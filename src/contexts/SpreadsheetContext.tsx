
"use client";

import type { Dispatch, ReactNode, SetStateAction} from 'react';
import { createContext, useState, useEffect, useCallback, useRef }
from 'react';
import type { SpreadsheetData, SheetData, CellData, CellStyle, CellAddress, SelectionRange, ConditionalFormatRule, PredefinedStyleKey } from '@/types/spreadsheet';
import { getSpreadsheet, saveSpreadsheet as dbSaveSpreadsheet } from '@/lib/db';
import { useToast } from '@/hooks/use-toast';
import { createEmptyCell, getCellId, DEFAULT_COLUMN_WIDTH, DEFAULT_ROW_COUNT, DEFAULT_COLUMN_COUNT, createInitialSheet as createInitialSheetUtil, DEFAULT_ROW_HEIGHT, isCellAddressInRange } from '@/types/spreadsheet';
import { v4 as uuidv4 } from 'uuid';
import { create, all, type Matrix, type MathNode } from 'mathjs';

const MAX_UNDO_HISTORY = 20;
const MAX_FORMULA_RECURSION_DEPTH = 20;
const CUSTOM_FUNCTION_REGEX = /^([A-Z_][A-Z0-9_]*)\((.*)\)$/i;
const CELL_REF_REGEX = /^[A-Z]+[1-9]\d*$/i;
const RANGE_REF_REGEX = /^([A-Z]+[1-9]\d*):([A-Z]+[1-9]\d*)$/i;
const NUMERIC_LITERAL_REGEX = /^-?\d+(\.\d+)?$/;


function parseCellId(id: string): { rowIndex: number; colIndex: number } | null {
  if (!id || typeof id !== 'string') return null;
  const match = id.toUpperCase().match(CELL_REF_REGEX);
  if (!match) return null;

  const lettersMatch = id.toUpperCase().match(/^([A-Z]+)/);
  const numbersMatch = id.toUpperCase().match(/([1-9]\d*)$/);

  if (!lettersMatch || !numbersMatch) return null;

  const colStr = lettersMatch[1];
  const rowStr = numbersMatch[1];

  let colIndex = 0;
  for (let i = 0; i < colStr.length; i++) {
    colIndex = colIndex * 26 + (colStr.charCodeAt(i) - 64);
  }
  colIndex -= 1;

  const rowIndex = parseInt(rowStr, 10) - 1;

  if (isNaN(colIndex) || isNaN(rowIndex) || colIndex < 0 || rowIndex < 0) return null;
  return { rowIndex, colIndex };
}

let actualEvaluateFormulaLogic: (
  currentSpreadsheetData: SpreadsheetData,
  sheetId: string,
  formulaExpressionWithEquals: string,
  visitedCellsInCurrentChain: Set<string>
) => string | number;


const getResolvedCellValue = (
    spreadsheetData: SpreadsheetData,
    targetSheetId: string,
    address: { rowIndex: number; colIndex: number },
    visitedCellsInCurrentEvalPath: Set<string>
  ): string | number => {
    const cellIdForVisited = `${targetSheetId}:${getCellId(address.rowIndex, address.colIndex)}`;

    if (visitedCellsInCurrentEvalPath.has(cellIdForVisited)) {
      return "#CIRCREF!";
    }
    if (visitedCellsInCurrentEvalPath.size > MAX_FORMULA_RECURSION_DEPTH) {
        return "#CIRCREF!";
    }

    const sheet = spreadsheetData.sheets.find(s => s.id === targetSheetId);
    if (!sheet || address.rowIndex < 0 || address.rowIndex >= sheet.rowCount || address.colIndex < 0 || address.colIndex >= sheet.columnCount) {
      return "#REF!";
    }
    const cell = sheet.cells[address.rowIndex]?.[address.colIndex];
    if (!cell) {
        return "#REF!"; // Should not happen if sheet.cells is always populated
    }
    
    // Handle merged cells: if this cell is part of a merge and not the top-left, get value from top-left
    if (cell.isMerged && cell.mergeMaster) {
        if (cell.mergeMaster.rowIndex === address.rowIndex && cell.mergeMaster.colIndex === address.colIndex) {
            // This IS the master cell, proceed as normal
        } else {
            // This is a subordinate merged cell, redirect to master
            const newVisitedPathRedirect = new Set(visitedCellsInCurrentEvalPath);
            // Add current cell to path before redirecting to avoid infinite loops if mergeMaster points back
            newVisitedPathRedirect.add(cellIdForVisited); 
            return getResolvedCellValue(spreadsheetData, targetSheetId, cell.mergeMaster, newVisitedPathRedirect);
        }
    }

    const raw = cell.rawValue;

    if (raw === undefined || raw === null || String(raw).trim() === '') {
        return 0; // Treat truly empty cells as 0 for formula evaluation
    }

    if (typeof raw === 'number') {
        return raw;
    }

    if (typeof raw === 'string') {
        if (raw.startsWith('=')) {
            const newVisitedPath = new Set(visitedCellsInCurrentEvalPath);
            newVisitedPath.add(cellIdForVisited);
            if (typeof actualEvaluateFormulaLogic === 'function') {
              return actualEvaluateFormulaLogic(spreadsheetData, targetSheetId, raw, newVisitedPath);
            } else {
              console.error("actualEvaluateFormulaLogic not yet defined when resolving cell value");
              return "#ERROR!";
            }
        }
        const num = parseFloat(raw);
        return isNaN(num) ? raw : num;
    }
    return String(raw);
};

const resolveRangeToArray = (
  rangeStr: string,
  spreadsheetData: SpreadsheetData,
  currentSheetId: string,
  visitedCells: Set<string>
): (string | number)[][] | string => {
  const rangeMatch = rangeStr.toUpperCase().match(RANGE_REF_REGEX);
  if (!rangeMatch) return "#NAME?"; // Excel often uses #NAME? for malformed range strings in functions

  const startCellStr = rangeMatch[1];
  const endCellStr = rangeMatch[2];

  const startCoord = parseCellId(startCellStr);
  const endCoord = parseCellId(endCellStr);
  const currentSheet = spreadsheetData.sheets.find(s => s.id === currentSheetId);

  if (!startCoord || !endCoord || !currentSheet) {
    return "#REF!";
  }

  const minRow = Math.min(startCoord.rowIndex, endCoord.rowIndex);
  const maxRow = Math.max(startCoord.rowIndex, endCoord.rowIndex);
  const minCol = Math.min(startCoord.colIndex, endCoord.colIndex);
  const maxCol = Math.max(startCoord.colIndex, endCoord.colIndex);

  if (minRow < 0 || maxRow >= currentSheet.rowCount || minCol < 0 || maxCol >= currentSheet.columnCount) {
    return "#REF!";
  }

  const result: (string | number)[][] = [];
  for (let r = minRow; r <= maxRow; r++) {
    const rowValues: (string | number)[] = [];
    for (let c = minCol; c <= maxCol; c++) {
      const cellVal = getResolvedCellValue(spreadsheetData, currentSheetId, { rowIndex: r, colIndex: c }, new Set(visitedCells));
      rowValues.push(cellVal);
    }
    result.push(rowValues);
  }
  return result;
};

function parseCustomFunctionArgs(argsString: string): string[] {
  if (argsString.trim() === "") return [];
  let balance = 0;
  let currentArg = "";
  const args: string[] = [];
  for (let i = 0; i < argsString.length; i++) {
    const char = argsString[i];
    if (char === '(') balance++;
    else if (char === ')') balance--;

    if (char === ',' && balance === 0) {
      args.push(currentArg.trim());
      currentArg = "";
    } else {
      currentArg += char;
    }
  }
  args.push(currentArg.trim());
  return args;
}

const processAggregateArg = (
    argString: string,
    spreadsheetData: SpreadsheetData,
    sheetId: string,
    visitedCells: Set<string>
  ): any | string => {

    const trimmedArg = argString.trim();

    if (NUMERIC_LITERAL_REGEX.test(trimmedArg)) {
      return parseFloat(trimmedArg);
    }
    if (CELL_REF_REGEX.test(trimmedArg)) {
      const coord = parseCellId(trimmedArg);
      return coord ? getResolvedCellValue(spreadsheetData, sheetId, coord, new Set(visitedCells)) : "#NAME?";
    }
    if (RANGE_REF_REGEX.test(trimmedArg)) {
      return resolveRangeToArray(trimmedArg, spreadsheetData, sheetId, new Set(visitedCells));
    }
    
    // If it looks like an expression (contains operators or parentheses), evaluate it recursively
    if (trimmedArg.includes('+') || trimmedArg.includes('-') || trimmedArg.includes('*') || trimmedArg.includes('/') || trimmedArg.includes('(') ) {
       // Ensure we pass a *new* Set for visitedCells for this independent sub-evaluation leg
       const subExpressionResult = actualEvaluateFormulaLogic(spreadsheetData, sheetId, '=' + trimmedArg, new Set(visitedCells));
       return subExpressionResult;
    }
    
    // If it's quoted text, return the text without quotes for functions.
    // Math.js will handle unquoted text as symbols.
    if ((trimmedArg.startsWith('"') && trimmedArg.endsWith('"')) || (trimmedArg.startsWith("'") && trimmedArg.endsWith("'"))) {
      return trimmedArg.substring(1, trimmedArg.length - 1);
    }

    return trimmedArg; // Treat as potential symbol/text if not caught by other cases
  };


const aggregateHelper = (
  argValues: any[], // Already processed by processAggregateArg
  processFn: (numbers: number[]) => number | string,
  isCount: boolean = false
): number | string => {
  const flatValues = argValues.flat(Infinity);
  
  let firstError: string | null = null;
  for (const val of flatValues) {
    if (typeof val === 'string' && val.startsWith('#')) {
      firstError = val;
      break;
    }
  }
  if (firstError) return firstError;

  const numbers = flatValues.filter(val => {
    if (typeof val === 'number' && isFinite(val)) return true;
    // For COUNT, we don't want to parse numeric strings if they weren't already numbers.
    // For SUM/AVERAGE/etc., Excel does parse numeric strings.
    if (!isCount && typeof val === 'string' && NUMERIC_LITERAL_REGEX.test(val)) return true; 
    return false;
  }).map(val => typeof val === 'number' ? val : parseFloat(val as string));

  return processFn(numbers);
};

actualEvaluateFormulaLogic = (
  currentSpreadsheetData: SpreadsheetData,
  sheetId: string,
  formulaExpressionWithEquals: string,
  visitedCellsInCurrentChain: Set<string> 
): string | number => {
  if (visitedCellsInCurrentChain.size > MAX_FORMULA_RECURSION_DEPTH) {
    return "#CIRCREF!";
  }

  const currentSheet = currentSpreadsheetData.sheets.find(s => s.id === sheetId);
  if (!currentSheet) return "#REF!";

  const cleanExpression = formulaExpressionWithEquals.startsWith('=')
    ? formulaExpressionWithEquals.substring(1).trim()
    : formulaExpressionWithEquals.trim();

  const topLevelFunctionMatch = cleanExpression.match(CUSTOM_FUNCTION_REGEX);

  if (topLevelFunctionMatch) {
    const functionName = topLevelFunctionMatch[1].toUpperCase();
    const argsString = topLevelFunctionMatch[2];
    const rawArgs = parseCustomFunctionArgs(argsString);

    const resolvedArgValues = rawArgs.map(rawArg => 
        processAggregateArg(rawArg, currentSpreadsheetData, sheetId, new Set(visitedCellsInCurrentChain))
    );
    
    // Check for errors in resolved arguments before passing to helper
    for (const val of resolvedArgValues.flat(Infinity)) {
        if (typeof val === 'string' && val.startsWith('#')) {
            return val;
        }
    }

    switch (functionName) {
      case 'SUM':
        return aggregateHelper(resolvedArgValues, nums => nums.reduce((acc, val) => acc + val, 0));
      case 'AVERAGE':
        return aggregateHelper(resolvedArgValues, nums => nums.length === 0 ? "#DIV/0!" : nums.reduce((acc, val) => acc + val, 0) / nums.length);
      case 'COUNT':
        return aggregateHelper(resolvedArgValues, nums => nums.length, true); // Pass true for isCount
      case 'MAX':
        return aggregateHelper(resolvedArgValues, nums => nums.length === 0 ? 0 : Math.max(...nums));
      case 'MIN':
        return aggregateHelper(resolvedArgValues, nums => nums.length === 0 ? 0 : Math.min(...nums));
      case 'IF': {
        if (resolvedArgValues.length < 2) return "#N/A"; // Not enough arguments
        
        let conditionResult: boolean;
        const conditionValue = resolvedArgValues[0];

        if (typeof conditionValue === 'string' && conditionValue.startsWith('#')) return conditionValue; // Propagate error from condition
        
        if (typeof conditionValue === 'number') conditionResult = conditionValue !== 0;
        else if (typeof conditionValue === 'boolean') conditionResult = conditionValue;
        else { // Try to interpret strings "TRUE" or "FALSE"
            const upperCond = String(conditionValue).toUpperCase();
            if (upperCond === "TRUE") conditionResult = true;
            else if (upperCond === "FALSE") conditionResult = false;
            else if (String(conditionValue).trim() === "") conditionResult = false; // Empty string condition is false
            else return "#VALUE!"; // Cannot interpret condition
        }
        
        const valueIfTrue = resolvedArgValues[1];
        if (conditionResult) {
            if (typeof valueIfTrue === 'string' && valueIfTrue.startsWith('#')) return valueIfTrue; // Propagate error
            return valueIfTrue;
        } else { // Condition is false
            if (resolvedArgValues.length > 2) {
                const valueIfFalse = resolvedArgValues[2];
                if (typeof valueIfFalse === 'string' && valueIfFalse.startsWith('#')) return valueIfFalse; // Propagate error
                return valueIfFalse;
            }
            return false; // Default Excel behavior if value_if_false is omitted
        }
      }
    }
  }

  const mathInstance = create(all);
  const scope: Record<string, any> = {};
  
  // Regex to find standalone cell references, not inside A1:B2 or part of function names
  const cellRefRegexForScope = /(?<![A-Z0-9:])([A-Z]+[1-9]\d*)(?![A-Z0-9:.(])/gi;
  const uniqueCellRefs = new Set<string>();
  let match;
  while((match = cellRefRegexForScope.exec(cleanExpression)) !== null) {
      uniqueCellRefs.add(match[1].toUpperCase());
  }

  for (const cellRef of uniqueCellRefs) {
      const coord = parseCellId(cellRef);
      if (coord) {
          const val = getResolvedCellValue(currentSpreadsheetData, sheetId, coord, new Set(visitedCellsInCurrentChain));
          scope[cellRef] = val; 
          if (typeof val === 'string' && val.startsWith('#')) { 
              return val;
          }
      } else {
         // If it looked like a cell ref but parseCellId failed, it could be a named range or bad syntax
         // For now, this path leads to #NAME? from math.js if 'cellRef' is used in expression
      }
  }
  
  const customFunctionsForMathJS: Record<string, (...args: any[]) => any> = {
    SUM: (...args: any[]): number | string => {
        const processedArgs = args.map(arg => {
            if (arg && typeof arg === 'object' && (arg as any).isMatrix === true) return (arg as Matrix).toArray();
            return arg;
        });
        return aggregateHelper(processedArgs, nums => nums.reduce((acc, val) => acc + val, 0));
    },
    AVERAGE: (...args: any[]): number | string => {
        const processedArgs = args.map(arg => (arg && typeof arg === 'object' && (arg as any).isMatrix === true) ? (arg as Matrix).toArray() : arg);
        return aggregateHelper(processedArgs, nums => nums.length === 0 ? "#DIV/0!" : nums.reduce((acc, val) => acc + val, 0) / nums.length);
    },
    COUNT: (...args: any[]): number | string => {
        const processedArgs = args.map(arg => (arg && typeof arg === 'object' && (arg as any).isMatrix === true) ? (arg as Matrix).toArray() : arg);
        return aggregateHelper(processedArgs, nums => nums.length, true);
    },
    MAX: (...args: any[]): number | string => {
        const processedArgs = args.map(arg => (arg && typeof arg === 'object' && (arg as any).isMatrix === true) ? (arg as Matrix).toArray() : arg);
        return aggregateHelper(processedArgs, nums => nums.length === 0 ? 0 : Math.max(...nums));
    },
    MIN: (...args: any[]): number | string => {
        const processedArgs = args.map(arg => (arg && typeof arg === 'object' && (arg as any).isMatrix === true) ? (arg as Matrix).toArray() : arg);
        return aggregateHelper(processedArgs, nums => nums.length === 0 ? 0 : Math.min(...nums));
    },
     IF: (condition: any, value_if_true: any, value_if_false?: any): any => {
        let condResult: boolean;
        if (typeof condition === 'string' && condition.startsWith('#')) return condition;
        if (typeof condition === 'number') condResult = condition !== 0;
        else if (typeof condition === 'boolean') condResult = condition;
        else {
            const upperCond = String(condition).toUpperCase();
            if (upperCond === "TRUE") condResult = true;
            else if (upperCond === "FALSE") condResult = false;
            else if (String(condition).trim() === "") condResult = false;
            else return "#VALUE!";
        }

        const trueValResolved = (value_if_true && typeof value_if_true === 'object' && (value_if_true as any)?.isMatrix === true) ? (value_if_true as Matrix).toArray().flat(Infinity)[0] : value_if_true;
        if (typeof trueValResolved === 'string' && trueValResolved.startsWith('#')) return trueValResolved;
        
        let falseValResolved = value_if_false;
        if (value_if_false !== undefined && typeof value_if_false === 'object' && (value_if_false as any)?.isMatrix === true) {
            falseValResolved = (value_if_false as Matrix).toArray().flat(Infinity)[0];
        }
        if (typeof falseValResolved === 'string' && falseValResolved.startsWith('#')) return falseValResolved;

        if (condResult) return trueValResolved;
        else return value_if_false === undefined ? false : falseValResolved;
    }
  };
  mathInstance.import(customFunctionsForMathJS, { override: true });

  try {
    const parsedNode: MathNode = mathInstance.parse(cleanExpression);
    let evalResult = parsedNode.evaluate(scope);

    if (evalResult === undefined || evalResult === null) return 0; // Default for undefined math.js results
    if (typeof evalResult === 'number') return isFinite(evalResult) ? evalResult : "#NUM!";
    if (typeof evalResult === 'string' && evalResult.startsWith('#')) return evalResult; // Propagate our errors
    if ((evalResult as any)?.isMatrix === true) { // Handle matrix result from math.js (e.g. from array ops)
        const matrixData = (evalResult as Matrix).toArray().flat(Infinity);
        if (matrixData.length === 1) { // If matrix is 1x1, return its single value
            const singleValue = matrixData[0];
             if (typeof singleValue === 'number' && isFinite(singleValue)) return singleValue;
             if (typeof singleValue === 'string' && singleValue.startsWith('#')) return singleValue;
             return String(singleValue); // Convert to string if not number/error
        }
        return "#VALUE!"; // Cannot display a multi-value matrix in a single cell
    }
    // For other object types math.js might return (like units, fractions), try valueOf()
    if (evalResult && typeof evalResult.valueOf === 'function' && typeof evalResult !== 'function') {
        const primitiveResult = evalResult.valueOf();
        if (typeof primitiveResult === 'number' && isFinite(primitiveResult)) return primitiveResult;
        if (primitiveResult === undefined || primitiveResult === null) return 0;
        return String(primitiveResult);
    }
    return String(evalResult); // Fallback: convert to string
  } catch (error: any) {
    const msgLower = String(error?.message || '').toLowerCase();
    if (msgLower.includes("undefined symbol") || msgLower.includes("unknown function")) return "#NAME?";
    if (msgLower.includes("division by zero")) return "#DIV/0!";
    if (msgLower.includes("value expected") || msgLower.includes("typeerror") || msgLower.includes("cannot convert") || msgLower.includes("unexpected type of argument") || msgLower.includes("dimension mismatch")) return "#VALUE!";
    if (msgLower.includes("incorrect number of arguments")) return "#N/A";
    return "#ERROR!";
  }
};

function reevaluateSheetFormulas (spreadsheetData: SpreadsheetData, sheetToReevaluateId: string): SpreadsheetData {
    const updatedSpreadsheet = JSON.parse(JSON.stringify(spreadsheetData)) as SpreadsheetData;
    const sheetToUpdate = updatedSpreadsheet.sheets.find(s => s.id === sheetToReevaluateId);

    if (sheetToUpdate) {
      for (let r = 0; r < sheetToUpdate.rowCount; r++) {
        if (!sheetToUpdate.cells[r]) sheetToUpdate.cells[r] = Array.from({ length: sheetToUpdate.columnCount }, (_, c) => createEmptyCell(r, c));
        for (let c = 0; c < sheetToUpdate.columnCount; c++) {
           if (!sheetToUpdate.cells[r][c]) sheetToUpdate.cells[r][c] = createEmptyCell(r,c);

           const cell = sheetToUpdate.cells[r][c];
           if (typeof cell.rawValue === 'string' && cell.rawValue.startsWith('=')) {
                cell.formula = cell.rawValue;
                // Pass a clone of the *current state* of updatedSpreadsheet for this specific eval
                const spreadsheetForThisSpecificEval = JSON.parse(JSON.stringify(updatedSpreadsheet)) as SpreadsheetData;
                cell.value = actualEvaluateFormulaLogic(spreadsheetForThisSpecificEval, sheetToReevaluateId, cell.formula, new Set());
           } else { 
             cell.formula = undefined;
             if (cell.rawValue === undefined || cell.rawValue === null || String(cell.rawValue).trim() === '') {
                 cell.value = ''; 
             } else if (typeof cell.rawValue === 'number') {
                 cell.value = cell.rawValue;
             } else if (typeof cell.rawValue === 'string') {
                 const num = parseFloat(cell.rawValue);
                 cell.value = isNaN(num) ? cell.rawValue : num;
             } else {
                 cell.value = String(cell.rawValue);
             }
           }
        }
      }
    }
    return updatedSpreadsheet;
  };

const getSheetFromData = (spreadsheetData: SpreadsheetData | null, sheetId: string | undefined): SheetData | null => {
  if (!spreadsheetData || !sheetId) return null;
  return spreadsheetData.sheets.find(s => s.id === sheetId) || null;
};

export interface FormulaBarApi {
  appendText: (text: string) => void;
  replaceText: (oldTextSubString: string, newText: string) => void;
  setText: (text: string) => void;
  focus: () => void;
  getValue: () => string;
}

export interface SpreadsheetContextType {
  spreadsheet: SpreadsheetData | null;
  setSpreadsheet: Dispatch<SetStateAction<SpreadsheetData | null>>;
  isLoading: boolean;
  loadSpreadsheet: (id: string) => Promise<void>;
  saveSpreadsheet: () => Promise<void>;
  updateCell: (sheetId: string, rowIndex: number, colIndex: number, newCellData: Partial<Pick<CellData, 'rawValue' | 'style'>>) => void;
  activeCell: CellAddress | null;
  selectionRange: SelectionRange | null;
  setActiveCellAndSelection: (
    cellAddress: CellAddress | null,
    isShiftKey: boolean,
    isDrag: boolean,
  ) => void;
  updateSelectedCellStyle: (styleChanges: Partial<CellStyle>) => void;
  formatSelectionAsTable: () => void;
  insertRow: (sheetId: string, rowIndex: number) => void;
  deleteRow: (sheetId: string, rowIndex: number) => void;
  insertColumn: (sheetId: string, colIndex: number) => void;
  deleteColumn: (sheetId: string, colIndex: number) => void;
  appendRow: (sheetId: string) => void;
  appendColumn: (sheetId: string) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  evaluateFormula: (sheetId: string, formulaWithEquals: string) => string | number;
  copySelectionToClipboard: () => Promise<void>;
  deleteSelectionContents: () => void;
  updateMultipleCellsRawValue: (newValue: string | number) => void;
  isActivelyEditingFormula: boolean;
  setIsActivelyEditingFormula: (isEditing: boolean) => void;
  formulaBarApiRef: React.MutableRefObject<FormulaBarApi | null>;
  updateColumnWidth: (sheetId: string, colIndex: number, newWidth: number) => void;
  updateRowHeight: (sheetId: string, rowIndex: number, newHeight: number) => void;
  addConditionalFormatRule: (sheetId: string, rule: ConditionalFormatRule) => void;
  removeConditionalFormatRule: (sheetId: string, ruleId: string) => void;
  updateConditionalFormatRule: (sheetId: string, rule: ConditionalFormatRule) => void;
  mergeSelection: () => void;
  unmergeSelection: () => void;
  findInSheet: (searchTerm: string, findOptions: { matchCase: boolean; entireCell: boolean; searchFormulas: boolean; sheetId: string; from: CellAddress | null }) => CellAddress | null;
}

export const SpreadsheetContext = createContext<SpreadsheetContextType | undefined>(undefined);

export function SpreadsheetProvider({ children }: { children: ReactNode }) {
  const [internalSpreadsheetState, setInternalSpreadsheetState] = useState<SpreadsheetData | null>(null);
  const internalSpreadsheetRef = useRef<SpreadsheetData | null>(null);

  useEffect(() => {
    internalSpreadsheetRef.current = internalSpreadsheetState;
  }, [internalSpreadsheetState]);

  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const [activeCell, setActiveCellState] = useState<CellAddress | null>(null);
  const [selectionRange, setSelectionRangeState] = useState<SelectionRange | null>(null);
  const [lastFoundCell, setLastFoundCell] = useState<CellAddress | null>(null);


  const [undoStack, setUndoStack] = useState<SpreadsheetData[]>([]);
  const [redoStack, setRedoStack] = useState<SpreadsheetData[]>([]);

  const [isActivelyEditingFormula, setIsActivelyEditingFormula] = useState<boolean>(false);
  const formulaBarApiRef = useRef<FormulaBarApi | null>(null);


  const setSpreadsheetWithHistory = useCallback((
    updater: SetStateAction<SpreadsheetData | null>,
    actionSource?: 'undo' | 'redo' | 'internal_no_history' | 'save' | 'user_action'
    ) => {
    setInternalSpreadsheetState(current => {
      const currentDeepCloneForHistory = current ? JSON.parse(JSON.stringify(current)) as SpreadsheetData : null;

      let newSpreadsheetRaw: SpreadsheetData | null;
      if (typeof updater === 'function') {
        newSpreadsheetRaw = updater(currentDeepCloneForHistory ? JSON.parse(JSON.stringify(currentDeepCloneForHistory)) : null );
      } else {
        newSpreadsheetRaw = updater;
      }
      
      let newSpreadsheet = newSpreadsheetRaw ? JSON.parse(JSON.stringify(newSpreadsheetRaw)) as SpreadsheetData : null;

      if (newSpreadsheet && actionSource !== 'internal_no_history' && actionSource !== 'save') { // Don't re-eval during load/save
          let reevaluatedSpreadsheet = newSpreadsheet;
          newSpreadsheet.sheets.forEach(sheet => {
            reevaluatedSpreadsheet = reevaluateSheetFormulas(reevaluatedSpreadsheet, sheet.id);
          });
          newSpreadsheet = reevaluatedSpreadsheet;
      }
      
      if (actionSource !== 'undo' && actionSource !== 'redo' &&
          actionSource !== 'internal_no_history' && actionSource !== 'save' && 
          currentDeepCloneForHistory && newSpreadsheet &&
          JSON.stringify(currentDeepCloneForHistory) !== JSON.stringify(newSpreadsheet)) {
        setUndoStack(prev => [...prev.slice(-MAX_UNDO_HISTORY + 1), currentDeepCloneForHistory]);
        if (actionSource !== 'redo') { // Don't clear redo stack if the action was an undo itself that gets redone
            setRedoStack([]);
        }
      }
      internalSpreadsheetRef.current = newSpreadsheet;
      return newSpreadsheet;
    });
  }, []);

  const exposedSetSpreadsheet = useCallback((value: SetStateAction<SpreadsheetData | null>) => {
     setSpreadsheetWithHistory(value, 'user_action');
  }, [setSpreadsheetWithHistory]);


  const evaluateFormulaContext = useCallback((sheetId: string, formulaExpressionWithEquals: string): string | number => {
    if (!internalSpreadsheetRef.current) {
      return "#REF!";
    }
    const spreadsheetClone = JSON.parse(JSON.stringify(internalSpreadsheetRef.current)) as SpreadsheetData;
    return actualEvaluateFormulaLogic(spreadsheetClone, sheetId, formulaExpressionWithEquals, new Set());
  }, []);


  const loadSpreadsheet = useCallback(async (id: string) => {
    setIsLoading(true);
    setActiveCellState(null);
    setSelectionRangeState(null);
    setUndoStack([]);
    setRedoStack([]);
    setLastFoundCell(null);

    const result = await getSpreadsheet(id);
    if (result.success && result.data) {
      let loadedSpreadsheet = JSON.parse(JSON.stringify(result.data)) as SpreadsheetData;

      loadedSpreadsheet.sheets = loadedSpreadsheet.sheets.map(sheet_from_db => {
        const rowCount = sheet_from_db.rowCount > 0 ? sheet_from_db.rowCount : DEFAULT_ROW_COUNT;
        const columnCount = sheet_from_db.columnCount > 0 ? sheet_from_db.columnCount : DEFAULT_COLUMN_COUNT;

        let cellsFromDb = sheet_from_db.cells || [];
        const newCells = Array.from({ length: rowCount }, (_, r) =>
            Array.from({ length: columnCount }, (_, c) => {
                const existingCellData = cellsFromDb[r]?.[c];
                const baseCell = createEmptyCell(r,c); 
                const cellWithData = existingCellData ? {...baseCell, ...existingCellData, id: getCellId(r,c)} : baseCell;
                // Ensure colSpan/rowSpan defaults if not present from DB
                cellWithData.colSpan = cellWithData.colSpan || 1;
                cellWithData.rowSpan = cellWithData.rowSpan || 1;
                cellWithData.isMerged = cellWithData.isMerged || false;
                delete cellWithData.mergeMaster; // Clear old mergeMaster, will be rebuilt if needed
                return cellWithData;
            })
        );
        
        const currentProcessingSheet: SheetData = {
          ...sheet_from_db,
          cells: newCells,
          rowCount,
          columnCount,
          columnWidths: (sheet_from_db.columnWidths && sheet_from_db.columnWidths.length === columnCount)
            ? sheet_from_db.columnWidths
            : Array(columnCount).fill(DEFAULT_COLUMN_WIDTH),
          rowHeights: (sheet_from_db.rowHeights && sheet_from_db.rowHeights.length === rowCount)
            ? sheet_from_db.rowHeights
            : Array(rowCount).fill(DEFAULT_ROW_HEIGHT),
          conditionalFormatRules: sheet_from_db.conditionalFormatRules || [],
          mergedCells: sheet_from_db.mergedCells || [],
        };

        // Re-apply merge properties to cells based on mergedCells array
        (currentProcessingSheet.mergedCells || []).forEach(mergeRange => {
            const { start: mergeStart, end: mergeEnd } = mergeRange;
            const masterRow = Math.min(mergeStart.rowIndex, mergeEnd.rowIndex);
            const masterCol = Math.min(mergeStart.colIndex, mergeEnd.colIndex);
            const numRows = Math.abs(mergeEnd.rowIndex - mergeStart.rowIndex) + 1;
            const numCols = Math.abs(mergeEnd.colIndex - mergeStart.colIndex) + 1;

            if(currentProcessingSheet.cells[masterRow]?.[masterCol]) {
                currentProcessingSheet.cells[masterRow][masterCol].colSpan = numCols;
                currentProcessingSheet.cells[masterRow][masterCol].rowSpan = numRows;
                currentProcessingSheet.cells[masterRow][masterCol].isMerged = false; // Master is not "isMerged" in its own right

                for (let r = masterRow; r < masterRow + numRows; r++) {
                    for (let c = masterCol; c < masterCol + numCols; c++) {
                        if (r === masterRow && c === masterCol) continue;
                        if (currentProcessingSheet.cells[r]?.[c]) {
                            currentProcessingSheet.cells[r][c].isMerged = true;
                            currentProcessingSheet.cells[r][c].mergeMaster = { sheetId: currentProcessingSheet.id, rowIndex: masterRow, colIndex: masterCol };
                            currentProcessingSheet.cells[r][c].rawValue = ''; // Clear subordinate cells
                            currentProcessingSheet.cells[r][c].value = '';
                            currentProcessingSheet.cells[r][c].formula = undefined;
                            currentProcessingSheet.cells[r][c].colSpan = 1; // Reset subordinate span
                            currentProcessingSheet.cells[r][c].rowSpan = 1; // Reset subordinate span
                        }
                    }
                }
            }
        });
        return currentProcessingSheet;
      });
      
      // After all sheets are structured, perform formula evaluation
      let spreadsheetAfterInitialEval = loadedSpreadsheet;
      loadedSpreadsheet.sheets.forEach(sheet => {
        spreadsheetAfterInitialEval = reevaluateSheetFormulas(spreadsheetAfterInitialEval, sheet.id);
      });
      
      setSpreadsheetWithHistory(() => spreadsheetAfterInitialEval, 'internal_no_history');
    } else {
      setSpreadsheetWithHistory(() => null, 'internal_no_history');
      setTimeout(() => {
        toast({ title: "Error", description: `Failed to load spreadsheet: ${result.error || 'Not found'}.`, variant: "destructive" });
      }, 0);
    }
    setIsLoading(false);
  }, [toast, setSpreadsheetWithHistory]);


  const saveSpreadsheet = useCallback(async () => {
    if (!internalSpreadsheetRef.current) {
      setTimeout(() => {
        toast({ title: "Error", description: "No spreadsheet data to save.", variant: "destructive" });
      },0);
      return;
    }
    setIsLoading(true);
    const spreadsheetToSave = JSON.parse(JSON.stringify(internalSpreadsheetRef.current)) as SpreadsheetData;
    spreadsheetToSave.updatedAt = Date.now();

    const result = await dbSaveSpreadsheet(spreadsheetToSave);
    if (result.success) {
      setSpreadsheetWithHistory(prev => prev ? {...prev, updatedAt: spreadsheetToSave.updatedAt} : null, 'save');
      setTimeout(() => {
        toast({ title: "Success", description: "Spreadsheet saved locally." });
      },0);
    } else {
      setTimeout(() => {
        toast({ title: "Error", description: `Failed to save spreadsheet: ${result.error}.`, variant: "destructive" });
      },0);
    }
    setIsLoading(false);
  }, [toast, setSpreadsheetWithHistory]);


  const updateCell = useCallback((sheetId: string, rowIndex: number, colIndex: number, newCellData: Partial<Pick<CellData, 'rawValue' | 'style'>>) => {
    setSpreadsheetWithHistory(prevSpreadsheet => {
      if (!prevSpreadsheet) return null;
      let spreadsheetCopy = JSON.parse(JSON.stringify(prevSpreadsheet)) as SpreadsheetData;
      const sheetToUpdate = spreadsheetCopy.sheets.find(sheet => sheet.id === sheetId);

      if (!sheetToUpdate || rowIndex < 0 || rowIndex >= sheetToUpdate.rowCount || colIndex < 0 || colIndex >= sheetToUpdate.columnCount) {
         console.error("updateCell called with invalid address or sheet not found:", sheetId, rowIndex, colIndex);
         return prevSpreadsheet;
      }
      if (!sheetToUpdate.cells[rowIndex]) sheetToUpdate.cells[rowIndex] = [];
      if (!sheetToUpdate.cells[rowIndex][colIndex]) sheetToUpdate.cells[rowIndex][colIndex] = createEmptyCell(rowIndex, colIndex);
      
      let targetRow = rowIndex;
      let targetCol = colIndex;
      const currentCell = sheetToUpdate.cells[rowIndex][colIndex];
      if(currentCell.isMerged && currentCell.mergeMaster) {
        targetRow = currentCell.mergeMaster.rowIndex;
        targetCol = currentCell.mergeMaster.colIndex;
      }
      const cellToUpdate = sheetToUpdate.cells[targetRow][targetCol];


      if (newCellData.rawValue !== undefined) {
        cellToUpdate.rawValue = newCellData.rawValue;
      }
      if (newCellData.style) {
        cellToUpdate.style = {...(cellToUpdate.style || {}), ...newCellData.style};
      }
      
      spreadsheetCopy.updatedAt = Date.now();
      return spreadsheetCopy;
    }, 'user_action');
  }, [setSpreadsheetWithHistory]);


  const setActiveCellAndSelection = useCallback((
    newCellAddress: CellAddress | null,
    isShiftKey: boolean,
    isDrag: boolean
  ) => {
    if (isActivelyEditingFormula) {
        return;
    }
    
    let finalActiveCell = newCellAddress;
    let finalSelectionRange = newCellAddress ? { start: newCellAddress, end: newCellAddress } : null;

    if (newCellAddress && internalSpreadsheetRef.current) {
        const sheet = getSheetFromData(internalSpreadsheetRef.current, newCellAddress.sheetId);
        if (sheet) {
            const cellData = sheet.cells[newCellAddress.rowIndex]?.[newCellAddress.colIndex];
            let masterAddress = newCellAddress;
            if (cellData?.isMerged && cellData.mergeMaster) {
                masterAddress = cellData.mergeMaster;
            }
            
            const mergedRange = (sheet.mergedCells || []).find(mr => 
                isCellAddressInRange(masterAddress, mr)
            );

            if (mergedRange) {
                finalActiveCell = {sheetId: sheet.id, rowIndex: mergedRange.start.rowIndex, colIndex: mergedRange.start.colIndex}; // Always top-left of merge
                finalSelectionRange = {start: mergedRange.start, end: mergedRange.end};
            } else { // Not a merged cell or master of one
                 setActiveCellState(currentActiveCell => {
                    if (newCellAddress === null) {
                        setSelectionRangeState(null);
                        return null;
                    }
                    const nextActiveCellForLogic = isDrag ? (currentActiveCell || newCellAddress) : newCellAddress;
                    setSelectionRangeState(currentSelRange => {
                        let startAddress = newCellAddress;
                        let endAddress = newCellAddress;
                        if (isDrag && currentSelRange?.start && currentSelRange.start.sheetId === newCellAddress.sheetId) {
                            startAddress = currentSelRange.start;
                            endAddress = newCellAddress;
                        } else if (isShiftKey && activeCell && activeCell.sheetId === newCellAddress.sheetId) {
                            startAddress = activeCell;
                            endAddress = newCellAddress;
                        }
                        return { start: startAddress, end: endAddress };
                    });
                    return nextActiveCellForLogic;
                });
                return; // Handled by old logic
            }
        }
    }
    setActiveCellState(finalActiveCell);
    setSelectionRangeState(finalSelectionRange);

  }, [isActivelyEditingFormula, activeCell, selectionRange]);


  const updateSelectedCellStyle = useCallback((styleChanges: Partial<CellStyle>) => {
    if (!selectionRange || !internalSpreadsheetRef.current) return;

    setSpreadsheetWithHistory(prevSpreadsheet => {
      if (!prevSpreadsheet) return null;
      const spreadsheetCopy = JSON.parse(JSON.stringify(prevSpreadsheet)) as SpreadsheetData;
      const {start, end} = selectionRange;
      const sheetIdToUpdate = start.sheetId;
      const sheetToUpdate = spreadsheetCopy.sheets.find(sheet => sheet.id === sheetIdToUpdate);
      if (!sheetToUpdate) return prevSpreadsheet;

      const minRow = Math.min(start.rowIndex, end.rowIndex);
      const maxRow = Math.max(start.rowIndex, end.rowIndex);
      const minCol = Math.min(start.colIndex, end.colIndex);
      const maxCol = Math.max(start.colIndex, end.colIndex);

      for (let rIdx = minRow; rIdx <= maxRow; rIdx++) {
        for (let cIdx = minCol; cIdx <= maxCol; cIdx++) {
           if (!sheetToUpdate.cells[rIdx]) sheetToUpdate.cells[rIdx] = [];
           if (!sheetToUpdate.cells[rIdx][cIdx]) sheetToUpdate.cells[rIdx][cIdx] = createEmptyCell(rIdx, cIdx);
           
           let targetCell = sheetToUpdate.cells[rIdx][cIdx];
           // If applying to a merged cell, apply to its master
           if(targetCell.isMerged && targetCell.mergeMaster) {
              targetCell = sheetToUpdate.cells[targetCell.mergeMaster.rowIndex][targetCell.mergeMaster.colIndex];
           }
           targetCell.style = { ...(targetCell.style || {}), ...styleChanges };
        }
      }
      spreadsheetCopy.updatedAt = Date.now();
      return spreadsheetCopy;
    }, 'user_action');
  }, [selectionRange, setSpreadsheetWithHistory]);


  const formatSelectionAsTable = useCallback(() => {
    if (!selectionRange || !internalSpreadsheetRef.current) return;

    setSpreadsheetWithHistory(prevSpreadsheet => {
      if (!prevSpreadsheet) return null;
      const spreadsheetCopy = JSON.parse(JSON.stringify(prevSpreadsheet)) as SpreadsheetData;
      const { start, end } = selectionRange;
      const sheetIdToUpdate = start.sheetId;
      const sheetToUpdate = spreadsheetCopy.sheets.find(sheet => sheet.id === sheetIdToUpdate);
      if (!sheetToUpdate) return prevSpreadsheet;

      const minRow = Math.min(start.rowIndex, end.rowIndex);
      const maxRow = Math.max(start.rowIndex, end.rowIndex);
      const minCol = Math.min(start.colIndex, end.colIndex);
      const maxCol = Math.max(start.colIndex, end.colIndex);

      for (let r = minRow; r <= maxRow; r++) {
        for (let c = minCol; c <= maxCol; c++) {
          if (!sheetToUpdate.cells[r]) sheetToUpdate.cells[r] = [];
          if (!sheetToUpdate.cells[r][c]) sheetToUpdate.cells[r][c] = createEmptyCell(r,c);
          const cell = sheetToUpdate.cells[r][c];
          
          const isHeaderRow = r === minRow;
          cell.style = {
            ...(cell.style || {}),
            bold: isHeaderRow,
            hasBorder: true,
          };
        }
      }
      spreadsheetCopy.updatedAt = Date.now();
      setTimeout(() => toast({ title: "Table Formatted", description: "Selected range formatted with header and borders." }), 0);
      return spreadsheetCopy;
    }, 'user_action');
  }, [selectionRange, setSpreadsheetWithHistory, toast]);

  const modifySheetStructure = useCallback((
    sheetId: string,
    operation: 'insertRow' | 'deleteRow' | 'insertColumn' | 'deleteColumn' | 'appendRow' | 'appendColumn',
    index?: number
  ) => {
    setSpreadsheetWithHistory(prevSpreadsheet => {
      if (!prevSpreadsheet) return null;
      let spreadsheetCopy = JSON.parse(JSON.stringify(prevSpreadsheet)) as SpreadsheetData;
      const sheet = spreadsheetCopy.sheets.find(s => s.id === sheetId);
      if (!sheet) return prevSpreadsheet;

      let updateRowCount = sheet.rowCount;
      let updateColCount = sheet.columnCount;
      let toastInfo: { title: string, description: string, variant?: "destructive" } | null = null;

      switch (operation) {
        case 'insertRow':
          if (index === undefined || index < 0 || index > updateRowCount) return prevSpreadsheet;
          const newRowData: CellData[] = Array.from({ length: updateColCount }, (_, cIdx) => createEmptyCell(index, cIdx));
          sheet.cells.splice(index, 0, newRowData);
          if(sheet.rowHeights) sheet.rowHeights.splice(index, 0, DEFAULT_ROW_HEIGHT); else sheet.rowHeights = Array(updateRowCount + 1).fill(DEFAULT_ROW_HEIGHT);
          updateRowCount++;
          // Adjust merged cell ranges
          if (sheet.mergedCells) {
            sheet.mergedCells = sheet.mergedCells.map(mc => {
              if (mc.start.rowIndex >= index) mc.start.rowIndex++;
              if (mc.end.rowIndex >= index) mc.end.rowIndex++;
              return mc;
            });
          }
          toastInfo = { title: "Row Inserted", description: `Row inserted at index ${index + 1}.` };
          break;
        case 'deleteRow':
          if (index === undefined || updateRowCount <= 1 || index < 0 || index >= updateRowCount) {
            if(updateRowCount <= 1) toastInfo = { title: "Cannot Delete", description: "Spreadsheet must have at least one row.", variant: "destructive"};
            if(toastInfo) setTimeout(() => { toast(toastInfo!); }, 0);
            return prevSpreadsheet;
          }
          sheet.cells.splice(index, 1);
          if(sheet.rowHeights) sheet.rowHeights.splice(index, 1);
          updateRowCount--;
           if (sheet.mergedCells) {
            sheet.mergedCells = sheet.mergedCells
                .filter(mc => !(mc.start.rowIndex === index && mc.end.rowIndex === index)) // Remove merges fully within deleted row
                .map(mc => {
                    if (mc.start.rowIndex > index) mc.start.rowIndex--;
                    if (mc.end.rowIndex >= index) mc.end.rowIndex = Math.max(index -1, mc.end.rowIndex -1); // Adjust or shrink
                    return mc;
                }).filter(mc => mc.start.rowIndex <= mc.end.rowIndex); // Remove invalid merges
          }
          toastInfo = { title: "Row Deleted", description: `Row at index ${index + 1} deleted.` };
          break;
        case 'appendRow':
          const appendRowIndex = updateRowCount;
          const appendedRowData: CellData[] = Array.from({ length: updateColCount }, (_, cIdx) => createEmptyCell(appendRowIndex, cIdx));
          sheet.cells.push(appendedRowData);
          if(sheet.rowHeights) sheet.rowHeights.push(DEFAULT_ROW_HEIGHT); else sheet.rowHeights = Array(updateRowCount + 1).fill(DEFAULT_ROW_HEIGHT);
          updateRowCount++;
          toastInfo = { title: "Row Added", description: `Row added at the end.` };
          break;
        case 'insertColumn':
          if (index === undefined || index < 0 || index > updateColCount) return prevSpreadsheet;
          sheet.cells.forEach((row, rIdx) => {
            row.splice(index, 0, createEmptyCell(rIdx, index));
          });
          if(sheet.columnWidths) sheet.columnWidths.splice(index, 0, DEFAULT_COLUMN_WIDTH); else sheet.columnWidths = Array(updateColCount + 1).fill(DEFAULT_COLUMN_WIDTH);
          updateColCount++;
           if (sheet.mergedCells) {
            sheet.mergedCells = sheet.mergedCells.map(mc => {
              if (mc.start.colIndex >= index) mc.start.colIndex++;
              if (mc.end.colIndex >= index) mc.end.colIndex++;
              return mc;
            });
          }
          toastInfo = { title: "Column Inserted", description: `Column inserted at index ${getCellId(0,index).replace(/[0-9]/g, '')}.` };
          break;
        case 'deleteColumn':
          if (index === undefined || updateColCount <= 1 || index < 0 || index >= updateColCount) {
            if(updateColCount <= 1) toastInfo = { title: "Cannot Delete", description: "Spreadsheet must have at least one column.", variant: "destructive"};
             if(toastInfo) setTimeout(() => { toast(toastInfo!); }, 0);
            return prevSpreadsheet;
          }
          sheet.cells.forEach(row => row.splice(index, 1));
          if (sheet.columnWidths && sheet.columnWidths.length > index) sheet.columnWidths.splice(index, 1);
          updateColCount--;
          if (sheet.mergedCells) {
            sheet.mergedCells = sheet.mergedCells
                .filter(mc => !(mc.start.colIndex === index && mc.end.colIndex === index))
                .map(mc => {
                    if (mc.start.colIndex > index) mc.start.colIndex--;
                    if (mc.end.colIndex >= index) mc.end.colIndex = Math.max(index-1, mc.end.colIndex-1);
                    return mc;
                }).filter(mc => mc.start.colIndex <= mc.end.colIndex);
          }
          toastInfo = { title: "Column Deleted", description: `Column ${getCellId(0,index).replace(/[0-9]/g, '')} deleted.` };
          break;
        case 'appendColumn':
          const appendColIndex = updateColCount;
          sheet.cells.forEach((row, rIdx) => row.push(createEmptyCell(rIdx, appendColIndex)));
          if(sheet.columnWidths) sheet.columnWidths.push(DEFAULT_COLUMN_WIDTH); else sheet.columnWidths = Array(updateColCount + 1).fill(DEFAULT_COLUMN_WIDTH);
          updateColCount++;
          toastInfo = { title: "Column Added", description: `Column added at the end.` };
          break;
      }

      if (toastInfo) {
        setTimeout(() => toast(toastInfo!), 0);
      }

      sheet.rowCount = updateRowCount;
      sheet.columnCount = updateColCount;

      for (let r = 0; r < sheet.rowCount; r++) {
        if(!sheet.cells[r]) sheet.cells[r] = Array.from({ length: sheet.columnCount }, (_, c) => createEmptyCell(r, c));
        sheet.cells[r] = sheet.cells[r].slice(0, sheet.columnCount); // Ensure row length matches columnCount
        while(sheet.cells[r].length < sheet.columnCount) {
            sheet.cells[r].push(createEmptyCell(r, sheet.cells[r].length));
        }

        for (let c = 0; c < sheet.columnCount; c++) {
          if (sheet.cells[r]?.[c]) {
            sheet.cells[r][c].id = getCellId(r, c);
          } else {
            if(!sheet.cells[r]) sheet.cells[r] = [];
            sheet.cells[r][c] = createEmptyCell(r,c);
          }
        }
      }
      // After structural changes, re-evaluate merge properties for all cells
        (sheet.mergedCells || []).forEach(mergeRange => {
            const { start: mergeStart, end: mergeEnd } = mergeRange;
            const masterRow = Math.min(mergeStart.rowIndex, mergeEnd.rowIndex);
            const masterCol = Math.min(mergeStart.colIndex, mergeEnd.colIndex);
            const numRows = Math.abs(mergeEnd.rowIndex - mergeStart.rowIndex) + 1;
            const numCols = Math.abs(mergeEnd.colIndex - mergeStart.colIndex) + 1;

            if (sheet.cells[masterRow]?.[masterCol]) {
                sheet.cells[masterRow][masterCol].colSpan = numCols;
                sheet.cells[masterRow][masterCol].rowSpan = numRows;
                sheet.cells[masterRow][masterCol].isMerged = false;
                 for (let r = masterRow; r < masterRow + numRows; r++) {
                    for (let c = masterCol; c < masterCol + numCols; c++) {
                        if (r === masterRow && c === masterCol) continue;
                        if (sheet.cells[r]?.[c]) {
                            sheet.cells[r][c].isMerged = true;
                            sheet.cells[r][c].mergeMaster = { sheetId: sheet.id, rowIndex: masterRow, colIndex: masterCol };
                        }
                    }
                }
            }
        });


      spreadsheetCopy.updatedAt = Date.now();
      return spreadsheetCopy;
    }, 'user_action');
  }, [setSpreadsheetWithHistory, toast]);

  const insertRow = useCallback((sheetId: string, rowIndex: number) => modifySheetStructure(sheetId, 'insertRow', rowIndex), [modifySheetStructure]);
  const deleteRow = useCallback((sheetId: string, rowIndex: number) => modifySheetStructure(sheetId, 'deleteRow', rowIndex), [modifySheetStructure]);
  const insertColumn = useCallback((sheetId: string, colIndex: number) => modifySheetStructure(sheetId, 'insertColumn', colIndex), [modifySheetStructure]);
  const deleteColumn = useCallback((sheetId: string, colIndex: number) => modifySheetStructure(sheetId, 'deleteColumn', colIndex), [modifySheetStructure]);
  const appendRow = useCallback((sheetId: string) => modifySheetStructure(sheetId, 'appendRow'), [modifySheetStructure]);
  const appendColumn = useCallback((sheetId: string) => modifySheetStructure(sheetId, 'appendColumn'), [modifySheetStructure]);

  const undo = useCallback(() => {
    if (undoStack.length > 0) {
      const previousState = undoStack[undoStack.length - 1];
      if (internalSpreadsheetRef.current) {
        const currentCopyForRedo = JSON.parse(JSON.stringify(internalSpreadsheetRef.current)) as SpreadsheetData;
        setRedoStack(prev => [currentCopyForRedo, ...prev.slice(0, MAX_UNDO_HISTORY -1)]);
      }
      setUndoStack(prev => prev.slice(0, -1));
      setSpreadsheetWithHistory(() => JSON.parse(JSON.stringify(previousState)), 'undo');
      setActiveCellState(null);
      setSelectionRangeState(null);
      setLastFoundCell(null);
      setTimeout(() => {
        toast({ title: "Undo", description: "Last action reverted." });
      }, 0);
    }
  }, [undoStack, setSpreadsheetWithHistory, toast]);

  const redo = useCallback(() => {
    if (redoStack.length > 0) {
      const nextState = redoStack[0];
       if (internalSpreadsheetRef.current) {
        const currentCopyForUndo = JSON.parse(JSON.stringify(internalSpreadsheetRef.current)) as SpreadsheetData;
        setUndoStack(prev => [...prev.slice(-MAX_UNDO_HISTORY + 1), currentCopyForUndo]);
       }
      setRedoStack(prev => prev.slice(1));
      setSpreadsheetWithHistory(() => JSON.parse(JSON.stringify(nextState)), 'redo');
      setActiveCellState(null);
      setSelectionRangeState(null);
      setLastFoundCell(null);
      setTimeout(() => {
        toast({ title: "Redo", description: "Last undone action applied." });
      }, 0);
    }
  }, [redoStack, setSpreadsheetWithHistory, toast]);


  const copySelectionToClipboard = useCallback(async () => {
    if (!selectionRange || !internalSpreadsheetRef.current) {
      setTimeout(() => {
        toast({ title: "Copy Failed", description: "No cells selected to copy.", variant: "destructive" });
      }, 0);
      return;
    }

    const { start, end } = selectionRange;
    const sheet = internalSpreadsheetRef.current.sheets.find(s => s.id === start.sheetId);
    if (!sheet) {
       setTimeout(() => {
        toast({ title: "Copy Failed", description: "Sheet not found for selection.", variant: "destructive" });
      }, 0);
      return;
    }

    const minRow = Math.min(start.rowIndex, end.rowIndex);
    const maxRow = Math.max(start.rowIndex, end.rowIndex);
    const minCol = Math.min(start.colIndex, end.colIndex);
    const maxCol = Math.max(start.colIndex, end.colIndex);

    let textToCopy = "";
    for (let r = minRow; r <= maxRow; r++) {
      for (let c = minCol; c <= maxCol; c++) {
        const cell = sheet.cells[r]?.[c];
        let valueToCopy = "";
        if (cell) {
            if (cell.isMerged && cell.mergeMaster) {
                 // For subordinate merged cells, copy value from master, but only once for the whole merged block
                 // This part is tricky for plain text copy. Simplest is to copy master if current (r,c) is master.
                 // Or if we only want unique values, more complex.
                 // For now, let's copy the master if (r,c) IS the master, and empty if it's a subordinate part of a merge.
                 // This will leave "holes" in text copy for merged areas.
                 if(cell.mergeMaster.rowIndex === r && cell.mergeMaster.colIndex === c) {
                    const masterCell = sheet.cells[cell.mergeMaster.rowIndex]?.[cell.mergeMaster.colIndex];
                    valueToCopy = (masterCell?.formula) 
                                ? masterCell.formula 
                                : (masterCell?.value === '' && (masterCell?.rawValue === '' || masterCell?.rawValue === null || masterCell?.rawValue === undefined)) 
                                    ? '' 
                                    : masterCell?.value?.toString() ?? "";
                 } else {
                    valueToCopy = ""; // Subordinate merged cells are empty in copy
                 }
            } else { // Not part of a merge, or is the master cell itself
                 valueToCopy = (cell.formula) 
                                ? cell.formula 
                                : (cell.value === '' && (cell.rawValue === '' || cell.rawValue === null || cell.rawValue === undefined)) 
                                    ? '' 
                                    : cell.value?.toString() ?? "";
            }
        }
        textToCopy += valueToCopy;
        if (c < maxCol) {
          textToCopy += "\t";
        }
      }
      if (r < maxRow) {
        textToCopy += "\n";
      }
    }

    try {
      await navigator.clipboard.writeText(textToCopy);
      setTimeout(() => {
        toast({ title: "Copied", description: "Selected cells copied to clipboard." });
      }, 0);
    } catch (err) {
      console.error("Failed to copy text: ", err);
       setTimeout(() => {
        toast({ title: "Copy Failed", description: "Could not copy cells to clipboard.", variant: "destructive" });
      }, 0);
    }
  }, [selectionRange, toast]);


  const deleteSelectionContents = useCallback(() => {
    if (!selectionRange || !internalSpreadsheetRef.current) return;

    setSpreadsheetWithHistory(prevSpreadsheet => {
      if (!prevSpreadsheet) return null;
      let spreadsheetCopy = JSON.parse(JSON.stringify(prevSpreadsheet)) as SpreadsheetData;
      const { start, end } = selectionRange;
      const sheetToUpdate = spreadsheetCopy.sheets.find(s => s.id === start.sheetId);

      if (!sheetToUpdate) return prevSpreadsheet;

      const minRow = Math.min(start.rowIndex, end.rowIndex);
      const maxRow = Math.max(start.rowIndex, end.rowIndex);
      const minCol = Math.min(start.colIndex, end.colIndex);
      const maxCol = Math.max(start.colIndex, end.colIndex);

      let changed = false;
      for (let r = minRow; r <= maxRow; r++) {
        for (let c = minCol; c <= maxCol; c++) {
          if (!sheetToUpdate.cells[r]) sheetToUpdate.cells[r] = [];
          if (!sheetToUpdate.cells[r][c]) sheetToUpdate.cells[r][c] = createEmptyCell(r, c);
          
          let targetCell = sheetToUpdate.cells[r][c];
          // If part of a merge, target the master cell for content deletion
          if (targetCell.isMerged && targetCell.mergeMaster) {
            targetCell = sheetToUpdate.cells[targetCell.mergeMaster.rowIndex][targetCell.mergeMaster.colIndex];
          }

          if (targetCell.rawValue !== '' || targetCell.formula !== undefined) {
              changed = true;
          }
          targetCell.rawValue = '';
          targetCell.formula = undefined; 
        }
      }

      if (changed) {
        spreadsheetCopy.updatedAt = Date.now();
        setTimeout(() => {
            toast({ title: "Contents Cleared", description: "Contents of selected cells have been cleared." });
        }, 0);
      }
      return spreadsheetCopy;
    }, 'user_action');
  }, [selectionRange, setSpreadsheetWithHistory, toast]);

  const updateMultipleCellsRawValue = useCallback((newValue: string | number) => {
    if (!selectionRange || !internalSpreadsheetRef.current) return;

    setSpreadsheetWithHistory(prevSpreadsheet => {
      if (!prevSpreadsheet) return null;
      let spreadsheetCopy = JSON.parse(JSON.stringify(prevSpreadsheet)) as SpreadsheetData;
      const { start, end } = selectionRange;
      const sheetToUpdate = spreadsheetCopy.sheets.find(s => s.id === start.sheetId);

      if (!sheetToUpdate) return prevSpreadsheet;

      const minRow = Math.min(start.rowIndex, end.rowIndex);
      const maxRow = Math.max(start.rowIndex, end.rowIndex);
      const minCol = Math.min(start.colIndex, end.colIndex);
      const maxCol = Math.max(start.colIndex, end.colIndex);

      for (let r = minRow; r <= maxRow; r++) {
        for (let c = minCol; c <= maxCol; c++) {
          if (!sheetToUpdate.cells[r]) sheetToUpdate.cells[r] = [];
          if (!sheetToUpdate.cells[r][c]) sheetToUpdate.cells[r][c] = createEmptyCell(r,c);
          
          let targetCell = sheetToUpdate.cells[r][c];
           // If part of a merge, target the master cell
          if (targetCell.isMerged && targetCell.mergeMaster) {
            targetCell = sheetToUpdate.cells[targetCell.mergeMaster.rowIndex][targetCell.mergeMaster.colIndex];
          }
          targetCell.rawValue = newValue;
        }
      }
      spreadsheetCopy.updatedAt = Date.now();
      setTimeout(() => {
          toast({ title: "Cells Updated", description: "Selected cells have been updated." });
      }, 0);
      return spreadsheetCopy;
    }, 'user_action');
  }, [selectionRange, setSpreadsheetWithHistory, toast]);


  const updateColumnWidth = useCallback((sheetId: string, colIndex: number, newWidth: number) => {
    setSpreadsheetWithHistory(prev => {
      if (!prev) return null;
      const newSheetData = JSON.parse(JSON.stringify(prev)) as SpreadsheetData;
      const sheet = newSheetData.sheets.find(s => s.id === sheetId);
      if (sheet && sheet.columnWidths && colIndex < sheet.columnWidths.length) {
        sheet.columnWidths[colIndex] = Math.max(20, newWidth);
        newSheetData.updatedAt = Date.now();
      }
      return newSheetData;
    }, 'user_action');
  }, [setSpreadsheetWithHistory]);

  const updateRowHeight = useCallback((sheetId: string, rowIndex: number, newHeight: number) => {
    setSpreadsheetWithHistory(prev => {
      if (!prev) return null;
      const newSheetData = JSON.parse(JSON.stringify(prev)) as SpreadsheetData;
      const sheet = newSheetData.sheets.find(s => s.id === sheetId);
      if (sheet && sheet.rowHeights && rowIndex < sheet.rowHeights.length) {
        sheet.rowHeights[rowIndex] = Math.max(20, newHeight);
        newSheetData.updatedAt = Date.now();
      }
      return newSheetData;
    }, 'user_action');
  }, [setSpreadsheetWithHistory]);

  const addConditionalFormatRule = useCallback((sheetId: string, rule: ConditionalFormatRule) => {
    setSpreadsheetWithHistory(prev => {
      if (!prev) return null;
      const newSheetData = JSON.parse(JSON.stringify(prev)) as SpreadsheetData;
      const sheet = newSheetData.sheets.find(s => s.id === sheetId);
      if (sheet) {
        if (!sheet.conditionalFormatRules) sheet.conditionalFormatRules = [];
        sheet.conditionalFormatRules.push(rule);
        newSheetData.updatedAt = Date.now();
         setTimeout(() => toast({ title: "Rule Added", description: "Conditional formatting rule applied." }), 0);
      }
      return newSheetData;
    }, 'user_action');
  }, [setSpreadsheetWithHistory, toast]);

  const removeConditionalFormatRule = useCallback((sheetId: string, ruleId: string) => {
     setSpreadsheetWithHistory(prev => {
        if (!prev) return null;
        const newSheetData = JSON.parse(JSON.stringify(prev)) as SpreadsheetData;
        const sheet = newSheetData.sheets.find(s => s.id === sheetId);
        if (sheet && sheet.conditionalFormatRules) {
            sheet.conditionalFormatRules = sheet.conditionalFormatRules.filter(r => r.id !== ruleId);
            newSheetData.updatedAt = Date.now();
            setTimeout(() => toast({ title: "Rule Removed", description: "Conditional formatting rule removed." }), 0);
        }
        return newSheetData;
     }, 'user_action');
  }, [setSpreadsheetWithHistory, toast]);
  
  const updateConditionalFormatRule = useCallback((sheetId: string, updatedRule: ConditionalFormatRule) => {
     setSpreadsheetWithHistory(prev => {
        if (!prev) return null;
        const newSheetData = JSON.parse(JSON.stringify(prev)) as SpreadsheetData;
        const sheet = newSheetData.sheets.find(s => s.id === sheetId);
        if (sheet && sheet.conditionalFormatRules) {
            const ruleIndex = sheet.conditionalFormatRules.findIndex(r => r.id === updatedRule.id);
            if (ruleIndex !== -1) {
                sheet.conditionalFormatRules[ruleIndex] = updatedRule;
                newSheetData.updatedAt = Date.now();
                setTimeout(() => toast({ title: "Rule Updated", description: "Conditional formatting rule updated." }), 0);
            }
        }
        return newSheetData;
     }, 'user_action');
  }, [setSpreadsheetWithHistory, toast]);

  const mergeSelection = useCallback(() => {
    if (!selectionRange || !internalSpreadsheetRef.current) return;
    const { start, end, start: { sheetId } } = selectionRange;
    if (start.rowIndex === end.rowIndex && start.colIndex === end.colIndex) {
        setTimeout(() => toast({ title: "Merge Cells", description: "Select multiple cells to merge.", variant: "default" }), 0);
        return;
    }

    setSpreadsheetWithHistory(prev => {
        if (!prev) return null;
        const spreadsheetCopy = JSON.parse(JSON.stringify(prev)) as SpreadsheetData;
        const sheet = spreadsheetCopy.sheets.find(s => s.id === sheetId);
        if (!sheet) return prev;

        if (!sheet.mergedCells) sheet.mergedCells = [];

        // Check for overlap with existing merges. For simplicity, disallow if any cell in selection is already merged.
        const minR = Math.min(start.rowIndex, end.rowIndex);
        const maxR = Math.max(start.rowIndex, end.rowIndex);
        const minC = Math.min(start.colIndex, end.colIndex);
        const maxC = Math.max(start.colIndex, end.colIndex);

        for (let r = minR; r <= maxR; r++) {
            for (let c = minC; c <= maxC; c++) {
                if (sheet.cells[r]?.[c]?.isMerged || sheet.mergedCells.some(mc => isCellAddressInRange({sheetId, rowIndex: r, colIndex: c}, mc))) {
                     setTimeout(() => toast({ title: "Merge Error", description: "Selection overlaps with an existing merged area. Unmerge first.", variant: "destructive" }), 0);
                    return prev;
                }
            }
        }
        
        const newMergeRange: SelectionRange = { 
            start: { sheetId, rowIndex: minR, colIndex: minC }, 
            end: { sheetId, rowIndex: maxR, colIndex: maxC } 
        };
        sheet.mergedCells.push(newMergeRange);

        const masterCell = sheet.cells[minR][minC];
        masterCell.colSpan = (maxC - minC) + 1;
        masterCell.rowSpan = (maxR - minR) + 1;
        masterCell.isMerged = false; // Master cell is not 'isMerged' itself, it defines the merge

        // Clear content and reset spans for subordinate cells in the merge
        for (let r = minR; r <= maxR; r++) {
            for (let c = minC; c <= maxC; c++) {
                if (r === minR && c === minC) continue; // Skip master cell
                if (sheet.cells[r]?.[c]) {
                    const subordinateCell = sheet.cells[r][c];
                    subordinateCell.rawValue = '';
                    subordinateCell.value = '';
                    subordinateCell.formula = undefined;
                    subordinateCell.style = {}; // Optionally clear styles of subordinate cells
                    subordinateCell.isMerged = true;
                    subordinateCell.mergeMaster = { sheetId, rowIndex: minR, colIndex: minC };
                    subordinateCell.colSpan = 1;
                    subordinateCell.rowSpan = 1;
                }
            }
        }
        spreadsheetCopy.updatedAt = Date.now();
        setTimeout(() => toast({ title: "Cells Merged", description: "Selected cells have been merged." }), 0);
        // After merging, set active cell to the master of the new merge and selection to the merged range
        setActiveCellState({ sheetId, rowIndex: minR, colIndex: minC });
        setSelectionRangeState(newMergeRange);
        return spreadsheetCopy;
    }, 'user_action');
  }, [selectionRange, toast, setSpreadsheetWithHistory]);

  const unmergeSelection = useCallback(() => {
    if (!activeCell || !internalSpreadsheetRef.current) return; // Unmerge based on active cell
    const { sheetId, rowIndex, colIndex } = activeCell;

    setSpreadsheetWithHistory(prev => {
        if (!prev) return null;
        const spreadsheetCopy = JSON.parse(JSON.stringify(prev)) as SpreadsheetData;
        const sheet = spreadsheetCopy.sheets.find(s => s.id === sheetId);
        if (!sheet || !sheet.mergedCells) return prev;

        const cellToUnmergeFrom = sheet.cells[rowIndex]?.[colIndex];
        if(!cellToUnmergeFrom) return prev;

        const masterAddress = (cellToUnmergeFrom.isMerged && cellToUnmergeFrom.mergeMaster) 
                               ? cellToUnmergeFrom.mergeMaster 
                               : {sheetId, rowIndex, colIndex};

        const mergeIndex = sheet.mergedCells.findIndex(mc => 
            mc.start.rowIndex === masterAddress.rowIndex && mc.start.colIndex === masterAddress.colIndex
        );

        if (mergeIndex === -1) {
            setTimeout(() => toast({ title: "Unmerge Cells", description: "Active cell is not part of a merged area.", variant: "default" }), 0);
            return prev;
        }

        const mergedRange = sheet.mergedCells[mergeIndex];
        sheet.mergedCells.splice(mergeIndex, 1); // Remove the merge instruction

        // Reset colSpan/rowSpan for the master cell and isMerged flags for all involved cells
        const masterCell = sheet.cells[mergedRange.start.rowIndex][mergedRange.start.colIndex];
        masterCell.colSpan = 1;
        masterCell.rowSpan = 1;
        masterCell.isMerged = false; // No longer defines a merge

        for (let r = mergedRange.start.rowIndex; r <= mergedRange.end.rowIndex; r++) {
            for (let c = mergedRange.start.colIndex; c <= mergedRange.end.colIndex; c++) {
                 if (sheet.cells[r]?.[c]) {
                    sheet.cells[r][c].isMerged = false;
                    delete sheet.cells[r][c].mergeMaster;
                 }
            }
        }
        spreadsheetCopy.updatedAt = Date.now();
        setTimeout(() => toast({ title: "Cells Unmerged", description: "Cells have been unmerged." }), 0);
        // After unmerging, set active cell and selection to the top-left of the former merge
        setActiveCellState({ sheetId, rowIndex: mergedRange.start.rowIndex, colIndex: mergedRange.start.colIndex });
        setSelectionRangeState({ start: mergedRange.start, end: mergedRange.start });
        return spreadsheetCopy;
    }, 'user_action');
  }, [activeCell, toast, setSpreadsheetWithHistory]);

  const findInSheet = useCallback((
    searchTerm: string,
    findOptions: { matchCase: boolean; entireCell: boolean; searchFormulas: boolean; sheetId: string; from: CellAddress | null }
    ): CellAddress | null => {
    
    const { matchCase, entireCell, searchFormulas, sheetId, from } = findOptions;
    const sheet = getSheetFromData(internalSpreadsheetRef.current, sheetId);
    if (!sheet || !searchTerm) return null;

    const term = matchCase ? searchTerm : searchTerm.toLowerCase();
    let startRow = from ? from.rowIndex : 0;
    let startCol = from ? from.colIndex + 1 : 0; // Start from next cell or beginning

    for (let r = startRow; r < sheet.rowCount; r++) {
        for (let c = (r === startRow ? startCol : 0); c < sheet.columnCount; c++) {
            const cell = sheet.cells[r]?.[c];
            if (cell) {
                let valueToSearch = searchFormulas ? (cell.rawValue || '').toString() : (cell.value || '').toString();
                if (!matchCase) valueToSearch = valueToSearch.toLowerCase();

                let found = false;
                if (entireCell) {
                    if (valueToSearch === term) found = true;
                } else {
                    if (valueToSearch.includes(term)) found = true;
                }

                if (found) {
                    const foundAddress = { sheetId, rowIndex: r, colIndex: c };
                    setLastFoundCell(foundAddress);
                    return foundAddress;
                }
            }
        }
    }
    // If not found from 'from', wrap around and search from beginning if 'from' was not (0,0)
    if (from && (from.rowIndex !== 0 || from.colIndex !== 0)) {
        for (let r = 0; r <= from.rowIndex; r++) {
            for (let c = 0; c < (r === from.rowIndex ? from.colIndex + 1 : sheet.columnCount) ; c++) {
                 const cell = sheet.cells[r]?.[c];
                 if (cell) {
                    let valueToSearch = searchFormulas ? (cell.rawValue || '').toString() : (cell.value || '').toString();
                    if (!matchCase) valueToSearch = valueToSearch.toLowerCase();
                    let found = false;
                    if (entireCell) {
                        if (valueToSearch === term) found = true;
                    } else {
                        if (valueToSearch.includes(term)) found = true;
                    }
                    if (found) {
                        const foundAddress = { sheetId, rowIndex: r, colIndex: c };
                        setLastFoundCell(foundAddress);
                        return foundAddress;
                    }
                }
            }
        }
    }
    setLastFoundCell(null); // Not found
    return null;

  }, []);


  const canUndo = undoStack.length > 0;
  const canRedo = redoStack.length > 0;

  return (
    <SpreadsheetContext.Provider value={{
      spreadsheet: internalSpreadsheetState,
      setSpreadsheet: exposedSetSpreadsheet,
      isLoading,
      loadSpreadsheet,
      saveSpreadsheet,
      updateCell,
      activeCell: activeCell,
      selectionRange: selectionRange,
      setActiveCellAndSelection,
      updateSelectedCellStyle,
      formatSelectionAsTable,
      insertRow,
      deleteRow,
      insertColumn,
      deleteColumn,
      appendRow,
      appendColumn,
      undo,
      redo,
      canUndo,
      canRedo,
      evaluateFormula: evaluateFormulaContext,
      copySelectionToClipboard,
      deleteSelectionContents,
      updateMultipleCellsRawValue,
      isActivelyEditingFormula: isActivelyEditingFormula,
      setIsActivelyEditingFormula,
      formulaBarApiRef,
      updateColumnWidth,
      updateRowHeight,
      addConditionalFormatRule,
      removeConditionalFormatRule,
      updateConditionalFormatRule,
      mergeSelection,
      unmergeSelection,
      findInSheet,
    }}>
      {children}
    </SpreadsheetContext.Provider>
  );
}


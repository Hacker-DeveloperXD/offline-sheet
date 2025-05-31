
"use client";

import type { Dispatch, ReactNode, SetStateAction} from 'react';
import { createContext, useState, useEffect, useCallback, useRef }
from 'react';
<<<<<<< HEAD
import type { SpreadsheetData, SheetData, CellData, CellStyle, CellAddress, SelectionRange, ConditionalFormatRule, NumberFormatStyle, CellHistoryEntry, CellDataType } from '@/types/spreadsheet';
import { useToast } from '@/hooks/use-toast';
import { createEmptyCell, getCellId, DEFAULT_COLUMN_WIDTH, DEFAULT_ROW_COUNT, DEFAULT_COLUMN_COUNT, createInitialSheet as createInitialSheetUtil, DEFAULT_ROW_HEIGHT, isCellAddressInRange, MAX_CELL_HISTORY } from '@/types/spreadsheet';
import { v4 as uuidv4 } from 'uuid';
import { create, all, type Matrix, type MathNode } from 'mathjs';
import * as XLSX from 'xlsx';
import { useRouter } from 'next/navigation';

import { db } from '@/lib/firebase'; // Import Firestore instance
import { doc, getDoc, setDoc, updateDoc, onSnapshot, collection, writeBatch, serverTimestamp, DocumentData, Timestamp, query, where, getDocs, deleteDoc } from 'firebase/firestore';


const MAX_UNDO_HISTORY = 0; // Disabled for Firestore integration
const MAX_FORMULA_RECURSION_DEPTH = 20;

const CUSTOM_FUNCTION_REGEX = /^([A-Z_][A-Z0-9_]*)\s*\((.*)\)$/i;
const CELL_REF_REGEX_SINGLE = /^[A-Z]+[1-9]\d*$/i;
const RANGE_REF_REGEX = /^([A-Z]+[1-9]\d*):([A-Z]+[1-9]\d*)$/i;
const ALL_CELL_REFS_REGEX = /[A-Z]+[1-9]\d*(?![A-Z0-9:()])/gi;
const NUMERIC_LITERAL_REGEX = /^-?\d+(\.\d+)?$/;

const PLACEHOLDER_USER_ID = "user_ABC"; 


function parseCellId(id: string): { rowIndex: number; colIndex: number } | null {
  if (!id || typeof id !== 'string') return null;
  const match = id.toUpperCase().match(CELL_REF_REGEX_SINGLE);
=======
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
>>>>>>> 3cd4ffaa439f3afbedf88f6042b7b8f5a2da87f2
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
<<<<<<< HEAD
  currentSpreadsheetData: SpreadsheetData, 
=======
  currentSpreadsheetData: SpreadsheetData,
>>>>>>> 3cd4ffaa439f3afbedf88f6042b7b8f5a2da87f2
  sheetId: string,
  formulaExpressionWithEquals: string,
  visitedCellsInCurrentChain: Set<string>
) => string | number;

<<<<<<< HEAD
const getResolvedCellValue = (
    spreadsheetData: SpreadsheetData, 
=======

const getResolvedCellValue = (
    spreadsheetData: SpreadsheetData,
>>>>>>> 3cd4ffaa439f3afbedf88f6042b7b8f5a2da87f2
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
<<<<<<< HEAD
    if (!cell) { 
       return 0; 
    }
    
    if(cell.isMerged && cell.mergeMaster){
        if(cell.mergeMaster.rowIndex === address.rowIndex && cell.mergeMaster.colIndex === address.colIndex){
            // This IS the master cell, proceed
        } else {
            const newVisitedPathRedirect = new Set(visitedCellsInCurrentEvalPath);
=======
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
>>>>>>> 3cd4ffaa439f3afbedf88f6042b7b8f5a2da87f2
            newVisitedPathRedirect.add(cellIdForVisited); 
            return getResolvedCellValue(spreadsheetData, targetSheetId, cell.mergeMaster, newVisitedPathRedirect);
        }
    }
<<<<<<< HEAD
    
    const raw = cell.rawValue;

    if (raw === undefined || raw === null || String(raw).trim() === '') {
        return 0; 
=======

    const raw = cell.rawValue;

    if (raw === undefined || raw === null || String(raw).trim() === '') {
        return 0; // Treat truly empty cells as 0 for formula evaluation
>>>>>>> 3cd4ffaa439f3afbedf88f6042b7b8f5a2da87f2
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
<<<<<<< HEAD
        return (isNaN(num) || !isFinite(num)) ? raw : num; 
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
  if (!rangeMatch) return "#NAME?";
=======
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
>>>>>>> 3cd4ffaa439f3afbedf88f6042b7b8f5a2da87f2

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

<<<<<<< HEAD

function parseCustomFunctionArgs(argsString: string): string[] {
  if (argsString.trim() === "") return [];
  let balance = 0; 
  let currentArg = "";
  const args: string[] = [];

=======
function parseCustomFunctionArgs(argsString: string): string[] {
  if (argsString.trim() === "") return [];
  let balance = 0;
  let currentArg = "";
  const args: string[] = [];
>>>>>>> 3cd4ffaa439f3afbedf88f6042b7b8f5a2da87f2
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
<<<<<<< HEAD
  args.push(currentArg.trim()); 
=======
  args.push(currentArg.trim());
>>>>>>> 3cd4ffaa439f3afbedf88f6042b7b8f5a2da87f2
  return args;
}

const processAggregateArg = (
<<<<<<< HEAD
    arg: any, 
    spreadsheetData: SpreadsheetData,
    sheetId: string,
    visitedCells: Set<string>,
    onNumber: (num: number) => void,
    onError: (err: string) => void,
    isCountFunction: boolean = false
  ): boolean => { 

    if (typeof arg === 'number') {
      if(isFinite(arg)) onNumber(arg); else onError("#NUM!");
      return false;
    }

    if (typeof arg === 'string') {
      const trimmedArg = arg.trim();
      if (NUMERIC_LITERAL_REGEX.test(trimmedArg)) {
        const num = parseFloat(trimmedArg);
        if(isFinite(num)) onNumber(num); else onError("#NUM!");
        return false;
      }
      if (RANGE_REF_REGEX.test(trimmedArg)) {
        const rangeValues = resolveRangeToArray(trimmedArg, spreadsheetData, sheetId, new Set(visitedCells));
        if (typeof rangeValues === 'string') { 
          onError(rangeValues);
          return true;
        }
        for (const row of rangeValues) {
          for (const val of row) {
            if (typeof val === 'number') {
              if(isFinite(val)) onNumber(val); else { onError("#NUM!"); return true;}
            } else if (typeof val === 'string' && val.startsWith('#')) {
              onError(val);
              return true; 
            } else if (typeof val === 'string' && !isCountFunction){
            } else if (typeof val === 'string' && isCountFunction && NUMERIC_LITERAL_REGEX.test(val)){
              const numFromText = parseFloat(val);
              if(isFinite(numFromText)) onNumber(numFromText);
            }
          }
        }
        return false;
      }
      if (CELL_REF_REGEX_SINGLE.test(trimmedArg)) {
        const coord = parseCellId(trimmedArg);
        if (coord) {
          const cellVal = getResolvedCellValue(spreadsheetData, sheetId, coord, new Set(visitedCells));
          if (typeof cellVal === 'number') {
            if(isFinite(cellVal)) onNumber(cellVal); else { onError("#NUM!"); return true; }
          } else if (typeof cellVal === 'string' && cellVal.startsWith('#')) {
            onError(cellVal);
            return true;
          } else if (typeof cellVal === 'string' && !isCountFunction){
          } else if (typeof cellVal === 'string' && isCountFunction && NUMERIC_LITERAL_REGEX.test(cellVal)){
            const numFromText = parseFloat(cellVal);
            if(isFinite(numFromText)) onNumber(numFromText);
          }
          return false;
        } else {
          onError("#NAME?"); 
          return true;
        }
      }
       if (trimmedArg.length > 0 && (trimmedArg.includes('+') || trimmedArg.includes('-') || trimmedArg.includes('*') || trimmedArg.includes('/') || trimmedArg.includes('(') || trimmedArg.startsWith('"'))) {
         if (typeof actualEvaluateFormulaLogic === 'function') {
             const subExpressionResult = actualEvaluateFormulaLogic(spreadsheetData, sheetId, '=' + trimmedArg, new Set(visitedCells));
             if(typeof subExpressionResult === 'number') {
                if(isFinite(subExpressionResult)) onNumber(subExpressionResult); else { onError("#NUM!"); return true; }
             } else if (typeof subExpressionResult === 'string' && subExpressionResult.startsWith('#')) {
                onError(subExpressionResult);
                return true;
             }
             else if (typeof subExpressionResult === 'string' && isCountFunction && NUMERIC_LITERAL_REGEX.test(subExpressionResult)) {
                const numFromText = parseFloat(subExpressionResult);
                if(isFinite(numFromText)) onNumber(numFromText);
             }
             return false;
         } else {
             onError("#VALUE!"); 
             return true;
         }
      }
      if (!isCountFunction) return false; 
      else if (isCountFunction && NUMERIC_LITERAL_REGEX.test(trimmedArg)){ 
         const numFromText = parseFloat(trimmedArg);
         if(isFinite(numFromText)) onNumber(numFromText);
      }
      return false;
    }
    
    if (Array.isArray(arg)) {
        for (const item of arg) {
            if (processAggregateArg(item, spreadsheetData, sheetId, visitedCells, onNumber, onError, isCountFunction)) {
                return true; 
            }
        }
        return false;
    }

    if (arg && typeof arg === 'object' && (arg as any).isMatrix === true) {
      const matrixArray = (arg as Matrix).toArray();
      for (const item of matrixArray.flat(Infinity)) { 
        if (processAggregateArg(item, spreadsheetData, sheetId, visitedCells, onNumber, onError, isCountFunction)) {
          return true; 
        }
      }
      return false;
    }

    return false;
  };


=======
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

>>>>>>> 3cd4ffaa439f3afbedf88f6042b7b8f5a2da87f2
actualEvaluateFormulaLogic = (
  currentSpreadsheetData: SpreadsheetData,
  sheetId: string,
  formulaExpressionWithEquals: string,
  visitedCellsInCurrentChain: Set<string> 
): string | number => {
<<<<<<< HEAD

=======
>>>>>>> 3cd4ffaa439f3afbedf88f6042b7b8f5a2da87f2
  if (visitedCellsInCurrentChain.size > MAX_FORMULA_RECURSION_DEPTH) {
    return "#CIRCREF!";
  }

  const currentSheet = currentSpreadsheetData.sheets.find(s => s.id === sheetId);
<<<<<<< HEAD
  if (!currentSheet) return "#REF!"; 
=======
  if (!currentSheet) return "#REF!";
>>>>>>> 3cd4ffaa439f3afbedf88f6042b7b8f5a2da87f2

  const cleanExpression = formulaExpressionWithEquals.startsWith('=')
    ? formulaExpressionWithEquals.substring(1).trim()
    : formulaExpressionWithEquals.trim();

  const topLevelFunctionMatch = cleanExpression.match(CUSTOM_FUNCTION_REGEX);
<<<<<<< HEAD
  if (topLevelFunctionMatch) {
    const functionName = topLevelFunctionMatch[1].toUpperCase();
    const argsString = topLevelFunctionMatch[2];
    const rawArgsStrings = parseCustomFunctionArgs(argsString); 
    
    const resolvedArgs: any[] = [];
    for (const argStr of rawArgsStrings) {
        let resolvedArg: any;
        if (NUMERIC_LITERAL_REGEX.test(argStr)) {
            resolvedArg = parseFloat(argStr);
        } else if (RANGE_REF_REGEX.test(argStr)) {
            resolvedArg = resolveRangeToArray(argStr, currentSpreadsheetData, sheetId, new Set(visitedCellsInCurrentChain));
        } else if (CELL_REF_REGEX_SINGLE.test(argStr)) {
            const coord = parseCellId(argStr);
            if (coord) {
                resolvedArg = getResolvedCellValue(currentSpreadsheetData, sheetId, coord, new Set(visitedCellsInCurrentChain));
            } else {
                return "#NAME?"; 
            }
        } else if ((argStr.startsWith('"') && argStr.endsWith('"')) || (argStr.startsWith("'") && argStr.endsWith("'")) ) {
            resolvedArg = argStr.substring(1, argStr.length -1); 
        } else if (argStr.toLowerCase() === 'true') {
            resolvedArg = true;
        } else if (argStr.toLowerCase() === 'false') {
            resolvedArg = false;
        } else { 
            resolvedArg = actualEvaluateFormulaLogic(currentSpreadsheetData, sheetId, '=' + argStr, new Set(visitedCellsInCurrentChain));
        }
        resolvedArgs.push(resolvedArg);
    }
    
    for(const arg of resolvedArgs.flat(Infinity)) { 
        if (typeof arg === 'string' && arg.startsWith('#')) return arg;
    }

    const aggregateAndProcess = (
      args: any[], 
      isCount: boolean,
      aggregator: (nums: number[]) => string | number
    ) => {
      const numbers: number[] = [];
      let anErrorOccurred = false;
      let firstError: string | null = null;

      const onNum = (num: number) => numbers.push(num);
      const onErr = (err: string) => {
        if (!anErrorOccurred) {
          anErrorOccurred = true;
          firstError = err;
        }
      };
      
      for(const arg of args){
          if(anErrorOccurred) break;
          processAggregateArg(arg, currentSpreadsheetData, sheetId, new Set(visitedCellsInCurrentChain), onNum, onErr, isCount);
      }

      if (anErrorOccurred && firstError) return firstError;
      return aggregator(numbers);
    };

    switch (functionName) {
      case 'SUM':
        return aggregateAndProcess(resolvedArgs, false, nums => nums.reduce((acc, val) => acc + val, 0));
      case 'AVERAGE':
        return aggregateAndProcess(resolvedArgs, false, nums => nums.length === 0 ? "#DIV/0!" : nums.reduce((acc, val) => acc + val, 0) / nums.length);
      case 'COUNT':
        return aggregateAndProcess(resolvedArgs, true, nums => nums.length);
      case 'MAX':
        return aggregateAndProcess(resolvedArgs, false, nums => nums.length === 0 ? 0 : Math.max(...nums));
      case 'MIN':
        return aggregateAndProcess(resolvedArgs, false, nums => nums.length === 0 ? 0 : Math.min(...nums));
      case 'IF': {
        if (resolvedArgs.length < 2 || resolvedArgs.length > 3) return "#N/A";
        const condition = resolvedArgs[0];
        const valueIfTrue = resolvedArgs[1];
        const valueIfFalse = resolvedArgs.length === 3 ? resolvedArgs[2] : false; 

        if (typeof condition === 'string' && condition.startsWith('#')) return condition; 

        let conditionResult: boolean;
        if (typeof condition === 'number') conditionResult = condition !== 0;
        else if (typeof condition === 'boolean') conditionResult = condition;
        else { 
            const upperCond = String(condition).toUpperCase();
            if (upperCond === "TRUE") conditionResult = true;
            else if (upperCond === "FALSE") conditionResult = false;
            else if (String(condition).trim() === "") conditionResult = false; 
            else return "#VALUE!"; 
        }
        return conditionResult ? valueIfTrue : valueIfFalse;
      }
      case 'CONCATENATE': case 'CONCAT':
        return resolvedArgs.flat(Infinity).map(String).join('');
      case 'LEN':
        if (resolvedArgs.length !== 1) return "#N/A";
        return String(resolvedArgs[0]).length;
      case 'LEFT': case 'RIGHT': {
        if (resolvedArgs.length < 1 || resolvedArgs.length > 2) return "#N/A";
        const text = String(resolvedArgs[0]);
        const numCharsArg = resolvedArgs.length === 2 ? resolvedArgs[1] : 1;
        if (typeof numCharsArg !== 'number' || !isFinite(numCharsArg) || numCharsArg < 0) return "#VALUE!";
        const numChars = Math.floor(numCharsArg);
        return functionName === 'LEFT' ? text.substring(0, numChars) : text.substring(text.length - numChars);
      }
      case 'MID': {
        if (resolvedArgs.length !== 3) return "#N/A";
        const text = String(resolvedArgs[0]);
        const startNumArg = resolvedArgs[1];
        const numCharsArg = resolvedArgs[2];
        if (typeof startNumArg !== 'number' || !isFinite(startNumArg) || startNumArg < 1 ||
            typeof numCharsArg !== 'number' || !isFinite(numCharsArg) || numCharsArg < 0) return "#VALUE!";
        const startNum = Math.floor(startNumArg);
        const numChars = Math.floor(numCharsArg);
        return text.substring(startNum - 1, startNum - 1 + numChars);
      }
      case 'LOWER': case 'UPPER':
        if (resolvedArgs.length !== 1) return "#N/A";
        return functionName === 'LOWER' ? String(resolvedArgs[0]).toLowerCase() : String(resolvedArgs[0]).toUpperCase();
      case 'TRIM':
        if (resolvedArgs.length !== 1) return "#N/A";
        return String(resolvedArgs[0]).trim();
      case 'ROUND': {
        if (resolvedArgs.length !== 2) return "#N/A";
        const numArg = resolvedArgs[0];
        const digitsArg = resolvedArgs[1];
        if (typeof numArg !== 'number' || !isFinite(numArg) || typeof digitsArg !== 'number' || !isFinite(digitsArg)) return "#VALUE!";
        const factor = Math.pow(10, Math.floor(digitsArg));
        return Math.round(numArg * factor) / factor;
      }
      case 'ABS':
        if (resolvedArgs.length !== 1) return "#N/A";
        const numForAbs = resolvedArgs[0];
        if (typeof numForAbs !== 'number' || !isFinite(numForAbs)) return "#VALUE!";
        return Math.abs(numForAbs);
=======

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
>>>>>>> 3cd4ffaa439f3afbedf88f6042b7b8f5a2da87f2
    }
  }

  const mathInstance = create(all);
  const scope: Record<string, any> = {};
<<<<<<< HEAD

  const cellRefMatches = cleanExpression.match(ALL_CELL_REFS_REGEX);
  if (cellRefMatches) {
    const uniqueCellRefs = new Set(cellRefMatches.map(ref => ref.toUpperCase()));
    for (const cellRef of uniqueCellRefs) {
        const coord = parseCellId(cellRef);
        if (coord) {
            const val = getResolvedCellValue(currentSpreadsheetData, sheetId, coord, new Set(visitedCellsInCurrentChain));
            scope[cellRef] = val;
            if (typeof val === 'string' && val.startsWith('#') && !topLevelFunctionMatch) {
                return val; 
            }
        }
    }
  }
  
  const customFunctionsForMathJS: Record<string, (...args: any[]) => any> = {
    SUM: (...args: any[]) => aggregateAndProcess(args, false, nums => nums.reduce((s, n) => s + n, 0)),
    AVERAGE: (...args: any[]) => aggregateAndProcess(args, false, nums => nums.length === 0 ? "#DIV/0!" : nums.reduce((s, n) => s + n, 0) / nums.length),
    COUNT: (...args: any[]) => aggregateAndProcess(args, true, nums => nums.length),
    MAX: (...args: any[]) => aggregateAndProcess(args, false, nums => nums.length === 0 ? 0 : Math.max(...nums)),
    MIN: (...args: any[]) => aggregateAndProcess(args, false, nums => nums.length === 0 ? 0 : Math.min(...nums)),
    IF: (condition: any, value_if_true: any, value_if_false?: any): any => {
        const resolvedCondition = (condition && typeof condition === 'object' && (condition as any).isMatrix === true) 
                                ? (condition as Matrix).toArray().flat(Infinity)[0] 
                                : condition;
        if (typeof resolvedCondition === 'string' && resolvedCondition.startsWith('#')) return resolvedCondition;
        let condResult: boolean;
        if (typeof resolvedCondition === 'number') condResult = resolvedCondition !== 0;
        else if (typeof resolvedCondition === 'boolean') condResult = resolvedCondition;
        else {
            const upperCond = String(resolvedCondition).toUpperCase();
            if (upperCond === "TRUE") condResult = true;
            else if (upperCond === "FALSE") condResult = false;
            else if (String(resolvedCondition).trim() === "") condResult = false;
            else return "#VALUE!";
        }
        const trueValResolved = (value_if_true && typeof value_if_true === 'object' && (value_if_true as any)?.isMatrix === true) ? (value_if_true as Matrix).toArray().flat(Infinity)[0] : value_if_true;
=======
  
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
        
>>>>>>> 3cd4ffaa439f3afbedf88f6042b7b8f5a2da87f2
        let falseValResolved = value_if_false;
        if (value_if_false !== undefined && typeof value_if_false === 'object' && (value_if_false as any)?.isMatrix === true) {
            falseValResolved = (value_if_false as Matrix).toArray().flat(Infinity)[0];
        }
<<<<<<< HEAD
        return condResult ? trueValResolved : (value_if_false === undefined ? false : falseValResolved);
    },
    CONCATENATE: (...args: any[]) => args.flat(Infinity).map(String).join(''),
    CONCAT: (...args: any[]) => args.flat(Infinity).map(String).join(''), 
    LEN: (text: any) => String(text).length,
    LEFT: (text: any, num_chars?: any) => String(text).substring(0, Math.max(0, Math.floor(Number(num_chars ?? 1)))),
    RIGHT: (text: any, num_chars?: any) => {
        const s = String(text);
        const n = Math.max(0, Math.floor(Number(num_chars ?? 1)));
        return s.substring(s.length - n);
    },
    MID: (text: any, start_num: any, num_chars: any) => {
        const s = String(text);
        const start = Math.floor(Number(start_num));
        const num = Math.floor(Number(num_chars));
        if (isNaN(start) || isNaN(num) || start < 1 || num < 0) return "#VALUE!";
        return s.substring(start - 1, start - 1 + num);
    },
    LOWER: (text: any) => String(text).toLowerCase(),
    UPPER: (text: any) => String(text).toUpperCase(),
    TRIM: (text: any) => String(text).trim(),
    ROUND: (num: any, digits: any) => {
        const n = Number(num);
        const d = Math.floor(Number(digits));
        if (isNaN(n) || isNaN(d)) return "#VALUE!";
        const factor = Math.pow(10, d);
        return Math.round(n * factor) / factor;
    },
    ABS: (num: any) => {
        const n = Number(num);
        if (isNaN(n)) return "#VALUE!";
        return Math.abs(n);
=======
        if (typeof falseValResolved === 'string' && falseValResolved.startsWith('#')) return falseValResolved;

        if (condResult) return trueValResolved;
        else return value_if_false === undefined ? false : falseValResolved;
>>>>>>> 3cd4ffaa439f3afbedf88f6042b7b8f5a2da87f2
    }
  };
  mathInstance.import(customFunctionsForMathJS, { override: true });

<<<<<<< HEAD

=======
>>>>>>> 3cd4ffaa439f3afbedf88f6042b7b8f5a2da87f2
  try {
    const parsedNode: MathNode = mathInstance.parse(cleanExpression);
    let evalResult = parsedNode.evaluate(scope);

<<<<<<< HEAD
    if (evalResult === undefined || evalResult === null) return 0; 
    if (typeof evalResult === 'number') return isFinite(evalResult) ? evalResult : "#NUM!"; 
    if (typeof evalResult === 'string' && evalResult.startsWith('#')) return evalResult; 
    
    if ((evalResult as any)?.isMatrix === true) {
        const matrixData = (evalResult as Matrix).toArray().flat(Infinity);
        if (matrixData.length === 1) {
            const singleValue = matrixData[0];
             if (typeof singleValue === 'number' && isFinite(singleValue)) return singleValue;
             if (typeof singleValue === 'string' && singleValue.startsWith('#')) return singleValue;
             if (singleValue === undefined || singleValue === null) return 0; 
             return String(singleValue);
        }
        return "#VALUE!"; 
    }

    if (evalResult && typeof evalResult.valueOf === 'function' && typeof evalResult !== 'function') {
        const primitiveResult = evalResult.valueOf();
        if (typeof primitiveResult === 'number' && isFinite(primitiveResult)) return primitiveResult;
        if (primitiveResult === undefined || primitiveResult === null) return 0; 
        return String(primitiveResult);
    }

    return String(evalResult); 
=======
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
>>>>>>> 3cd4ffaa439f3afbedf88f6042b7b8f5a2da87f2
  } catch (error: any) {
    const msgLower = String(error?.message || '').toLowerCase();
    if (msgLower.includes("undefined symbol") || msgLower.includes("unknown function")) return "#NAME?";
    if (msgLower.includes("division by zero")) return "#DIV/0!";
<<<<<<< HEAD
    if (msgLower.includes("typeerror") || msgLower.includes("cannot convert") || msgLower.includes("unexpected type of argument") || msgLower.includes("dimension mismatch") || msgLower.includes("value expected") ) return "#VALUE!";
    if (msgLower.includes("incorrect number of arguments")) return "#N/A";
    return "#ERROR!"; 
=======
    if (msgLower.includes("value expected") || msgLower.includes("typeerror") || msgLower.includes("cannot convert") || msgLower.includes("unexpected type of argument") || msgLower.includes("dimension mismatch")) return "#VALUE!";
    if (msgLower.includes("incorrect number of arguments")) return "#N/A";
    return "#ERROR!";
>>>>>>> 3cd4ffaa439f3afbedf88f6042b7b8f5a2da87f2
  }
};

function reevaluateSheetFormulas (spreadsheetData: SpreadsheetData, sheetToReevaluateId: string): SpreadsheetData {
<<<<<<< HEAD
    const updatedSpreadsheet = JSON.parse(JSON.stringify(spreadsheetData)) as SpreadsheetData; 
=======
    const updatedSpreadsheet = JSON.parse(JSON.stringify(spreadsheetData)) as SpreadsheetData;
>>>>>>> 3cd4ffaa439f3afbedf88f6042b7b8f5a2da87f2
    const sheetToUpdate = updatedSpreadsheet.sheets.find(s => s.id === sheetToReevaluateId);

    if (sheetToUpdate) {
      for (let r = 0; r < sheetToUpdate.rowCount; r++) {
        if (!sheetToUpdate.cells[r]) sheetToUpdate.cells[r] = Array.from({ length: sheetToUpdate.columnCount }, (_, c) => createEmptyCell(r, c));
        for (let c = 0; c < sheetToUpdate.columnCount; c++) {
<<<<<<< HEAD
          if (!sheetToUpdate.cells[r][c]) {
            sheetToUpdate.cells[r][c] = createEmptyCell(r, c);
          }
           const cell = sheetToUpdate.cells[r][c]; 
           const rawValue = cell.rawValue;

           if (typeof rawValue === 'string' && rawValue.startsWith('=')) {
                cell.formula = rawValue; 
                cell.value = actualEvaluateFormulaLogic(updatedSpreadsheet, sheetToReevaluateId, rawValue, new Set());
           } else {
             cell.formula = undefined;
             if (rawValue === undefined || rawValue === null || String(rawValue).trim() === '') {
                 cell.value = ''; 
             } else if (typeof rawValue === 'number') {
                 cell.value = rawValue;
             } else if (typeof rawValue === 'string') {
                 const num = parseFloat(rawValue);
                 cell.value = (!isNaN(num) && isFinite(num) && String(num) === rawValue.trim()) ? num : rawValue;
             } else {
                 cell.value = String(rawValue); 
             }
           }
           // Ensure history exists
           if (!cell.history) cell.history = [];
=======
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
>>>>>>> 3cd4ffaa439f3afbedf88f6042b7b8f5a2da87f2
        }
      }
    }
    return updatedSpreadsheet;
  };

<<<<<<< HEAD

=======
>>>>>>> 3cd4ffaa439f3afbedf88f6042b7b8f5a2da87f2
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

<<<<<<< HEAD
export interface CellHistoryDialogApi {
  openDialog: (cellAddress: CellAddress) => void;
}

export interface SpreadsheetContextType {
  spreadsheet: SpreadsheetData | null;
  isLoading: boolean;
  loadSpreadsheet: (id: string) => Promise<void>;
  saveSpreadsheet: () => Promise<void>; 
  updateCell: (sheetId: string, rowIndex: number, colIndex: number, newCellData: Partial<Pick<CellData, 'rawValue' | 'style'>>, typedChar?: string) => void;
=======
export interface SpreadsheetContextType {
  spreadsheet: SpreadsheetData | null;
  setSpreadsheet: Dispatch<SetStateAction<SpreadsheetData | null>>;
  isLoading: boolean;
  loadSpreadsheet: (id: string) => Promise<void>;
  saveSpreadsheet: () => Promise<void>;
  updateCell: (sheetId: string, rowIndex: number, colIndex: number, newCellData: Partial<Pick<CellData, 'rawValue' | 'style'>>) => void;
>>>>>>> 3cd4ffaa439f3afbedf88f6042b7b8f5a2da87f2
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
<<<<<<< HEAD
  updateSelectedCellNumberFormat: (format: NumberFormatStyle) => void;
  updateSelectedCellDataType: (dataType: CellDataType) => void; 
=======
>>>>>>> 3cd4ffaa439f3afbedf88f6042b7b8f5a2da87f2
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
<<<<<<< HEAD
  exportToXLSX: () => void;
  exportToCSV: () => void;
  importSpreadsheetData: (file: File, type: 'json' | 'xlsx' | 'csv') => Promise<void>;
  revertCellToHistory: (sheetId: string, rowIndex: number, colIndex: number, historyEntryIndex: number) => void;
  updateCellHistoryEntryComment: (sheetId: string, rowIndex: number, colIndex: number, historyEntryTimestamp: number, newComment: string) => void;
  cellHistoryDialogApiRef: React.MutableRefObject<CellHistoryDialogApi | null>;
  // Add setSpreadsheet for direct manipulation if needed, though prefer specific action functions
  setSpreadsheet: Dispatch<SetStateAction<SpreadsheetData | null>>;
=======
>>>>>>> 3cd4ffaa439f3afbedf88f6042b7b8f5a2da87f2
}

export const SpreadsheetContext = createContext<SpreadsheetContextType | undefined>(undefined);

export function SpreadsheetProvider({ children }: { children: ReactNode }) {
  const [internalSpreadsheetState, setInternalSpreadsheetState] = useState<SpreadsheetData | null>(null);
<<<<<<< HEAD
  const internalSpreadsheetRef = useRef<SpreadsheetData | null>(null); 
=======
  const internalSpreadsheetRef = useRef<SpreadsheetData | null>(null);
>>>>>>> 3cd4ffaa439f3afbedf88f6042b7b8f5a2da87f2

  useEffect(() => {
    internalSpreadsheetRef.current = internalSpreadsheetState;
  }, [internalSpreadsheetState]);

<<<<<<< HEAD

  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
=======
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
>>>>>>> 3cd4ffaa439f3afbedf88f6042b7b8f5a2da87f2

  const [activeCell, setActiveCellState] = useState<CellAddress | null>(null);
  const [selectionRange, setSelectionRangeState] = useState<SelectionRange | null>(null);
  const [lastFoundCell, setLastFoundCell] = useState<CellAddress | null>(null);


  const [undoStack, setUndoStack] = useState<SpreadsheetData[]>([]);
  const [redoStack, setRedoStack] = useState<SpreadsheetData[]>([]);

<<<<<<< HEAD
  const [isActivelyEditingFormula, setIsActivelyEditingFormulaState] = useState<boolean>(false);
  const formulaBarApiRef = useRef<FormulaBarApi | null>(null);
  const cellHistoryDialogApiRef = useRef<CellHistoryDialogApi | null>(null);

  const activeSheetListenerUnsubscribeRef = useRef<(() => void) | null>(null);
=======
  const [isActivelyEditingFormula, setIsActivelyEditingFormula] = useState<boolean>(false);
  const formulaBarApiRef = useRef<FormulaBarApi | null>(null);
>>>>>>> 3cd4ffaa439f3afbedf88f6042b7b8f5a2da87f2


  const setSpreadsheetWithHistory = useCallback((
    updater: SetStateAction<SpreadsheetData | null>,
<<<<<<< HEAD
    actionSource: 'user_action' | 'undo' | 'redo' | 'internal_no_history' | 'save' | 'import' | 'revert_history' | 'structural_change' | 'firestore_update' | 'metadata_update' = 'user_action'
    ) => {
    setInternalSpreadsheetState(currentSpreadsheetForUpdate => {
      const currentDeepCloneForHistory = currentSpreadsheetForUpdate && actionSource !== 'firestore_update' && MAX_UNDO_HISTORY > 0
        ? JSON.parse(JSON.stringify(currentSpreadsheetForUpdate)) as SpreadsheetData 
        : null;

      let newSpreadsheetRaw: SpreadsheetData | null;
      if (typeof updater === 'function') {
        newSpreadsheetRaw = updater(currentSpreadsheetForUpdate ? JSON.parse(JSON.stringify(currentSpreadsheetForUpdate)) : null );
=======
    actionSource?: 'undo' | 'redo' | 'internal_no_history' | 'save' | 'user_action'
    ) => {
    setInternalSpreadsheetState(current => {
      const currentDeepCloneForHistory = current ? JSON.parse(JSON.stringify(current)) as SpreadsheetData : null;

      let newSpreadsheetRaw: SpreadsheetData | null;
      if (typeof updater === 'function') {
        newSpreadsheetRaw = updater(currentDeepCloneForHistory ? JSON.parse(JSON.stringify(currentDeepCloneForHistory)) : null );
>>>>>>> 3cd4ffaa439f3afbedf88f6042b7b8f5a2da87f2
      } else {
        newSpreadsheetRaw = updater;
      }
      
      let newSpreadsheet = newSpreadsheetRaw ? JSON.parse(JSON.stringify(newSpreadsheetRaw)) as SpreadsheetData : null;
<<<<<<< HEAD
      
      if (newSpreadsheet && (actionSource === 'user_action' || actionSource === 'revert_history' || actionSource === 'import' || actionSource === 'structural_change' || actionSource === 'firestore_update')) {
          const activeSheetToReevaluateId = newSpreadsheet.activeSheetId; 
          if (actionSource === 'import' || actionSource === 'structural_change') {
              newSpreadsheet.sheets.forEach(sheet => {
                newSpreadsheet = reevaluateSheetFormulas(JSON.parse(JSON.stringify(newSpreadsheet!)), sheet.id);
              });
          } else if (activeSheetToReevaluateId && (actionSource === 'user_action' || actionSource === 'revert_history' || actionSource === 'firestore_update')) {
              newSpreadsheet = reevaluateSheetFormulas(JSON.parse(JSON.stringify(newSpreadsheet!)), activeSheetToReevaluateId);
          }
      }
      
      if (actionSource !== 'internal_no_history' && actionSource !== 'save' && actionSource !== 'firestore_update' && actionSource !== 'metadata_update' && MAX_UNDO_HISTORY > 0 &&
          currentDeepCloneForHistory && newSpreadsheet &&
          JSON.stringify(currentDeepCloneForHistory) !== JSON.stringify(newSpreadsheet)) {
        
        if (actionSource !== 'undo' && actionSource !== 'redo') {
          setUndoStack(prev => [...prev.slice(-MAX_UNDO_HISTORY + 1), currentDeepCloneForHistory]);
        }
        
        if (actionSource !== 'redo') {
            setRedoStack([]);
        }
      }
      
      internalSpreadsheetRef.current = newSpreadsheet;
      return newSpreadsheet; 
    });
  }, []); 
=======

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
>>>>>>> 3cd4ffaa439f3afbedf88f6042b7b8f5a2da87f2

  const exposedSetSpreadsheet = useCallback((value: SetStateAction<SpreadsheetData | null>) => {
     setSpreadsheetWithHistory(value, 'user_action');
  }, [setSpreadsheetWithHistory]);


  const evaluateFormulaContext = useCallback((sheetId: string, formulaExpressionWithEquals: string): string | number => {
<<<<<<< HEAD
    if (!internalSpreadsheetRef.current) { 
=======
    if (!internalSpreadsheetRef.current) {
>>>>>>> 3cd4ffaa439f3afbedf88f6042b7b8f5a2da87f2
      return "#REF!";
    }
    const spreadsheetClone = JSON.parse(JSON.stringify(internalSpreadsheetRef.current)) as SpreadsheetData;
    return actualEvaluateFormulaLogic(spreadsheetClone, sheetId, formulaExpressionWithEquals, new Set());
<<<<<<< HEAD
  }, []); 


  const loadSpreadsheet = useCallback(async (spreadsheetId: string) => {
    setIsLoading(true);
    setActiveCellState(null); 
=======
  }, []);


  const loadSpreadsheet = useCallback(async (id: string) => {
    setIsLoading(true);
    setActiveCellState(null);
>>>>>>> 3cd4ffaa439f3afbedf88f6042b7b8f5a2da87f2
    setSelectionRangeState(null);
    setUndoStack([]);
    setRedoStack([]);
    setLastFoundCell(null);

<<<<<<< HEAD
    if (activeSheetListenerUnsubscribeRef.current) {
        activeSheetListenerUnsubscribeRef.current();
        activeSheetListenerUnsubscribeRef.current = null;
    }

    try {
        const spreadSheetDocRef = doc(db, "spreadsheets", spreadsheetId);
        const spreadSheetSnap = await getDoc(spreadSheetDocRef);

        if (!spreadSheetSnap.exists()) {
          throw new Error("Spreadsheet not found in Firestore.");
        }
        const data = spreadSheetSnap.data();
        const loadedSpreadsheet: SpreadsheetData = {
          id: spreadSheetSnap.id,
          name: data.name,
          sheets: (data.sheetsMetadata || []).map((sm: any) => {
            const sheetCells: CellData[][] = Array.from({ length: sm.rowCount || DEFAULT_ROW_COUNT }, (_, r) =>
                Array.from({ length: sm.columnCount || DEFAULT_COLUMN_COUNT }, (_, c) => {
                    const cell = createEmptyCell(r, c);
                    if(!cell.history) cell.history = [];
                    return cell;
                })
            );
            return {
                ...createInitialSheetUtil(sm.id, sm.name), // Get defaults
                ...sm, // Overlay stored metadata
                cells: sheetCells, // Start with empty cells, listener will populate
            };
          }),
          activeSheetId: data.activeSheetId,
          createdAt: (data.createdAt as Timestamp)?.toDate().getTime() || Date.now(),
          updatedAt: (data.updatedAt as Timestamp)?.toDate().getTime() || Date.now(),
        };
        
        setSpreadsheetWithHistory(() => loadedSpreadsheet, 'internal_no_history'); // Set initial structure

        const activeSheetId = loadedSpreadsheet.activeSheetId;
        const activeSheetData = loadedSpreadsheet.sheets.find(s => s.id === activeSheetId);

        if (activeSheetData) {
            const cellsColRef = collection(db, "spreadsheets", spreadsheetId, "sheets", activeSheetId, "cells");
            
            // Initial fetch of all cells for the active sheet (optional, can rely on listener too)
            const initialCellsSnap = await getDocs(cellsColRef);
            setSpreadsheetWithHistory(prev => {
                if (!prev) return null;
                let copy = JSON.parse(JSON.stringify(prev)) as SpreadsheetData;
                const sheetToUpdate = copy.sheets.find(s => s.id === activeSheetId);
                if (sheetToUpdate) {
                    initialCellsSnap.forEach(cellDoc => {
                        const cellDataFS = cellDoc.data() as CellData & {rowIndex: number, colIndex: number};
                        if (sheetToUpdate.cells[cellDataFS.rowIndex]) {
                             sheetToUpdate.cells[cellDataFS.rowIndex][cellDataFS.colIndex] = {
                                ...createEmptyCell(cellDataFS.rowIndex, cellDataFS.colIndex),
                                ...cellDataFS,
                                id: getCellId(cellDataFS.rowIndex, cellDataFS.colIndex), // Ensure client-side ID
                                history: cellDataFS.history || [],
                             };
                        }
                    });
                     copy = reevaluateSheetFormulas(copy, activeSheetId);
                }
                return copy;
            }, 'firestore_update');


            activeSheetListenerUnsubscribeRef.current = onSnapshot(cellsColRef, (snapshot) => {
                let changedCellsData: { address: CellAddress, data: Partial<CellData> }[] = [];
                let reevalRequired = false;
                snapshot.docChanges().forEach((change) => {
                    // TODO: Add check to ignore local echos if `updatedBy` matches current user
                    // For now, all changes from Firestore trigger update.
                    if (change.type === "added" || change.type === "modified") {
                        const cellDataFromFS = change.doc.data() as CellData & {rowIndex: number, colIndex: number};
                        changedCellsData.push({
                            address: { sheetId: activeSheetId, rowIndex: cellDataFromFS.rowIndex, colIndex: cellDataFromFS.colIndex },
                            data: {
                                rawValue: cellDataFromFS.rawValue,
                                style: cellDataFromFS.style,
                                formula: cellDataFromFS.formula,
                                history: cellDataFromFS.history || [],
                            }
                        });
                        reevalRequired = true;
                    }
                });
                if (changedCellsData.length > 0) {
                    setSpreadsheetWithHistory(prev => {
                        if (!prev) return null;
                        let copy = JSON.parse(JSON.stringify(prev)) as SpreadsheetData;
                        const sheetToUpdate = copy.sheets.find(s => s.id === activeSheetId);
                        if (sheetToUpdate) {
                            changedCellsData.forEach(cc => {
                                if (sheetToUpdate.cells[cc.address.rowIndex]) {
                                     sheetToUpdate.cells[cc.address.rowIndex][cc.address.colIndex] = {
                                        ...sheetToUpdate.cells[cc.address.rowIndex][cc.address.colIndex], // Keep existing props like id, spans
                                        ...cc.data // Apply updates from FS
                                     };
                                }
                            });
                           if(reevalRequired) copy = reevaluateSheetFormulas(copy, activeSheetId);
                        }
                        return copy;
                    }, 'firestore_update');
                }
            });
        }

    } catch (error) {
      setSpreadsheetWithHistory(() => null, 'internal_no_history');
      setTimeout(() => {
        toast({ title: "Error", description: `Failed to load spreadsheet: ${error instanceof Error ? error.message : String(error)}.`, variant: "destructive" });
      }, 0);
       router.push('/'); 
    }
    setIsLoading(false);
  }, [toast, setSpreadsheetWithHistory, router]);


  const saveSpreadsheet = useCallback(async () => {
    if (!internalSpreadsheetRef.current) { 
=======
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
>>>>>>> 3cd4ffaa439f3afbedf88f6042b7b8f5a2da87f2
      setTimeout(() => {
        toast({ title: "Error", description: "No spreadsheet data to save.", variant: "destructive" });
      },0);
      return;
    }
    setIsLoading(true);
<<<<<<< HEAD
    try {
      const spreadsheetDocRef = doc(db, "spreadsheets", internalSpreadsheetRef.current.id);
      const { sheets, ...metaToSave } = internalSpreadsheetRef.current;
      const sheetsMetadata = sheets.map(s => {
        const { cells, ...metadata } = s; // Exclude full cells array from top-level doc
        return metadata;
      });

      await updateDoc(spreadsheetDocRef, {
        name: metaToSave.name,
        activeSheetId: metaToSave.activeSheetId,
        sheetsMetadata: sheetsMetadata,
        updatedAt: serverTimestamp(),
      });
      toast({ title: "Success", description: "Spreadsheet metadata saved to cloud." });
    } catch (error) {
      console.error("Error saving spreadsheet metadata:", error);
      toast({ title: "Error", description: `Failed to save spreadsheet metadata: ${error instanceof Error ? error.message : String(error)}.`, variant: "destructive" });
    }
    setIsLoading(false);
  }, [toast]);

  const addHistoryEntry = useCallback((cell: CellData, oldRawValue: string | number | undefined, oldComment?: string) => {
    if (!cell.history) {
        cell.history = [];
    }
    // Avoid duplicate entries if rawValue hasn't changed
    if (cell.history.length > 0 && cell.history[0].rawValue === oldRawValue && cell.history[0].comment === oldComment) {
        return;
    }
    cell.history.unshift({ rawValue: oldRawValue, timestamp: Date.now(), comment: oldComment || '' }); 
    if (cell.history.length > MAX_CELL_HISTORY && MAX_CELL_HISTORY > 0) { // MAX_CELL_HISTORY can be 0
        cell.history.pop();
    }
  }, []);

  const updateCell = useCallback(async (sheetId: string, rowIndex: number, colIndex: number, newCellData: Partial<Pick<CellData, 'rawValue' | 'style'>>, typedChar?: string) => {
    
    let localUpdateError = false;
    let cellToSaveToFirestore: CellData | null = null;

=======
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
>>>>>>> 3cd4ffaa439f3afbedf88f6042b7b8f5a2da87f2
    setSpreadsheetWithHistory(prevSpreadsheet => {
      if (!prevSpreadsheet) return null;
      let spreadsheetCopy = JSON.parse(JSON.stringify(prevSpreadsheet)) as SpreadsheetData;
      const sheetToUpdate = spreadsheetCopy.sheets.find(sheet => sheet.id === sheetId);

      if (!sheetToUpdate || rowIndex < 0 || rowIndex >= sheetToUpdate.rowCount || colIndex < 0 || colIndex >= sheetToUpdate.columnCount) {
<<<<<<< HEAD
         localUpdateError = true;
         return prevSpreadsheet; 
      }
      if (!sheetToUpdate.cells[rowIndex]) sheetToUpdate.cells[rowIndex] = Array.from({ length: sheetToUpdate.columnCount }, (_, c) => createEmptyCell(rowIndex, c));
=======
         console.error("updateCell called with invalid address or sheet not found:", sheetId, rowIndex, colIndex);
         return prevSpreadsheet;
      }
      if (!sheetToUpdate.cells[rowIndex]) sheetToUpdate.cells[rowIndex] = [];
>>>>>>> 3cd4ffaa439f3afbedf88f6042b7b8f5a2da87f2
      if (!sheetToUpdate.cells[rowIndex][colIndex]) sheetToUpdate.cells[rowIndex][colIndex] = createEmptyCell(rowIndex, colIndex);
      
      let targetRow = rowIndex;
      let targetCol = colIndex;
<<<<<<< HEAD
      const currentCellInSheet = sheetToUpdate.cells[rowIndex][colIndex];
      if(currentCellInSheet.isMerged && currentCellInSheet.mergeMaster) {
        targetRow = currentCellInSheet.mergeMaster.rowIndex;
        targetCol = currentCellInSheet.mergeMaster.colIndex;
      }
      const cellToUpdate = sheetToUpdate.cells[targetRow][targetCol];
      if (!cellToUpdate.history) cellToUpdate.history = []; // Ensure history array exists
      const oldRawValue = cellToUpdate.rawValue; 
      const oldComment = cellToUpdate.history?.[0]?.comment;

      let rawValueToSet: string | number | undefined = newCellData.rawValue;
      if (typedChar !== undefined) {
         rawValueToSet = typedChar + String(newCellData.rawValue ?? '');
      }

      if (rawValueToSet !== undefined) {
          const currentDataType = cellToUpdate.style?.dataType || 'general';
          let validationPassed = true;
          if (cellToUpdate.style) cellToUpdate.style.validationError = false; 

          if (currentDataType === 'number' && typeof rawValueToSet === 'string' && !rawValueToSet.startsWith('=')) {
              if (isNaN(parseFloat(rawValueToSet))) {
                  setTimeout(() => toast({ title: "Invalid Input", description: `Cell is formatted as Number. "${rawValueToSet}" is not a valid number.`, variant: "destructive" }), 0);
                  validationPassed = false;
                  if(cellToUpdate.style) cellToUpdate.style.validationError = true; else cellToUpdate.style = { validationError: true, numberFormat: 'general', dataType: 'general' };
              } else {
                  rawValueToSet = parseFloat(rawValueToSet); 
              }
          }
          
          if (validationPassed) {
            if (MAX_CELL_HISTORY > 0 && rawValueToSet !== oldRawValue) { // Only add history if value changed
                addHistoryEntry(cellToUpdate, oldRawValue, oldComment);
            }
            cellToUpdate.rawValue = rawValueToSet;
            if (typeof rawValueToSet === 'string' && rawValueToSet.startsWith('=')) {
                cellToUpdate.formula = rawValueToSet;
            } else {
                cellToUpdate.formula = undefined;
            }
          } else {
             localUpdateError = true;
          }
      }

      if (newCellData.style) {
        if(newCellData.style.dataType && cellToUpdate.style?.dataType !== newCellData.style.dataType){
            if(cellToUpdate.style) cellToUpdate.style.validationError = false;
        }
        cellToUpdate.style = {...(cellToUpdate.style || { numberFormat: 'general', dataType: 'general'}), ...newCellData.style};
      }
      
      spreadsheetCopy.updatedAt = Date.now(); 
      cellToSaveToFirestore = cellToUpdate; // Capture the state of the cell for Firestore
      return spreadsheetCopy; 
    }, 'user_action'); 

    if (localUpdateError || !cellToSaveToFirestore) return;

    if (internalSpreadsheetRef.current && cellToSaveToFirestore) {
      const spreadsheetId = internalSpreadsheetRef.current.id;
      const cellDocId = `r${targetRow}_c${targetCol}`; // Using master cell's coordinates for merged cells
      const cellRef = doc(db, "spreadsheets", spreadsheetId, "sheets", sheetId, "cells", cellDocId);
      
      const dataForFirestore: any = {
          rowIndex: targetRow, // Ensure these are stored
          colIndex: targetCol,
          rawValue: cellToSaveToFirestore.rawValue,
          style: cellToSaveToFirestore.style || { numberFormat: 'general', dataType: 'general' },
          formula: cellToSaveToFirestore.formula,
          history: cellToSaveToFirestore.history || [],
          updatedAt: serverTimestamp(),
          updatedBy: PLACEHOLDER_USER_ID 
      };
       if(cellToSaveToFirestore.colSpan && cellToSaveToFirestore.colSpan > 1) dataForFirestore.colSpan = cellToSaveToFirestore.colSpan;
       if(cellToSaveToFirestore.rowSpan && cellToSaveToFirestore.rowSpan > 1) dataForFirestore.rowSpan = cellToSaveToFirestore.rowSpan;

      try {
          await setDoc(cellRef, dataForFirestore, { merge: true });
      } catch (error) {
          console.error("Error updating cell in Firestore:", error);
          setTimeout(() => toast({ title: "Sync Error", description: "Could not save cell change to cloud.", variant: "destructive" }), 0);
      }
    }
  }, [setSpreadsheetWithHistory, toast, addHistoryEntry]);
=======
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
>>>>>>> 3cd4ffaa439f3afbedf88f6042b7b8f5a2da87f2


  const setActiveCellAndSelection = useCallback((
    newCellAddress: CellAddress | null,
    isShiftKey: boolean,
    isDrag: boolean
  ) => {
<<<<<<< HEAD
    if (isActivelyEditingFormula) { 
        return; 
    }
    
    let finalActiveCellForState = newCellAddress;
    let finalSelectionRangeForState = newCellAddress ? { start: newCellAddress, end: newCellAddress } : null;

    if (newCellAddress && internalSpreadsheetRef.current) { 
        const sheet = getSheetFromData(internalSpreadsheetRef.current, newCellAddress.sheetId);
        if (sheet) {
            const cellData = sheet.cells[newCellAddress.rowIndex]?.[newCellAddress.colIndex];
            
            if (cellData?.isMerged && cellData.mergeMaster) {
                finalActiveCellForState = cellData.mergeMaster;
                const masterCellData = sheet.cells[cellData.mergeMaster.rowIndex]?.[cellData.mergeMaster.colIndex];
                if(masterCellData){
                    finalSelectionRangeForState = {
                        start: cellData.mergeMaster,
                        end: { 
                            sheetId: cellData.mergeMaster.sheetId,
                            rowIndex: cellData.mergeMaster.rowIndex + (masterCellData.rowSpan || 1) - 1,
                            colIndex: cellData.mergeMaster.colIndex + (masterCellData.colSpan || 1) - 1,
                        }
                    };
                }
            } else if (isShiftKey && activeCell && activeCell.sheetId === newCellAddress.sheetId) {
                const startRow = Math.min(activeCell.rowIndex, newCellAddress.rowIndex);
                const startCol = Math.min(activeCell.colIndex, newCellAddress.colIndex);
                const endRow = Math.max(activeCell.rowIndex, newCellAddress.rowIndex);
                const endCol = Math.max(activeCell.colIndex, newCellAddress.colIndex);
                finalSelectionRangeForState = {
                    start: { sheetId: activeCell.sheetId, rowIndex: startRow, colIndex: startCol },
                    end: { sheetId: activeCell.sheetId, rowIndex: endRow, colIndex: endCol }
                };
                finalActiveCellForState = newCellAddress; 
            } else if (isDrag && selectionRange && selectionRange.start.sheetId === newCellAddress.sheetId) {
                const startRow = Math.min(selectionRange.start.rowIndex, newCellAddress.rowIndex);
                const startCol = Math.min(selectionRange.start.colIndex, newCellAddress.colIndex);
                const endRow = Math.max(selectionRange.start.rowIndex, newCellAddress.rowIndex);
                const endCol = Math.max(selectionRange.start.colIndex, newCellAddress.colIndex);
                finalSelectionRangeForState = {
                    start: selectionRange.start, 
                    end: { sheetId: newCellAddress.sheetId, rowIndex: endRow, colIndex: endCol }
                };
                finalActiveCellForState = activeCell; 
            }
        }
    }
    setActiveCellState(finalActiveCellForState);
    setSelectionRangeState(finalSelectionRangeForState);

  }, [isActivelyEditingFormula, activeCell, selectionRange]); 


  const updateSelectedCellStyle = useCallback(async (styleChanges: Partial<CellStyle>) => {
    if (!selectionRange || !internalSpreadsheetRef.current) return; 
    
    const spreadsheetId = internalSpreadsheetRef.current.id;
    const batch = writeBatch(db);
    let cellsAffectedCount = 0;
=======
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
>>>>>>> 3cd4ffaa439f3afbedf88f6042b7b8f5a2da87f2

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
<<<<<<< HEAD
           if (!sheetToUpdate.cells[rIdx]) sheetToUpdate.cells[rIdx] = Array.from({ length: sheetToUpdate.columnCount }, (_, c) => createEmptyCell(rIdx, c));
           if (!sheetToUpdate.cells[rIdx][cIdx]) sheetToUpdate.cells[rIdx][cIdx] = createEmptyCell(rIdx, cIdx);
           
           let targetCell = sheetToUpdate.cells[rIdx][cIdx];
           let masterR = rIdx, masterC = cIdx;
           if(targetCell.isMerged && targetCell.mergeMaster) {
              if (sheetToUpdate.cells[targetCell.mergeMaster.rowIndex]?.[targetCell.mergeMaster.colIndex]) {
                targetCell = sheetToUpdate.cells[targetCell.mergeMaster.rowIndex][targetCell.mergeMaster.colIndex];
                masterR = targetCell.mergeMaster.rowIndex;
                masterC = targetCell.mergeMaster.colIndex;
              } else {
                continue; 
              }
           }
           if(styleChanges.dataType && targetCell.style?.dataType !== styleChanges.dataType){
               if(targetCell.style) targetCell.style.validationError = false;
           }
           const newStyle = { ...(targetCell.style || { numberFormat: 'general', dataType: 'general'}), ...styleChanges };
           targetCell.style = newStyle;
           
           const cellDocId = `r${masterR}_c${masterC}`;
           const cellRef = doc(db, "spreadsheets", spreadsheetId, "sheets", sheetIdToUpdate, "cells", cellDocId);
           batch.set(cellRef, { style: newStyle, updatedAt: serverTimestamp(), updatedBy: PLACEHOLDER_USER_ID }, { merge: true });
           cellsAffectedCount++;
=======
           if (!sheetToUpdate.cells[rIdx]) sheetToUpdate.cells[rIdx] = [];
           if (!sheetToUpdate.cells[rIdx][cIdx]) sheetToUpdate.cells[rIdx][cIdx] = createEmptyCell(rIdx, cIdx);
           
           let targetCell = sheetToUpdate.cells[rIdx][cIdx];
           // If applying to a merged cell, apply to its master
           if(targetCell.isMerged && targetCell.mergeMaster) {
              targetCell = sheetToUpdate.cells[targetCell.mergeMaster.rowIndex][targetCell.mergeMaster.colIndex];
           }
           targetCell.style = { ...(targetCell.style || {}), ...styleChanges };
>>>>>>> 3cd4ffaa439f3afbedf88f6042b7b8f5a2da87f2
        }
      }
      spreadsheetCopy.updatedAt = Date.now();
      return spreadsheetCopy;
<<<<<<< HEAD
    }, 'user_action'); 
    
    try {
        if(cellsAffectedCount > 0) await batch.commit();
        if(cellsAffectedCount > 0) setTimeout(() => toast({title: "Styles Applied", description: `Styles applied to ${cellsAffectedCount} cell(s) and synced.`}), 0);
    } catch (error) {
        console.error("Error batch updating cell styles in Firestore:", error);
        setTimeout(() => toast({title: "Sync Error", description: "Could not save style changes to cloud.", variant: "destructive"}), 0);
    }

  }, [selectionRange, setSpreadsheetWithHistory, toast]);

  const updateSelectedCellNumberFormat = useCallback((format: NumberFormatStyle) => {
    updateSelectedCellStyle({ numberFormat: format });
  }, [updateSelectedCellStyle]);

  const updateSelectedCellDataType = useCallback((dataType: CellDataType) => {
    updateSelectedCellStyle({ dataType: dataType });
    if (selectionRange && internalSpreadsheetRef.current) {
        setSpreadsheetWithHistory(prev => {
            if (!prev) return null;
            let spreadsheetCopy = JSON.parse(JSON.stringify(prev)) as SpreadsheetData;
            const sheet = spreadsheetCopy.sheets.find(s => s.id === selectionRange.start.sheetId);
            if (sheet) {
                spreadsheetCopy = reevaluateSheetFormulas(spreadsheetCopy, sheet.id);
            }
            return spreadsheetCopy;
        }, 'user_action');
    }
  }, [updateSelectedCellStyle, selectionRange, setSpreadsheetWithHistory]);


  const formatSelectionAsTable = useCallback(() => {
    if (!selectionRange || !internalSpreadsheetRef.current) return; 
    updateSelectedCellStyle({ hasBorder: true }); 
    
    const spreadsheetId = internalSpreadsheetRef.current.id;
    const batch = writeBatch(db);
    let headerCellsCount = 0;

    setSpreadsheetWithHistory(prev => {
        if(!prev) return null;
        const copy = JSON.parse(JSON.stringify(prev)) as SpreadsheetData;
        const sheet = copy.sheets.find(s => s.id === selectionRange.start.sheetId);
        if (sheet) {
            const minRow = Math.min(selectionRange.start.rowIndex, selectionRange.end.rowIndex);
            const minCol = Math.min(selectionRange.start.colIndex, selectionRange.end.colIndex);
            const maxCol = Math.max(selectionRange.start.colIndex, selectionRange.end.colIndex);
            for (let c = minCol; c <= maxCol; c++) {
                let targetCell = sheet.cells[minRow]?.[c];
                if (targetCell) {
                    let masterR = minRow, masterC = c;
                    if (targetCell.isMerged && targetCell.mergeMaster) {
                        targetCell = sheet.cells[targetCell.mergeMaster.rowIndex]?.[targetCell.mergeMaster.colIndex];
                        if (!targetCell) continue;
                        masterR = targetCell.mergeMaster.rowIndex;
                        masterC = targetCell.mergeMaster.colIndex;
                    }
                    targetCell.style = { ...(targetCell.style || { numberFormat: 'general', dataType: 'general' }), bold: true, hasBorder: true };
                    const cellDocId = `r${masterR}_c${masterC}`;
                    const cellRef = doc(db, "spreadsheets", spreadsheetId, "sheets", selectionRange.start.sheetId, "cells", cellDocId);
                    batch.set(cellRef, { style: targetCell.style, updatedAt: serverTimestamp(), updatedBy: PLACEHOLDER_USER_ID }, { merge: true });
                    headerCellsCount++;
                }
            }
        }
        return copy;
    }, 'user_action');
    
    if (headerCellsCount > 0) {
        batch.commit().then(() => {
            setTimeout(() => toast({ title: "Table Formatted", description: "Selected range formatted with header and borders, synced." }), 0);
        }).catch(err => {
            console.error("Error formatting table header in Firestore:", err);
            setTimeout(() => toast({ title: "Sync Error", description: "Could not save table formatting to cloud.", variant: "destructive" }), 0);
        });
    } else {
       setTimeout(() => toast({ title: "Table Formatted", description: "Selected range formatted with header and borders." }), 0);
    }

  }, [selectionRange, setSpreadsheetWithHistory, toast, updateSelectedCellStyle]);

  const modifySheetStructure = useCallback(async (
=======
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
>>>>>>> 3cd4ffaa439f3afbedf88f6042b7b8f5a2da87f2
    sheetId: string,
    operation: 'insertRow' | 'deleteRow' | 'insertColumn' | 'deleteColumn' | 'appendRow' | 'appendColumn',
    index?: number
  ) => {
<<<<<<< HEAD
    let toastInfo: { title: string, description: string, variant?: "destructive" } | null = null;
    let success = false;

=======
>>>>>>> 3cd4ffaa439f3afbedf88f6042b7b8f5a2da87f2
    setSpreadsheetWithHistory(prevSpreadsheet => {
      if (!prevSpreadsheet) return null;
      let spreadsheetCopy = JSON.parse(JSON.stringify(prevSpreadsheet)) as SpreadsheetData;
      const sheet = spreadsheetCopy.sheets.find(s => s.id === sheetId);
      if (!sheet) return prevSpreadsheet;

      let updateRowCount = sheet.rowCount;
      let updateColCount = sheet.columnCount;
<<<<<<< HEAD
=======
      let toastInfo: { title: string, description: string, variant?: "destructive" } | null = null;
>>>>>>> 3cd4ffaa439f3afbedf88f6042b7b8f5a2da87f2

      switch (operation) {
        case 'insertRow':
          if (index === undefined || index < 0 || index > updateRowCount) return prevSpreadsheet;
          const newRowData: CellData[] = Array.from({ length: updateColCount }, (_, cIdx) => createEmptyCell(index, cIdx));
          sheet.cells.splice(index, 0, newRowData);
          if(sheet.rowHeights) sheet.rowHeights.splice(index, 0, DEFAULT_ROW_HEIGHT); else sheet.rowHeights = Array(updateRowCount + 1).fill(DEFAULT_ROW_HEIGHT);
          updateRowCount++;
<<<<<<< HEAD
          // Adjust mergedCells and conditionalFormatRules for rows after index
          // (Simplified for now, more complex logic needed for perfect adjustment)
          toastInfo = { title: "Row Inserted", description: `Row inserted at index ${index + 1}.` };
          success = true;
=======
          // Adjust merged cell ranges
          if (sheet.mergedCells) {
            sheet.mergedCells = sheet.mergedCells.map(mc => {
              if (mc.start.rowIndex >= index) mc.start.rowIndex++;
              if (mc.end.rowIndex >= index) mc.end.rowIndex++;
              return mc;
            });
          }
          toastInfo = { title: "Row Inserted", description: `Row inserted at index ${index + 1}.` };
>>>>>>> 3cd4ffaa439f3afbedf88f6042b7b8f5a2da87f2
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
<<<<<<< HEAD
          toastInfo = { title: "Row Deleted", description: `Row at index ${index + 1} deleted.` };
          success = true;
=======
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
>>>>>>> 3cd4ffaa439f3afbedf88f6042b7b8f5a2da87f2
          break;
        case 'appendRow':
          const appendRowIndex = updateRowCount;
          const appendedRowData: CellData[] = Array.from({ length: updateColCount }, (_, cIdx) => createEmptyCell(appendRowIndex, cIdx));
          sheet.cells.push(appendedRowData);
          if(sheet.rowHeights) sheet.rowHeights.push(DEFAULT_ROW_HEIGHT); else sheet.rowHeights = Array(updateRowCount + 1).fill(DEFAULT_ROW_HEIGHT);
          updateRowCount++;
          toastInfo = { title: "Row Added", description: `Row added at the end.` };
<<<<<<< HEAD
          success = true;
          break;
        case 'insertColumn':
          if (index === undefined || index < 0 || index > updateColCount) return prevSpreadsheet;
          sheet.cells.forEach((row, rIdx) => { 
            row.splice(index!, 0, createEmptyCell(rIdx, index!));
          });
          if(sheet.columnWidths) sheet.columnWidths.splice(index, 0, DEFAULT_COLUMN_WIDTH); else sheet.columnWidths = Array(updateColCount + 1).fill(DEFAULT_COLUMN_WIDTH);
          updateColCount++;
          toastInfo = { title: "Column Inserted", description: `Column inserted at index ${getCellId(0,index!).replace(/[0-9]/g, '')}.` };
          success = true;
=======
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
>>>>>>> 3cd4ffaa439f3afbedf88f6042b7b8f5a2da87f2
          break;
        case 'deleteColumn':
          if (index === undefined || updateColCount <= 1 || index < 0 || index >= updateColCount) {
            if(updateColCount <= 1) toastInfo = { title: "Cannot Delete", description: "Spreadsheet must have at least one column.", variant: "destructive"};
             if(toastInfo) setTimeout(() => { toast(toastInfo!); }, 0);
            return prevSpreadsheet;
          }
<<<<<<< HEAD
          sheet.cells.forEach(row => row.splice(index!, 1)); 
          if (sheet.columnWidths && sheet.columnWidths.length > index!) sheet.columnWidths.splice(index!, 1);
          updateColCount--;
          toastInfo = { title: "Column Deleted", description: `Column ${getCellId(0,index!).replace(/[0-9]/g, '')} deleted.` };
          success = true;
=======
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
>>>>>>> 3cd4ffaa439f3afbedf88f6042b7b8f5a2da87f2
          break;
        case 'appendColumn':
          const appendColIndex = updateColCount;
          sheet.cells.forEach((row, rIdx) => row.push(createEmptyCell(rIdx, appendColIndex)));
          if(sheet.columnWidths) sheet.columnWidths.push(DEFAULT_COLUMN_WIDTH); else sheet.columnWidths = Array(updateColCount + 1).fill(DEFAULT_COLUMN_WIDTH);
          updateColCount++;
          toastInfo = { title: "Column Added", description: `Column added at the end.` };
<<<<<<< HEAD
          success = true;
          break;
      }

      sheet.rowCount = updateRowCount;
      sheet.columnCount = updateColCount;

      // Update all cell IDs after structural change
      for (let r = 0; r < sheet.rowCount; r++) {
        if(!sheet.cells[r]) sheet.cells[r] = Array.from({ length: sheet.columnCount }, (_, c) => createEmptyCell(r, c));
        sheet.cells[r] = sheet.cells[r].slice(0, sheet.columnCount);
        while(sheet.cells[r].length < sheet.columnCount) {
            sheet.cells[r].push(createEmptyCell(r, sheet.cells[r].length));
        }
        for (let c = 0; c < sheet.columnCount; c++) {
          if (sheet.cells[r]?.[c]) {
            sheet.cells[r][c].id = getCellId(r, c); 
          } else {
            if(!sheet.cells[r]) sheet.cells[r] = []; 
=======
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
>>>>>>> 3cd4ffaa439f3afbedf88f6042b7b8f5a2da87f2
            sheet.cells[r][c] = createEmptyCell(r,c);
          }
        }
      }
<<<<<<< HEAD
      // Simplified merge/conditional format rule adjustment (more robust logic needed)
      (sheet.mergedCells || []).forEach(mc => { /* Adjust or remove if out of bounds */ });
      (sheet.conditionalFormatRules || []).forEach(rule => { /* Adjust or remove */ });

      spreadsheetCopy.updatedAt = Date.now();
      return spreadsheetCopy;
    }, 'structural_change'); 

    if (success && internalSpreadsheetRef.current) {
        const currentSheetState = internalSpreadsheetRef.current.sheets.find(s => s.id === sheetId);
        if (currentSheetState) {
            const { cells, ...metadataToSave } = currentSheetState;
            const mainSpreadsheetDocRef = doc(db, "spreadsheets", internalSpreadsheetRef.current.id);
            const updatedSheetsMetadata = internalSpreadsheetRef.current.sheets.map(s => {
                 const { cells: sCells, ...sMetadata } = s; return sMetadata;
            });
            try {
                await updateDoc(mainSpreadsheetDocRef, { 
                    sheetsMetadata: updatedSheetsMetadata, 
                    updatedAt: serverTimestamp() 
                });
                if (toastInfo) setTimeout(() => toast(toastInfo!), 0);
            } catch (error) {
                 console.error("Error updating sheet metadata in Firestore:", error);
                 setTimeout(() => toast({title: "Sync Error", description: `Could not save structural change to cloud. ${error instanceof Error ? error.message : ''}`, variant: "destructive"}), 0);
            }
            // Note: Deleting rows/columns in Firestore for individual cells is complex and omitted here for simplicity.
            // This would typically involve batch deleting many cell documents.
            if (operation === 'deleteRow' || operation === 'deleteColumn') {
                console.warn(` Firestore cell documents for the deleted ${operation === 'deleteRow' ? 'row' : 'column'} at index ${index} are not automatically removed. Manual cleanup or a Cloud Function may be needed.`);
            }
        }
    } else if (toastInfo && !success) { // For errors like "cannot delete last row/col"
        setTimeout(() => { toast(toastInfo!); }, 0);
    }

=======
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
>>>>>>> 3cd4ffaa439f3afbedf88f6042b7b8f5a2da87f2
  }, [setSpreadsheetWithHistory, toast]);

  const insertRow = useCallback((sheetId: string, rowIndex: number) => modifySheetStructure(sheetId, 'insertRow', rowIndex), [modifySheetStructure]);
  const deleteRow = useCallback((sheetId: string, rowIndex: number) => modifySheetStructure(sheetId, 'deleteRow', rowIndex), [modifySheetStructure]);
  const insertColumn = useCallback((sheetId: string, colIndex: number) => modifySheetStructure(sheetId, 'insertColumn', colIndex), [modifySheetStructure]);
  const deleteColumn = useCallback((sheetId: string, colIndex: number) => modifySheetStructure(sheetId, 'deleteColumn', colIndex), [modifySheetStructure]);
  const appendRow = useCallback((sheetId: string) => modifySheetStructure(sheetId, 'appendRow'), [modifySheetStructure]);
  const appendColumn = useCallback((sheetId: string) => modifySheetStructure(sheetId, 'appendColumn'), [modifySheetStructure]);

  const undo = useCallback(() => {
<<<<<<< HEAD
     if (MAX_UNDO_HISTORY > 0 && undoStack.length > 0) {
        // Implement actual undo logic if needed, for now it's disabled for cloud sync
     }
     setTimeout(() => { toast({ title: "Undo/Redo", description: "Local undo/redo is disabled for cloud-synced spreadsheets." }); }, 0);
  }, [undoStack, setSpreadsheetWithHistory, toast]);

  const redo = useCallback(() => {
     if (MAX_UNDO_HISTORY > 0 && redoStack.length > 0) {
        // Implement actual redo logic if needed
     }
     setTimeout(() => { toast({ title: "Undo/Redo", description: "Local undo/redo is disabled for cloud-synced spreadsheets." }); }, 0);
=======
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
>>>>>>> 3cd4ffaa439f3afbedf88f6042b7b8f5a2da87f2
  }, [redoStack, setSpreadsheetWithHistory, toast]);


  const copySelectionToClipboard = useCallback(async () => {
<<<<<<< HEAD
    if (!selectionRange || !internalSpreadsheetRef.current) { 
=======
    if (!selectionRange || !internalSpreadsheetRef.current) {
>>>>>>> 3cd4ffaa439f3afbedf88f6042b7b8f5a2da87f2
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
<<<<<<< HEAD
            let masterCell = cell;
            if(cell.isMerged && cell.mergeMaster){
                if(cell.mergeMaster.rowIndex === r && cell.mergeMaster.colIndex === c){
                } else {
                    masterCell = sheet.cells[cell.mergeMaster.rowIndex]?.[cell.mergeMaster.colIndex] || null;
                }
            }
            
            if(masterCell) { 
                 valueToCopy = (masterCell.formula) 
                                ? masterCell.formula
                                : (masterCell.value === '' && (masterCell.rawValue === '' || masterCell.rawValue === null || masterCell.rawValue === undefined))
                                    ? '' 
                                    : masterCell.value?.toString() ?? ""; 
=======
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
>>>>>>> 3cd4ffaa439f3afbedf88f6042b7b8f5a2da87f2
            }
        }
        textToCopy += valueToCopy;
        if (c < maxCol) {
<<<<<<< HEAD
          textToCopy += "\t"; 
        }
      }
      if (r < maxRow) {
        textToCopy += "\n"; 
=======
          textToCopy += "\t";
        }
      }
      if (r < maxRow) {
        textToCopy += "\n";
>>>>>>> 3cd4ffaa439f3afbedf88f6042b7b8f5a2da87f2
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


<<<<<<< HEAD
  const deleteSelectionContents = useCallback(async () => {
    if (!selectionRange || !internalSpreadsheetRef.current) return; 
    
    const spreadsheetId = internalSpreadsheetRef.current.id;
    const batch = writeBatch(db);
    let cellsAffectedCount = 0;
=======
  const deleteSelectionContents = useCallback(() => {
    if (!selectionRange || !internalSpreadsheetRef.current) return;
>>>>>>> 3cd4ffaa439f3afbedf88f6042b7b8f5a2da87f2

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

<<<<<<< HEAD
      for (let r = minRow; r <= maxRow; r++) {
        for (let c = minCol; c <= maxCol; c++) {
          if (!sheetToUpdate.cells[r]) sheetToUpdate.cells[r] = Array.from({ length: sheetToUpdate.columnCount }, (_, c_idx) => createEmptyCell(r, c_idx));
          if (!sheetToUpdate.cells[r][c]) sheetToUpdate.cells[r][c] = createEmptyCell(r, c);
          
          let targetCell = sheetToUpdate.cells[r][c];
          let masterR = r, masterC = c;
          if (targetCell.isMerged && targetCell.mergeMaster) {
            if (targetCell.mergeMaster.rowIndex === r && targetCell.mergeMaster.colIndex === c) {
                 targetCell = sheetToUpdate.cells[targetCell.mergeMaster.rowIndex][targetCell.mergeMaster.colIndex];
                 masterR = targetCell.mergeMaster.rowIndex;
                 masterC = targetCell.mergeMaster.colIndex;
            } else {
                continue; 
            }
          }

          if (MAX_CELL_HISTORY > 0 && (targetCell.rawValue !== '' || targetCell.formula !== undefined)) {
              addHistoryEntry(targetCell, targetCell.rawValue, targetCell.history?.[0]?.comment);
          }
          targetCell.rawValue = '';
          targetCell.formula = undefined;
          
          const cellDocId = `r${masterR}_c${masterC}`;
          const cellRef = doc(db, "spreadsheets", spreadsheetId, "sheets", start.sheetId, "cells", cellDocId);
          batch.set(cellRef, { 
              rawValue: '', formula: null, // Explicitly null for Firestore to remove if needed
              updatedAt: serverTimestamp(), updatedBy: PLACEHOLDER_USER_ID 
           }, { merge: true });
           cellsAffectedCount++;
        }
      }

      spreadsheetCopy.updatedAt = Date.now();
      return spreadsheetCopy;
    }, 'user_action'); 
    
    try {
        if(cellsAffectedCount > 0) await batch.commit();
        if(cellsAffectedCount > 0) setTimeout(() => toast({ title: "Contents Cleared", description: "Selected cells cleared and synced." }), 0);
    } catch (error) {
        console.error("Error batch clearing cell contents in Firestore:", error);
        setTimeout(() => toast({title: "Sync Error", description: "Could not clear cell contents in cloud.", variant: "destructive"}), 0);
    }

  }, [selectionRange, setSpreadsheetWithHistory, toast, addHistoryEntry]);

  const updateMultipleCellsRawValue = useCallback(async (newValue: string | number) => {
    if (!selectionRange || !internalSpreadsheetRef.current) return; 
    
    const spreadsheetId = internalSpreadsheetRef.current.id;
    const batch = writeBatch(db);
    let cellsAffectedCount = 0;
=======
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
>>>>>>> 3cd4ffaa439f3afbedf88f6042b7b8f5a2da87f2

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
<<<<<<< HEAD
          if (!sheetToUpdate.cells[r]) sheetToUpdate.cells[r] = Array.from({ length: sheetToUpdate.columnCount }, (_, c_idx) => createEmptyCell(r, c_idx));
          if (!sheetToUpdate.cells[r][c]) sheetToUpdate.cells[r][c] = createEmptyCell(r,c);
          
          let targetCell = sheetToUpdate.cells[r][c];
          let masterR = r, masterC = c;
          if (targetCell.isMerged && targetCell.mergeMaster) {
             if (targetCell.mergeMaster.rowIndex === r && targetCell.mergeMaster.colIndex === c) {
                targetCell = sheetToUpdate.cells[targetCell.mergeMaster.rowIndex][targetCell.mergeMaster.colIndex];
                masterR = targetCell.mergeMaster.rowIndex;
                masterC = targetCell.mergeMaster.colIndex;
             } else {
                continue; 
             }
          }
          if(MAX_CELL_HISTORY > 0) addHistoryEntry(targetCell, targetCell.rawValue, targetCell.history?.[0]?.comment);
          targetCell.rawValue = newValue;
          
          const cellDocId = `r${masterR}_c${masterC}`;
          const cellRef = doc(db, "spreadsheets", spreadsheetId, "sheets", start.sheetId, "cells", cellDocId);
          batch.set(cellRef, { 
              rawValue: newValue, 
              formula: typeof newValue === 'string' && newValue.startsWith('=') ? newValue : null,
              updatedAt: serverTimestamp(), updatedBy: PLACEHOLDER_USER_ID 
           }, { merge: true });
           cellsAffectedCount++;
        }
      }
      spreadsheetCopy.updatedAt = Date.now();
      return spreadsheetCopy;
    }, 'user_action'); 
    
    try {
        if(cellsAffectedCount > 0) await batch.commit();
        if(cellsAffectedCount > 0) setTimeout(() => toast({ title: "Cells Updated", description: "Selected cells updated and synced." }), 0);
    } catch (error) {
        console.error("Error batch updating cell values in Firestore:", error);
        setTimeout(() => toast({title: "Sync Error", description: "Could not update cell values in cloud.", variant: "destructive"}), 0);
    }

  }, [selectionRange, setSpreadsheetWithHistory, toast, addHistoryEntry]);


  const updateColumnWidth = useCallback(async (sheetId: string, colIndex: number, newWidth: number) => {
=======
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
>>>>>>> 3cd4ffaa439f3afbedf88f6042b7b8f5a2da87f2
    setSpreadsheetWithHistory(prev => {
      if (!prev) return null;
      const newSheetData = JSON.parse(JSON.stringify(prev)) as SpreadsheetData;
      const sheet = newSheetData.sheets.find(s => s.id === sheetId);
<<<<<<< HEAD
      if (sheet) {
        if (!sheet.columnWidths) sheet.columnWidths = Array(sheet.columnCount).fill(DEFAULT_COLUMN_WIDTH);
        if (colIndex < sheet.columnWidths.length) {
            sheet.columnWidths[colIndex] = Math.max(20, newWidth); 
        }
        newSheetData.updatedAt = Date.now(); // Local timestamp update
      }
      return newSheetData;
    }, 'metadata_update'); 
    
    if(internalSpreadsheetRef.current){
        const currentSheetMeta = internalSpreadsheetRef.current.sheets.find(s => s.id === sheetId);
        if(currentSheetMeta?.columnWidths) {
            try {
                const mainSpreadsheetDocRef = doc(db, "spreadsheets", internalSpreadsheetRef.current.id);
                const updatedSheetsMetadata = internalSpreadsheetRef.current.sheets.map(s => {
                    const { cells, ...metadata } = s; return metadata;
                });
                await updateDoc(mainSpreadsheetDocRef, { sheetsMetadata: updatedSheetsMetadata, updatedAt: serverTimestamp() });
            } catch (error) {
                 console.error("Error updating column widths in Firestore:", error);
                 setTimeout(() => toast({title: "Sync Error", description: `Could not save column width change. ${error instanceof Error ? error.message : ''}`, variant: "destructive"}), 0);
            }
        }
    }
  }, [setSpreadsheetWithHistory, toast]);

  const updateRowHeight = useCallback(async (sheetId: string, rowIndex: number, newHeight: number) => {
    setSpreadsheetWithHistory(prev => {
      if (!prev) return null;
      const newSheetData = JSON.parse(JSON.stringify(prev)) as SpreadsheetData;
      const sheet = newSheetData.sheets.find(s => s.id === sheetId);
      if (sheet) {
         if (!sheet.rowHeights) sheet.rowHeights = Array(sheet.rowCount).fill(DEFAULT_ROW_HEIGHT);
         if (rowIndex < sheet.rowHeights.length) {
            sheet.rowHeights[rowIndex] = Math.max(20, newHeight); 
        }
        newSheetData.updatedAt = Date.now();
      }
      return newSheetData;
    }, 'metadata_update'); 

    if(internalSpreadsheetRef.current){
        const currentSheetMeta = internalSpreadsheetRef.current.sheets.find(s => s.id === sheetId);
        if(currentSheetMeta?.rowHeights) {
            try {
                const mainSpreadsheetDocRef = doc(db, "spreadsheets", internalSpreadsheetRef.current.id);
                 const updatedSheetsMetadata = internalSpreadsheetRef.current.sheets.map(s => {
                    const { cells, ...metadata } = s; return metadata;
                });
                await updateDoc(mainSpreadsheetDocRef, { sheetsMetadata: updatedSheetsMetadata, updatedAt: serverTimestamp() });
            } catch (error) {
                 console.error("Error updating row heights in Firestore:", error);
                 setTimeout(() => toast({title: "Sync Error", description: `Could not save row height change. ${error instanceof Error ? error.message : ''}`, variant: "destructive"}), 0);
            }
        }
    }
  }, [setSpreadsheetWithHistory, toast]);

  const addConditionalFormatRule = useCallback(async (sheetId: string, rule: ConditionalFormatRule) => {
=======
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
>>>>>>> 3cd4ffaa439f3afbedf88f6042b7b8f5a2da87f2
    setSpreadsheetWithHistory(prev => {
      if (!prev) return null;
      const newSheetData = JSON.parse(JSON.stringify(prev)) as SpreadsheetData;
      const sheet = newSheetData.sheets.find(s => s.id === sheetId);
      if (sheet) {
        if (!sheet.conditionalFormatRules) sheet.conditionalFormatRules = [];
        sheet.conditionalFormatRules.push(rule);
        newSheetData.updatedAt = Date.now();
<<<<<<< HEAD
      }
      return newSheetData; 
    }, 'metadata_update');
    
    if(internalSpreadsheetRef.current){
        const currentSheetMeta = internalSpreadsheetRef.current.sheets.find(s => s.id === sheetId);
        if(currentSheetMeta?.conditionalFormatRules) {
             try {
                const mainSpreadsheetDocRef = doc(db, "spreadsheets", internalSpreadsheetRef.current.id);
                 const updatedSheetsMetadata = internalSpreadsheetRef.current.sheets.map(s => {
                    const { cells, ...metadata } = s; return metadata;
                });
                await updateDoc(mainSpreadsheetDocRef, { sheetsMetadata: updatedSheetsMetadata, updatedAt: serverTimestamp() });
                setTimeout(() => toast({ title: "Rule Added", description: "Conditional formatting rule applied and synced." }), 0);
            } catch (error) {
                 console.error("Error updating conditional format rules in Firestore:", error);
                 setTimeout(() => toast({title: "Sync Error", description: `Could not save conditional formatting rule. ${error instanceof Error ? error.message : ''}`, variant: "destructive"}), 0);
            }
        }
    }
  }, [setSpreadsheetWithHistory, toast]);

  const removeConditionalFormatRule = useCallback(async (sheetId: string, ruleId: string) => {
=======
         setTimeout(() => toast({ title: "Rule Added", description: "Conditional formatting rule applied." }), 0);
      }
      return newSheetData;
    }, 'user_action');
  }, [setSpreadsheetWithHistory, toast]);

  const removeConditionalFormatRule = useCallback((sheetId: string, ruleId: string) => {
>>>>>>> 3cd4ffaa439f3afbedf88f6042b7b8f5a2da87f2
     setSpreadsheetWithHistory(prev => {
        if (!prev) return null;
        const newSheetData = JSON.parse(JSON.stringify(prev)) as SpreadsheetData;
        const sheet = newSheetData.sheets.find(s => s.id === sheetId);
        if (sheet && sheet.conditionalFormatRules) {
            sheet.conditionalFormatRules = sheet.conditionalFormatRules.filter(r => r.id !== ruleId);
            newSheetData.updatedAt = Date.now();
<<<<<<< HEAD
        }
        return newSheetData;
     }, 'metadata_update'); 
     
    if(internalSpreadsheetRef.current){
        const currentSheetMeta = internalSpreadsheetRef.current.sheets.find(s => s.id === sheetId);
        if(currentSheetMeta) { // Check if sheet exists, rules array might be empty after filter
             try {
                const mainSpreadsheetDocRef = doc(db, "spreadsheets", internalSpreadsheetRef.current.id);
                 const updatedSheetsMetadata = internalSpreadsheetRef.current.sheets.map(s => {
                    const { cells, ...metadata } = s; return metadata;
                });
                await updateDoc(mainSpreadsheetDocRef, { sheetsMetadata: updatedSheetsMetadata, updatedAt: serverTimestamp() });
                setTimeout(() => toast({ title: "Rule Removed", description: "Conditional formatting rule removed and synced." }), 0);
            } catch (error) {
                 console.error("Error updating conditional format rules in Firestore:", error);
                 setTimeout(() => toast({title: "Sync Error", description: `Could not remove conditional formatting rule. ${error instanceof Error ? error.message : ''}`, variant: "destructive"}), 0);
            }
        }
    }
  }, [setSpreadsheetWithHistory, toast]);

  const updateConditionalFormatRule = useCallback(async (sheetId: string, updatedRule: ConditionalFormatRule) => {
=======
            setTimeout(() => toast({ title: "Rule Removed", description: "Conditional formatting rule removed." }), 0);
        }
        return newSheetData;
     }, 'user_action');
  }, [setSpreadsheetWithHistory, toast]);
  
  const updateConditionalFormatRule = useCallback((sheetId: string, updatedRule: ConditionalFormatRule) => {
>>>>>>> 3cd4ffaa439f3afbedf88f6042b7b8f5a2da87f2
     setSpreadsheetWithHistory(prev => {
        if (!prev) return null;
        const newSheetData = JSON.parse(JSON.stringify(prev)) as SpreadsheetData;
        const sheet = newSheetData.sheets.find(s => s.id === sheetId);
        if (sheet && sheet.conditionalFormatRules) {
            const ruleIndex = sheet.conditionalFormatRules.findIndex(r => r.id === updatedRule.id);
            if (ruleIndex !== -1) {
                sheet.conditionalFormatRules[ruleIndex] = updatedRule;
                newSheetData.updatedAt = Date.now();
<<<<<<< HEAD
            }
        }
        return newSheetData;
     }, 'metadata_update'); 
     
    if(internalSpreadsheetRef.current){
        const currentSheetMeta = internalSpreadsheetRef.current.sheets.find(s => s.id === sheetId);
        if(currentSheetMeta?.conditionalFormatRules) {
             try {
                const mainSpreadsheetDocRef = doc(db, "spreadsheets", internalSpreadsheetRef.current.id);
                const updatedSheetsMetadata = internalSpreadsheetRef.current.sheets.map(s => {
                    const { cells, ...metadata } = s; return metadata;
                });
                await updateDoc(mainSpreadsheetDocRef, { sheetsMetadata: updatedSheetsMetadata, updatedAt: serverTimestamp() });
                setTimeout(() => toast({ title: "Rule Updated", description: "Conditional formatting rule updated and synced." }), 0);
            } catch (error) {
                 console.error("Error updating conditional format rules in Firestore:", error);
                 setTimeout(() => toast({title: "Sync Error", description: `Could not update conditional formatting rule. ${error instanceof Error ? error.message : ''}`, variant: "destructive"}), 0);
            }
        }
    }
  }, [setSpreadsheetWithHistory, toast]);

  const mergeSelection = useCallback(async () => {
    if (!selectionRange || !internalSpreadsheetRef.current) return; 
=======
                setTimeout(() => toast({ title: "Rule Updated", description: "Conditional formatting rule updated." }), 0);
            }
        }
        return newSheetData;
     }, 'user_action');
  }, [setSpreadsheetWithHistory, toast]);

  const mergeSelection = useCallback(() => {
    if (!selectionRange || !internalSpreadsheetRef.current) return;
>>>>>>> 3cd4ffaa439f3afbedf88f6042b7b8f5a2da87f2
    const { start, end, start: { sheetId } } = selectionRange;
    if (start.rowIndex === end.rowIndex && start.colIndex === end.colIndex) {
        setTimeout(() => toast({ title: "Merge Cells", description: "Select multiple cells to merge.", variant: "default" }), 0);
        return;
    }

<<<<<<< HEAD
    const spreadsheetId = internalSpreadsheetRef.current.id;
    const batch = writeBatch(db);
    let masterCellFinalState: CellData | null = null;
    let cellsToClearForMerge: {rowIndex: number, colIndex: number}[] = [];


=======
>>>>>>> 3cd4ffaa439f3afbedf88f6042b7b8f5a2da87f2
    setSpreadsheetWithHistory(prev => {
        if (!prev) return null;
        const spreadsheetCopy = JSON.parse(JSON.stringify(prev)) as SpreadsheetData;
        const sheet = spreadsheetCopy.sheets.find(s => s.id === sheetId);
        if (!sheet) return prev;

        if (!sheet.mergedCells) sheet.mergedCells = [];

<<<<<<< HEAD
=======
        // Check for overlap with existing merges. For simplicity, disallow if any cell in selection is already merged.
>>>>>>> 3cd4ffaa439f3afbedf88f6042b7b8f5a2da87f2
        const minR = Math.min(start.rowIndex, end.rowIndex);
        const maxR = Math.max(start.rowIndex, end.rowIndex);
        const minC = Math.min(start.colIndex, end.colIndex);
        const maxC = Math.max(start.colIndex, end.colIndex);

<<<<<<< HEAD
        for (let r_idx = minR; r_idx <= maxR; r_idx++) {
            for (let c_idx = minC; c_idx <= maxC; c_idx++) {
                if (sheet.mergedCells.some(mc => isCellAddressInRange({sheetId, rowIndex: r_idx, colIndex: c_idx}, mc))) {
                     setTimeout(() => toast({ title: "Merge Error", description: "Selection overlaps with an existing merged area. Unmerge first.", variant: "destructive" }), 0);
                    return prev; 
                }
            }
        }

        const newMergeRange: SelectionRange = {
            start: { sheetId, rowIndex: minR, colIndex: minC },
            end: { sheetId, rowIndex: maxR, colIndex: maxC }
=======
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
>>>>>>> 3cd4ffaa439f3afbedf88f6042b7b8f5a2da87f2
        };
        sheet.mergedCells.push(newMergeRange);

        const masterCell = sheet.cells[minR][minC];
<<<<<<< HEAD
        if(MAX_CELL_HISTORY > 0) addHistoryEntry(masterCell, masterCell.rawValue, masterCell.history?.[0]?.comment);
        masterCell.colSpan = (maxC - minC) + 1;
        masterCell.rowSpan = (maxR - minR) + 1;
        masterCell.isMerged = false; 
        masterCellFinalState = JSON.parse(JSON.stringify(masterCell));


        for (let r_idx = minR; r_idx <= maxR; r_idx++) {
            for (let c_idx = minC; c_idx <= maxC; c_idx++) {
                if (r_idx === minR && c_idx === minC) continue; 
                if (!sheet.cells[r_idx]) sheet.cells[r_idx] = [];
                if (!sheet.cells[r_idx][c_idx]) sheet.cells[r_idx][c_idx] = createEmptyCell(r_idx, c_idx);
                
                const subordinateCell = sheet.cells[r_idx][c_idx];
                if(MAX_CELL_HISTORY > 0) addHistoryEntry(subordinateCell, subordinateCell.rawValue, subordinateCell.history?.[0]?.comment);
                subordinateCell.rawValue = ''; 
                subordinateCell.value = '';    
                subordinateCell.formula = undefined;
                subordinateCell.isMerged = true;
                subordinateCell.mergeMaster = { sheetId, rowIndex: minR, colIndex: minC };
                subordinateCell.colSpan = 1; 
                subordinateCell.rowSpan = 1;
                cellsToClearForMerge.push({rowIndex: r_idx, colIndex: c_idx});
            }
        }
        spreadsheetCopy.updatedAt = Date.now();
        setActiveCellState({ sheetId, rowIndex: minR, colIndex: minC });
        setSelectionRangeState(newMergeRange);
        return spreadsheetCopy;
    }, 'structural_change'); 
    
    if(internalSpreadsheetRef.current && masterCellFinalState){
        const mainSpreadsheetDocRef = doc(db, "spreadsheets", spreadsheetId);
        const updatedSheetsMetadata = internalSpreadsheetRef.current.sheets.map(s => {
            const { cells, ...metadata } = s; return metadata;
        });
        batch.update(mainSpreadsheetDocRef, { sheetsMetadata: updatedSheetsMetadata, updatedAt: serverTimestamp() });
        
        const masterCellDocId = `r${masterCellFinalState.id.match(/\d+$/)![0]-1}_c${masterCellFinalState.id.match(/^[A-Z]+/)![0].split('').reduce((acc, char) => acc * 26 + char.charCodeAt(0) - 64, 0) -1}`;
        batch.set(doc(db, "spreadsheets", spreadsheetId, "sheets", sheetId, "cells", masterCellDocId), {
            ...masterCellFinalState, // Store full state of master cell
            updatedAt: serverTimestamp(), updatedBy: PLACEHOLDER_USER_ID
        }, { merge: true });

        cellsToClearForMerge.forEach(cellAddr => {
            const subCellDocId = `r${cellAddr.rowIndex}_c${cellAddr.colIndex}`;
            batch.set(doc(db, "spreadsheets", spreadsheetId, "sheets", sheetId, "cells", subCellDocId), {
                rawValue: '', formula: null, isMerged: true, mergeMaster: { sheetId, rowIndex: masterCellFinalState!.id.match(/\d+$/)![0]-1, colIndex: masterCellFinalState!.id.match(/^[A-Z]+/)![0].split('').reduce((acc, char) => acc * 26 + char.charCodeAt(0) - 64, 0) -1 },
                colSpan: 1, rowSpan: 1,
                updatedAt: serverTimestamp(), updatedBy: PLACEHOLDER_USER_ID
            }, { merge: true });
        });
        
        try {
            await batch.commit();
            setTimeout(() => toast({ title: "Cells Merged", description: "Selected cells merged and synced." }), 0);
        } catch (error) {
            console.error("Error merging cells in Firestore:", error);
            setTimeout(() => toast({title: "Sync Error", description: "Could not save merge operation to cloud.", variant: "destructive"}), 0);
        }
    }

  }, [selectionRange, toast, setSpreadsheetWithHistory, addHistoryEntry, setActiveCellState, setSelectionRangeState]);

  const unmergeSelection = useCallback(async () => {
    if (!activeCell || !internalSpreadsheetRef.current) return; 
    const { sheetId, rowIndex, colIndex } = activeCell;
    const spreadsheetId = internalSpreadsheetRef.current.id;
    let mergedRangeToUnmerge: SelectionRange | null = null;
    const batch = writeBatch(db);
=======
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
>>>>>>> 3cd4ffaa439f3afbedf88f6042b7b8f5a2da87f2

    setSpreadsheetWithHistory(prev => {
        if (!prev) return null;
        const spreadsheetCopy = JSON.parse(JSON.stringify(prev)) as SpreadsheetData;
        const sheet = spreadsheetCopy.sheets.find(s => s.id === sheetId);
        if (!sheet || !sheet.mergedCells) return prev;

<<<<<<< HEAD
        const cellToCheck = sheet.cells[rowIndex]?.[colIndex];
        if(!cellToCheck) return prev;
        
        const masterAddress = (cellToCheck.isMerged && cellToCheck.mergeMaster) 
                               ? cellToCheck.mergeMaster 
                               : { sheetId, rowIndex, colIndex };
        
        const mergeIndex = sheet.mergedCells.findIndex(mc =>
            mc.start.rowIndex === masterAddress.rowIndex && mc.start.colIndex === masterAddress.colIndex && mc.start.sheetId === masterAddress.sheetId
=======
        const cellToUnmergeFrom = sheet.cells[rowIndex]?.[colIndex];
        if(!cellToUnmergeFrom) return prev;

        const masterAddress = (cellToUnmergeFrom.isMerged && cellToUnmergeFrom.mergeMaster) 
                               ? cellToUnmergeFrom.mergeMaster 
                               : {sheetId, rowIndex, colIndex};

        const mergeIndex = sheet.mergedCells.findIndex(mc => 
            mc.start.rowIndex === masterAddress.rowIndex && mc.start.colIndex === masterAddress.colIndex
>>>>>>> 3cd4ffaa439f3afbedf88f6042b7b8f5a2da87f2
        );

        if (mergeIndex === -1) {
            setTimeout(() => toast({ title: "Unmerge Cells", description: "Active cell is not part of a merged area.", variant: "default" }), 0);
            return prev;
        }

<<<<<<< HEAD
        mergedRangeToUnmerge = sheet.mergedCells[mergeIndex];
        sheet.mergedCells.splice(mergeIndex, 1); 

        for (let r_idx = mergedRangeToUnmerge.start.rowIndex; r_idx <= mergedRangeToUnmerge.end.rowIndex; r_idx++) {
            for (let c_idx = mergedRangeToUnmerge.start.colIndex; c_idx <= mergedRangeToUnmerge.end.colIndex; c_idx++) {
                 if (sheet.cells[r_idx]?.[c_idx]) {
                    sheet.cells[r_idx][c_idx].isMerged = false;
                    delete sheet.cells[r_idx][c_idx].mergeMaster;
                    sheet.cells[r_idx][c_idx].colSpan = 1;
                    sheet.cells[r_idx][c_idx].rowSpan = 1;
                    
                    // Prepare Firestore update for each unmerged cell
                    const cellDocId = `r${r_idx}_c${c_idx}`;
                    batch.set(doc(db, "spreadsheets", spreadsheetId, "sheets", sheetId, "cells", cellDocId), {
                        isMerged: false, mergeMaster: null, colSpan: 1, rowSpan: 1, // or FieldValue.delete() for mergeMaster
                        updatedAt: serverTimestamp(), updatedBy: PLACEHOLDER_USER_ID
                    }, { merge: true });
=======
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
>>>>>>> 3cd4ffaa439f3afbedf88f6042b7b8f5a2da87f2
                 }
            }
        }
        spreadsheetCopy.updatedAt = Date.now();
<<<<<<< HEAD
        setActiveCellState({ sheetId, rowIndex: mergedRangeToUnmerge.start.rowIndex, colIndex: mergedRangeToUnmerge.start.colIndex });
        setSelectionRangeState({ start: mergedRangeToUnmerge.start, end: mergedRangeToUnmerge.start });
        return spreadsheetCopy;
    }, 'structural_change'); 
    
    if(internalSpreadsheetRef.current && mergedRangeToUnmerge){
         const mainSpreadsheetDocRef = doc(db, "spreadsheets", spreadsheetId);
         const updatedSheetsMetadata = internalSpreadsheetRef.current.sheets.map(s => {
            const { cells, ...metadata } = s; return metadata;
        });
        batch.update(mainSpreadsheetDocRef, { sheetsMetadata: updatedSheetsMetadata, updatedAt: serverTimestamp() });
        try {
            await batch.commit();
            setTimeout(() => toast({ title: "Cells Unmerged", description: "Cells unmerged and synced." }), 0);
        } catch (error) {
            console.error("Error unmerging cells in Firestore:", error);
            setTimeout(() => toast({title: "Sync Error", description: "Could not save unmerge operation to cloud.", variant: "destructive"}), 0);
        }
    }
  }, [activeCell, toast, setSpreadsheetWithHistory, setActiveCellState, setSelectionRangeState]);
=======
        setTimeout(() => toast({ title: "Cells Unmerged", description: "Cells have been unmerged." }), 0);
        // After unmerging, set active cell and selection to the top-left of the former merge
        setActiveCellState({ sheetId, rowIndex: mergedRange.start.rowIndex, colIndex: mergedRange.start.colIndex });
        setSelectionRangeState({ start: mergedRange.start, end: mergedRange.start });
        return spreadsheetCopy;
    }, 'user_action');
  }, [activeCell, toast, setSpreadsheetWithHistory]);
>>>>>>> 3cd4ffaa439f3afbedf88f6042b7b8f5a2da87f2

  const findInSheet = useCallback((
    searchTerm: string,
    findOptions: { matchCase: boolean; entireCell: boolean; searchFormulas: boolean; sheetId: string; from: CellAddress | null }
    ): CellAddress | null => {
<<<<<<< HEAD

    const { matchCase, entireCell, searchFormulas, sheetId, from } = findOptions;
    const currentSpreadsheet = internalSpreadsheetRef.current; 
    const sheet = getSheetFromData(currentSpreadsheet, sheetId);
=======
    
    const { matchCase, entireCell, searchFormulas, sheetId, from } = findOptions;
    const sheet = getSheetFromData(internalSpreadsheetRef.current, sheetId);
>>>>>>> 3cd4ffaa439f3afbedf88f6042b7b8f5a2da87f2
    if (!sheet || !searchTerm) return null;

    const term = matchCase ? searchTerm : searchTerm.toLowerCase();
    let startRow = from ? from.rowIndex : 0;
<<<<<<< HEAD
    let startCol = from ? from.colIndex + 1 : 0; 
=======
    let startCol = from ? from.colIndex + 1 : 0; // Start from next cell or beginning
>>>>>>> 3cd4ffaa439f3afbedf88f6042b7b8f5a2da87f2

    for (let r = startRow; r < sheet.rowCount; r++) {
        for (let c = (r === startRow ? startCol : 0); c < sheet.columnCount; c++) {
            const cell = sheet.cells[r]?.[c];
<<<<<<< HEAD
            if (cell && (!cell.isMerged || (cell.mergeMaster && cell.mergeMaster.rowIndex === r && cell.mergeMaster.colIndex === c))) {
=======
            if (cell) {
>>>>>>> 3cd4ffaa439f3afbedf88f6042b7b8f5a2da87f2
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
<<<<<<< HEAD
    if (from && (from.rowIndex !== 0 || from.colIndex !== 0)) { 
        for (let r = 0; r <= from.rowIndex; r++) {
            for (let c = 0; c < (r === from.rowIndex ? from.colIndex : sheet.columnCount) ; c++) { 
                 const cell = sheet.cells[r]?.[c];
                 if (cell && (!cell.isMerged || (cell.mergeMaster && cell.mergeMaster.rowIndex === r && cell.mergeMaster.colIndex === c))) {
=======
    // If not found from 'from', wrap around and search from beginning if 'from' was not (0,0)
    if (from && (from.rowIndex !== 0 || from.colIndex !== 0)) {
        for (let r = 0; r <= from.rowIndex; r++) {
            for (let c = 0; c < (r === from.rowIndex ? from.colIndex + 1 : sheet.columnCount) ; c++) {
                 const cell = sheet.cells[r]?.[c];
                 if (cell) {
>>>>>>> 3cd4ffaa439f3afbedf88f6042b7b8f5a2da87f2
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
<<<<<<< HEAD
    setLastFoundCell(null); 
    return null;
  }, []); 

  const exportToXLSX = useCallback(() => {
    const currentSpreadsheet = internalSpreadsheetRef.current; 
    if (!currentSpreadsheet) {
        setTimeout(() => toast({ title: "Export Error", description: "No spreadsheet to export.", variant: "destructive" }), 0);
        return;
    }
    const wb = XLSX.utils.book_new();
    currentSpreadsheet.sheets.forEach(sheetData => {
        const ws_data = sheetData.cells.map(row =>
            row.map(cell => {
                let masterCell = cell;
                if (cell.isMerged && cell.mergeMaster) {
                    if (!(cell.mergeMaster.rowIndex === parseInt(cell.id.match(/\d+$/)![0],10)-1 && 
                          cell.mergeMaster.colIndex === (cell.id.match(/^[A-Z]+/)![0].split('').reduce((acc, char) => acc * 26 + char.charCodeAt(0) - 64, 0) -1))) {
                       return null; 
                    }
                    masterCell = sheetData.cells[cell.mergeMaster.rowIndex]?.[cell.mergeMaster.colIndex] || cell;
                }
                return masterCell.value !== undefined && masterCell.value !== '' ? masterCell.value : (masterCell.rawValue || '');
            })
        );
        const ws = XLSX.utils.aoa_to_sheet(ws_data);
        
        if (sheetData.mergedCells && sheetData.mergedCells.length > 0) {
            ws['!merges'] = sheetData.mergedCells.map(mc => ({
                s: { r: mc.start.rowIndex, c: mc.start.colIndex }, 
                e: { r: mc.end.rowIndex, c: mc.end.colIndex }   
            }));
        }
        XLSX.utils.book_append_sheet(wb, ws, sheetData.name.substring(0,31)); 
    });
    XLSX.writeFile(wb, `${currentSpreadsheet.name}.xlsx`);
    setTimeout(() => toast({ title: "Exported", description: "Spreadsheet exported as .xlsx" }), 0);
  }, [toast]);

  const exportToCSV = useCallback(() => {
    const currentSpreadsheet = internalSpreadsheetRef.current; 
    if (!currentSpreadsheet || !currentSpreadsheet.activeSheetId) {
        setTimeout(() => toast({ title: "Export Error", description: "No active sheet to export.", variant: "destructive" }), 0);
        return;
    }
    const activeSheetData = currentSpreadsheet.sheets.find(s => s.id === currentSpreadsheet.activeSheetId);
    if (!activeSheetData) {
        setTimeout(() => toast({ title: "Export Error", description: "Active sheet data not found.", variant: "destructive" }), 0);
        return;
    }
    const ws_data = activeSheetData.cells.map(row =>
        row.map(cell => {
            let masterCell = cell;
            if (cell.isMerged && cell.mergeMaster) {
                 if (!(cell.mergeMaster.rowIndex === parseInt(cell.id.match(/\d+$/)![0],10)-1 && 
                       cell.mergeMaster.colIndex === (cell.id.match(/^[A-Z]+/)![0].split('').reduce((acc, char) => acc * 26 + char.charCodeAt(0) - 64, 0) -1))) {
                    return ''; 
                 }
                 masterCell = activeSheetData.cells[cell.mergeMaster.rowIndex]?.[cell.mergeMaster.colIndex] || cell;
            }
            return masterCell.value !== undefined && masterCell.value !== '' ? masterCell.value : (masterCell.rawValue || '');
        })
    );
    const ws = XLSX.utils.aoa_to_sheet(ws_data);
    const csvString = XLSX.utils.sheet_to_csv(ws);

    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${activeSheetData.name}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => toast({ title: "Exported", description: `Sheet "${activeSheetData.name}" exported as .csv` }), 0);
  }, [toast]);


  const importSpreadsheetData = useCallback(async (file: File, type: 'json' | 'xlsx' | 'csv') => {
    setIsLoading(true);
    let importedSpreadsheetData: Partial<SpreadsheetData> & { sheets: SheetData[] } | null = null;
    const originalName = file.name.split('.')[0] || "Untitled Import";
    const newFirestoreId = uuidv4(); 

    try {
        if (type === 'json') {
            const text = await file.text();
            const parsed = JSON.parse(text) as SpreadsheetData; 
            if (!parsed || typeof parsed.name !== 'string' || !Array.isArray(parsed.sheets)) {
                throw new Error("Invalid JSON file format. Expected OfflineSheet structure.");
            }
            importedSpreadsheetData = {...parsed, id: newFirestoreId}; // Ensure new ID for FS
        } else if (type === 'xlsx') {
            const buffer = await file.arrayBuffer();
            const wb = XLSX.read(buffer, { type: 'buffer', cellStyles: false, cellFormula: true }); 
            const sheets: SheetData[] = [];
            wb.SheetNames.forEach(sheetName => {
                const ws = wb.Sheets[sheetName];
                const data = XLSX.utils.sheet_to_json<any[]>(ws, { header: 1, defval: null }); 
                
                const rowCount = data.length > 0 ? data.length : DEFAULT_ROW_COUNT;
                let colCount = data.length > 0 ? data.reduce((max, row) => Math.max(max, row.length), 0) : DEFAULT_COLUMN_COUNT;
                colCount = Math.max(colCount, DEFAULT_COLUMN_COUNT);

                const newSheetId = uuidv4();
                const newSheetCells: CellData[][] = Array.from({ length: rowCount }, (_, rIdx) =>
                    Array.from({ length: colCount }, (_, cIdx) => {
                        const cellValue = data[rIdx]?.[cIdx];
                        const cellFormula = ws[XLSX.utils.encode_cell({r: rIdx, c: cIdx})]?.f; 
                        return {
                            ...createEmptyCell(rIdx, cIdx),
                            rawValue: cellFormula ? `=${cellFormula}` : (cellValue ?? ''), 
                        };
                    })
                );
                
                const importedMerges: SelectionRange[] = [];
                if (ws['!merges']) {
                    ws['!merges'].forEach((m: XLSX.Range) => {
                        importedMerges.push({
                            start: { sheetId: newSheetId, rowIndex: m.s.r, colIndex: m.s.c }, 
                            end: { sheetId: newSheetId, rowIndex: m.e.r, colIndex: m.e.c }
                        });
                    });
                }

                sheets.push({
                    id: newSheetId,
                    name: sheetName,
                    cells: newSheetCells,
                    rowCount,
                    columnCount: colCount,
                    columnWidths: Array(colCount).fill(DEFAULT_COLUMN_WIDTH),
                    rowHeights: Array(rowCount).fill(DEFAULT_ROW_HEIGHT),
                    conditionalFormatRules: [], 
                    mergedCells: importedMerges,
                });
            });
            if (sheets.length === 0) throw new Error("No sheets found in XLSX file.");
            importedSpreadsheetData = { id: newFirestoreId, sheets, activeSheetId: sheets[0].id, name: originalName };

        } else if (type === 'csv') {
            const text = await file.text();
            const rows = XLSX.read(text, {type: 'string', raw: true, CSV: true}); 
            const firstSheetName = Object.keys(rows.Sheets)[0];
            const csvData = XLSX.utils.sheet_to_json<any[]>(rows.Sheets[firstSheetName], {header: 1, defval: null});

            const rowCount = csvData.length > 0 ? csvData.length : DEFAULT_ROW_COUNT;
            let colCount = csvData.length > 0 ? csvData.reduce((max, row) => Math.max(max, row.length), 0) : DEFAULT_COLUMN_COUNT;
            colCount = Math.max(colCount, DEFAULT_COLUMN_COUNT);

            const newSheetId = uuidv4();
            const cells: CellData[][] = Array.from({ length: rowCount }, (_, rIdx) =>
                Array.from({ length: colCount }, (_, cIdx) => ({
                    ...createEmptyCell(rIdx, cIdx),
                    rawValue: csvData[rIdx]?.[cIdx] ?? '',
                }))
            );
            const sheet: SheetData = {
                id: newSheetId,
                name: originalName.substring(0,31),
                cells,
                rowCount,
                columnCount: colCount,
                columnWidths: Array(colCount).fill(DEFAULT_COLUMN_WIDTH),
                rowHeights: Array(rowCount).fill(DEFAULT_ROW_HEIGHT),
                conditionalFormatRules: [],
                mergedCells: [], 
            };
            importedSpreadsheetData = { id: newFirestoreId, sheets: [sheet], activeSheetId: sheet.id, name: originalName };
        }

        if (!importedSpreadsheetData || !importedSpreadsheetData.sheets || importedSpreadsheetData.sheets.length === 0) {
            throw new Error("Failed to process file or file is empty.");
        }
        
        let finalSpreadsheetData: SpreadsheetData = {
            id: newFirestoreId,
            name: `Imported - ${importedSpreadsheetData.name || originalName}`.substring(0, 100),
            sheets: importedSpreadsheetData.sheets.map(s => {
                const currentSheetId = s.id || uuidv4(); 
                const baseNewSheet = createInitialSheetUtil(currentSheetId, s.name || "Sheet");
                const finalRowCount = Math.max(s.rowCount || 0, baseNewSheet.rowCount, (s.cells || []).length);
                const finalColCount = Math.max(s.columnCount || 0, baseNewSheet.columnCount, (s.cells && s.cells[0]) ? s.cells[0].length : 0);

                const finalCells = Array.from({length: finalRowCount}, (_, rIdx) =>
                    Array.from({length: finalColCount}, (_, cIdx) => {
                        const cellFromFile = s.cells?.[rIdx]?.[cIdx];
                        const baseCell = createEmptyCell(rIdx, cIdx);
                        return cellFromFile ? {...baseCell, ...cellFromFile, id: getCellId(rIdx, cIdx)} : {...baseCell, id: getCellId(rIdx, cIdx)};
                    })
                );
                return {
                    ...baseNewSheet, 
                    ...s,             
                    id: currentSheetId,
                    rowCount: finalRowCount,
                    columnCount: finalColCount,
                    cells: finalCells, // Keep cells here for re-evaluation pass
                    columnWidths: Array.from({length: finalColCount}, (_, i) => s.columnWidths?.[i] ?? DEFAULT_COLUMN_WIDTH),
                    rowHeights: Array.from({length: finalRowCount}, (_, i) => s.rowHeights?.[i] ?? DEFAULT_ROW_HEIGHT),
                    mergedCells: (s.mergedCells || []).map(mc => ({ 
                        ...mc,
                        start: {...mc.start, sheetId: currentSheetId},
                        end: {...mc.end, sheetId: currentSheetId}
                    }))
                };
            }),
            activeSheetId: importedSpreadsheetData.activeSheetId || importedSpreadsheetData.sheets[0].id,
            createdAt: Date.now(), 
            updatedAt: Date.now(),
        };
        
        let reevaluatedData = JSON.parse(JSON.stringify(finalSpreadsheetData)) as SpreadsheetData;
        reevaluatedData.sheets.forEach(sheet => {
            (sheet.mergedCells || []).forEach(mergeRange => {
                const { start: mergeStart, end: mergeEnd } = mergeRange;
                const masterRow = Math.min(mergeStart.rowIndex, mergeEnd.rowIndex);
                const masterCol = Math.min(mergeStart.colIndex, mergeEnd.colIndex);
                const numRows = Math.abs(mergeEnd.rowIndex - mergeStart.rowIndex) + 1;
                const numCols = Math.abs(mergeEnd.colIndex - mergeStart.colIndex) + 1;

                if(sheet.cells[masterRow]?.[masterCol]) {
                    sheet.cells[masterRow][masterCol].colSpan = numCols;
                    sheet.cells[masterRow][masterCol].rowSpan = numRows;
                    sheet.cells[masterRow][masterCol].isMerged = false;
                    for (let r_idx = masterRow; r_idx < masterRow + numRows; r_idx++) {
                        for (let c_idx = masterCol; c_idx < masterCol + numCols; c_idx++) {
                            if (r_idx === masterRow && c_idx === masterCol) continue;
                            if (sheet.cells[r_idx]?.[c_idx]) {
                                sheet.cells[r_idx][c_idx].isMerged = true;
                                sheet.cells[r_idx][c_idx].mergeMaster = { sheetId: sheet.id, rowIndex: masterRow, colIndex: masterCol };
                            }
                        }
                    }
                }
            });
            reevaluatedData = reevaluateSheetFormulas(reevaluatedData, sheet.id);
        });

        const { sheets: sheetsWithCellData, ...metaToSave } = reevaluatedData;
        const sheetsMetadata = sheetsWithCellData.map(s => {
            const { cells, ...metadata } = s; return metadata;
        });

        await setDoc(doc(db, "spreadsheets", newFirestoreId), {
           ...metaToSave,
           sheetsMetadata: sheetsMetadata,
           createdAt: serverTimestamp(), 
           updatedAt: serverTimestamp(),
           ownerId: PLACEHOLDER_USER_ID
        });
        
        // Save all cells for all sheets to Firestore
        const batch = writeBatch(db);
        sheetsWithCellData.forEach(sheet => {
            sheet.cells.forEach(row => {
                row.forEach(cell => {
                    if (cell.rawValue !== '' || cell.formula || (cell.style && Object.keys(cell.style).length > 2) /* default style has 2 keys */ ) {
                        const cellDocId = `r${cell.id.match(/\d+$/)![0]-1}_c${cell.id.match(/^[A-Z]+/)![0].split('').reduce((acc, char) => acc * 26 + char.charCodeAt(0) - 64, 0) -1}`;
                        const cellRef = doc(db, "spreadsheets", newFirestoreId, "sheets", sheet.id, "cells", cellDocId);
                         const dataToSaveForCell: any = {
                            rowIndex: cell.id.match(/\d+$/)![0]-1,
                            colIndex: cell.id.match(/^[A-Z]+/)![0].split('').reduce((acc, char) => acc * 26 + char.charCodeAt(0) - 64, 0) -1,
                            rawValue: cell.rawValue,
                            style: cell.style || { numberFormat: 'general', dataType: 'general' },
                            formula: cell.formula,
                            history: cell.history || [],
                            updatedAt: serverTimestamp(),
                            updatedBy: PLACEHOLDER_USER_ID
                        };
                        if (cell.colSpan && cell.colSpan > 1) dataToSaveForCell.colSpan = cell.colSpan;
                        if (cell.rowSpan && cell.rowSpan > 1) dataToSaveForCell.rowSpan = cell.rowSpan;
                        batch.set(cellRef, dataToSaveForCell);
                    }
                });
            });
        });
        await batch.commit();

        setSpreadsheetWithHistory(() => reevaluatedData, 'import'); // Update local state
        setTimeout(() => toast({ title: "Import Successful", description: `Spreadsheet "${reevaluatedData.name}" imported and saved to cloud.`}), 0);
        router.push(`/spreadsheet/${newFirestoreId}`);
        
    } catch (error: any) {
        console.error("Import error:", error);
        setTimeout(() => toast({ title: "Import Error", description: error.message, variant: "destructive" }), 0);
    } finally {
        setIsLoading(false);
    }
  }, [toast, setSpreadsheetWithHistory, router]);


  const revertCellToHistory = useCallback((sheetId: string, rowIndex: number, colIndex: number, historyEntryIndex: number) => {
    let cellToSaveToFirestore: CellData | null = null;
    setSpreadsheetWithHistory(prevSpreadsheet => {
        if (!prevSpreadsheet) return null;
        let spreadsheetCopy = JSON.parse(JSON.stringify(prevSpreadsheet)) as SpreadsheetData;
        const sheet = spreadsheetCopy.sheets.find(s => s.id === sheetId);
        if (!sheet) return prevSpreadsheet;

        const cell = sheet.cells[rowIndex]?.[colIndex];
        if (!cell || !cell.history || historyEntryIndex < 0 || historyEntryIndex >= cell.history.length) {
            setTimeout(() => toast({ title: "Revert Error", description: "History entry not found.", variant: "destructive" }), 0);
            return prevSpreadsheet;
        }
        
        const historyEntry = cell.history[historyEntryIndex];
        if (MAX_CELL_HISTORY > 0) addHistoryEntry(cell, cell.rawValue, cell.history[0]?.comment);
        
        cell.rawValue = historyEntry.rawValue;
        cell.formula = typeof historyEntry.rawValue === 'string' && historyEntry.rawValue.startsWith('=') ? historyEntry.rawValue : undefined;

        if (cell.history.length > historyEntryIndex + 1) {
          // Optional: To keep the reverted entry at top and remove future ones from this point.
          // cell.history.splice(0, historyEntryIndex + 1);
        }
        
        spreadsheetCopy.updatedAt = Date.now();
        cellToSaveToFirestore = JSON.parse(JSON.stringify(cell));
        return spreadsheetCopy;
    }, 'revert_history'); 

    if (internalSpreadsheetRef.current && cellToSaveToFirestore) {
        const spreadsheetId = internalSpreadsheetRef.current.id;
        const cellDocId = `r${rowIndex}_c${colIndex}`;
        const cellRef = doc(db, "spreadsheets", spreadsheetId, "sheets", sheetId, "cells", cellDocId);
        try {
            setDoc(cellRef, { 
                rawValue: cellToSaveToFirestore.rawValue, 
                formula: cellToSaveToFirestore.formula,
                history: cellToSaveToFirestore.history, 
                updatedAt: serverTimestamp(), 
                updatedBy: PLACEHOLDER_USER_ID 
            }, { merge: true });
            setTimeout(() => toast({ title: "Cell Reverted", description: `Cell ${getCellId(rowIndex, colIndex)} reverted and synced.` }), 0);
        } catch(error) {
            console.error("Error reverting cell in Firestore:", error);
            setTimeout(() => toast({ title: "Sync Error", description: "Could not save cell revert to cloud.", variant: "destructive" }), 0);
        }
    }
  }, [setSpreadsheetWithHistory, toast, addHistoryEntry]);

  const updateCellHistoryEntryComment = useCallback(async (sheetId: string, rowIndex: number, colIndex: number, historyEntryTimestamp: number, newComment: string) => {
    let updatedHistoryForFirestore: CellHistoryEntry[] | null = null;
    setSpreadsheetWithHistory(prev => {
      if (!prev) return null;
      const spreadsheetCopy = JSON.parse(JSON.stringify(prev)) as SpreadsheetData;
      const sheet = spreadsheetCopy.sheets.find(s => s.id === sheetId);
      if (!sheet) return prev;

      const cell = sheet.cells[rowIndex]?.[colIndex];
      if (cell && cell.history) {
        const entry = cell.history.find(h => h.timestamp === historyEntryTimestamp);
        if (entry) {
          entry.comment = newComment;
          updatedHistoryForFirestore = JSON.parse(JSON.stringify(cell.history));
          spreadsheetCopy.updatedAt = Date.now();
        } else {
          setTimeout(() => toast({ title: "Error", description: "Could not find history entry to update comment.", variant: "destructive" }), 0);
        }
      }
      return spreadsheetCopy;
    }, 'user_action'); 

    if (internalSpreadsheetRef.current && updatedHistoryForFirestore) {
        const spreadsheetId = internalSpreadsheetRef.current.id;
        const cellDocId = `r${rowIndex}_c${colIndex}`;
        const cellRef = doc(db, "spreadsheets", spreadsheetId, "sheets", sheetId, "cells", cellDocId);
        try {
            await updateDoc(cellRef, { history: updatedHistoryForFirestore, updatedAt: serverTimestamp(), updatedBy: PLACEHOLDER_USER_ID });
            setTimeout(() => toast({ title: "Comment Updated", description: `Comment for cell ${getCellId(rowIndex, colIndex)} history updated and synced.` }), 0);
        } catch(error) {
            console.error("Error updating cell history comment in Firestore:", error);
            setTimeout(() => toast({ title: "Sync Error", description: "Could not save history comment to cloud.", variant: "destructive" }), 0);
        }
    }
  }, [setSpreadsheetWithHistory, toast]);


  const canUndo = MAX_UNDO_HISTORY > 0 && undoStack.length > 0;
  const canRedo = MAX_UNDO_HISTORY > 0 && redoStack.length > 0;

  useEffect(() => {
    return () => {
        if (activeSheetListenerUnsubscribeRef.current) {
            activeSheetListenerUnsubscribeRef.current();
        }
    };
  }, []);

  return (
    <SpreadsheetContext.Provider value={{
      spreadsheet: internalSpreadsheetState,
=======
    setLastFoundCell(null); // Not found
    return null;

  }, []);


  const canUndo = undoStack.length > 0;
  const canRedo = redoStack.length > 0;

  return (
    <SpreadsheetContext.Provider value={{
      spreadsheet: internalSpreadsheetState,
      setSpreadsheet: exposedSetSpreadsheet,
>>>>>>> 3cd4ffaa439f3afbedf88f6042b7b8f5a2da87f2
      isLoading,
      loadSpreadsheet,
      saveSpreadsheet,
      updateCell,
      activeCell: activeCell,
      selectionRange: selectionRange,
      setActiveCellAndSelection,
      updateSelectedCellStyle,
<<<<<<< HEAD
      updateSelectedCellNumberFormat,
      updateSelectedCellDataType, 
=======
>>>>>>> 3cd4ffaa439f3afbedf88f6042b7b8f5a2da87f2
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
<<<<<<< HEAD
      setIsActivelyEditingFormula: setIsActivelyEditingFormulaState,
=======
      setIsActivelyEditingFormula,
>>>>>>> 3cd4ffaa439f3afbedf88f6042b7b8f5a2da87f2
      formulaBarApiRef,
      updateColumnWidth,
      updateRowHeight,
      addConditionalFormatRule,
      removeConditionalFormatRule,
      updateConditionalFormatRule,
      mergeSelection,
      unmergeSelection,
      findInSheet,
<<<<<<< HEAD
      exportToXLSX,
      exportToCSV,
      importSpreadsheetData,
      revertCellToHistory,
      updateCellHistoryEntryComment,
      cellHistoryDialogApiRef,
      setSpreadsheet: exposedSetSpreadsheet,
=======
>>>>>>> 3cd4ffaa439f3afbedf88f6042b7b8f5a2da87f2
    }}>
      {children}
    </SpreadsheetContext.Provider>
  );
}
<<<<<<< HEAD
=======

>>>>>>> 3cd4ffaa439f3afbedf88f6042b7b8f5a2da87f2

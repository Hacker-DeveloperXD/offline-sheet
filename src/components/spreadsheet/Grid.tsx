
"use client";

<<<<<<< HEAD
import type { MouseEvent as ReactMouseEvent, WheelEvent, KeyboardEvent as ReactKeyboardEvent } from 'react'; // Added ReactKeyboardEvent
=======
import type { MouseEvent as ReactMouseEvent, WheelEvent } from 'react';
>>>>>>> 3cd4ffaa439f3afbedf88f6042b7b8f5a2da87f2
import { useState, useEffect, useRef, useCallback } from 'react';
import type { SheetData, CellAddress, SelectionRange } from '@/types/spreadsheet';
import { useSpreadsheet } from '@/hooks/useSpreadsheet';
import Cell from './Cell';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DEFAULT_COLUMN_WIDTH, DEFAULT_ROW_HEIGHT, getCellId as getCellIdUtil, isCellAddressInRange } from '@/types/spreadsheet';
import { cn } from '@/lib/utils';


const getColumnName = (index: number): string => {
  let name = '';
  let n = index;
  do {
    name = String.fromCharCode(65 + (n % 26)) + name;
    n = Math.floor(n / 26) -1;
  } while (n >= 0)
  return name;
};

function makeRangeString(start: CellAddress, end: CellAddress): string {
  const minR = Math.min(start.rowIndex, end.rowIndex);
  const maxR = Math.max(start.rowIndex, end.rowIndex);
  const minC = Math.min(start.colIndex, end.colIndex);
  const maxC = Math.max(start.colIndex, end.colIndex);
<<<<<<< HEAD

=======
  
>>>>>>> 3cd4ffaa439f3afbedf88f6042b7b8f5a2da87f2
  const startId = getCellIdUtil(minR, minC);
  const endId = getCellIdUtil(maxR, maxC);

  return startId === endId ? startId : `${startId}:${endId}`;
}


export default function Grid({ sheet }: GridProps) {
<<<<<<< HEAD
  const {
    spreadsheet,
    updateCell,
    activeCell,
    selectionRange,
=======
  const { 
    spreadsheet, 
    updateCell, 
    activeCell, 
    selectionRange, 
>>>>>>> 3cd4ffaa439f3afbedf88f6042b7b8f5a2da87f2
    setActiveCellAndSelection,
    isActivelyEditingFormula,
    formulaBarApiRef,
    updateColumnWidth,
    updateRowHeight,
  } = useSpreadsheet();
<<<<<<< HEAD

  const [editingCellAddress, setEditingCellAddress] = useState<CellAddress | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const activeCellRef = useRef<CellAddress | null>(activeCell); // Ref to track activeCell for keyboard nav
  const isCellCurrentlyEditingRef = useRef(false); // To track if cell input is active for keyboard
  const isMouseDownRef = useRef(false);

  const formulaSelectionStartCellRef = useRef<CellAddress | null>(null);
  const currentFormulaDragRangeStringRef = useRef<string | null>(null);
=======
  
  const [editingCell, setEditingCell] = useState<CellAddress | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const isMouseDownRef = useRef(false); 

  const formulaSelectionStartCellRef = useRef<CellAddress | null>(null);
  const currentFormulaDragRangeStringRef = useRef<string | null>(null); 
>>>>>>> 3cd4ffaa439f3afbedf88f6042b7b8f5a2da87f2
  const [formulaHighlightRange, setFormulaHighlightRange] = useState<SelectionRange | null>(null);

  const [resizingColumn, setResizingColumn] = useState<{ index: number; startX: number; initialWidth: number } | null>(null);
  const [resizingRow, setResizingRow] = useState<{ index: number; startY: number; initialHeight: number } | null>(null);
  const resizerTolerance = 5;

<<<<<<< HEAD
  useEffect(() => {
    activeCellRef.current = activeCell;
  }, [activeCell]);


  const handleCellChange = useCallback((rowIndex: number, colIndex: number, rawValue: string | number, typedChar?: string) => {
    updateCell(sheet.id, rowIndex, colIndex, { rawValue }, typedChar);
=======

  const handleCellChange = useCallback((rowIndex: number, colIndex: number, rawValue: string | number) => {
    updateCell(sheet.id, rowIndex, colIndex, { rawValue });
>>>>>>> 3cd4ffaa439f3afbedf88f6042b7b8f5a2da87f2
  },[updateCell, sheet.id]);


  const handleCellSelect = useCallback((address: CellAddress, isShiftKey: boolean, isDrag: boolean) => {
    if (formulaBarApiRef.current && isActivelyEditingFormula) {
        const newCellId = getCellIdUtil(address.rowIndex, address.colIndex);

<<<<<<< HEAD
        if (isDrag) {
            if (!formulaSelectionStartCellRef.current) {
                formulaSelectionStartCellRef.current = address;
                currentFormulaDragRangeStringRef.current = newCellId;
                formulaBarApiRef.current.appendText(newCellId);
                setFormulaHighlightRange({ start: address, end: address });
            } else {
=======
        if (isDrag) { 
            if (!formulaSelectionStartCellRef.current) { 
                formulaSelectionStartCellRef.current = address;
                currentFormulaDragRangeStringRef.current = newCellId;
                formulaBarApiRef.current.appendText(newCellId); 
                setFormulaHighlightRange({ start: address, end: address });
            } else { 
>>>>>>> 3cd4ffaa439f3afbedf88f6042b7b8f5a2da87f2
                const newRangeString = makeRangeString(formulaSelectionStartCellRef.current, address);
                const currentFullFormula = formulaBarApiRef.current.getValue();
                const oldRangeToken = currentFormulaDragRangeStringRef.current;

<<<<<<< HEAD
=======
                // More robust replacement: look for the specific old token, even if not exactly at the end.
                // This regex tries to find the last cell/range reference that might be the one we're dragging.
>>>>>>> 3cd4ffaa439f3afbedf88f6042b7b8f5a2da87f2
                const endsWithCellOrRangeRegex = /([A-Z]+[1-9]\d*(?::[A-Z]+[1-9]\d*)?)$/;
                const formulaEndsWithMatch = currentFullFormula.match(endsWithCellOrRangeRegex);

                if(oldRangeToken && currentFullFormula.endsWith(oldRangeToken)) {
                    const baseFormula = currentFullFormula.slice(0, -oldRangeToken.length);
                    formulaBarApiRef.current.setText(baseFormula + newRangeString);
                } else if (formulaEndsWithMatch && formulaEndsWithMatch[1] === oldRangeToken) {
                    const baseFormula = currentFullFormula.slice(0, -(oldRangeToken?.length || 0));
                    formulaBarApiRef.current.setText(baseFormula + newRangeString);
                } else {
<<<<<<< HEAD
=======
                    // Fallback: if a clear replacement isn't obvious, append after ensuring an operator or comma.
>>>>>>> 3cd4ffaa439f3afbedf88f6042b7b8f5a2da87f2
                    const endsWithOperatorOrParenOrComma = /[+\-*/,(]$/.test(currentFullFormula);
                     if (endsWithOperatorOrParenOrComma || currentFullFormula === "=" || currentFullFormula.endsWith("(")) {
                        formulaBarApiRef.current.appendText(newRangeString);
                    } else {
<<<<<<< HEAD
                        if(oldRangeToken && currentFullFormula.includes(oldRangeToken)){
=======
                        // If user likely wants to replace, but we couldn't match, just append with a comma.
                        // This might need user correction but avoids breaking the formula too much.
                        // Or, better, if oldToken is set, it implies a previous selection was made.
                        if(oldRangeToken && currentFullFormula.includes(oldRangeToken)){
                             // This is tricky. If oldToken is in the middle, replacing is complex.
                             // For now, let's assume a simple append after comma if not ending.
>>>>>>> 3cd4ffaa439f3afbedf88f6042b7b8f5a2da87f2
                             formulaBarApiRef.current.appendText("," + newRangeString);
                        } else {
                           formulaBarApiRef.current.appendText(newRangeString);
                        }
                    }
                }
                currentFormulaDragRangeStringRef.current = newRangeString;
                setFormulaHighlightRange({ start: formulaSelectionStartCellRef.current, end: address });
            }
<<<<<<< HEAD
        } else {
            const currentFullFormula = formulaBarApiRef.current.getValue();
            const endsWithSeparator = /[+\-*/(,]$/.test(currentFullFormula);
            const isFormulaEmptyIsh = currentFullFormula === "=" || currentFullFormula === "";

            if (endsWithSeparator || isFormulaEmptyIsh || currentFullFormula.endsWith("(") || currentFullFormula.endsWith(",")) {
                formulaBarApiRef.current.appendText(newCellId);
            } else {
=======
        } else { // Single click during formula editing
            const currentFullFormula = formulaBarApiRef.current.getValue();
            // Regex to check if formula ends with an operator, opening parenthesis, or comma
            const endsWithSeparator = /[+\-*/(,]$/.test(currentFullFormula);
            const isFormulaEmptyIsh = currentFullFormula === "=" || currentFullFormula === "";

            if (endsWithSeparator || isFormulaEmptyIsh || currentFullFormula.endsWith("(")) {
                formulaBarApiRef.current.appendText(newCellId);
            } else {
                 // If it ends with a cell/range, replace it.
>>>>>>> 3cd4ffaa439f3afbedf88f6042b7b8f5a2da87f2
                const endsWithCellOrRangeRegex = /([A-Z]+[1-9]\d*(?::[A-Z]+[1-9]\d*)?)$/;
                const formulaEndsWithMatch = currentFullFormula.match(endsWithCellOrRangeRegex);
                if (formulaEndsWithMatch) {
                    const oldToken = formulaEndsWithMatch[1];
                    const baseFormula = currentFullFormula.slice(0, -oldToken.length);
                    formulaBarApiRef.current.setText(baseFormula + newCellId);
                } else {
<<<<<<< HEAD
                    formulaBarApiRef.current.appendText(newCellId);
                }
            }
            formulaSelectionStartCellRef.current = address;
=======
                    formulaBarApiRef.current.appendText(newCellId); // Default append
                }
            }
            
            formulaSelectionStartCellRef.current = address; 
>>>>>>> 3cd4ffaa439f3afbedf88f6042b7b8f5a2da87f2
            currentFormulaDragRangeStringRef.current = newCellId;
            setFormulaHighlightRange({ start: address, end: address });
        }
        formulaBarApiRef.current.focus();
<<<<<<< HEAD
        return;
    }
    setActiveCellAndSelection(address, isShiftKey, isDrag);
    setFormulaHighlightRange(null);
  }, [
    setActiveCellAndSelection,
    isActivelyEditingFormula,
    formulaBarApiRef,
    sheet.id,
  ]);

  const startCellEditing = useCallback((address: CellAddress, initialValue?: string) => {
    if (isActivelyEditingFormula) return;
=======
        return; 
    }
    // Normal selection
    setActiveCellAndSelection(address, isShiftKey, isDrag);
    setFormulaHighlightRange(null); 
  }, [
    setActiveCellAndSelection, 
    isActivelyEditingFormula, 
    formulaBarApiRef, 
    sheet.id,
  ]);

  const startCellEditing = useCallback((address: CellAddress) => {
    if (isActivelyEditingFormula) return;
    // Check if the address is part of a merged cell, if so, edit the master cell
>>>>>>> 3cd4ffaa439f3afbedf88f6042b7b8f5a2da87f2
    const cellData = sheet.cells[address.rowIndex]?.[address.colIndex];
    let masterAddress = address;
    if(cellData?.isMerged && cellData.mergeMaster){
        masterAddress = cellData.mergeMaster;
    }

<<<<<<< HEAD
    if (activeCellRef.current && activeCellRef.current.sheetId === masterAddress.sheetId && activeCellRef.current.rowIndex === masterAddress.rowIndex && activeCellRef.current.colIndex === masterAddress.colIndex) {
       if (editingCellAddress?.rowIndex !== masterAddress.rowIndex || editingCellAddress?.colIndex !== masterAddress.colIndex || editingCellAddress?.sheetId !== masterAddress.sheetId) {
         // Update cellData's rawValue if initialValue is provided (e.g., typed char)
         // This is tricky because we want to set the editValue in Cell.tsx, not directly rawValue here
         if (initialValue !== undefined && sheet.cells[masterAddress.rowIndex]?.[masterAddress.colIndex]) {
           // We'll pass initialValue to Cell.tsx eventually, for now, setEditingCellAddress triggers Cell's useEffect
         }
         setEditingCellAddress(masterAddress);
         isCellCurrentlyEditingRef.current = true;
         if (initialValue !== undefined && sheet.cells[masterAddress.rowIndex]?.[masterAddress.colIndex]) {
            // This part is to ensure the Cell's editValue is updated correctly
            // This is a bit of a workaround; ideally Cell component itself handles initial char.
            // Forcing a re-render of the specific cell might be complex without direct Cell ref.
            // The Cell's useEffect will pick up initialValue from rawValue if we set it.
            // So, updateCell in context will set rawValue.
            updateCell(masterAddress.sheetId, masterAddress.rowIndex, masterAddress.colIndex, { rawValue: initialValue });
         }
       }
    } else {
        setActiveCellAndSelection(masterAddress, false, false);
        setEditingCellAddress(masterAddress);
        isCellCurrentlyEditingRef.current = true;
         if (initialValue !== undefined) {
            updateCell(masterAddress.sheetId, masterAddress.rowIndex, masterAddress.colIndex, { rawValue: initialValue });
         }
    }
  }, [editingCellAddress, isActivelyEditingFormula, sheet.cells, setActiveCellAndSelection, updateCell, sheet.id]);

  const stopCellEditing = useCallback(() => {
    setEditingCellAddress(null);
    isCellCurrentlyEditingRef.current = false;
    // Ensure grid can receive focus again for keyboard navigation
    setTimeout(() => gridRef.current?.focus(), 0);
=======
    // Ensure the cell to be edited is the active cell
    if (activeCell && activeCell.sheetId === masterAddress.sheetId && activeCell.rowIndex === masterAddress.rowIndex && activeCell.colIndex === masterAddress.colIndex) {
       if (editingCell?.rowIndex !== masterAddress.rowIndex || editingCell?.colIndex !== masterAddress.colIndex || editingCell?.sheetId !== masterAddress.sheetId) {
         setEditingCell(masterAddress);
       }
    } else {
        // This case should ideally not be hit if selection logic correctly sets activeCell to master.
        // But as a fallback, make it active first then edit.
        setActiveCellAndSelection(masterAddress, false, false);
        setEditingCell(masterAddress);
    }
  }, [editingCell, activeCell, isActivelyEditingFormula, sheet.cells, setActiveCellAndSelection]);

  const stopCellEditing = useCallback(() => {
    setEditingCell(null);
>>>>>>> 3cd4ffaa439f3afbedf88f6042b7b8f5a2da87f2
  }, []);

  const handleGridMouseUp = useCallback(() => {
    isMouseDownRef.current = false;
    if (isActivelyEditingFormula && formulaBarApiRef.current) {
        formulaBarApiRef.current.focus();
<<<<<<< HEAD
    }
  }, [isActivelyEditingFormula, formulaBarApiRef]);

  const handleCellInputBlur = useCallback(() => { // Called by Cell on blur
    isCellCurrentlyEditingRef.current = false;
    // Don't call stopCellEditing here as Cell's blur handler does it.
    // Ensure grid re-focuses for keyboard nav
    setTimeout(() => gridRef.current?.focus(), 0);
  }, []);

  const handleCellInputKeyDown = useCallback((e: ReactKeyboardEvent<HTMLInputElement>, cellAddr: CellAddress) => {
    // This function will be called by the Cell's input onKeyDown
    // It allows the Grid to take over navigation keys like Enter, Tab, Arrows
    if (e.key === 'Enter' || e.key === 'Tab') {
      e.preventDefault();
      (e.target as HTMLInputElement).blur(); // Commit change
      // Navigation will be handled by Grid's main keydown handler after blur
      const nextRow = e.key === 'Enter' ? cellAddr.rowIndex + 1 : cellAddr.rowIndex;
      const nextCol = e.key === 'Tab' ? (e.shiftKey ? cellAddr.colIndex -1 : cellAddr.colIndex + 1) : cellAddr.colIndex;
      
      // After blur, schedule the focus move.
      setTimeout(() => navigateToCell(nextRow, nextCol, e.shiftKey && e.key === 'Tab'), 0);
    }
    // Escape is handled within Cell.tsx's input to revert and blur
  }, [sheet.id, sheet.rowCount, sheet.columnCount, setActiveCellAndSelection]);


  const navigateToCell = useCallback((rowIndex: number, colIndex: number, isShiftTab: boolean = false) => {
    let newRow = rowIndex;
    let newCol = colIndex;

    if (isShiftTab) { // Tab with Shift (move left, wrap to prev row)
        newCol--;
        if (newCol < 0) {
            newCol = sheet.columnCount - 1;
            newRow = Math.max(0, newRow - 1);
        }
    } else { // Enter (move down) or Tab (move right, wrap to next row)
        if (newCol >= sheet.columnCount) {
            newCol = 0;
            newRow = Math.min(sheet.rowCount - 1, newRow + 1);
        }
    }
    newRow = Math.max(0, Math.min(sheet.rowCount - 1, newRow));
    newCol = Math.max(0, Math.min(sheet.columnCount - 1, newCol));

    setActiveCellAndSelection({ sheetId: sheet.id, rowIndex: newRow, colIndex: newCol }, false, false);
    // Ensure the new active cell is scrolled into view if needed (browser might do this)
    // And set it to edit if it was an Enter/Tab from edit
    // setTimeout(() => startCellEditing({ sheetId: sheet.id, rowIndex: newRow, colIndex: newCol }), 0); // Optionally start editing next cell
  }, [sheet.id, sheet.rowCount, sheet.columnCount, setActiveCellAndSelection]);


  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if (isCellCurrentlyEditingRef.current || isActivelyEditingFormula) return; // Let cell input or formula bar handle keys

        const currentActive = activeCellRef.current;
        if (!currentActive || currentActive.sheetId !== sheet.id) return;

        let newRow = currentActive.rowIndex;
        let newCol = currentActive.colIndex;
        let shiftKey = e.shiftKey;

        switch (e.key) {
            case 'ArrowUp':
                e.preventDefault();
                newRow = Math.max(0, currentActive.rowIndex - 1);
                setActiveCellAndSelection({ sheetId: sheet.id, rowIndex: newRow, colIndex: currentActive.colIndex }, shiftKey, false);
                break;
            case 'ArrowDown':
                e.preventDefault();
                newRow = Math.min(sheet.rowCount - 1, currentActive.rowIndex + 1);
                setActiveCellAndSelection({ sheetId: sheet.id, rowIndex: newRow, colIndex: currentActive.colIndex }, shiftKey, false);
                break;
            case 'ArrowLeft':
                e.preventDefault();
                newCol = Math.max(0, currentActive.colIndex - 1);
                setActiveCellAndSelection({ sheetId: sheet.id, rowIndex: currentActive.rowIndex, colIndex: newCol }, shiftKey, false);
                break;
            case 'ArrowRight':
                e.preventDefault();
                newCol = Math.min(sheet.columnCount - 1, currentActive.colIndex + 1);
                setActiveCellAndSelection({ sheetId: sheet.id, rowIndex: currentActive.rowIndex, colIndex: newCol }, shiftKey, false);
                break;
            case 'Enter':
                e.preventDefault();
                newRow = Math.min(sheet.rowCount - 1, currentActive.rowIndex + 1);
                setActiveCellAndSelection({ sheetId: sheet.id, rowIndex: newRow, colIndex: currentActive.colIndex }, false, false);
                // Optionally start editing: setTimeout(() => startCellEditing({ sheetId: sheet.id, rowIndex: newRow, colIndex: currentActive.colIndex }),0);
                break;
            case 'Tab':
                e.preventDefault();
                if (shiftKey) {
                    newCol = currentActive.colIndex - 1;
                    if (newCol < 0) {
                        newCol = sheet.columnCount - 1;
                        newRow = Math.max(0, currentActive.rowIndex - 1);
                    }
                } else {
                    newCol = currentActive.colIndex + 1;
                    if (newCol >= sheet.columnCount) {
                        newCol = 0;
                        newRow = Math.min(sheet.rowCount - 1, currentActive.rowIndex + 1);
                    }
                }
                setActiveCellAndSelection({ sheetId: sheet.id, rowIndex: newRow, colIndex: newCol }, false, false);
                break;
            case 'F2':
                e.preventDefault();
                startCellEditing(currentActive);
                break;
            case 'Escape':
                if (selectionRange && (selectionRange.start.rowIndex !== selectionRange.end.rowIndex || selectionRange.start.colIndex !== selectionRange.end.colIndex)) {
                    setActiveCellAndSelection(currentActive, false, false); // Collapse selection to active cell
                }
                // Further escape logic (e.g. clear activeCell) could be added.
                break;
            default:
                // Alphanumeric or symbol: start editing with this char
                if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
                    // Prevent default if it's a character that would normally type in a focused element
                    // This needs to be careful not to block shortcuts like Ctrl+C
                     if (document.activeElement === gridRef.current) { // Only if grid itself has focus
                        e.preventDefault();
                        startCellEditing(currentActive, e.key);
                     }
                }
                break;
        }
    };
    const currentGridRef = gridRef.current;
    currentGridRef?.addEventListener('keydown', handleKeyDown);
    return () => {
        currentGridRef?.removeEventListener('keydown', handleKeyDown);
    };
  }, [sheet.id, sheet.rowCount, sheet.columnCount, setActiveCellAndSelection, startCellEditing, selectionRange, isActivelyEditingFormula]);


=======
      // Keep formulaSelectionStartCellRef and currentFormulaDragRangeStringRef for potential further edits.
      // They get cleared if formula mode ends (e.g., on Enter/Escape in formula bar).
    }
  }, [isActivelyEditingFormula, formulaBarApiRef]);

>>>>>>> 3cd4ffaa439f3afbedf88f6042b7b8f5a2da87f2
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (resizingColumn) {
        const newWidth = Math.max(20, resizingColumn.initialWidth + (e.clientX - resizingColumn.startX));
<<<<<<< HEAD
        if (gridRef.current) {
            // For visual feedback during resize, could update style of header directly
=======
        // Live update: For smooth resize, update a temporary width here and apply on mouseup,
        // or directly call updateColumnWidth but be mindful of performance.
        // For now, we update on mouse up.
        if (gridRef.current) { // To change cursor style
            const colHeaderCells = gridRef.current.querySelectorAll('table > thead > tr > th');
            if(colHeaderCells[resizingColumn.index + 1]) { // +1 because of row number header
                 // (colHeaderCells[resizingColumn.index + 1] as HTMLElement).style.width = `${newWidth}px`;
            }
>>>>>>> 3cd4ffaa439f3afbedf88f6042b7b8f5a2da87f2
        }
      }
      if (resizingRow) {
        const newHeight = Math.max(20, resizingRow.initialHeight + (e.clientY - resizingRow.startY));
<<<<<<< HEAD
      }
    };

    const handleGlobalMouseUpForResize = (e: MouseEvent) => {
      if (resizingColumn && spreadsheet) {
        const finalWidth = Math.max(20, resizingColumn.initialWidth + (e.clientX - resizingColumn.startX));
        updateColumnWidth(sheet.id, resizingColumn.index, finalWidth);
      }
      if (resizingRow && spreadsheet) {
         const finalHeight = Math.max(20, resizingRow.initialHeight + (e.clientY - resizingRow.startY));
=======
        // Live update row height similarly
      }
    };

    const handleGlobalMouseUpForResize = () => {
      if (resizingColumn && spreadsheet) {
        const finalWidth = Math.max(20, resizingColumn.initialWidth + ((event as MouseEvent).clientX - resizingColumn.startX));
        updateColumnWidth(sheet.id, resizingColumn.index, finalWidth);
      }
      if (resizingRow && spreadsheet) {
         const finalHeight = Math.max(20, resizingRow.initialHeight + ((event as MouseEvent).clientY - resizingRow.startY));
>>>>>>> 3cd4ffaa439f3afbedf88f6042b7b8f5a2da87f2
        updateRowHeight(sheet.id, resizingRow.index, finalHeight);
      }
      setResizingColumn(null);
      setResizingRow(null);
      if (document.body.style.cursor !== 'default') document.body.style.cursor = 'default';
<<<<<<< HEAD
      // if (isMouseDownRef.current) handleGridMouseUp(); // Call grid mouse up if drag was for resize
=======
      handleGridMouseUp();
>>>>>>> 3cd4ffaa439f3afbedf88f6042b7b8f5a2da87f2
    };

    document.addEventListener('mousemove', handleGlobalMouseMove);
    document.addEventListener('mouseup', handleGlobalMouseUpForResize);
    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUpForResize);
    };
<<<<<<< HEAD
  }, [resizingColumn, resizingRow, sheet.id, updateColumnWidth, updateRowHeight, spreadsheet]);
=======
  }, [resizingColumn, resizingRow, sheet.id, updateColumnWidth, updateRowHeight, handleGridMouseUp, spreadsheet]);
>>>>>>> 3cd4ffaa439f3afbedf88f6042b7b8f5a2da87f2


  const handleColumnHeaderMouseDown = (colIndex: number, e: ReactMouseEvent<HTMLTableCellElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    if (rect.right - e.clientX < resizerTolerance && e.clientX > rect.left + resizerTolerance) {
      e.preventDefault();
      setResizingColumn({
        index: colIndex,
        startX: e.clientX,
        initialWidth: columnWidths[colIndex] || DEFAULT_COLUMN_WIDTH,
      });
      document.body.style.cursor = 'col-resize';
    }
  };
  const handleRowHeaderMouseDown = (rowIndex: number, e: ReactMouseEvent<HTMLTableCellElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
     if (rect.bottom - e.clientY < resizerTolerance && e.clientY > rect.top + resizerTolerance) {
        e.preventDefault();
        setResizingRow({
            index: rowIndex,
            startY: e.clientY,
            initialHeight: rowHeights[rowIndex] || DEFAULT_ROW_HEIGHT,
        });
        document.body.style.cursor = 'row-resize';
    }
  };
    const handleColumnHeaderMouseMove = (e: ReactMouseEvent<HTMLTableCellElement>) => {
        if (resizingColumn || resizingRow) return;
        const rect = e.currentTarget.getBoundingClientRect();
        if (rect.right - e.clientX < resizerTolerance && e.clientX > rect.left + resizerTolerance) {
            e.currentTarget.style.cursor = 'col-resize';
        } else {
            e.currentTarget.style.cursor = 'default';
        }
    };
    const handleRowHeaderMouseMove = (e: ReactMouseEvent<HTMLTableCellElement>) => {
        if (resizingColumn || resizingRow) return;
        const rect = e.currentTarget.getBoundingClientRect();
        if (rect.bottom - e.clientY < resizerTolerance && e.clientY > rect.top + resizerTolerance) {
            e.currentTarget.style.cursor = 'row-resize';
        } else {
            e.currentTarget.style.cursor = 'default';
        }
    };
    const handleHeaderMouseLeave = (e: ReactMouseEvent<HTMLTableCellElement>) => {
        if (!resizingColumn && !resizingRow) {
            e.currentTarget.style.cursor = 'default';
        }
    };


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
<<<<<<< HEAD
      // If currently editing a cell and click happens outside the grid, blur the cell input
      if (gridRef.current && !gridRef.current.contains(event.target as Node) && editingCellAddress) {
           const activeInputElement = document.querySelector(`td[data-cell-id="${getCellIdUtil(editingCellAddress.rowIndex, editingCellAddress.colIndex)}"] input`) as HTMLInputElement;
           activeInputElement?.blur(); // This will trigger stopCellEditing via onCellInputBlur
=======
      if (gridRef.current && !gridRef.current.contains(event.target as Node) && editingCell) {
          const activeInputElement = document.querySelector(`td[data-cell-id="${getCellIdUtil(editingCell.rowIndex, editingCell.colIndex)}"] input`) as HTMLInputElement;
          activeInputElement?.blur(); 
>>>>>>> 3cd4ffaa439f3afbedf88f6042b7b8f5a2da87f2
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
<<<<<<< HEAD
  }, [editingCellAddress]);
=======
  }, [editingCell]); 
>>>>>>> 3cd4ffaa439f3afbedf88f6042b7b8f5a2da87f2

  useEffect(() => {
    if (!isActivelyEditingFormula) {
      setFormulaHighlightRange(null);
<<<<<<< HEAD
      currentFormulaDragRangeStringRef.current = null;
=======
      currentFormulaDragRangeStringRef.current = null; 
>>>>>>> 3cd4ffaa439f3afbedf88f6042b7b8f5a2da87f2
      formulaSelectionStartCellRef.current = null;
    }
  }, [isActivelyEditingFormula]);


  const columnWidths = sheet.columnWidths || Array(sheet.columnCount).fill(DEFAULT_COLUMN_WIDTH);
  const rowHeights = sheet.rowHeights || Array(sheet.rowCount).fill(DEFAULT_ROW_HEIGHT);

  const isCellInSelection = useCallback((rowIndex: number, colIndex: number): boolean => {
    if (!selectionRange || selectionRange.start.sheetId !== sheet.id || selectionRange.end.sheetId !== sheet.id) return false;
    return isCellAddressInRange({sheetId: sheet.id, rowIndex, colIndex}, selectionRange);
  }, [selectionRange, sheet.id]);

  const isCellInFormulaHighlight = useCallback((rowIndex: number, colIndex: number): boolean => {
    if (!isActivelyEditingFormula || !formulaHighlightRange || formulaHighlightRange.start.sheetId !== sheet.id) return false;
    return isCellAddressInRange({sheetId: sheet.id, rowIndex, colIndex}, formulaHighlightRange);
  }, [isActivelyEditingFormula, formulaHighlightRange, sheet.id]);
<<<<<<< HEAD

=======
  
>>>>>>> 3cd4ffaa439f3afbedf88f6042b7b8f5a2da87f2
  if (!sheet || !sheet.cells || sheet.cells.length === 0) {
    return <div className="p-4">Loading sheet data or sheet is empty...</div>;
  }

<<<<<<< HEAD
  const renderedCells = new Set<string>();

  return (
    <div
      className="h-full w-full p-1 bg-muted/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md"
      tabIndex={0} // Make grid container focusable
      ref={gridRef}
      onMouseDownCapture={(e) => { // Capture to ensure grid gets focus before cell mousedown
        isMouseDownRef.current = true;
        if(document.activeElement !== gridRef.current && !isCellCurrentlyEditingRef.current && !isActivelyEditingFormula){
          gridRef.current?.focus();
        }
      }}
      onMouseUp={handleGridMouseUp}
      onMouseLeave={() => { if(isMouseDownRef.current) handleGridMouseUp(); }}
    >
        <Table
          className="min-w-full border-collapse table-fixed select-none"
          style={{ '--default-cell-width': `${DEFAULT_COLUMN_WIDTH}px`, '--default-row-height': `${DEFAULT_ROW_HEIGHT}px` } as React.CSSProperties}
        >
          <TableHeader className="sticky top-0 bg-card z-20 shadow-sm print:bg-white">
            <TableRow>
              <TableHead
=======
  const renderedCells = new Set<string>(); // To track cells already rendered due to colSpan/rowSpan

  return (
    <ScrollArea 
      className="h-full w-full p-1 bg-muted/20 focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 rounded-md" 
      tabIndex={-1} 
      ref={gridRef}
    >
        <Table 
          className="min-w-full border-collapse table-fixed select-none"
          style={{ '--default-cell-width': `${DEFAULT_COLUMN_WIDTH}px`, '--default-row-height': `${DEFAULT_ROW_HEIGHT}px` } as React.CSSProperties}
          onMouseDown={() => { isMouseDownRef.current = true; }}
          onMouseUp={handleGridMouseUp} // Added mouseup on table as well
          onMouseLeave={() => { if(isMouseDownRef.current) handleGridMouseUp(); }} // If mouse leaves grid while down
        >
          <TableHeader className="sticky top-0 bg-card z-20 shadow-sm print:bg-white">
            <TableRow>
              <TableHead 
>>>>>>> 3cd4ffaa439f3afbedf88f6042b7b8f5a2da87f2
                className="w-12 min-w-[3rem] p-0 text-center border sticky left-0 bg-card z-30 select-none print:bg-white"
                style={{ width: '3rem', minWidth: '3rem', height: `${DEFAULT_ROW_HEIGHT}px` }}
              >
              </TableHead>
              {Array.from({ length: sheet.columnCount }).map((_, colIndex) => (
<<<<<<< HEAD
                <TableHead
                    key={`header-${colIndex}`}
                    className="p-0 text-center border select-none print:bg-white relative"
                    style={{
                        width: `${columnWidths[colIndex] || DEFAULT_COLUMN_WIDTH}px`,
=======
                <TableHead 
                    key={`header-${colIndex}`} 
                    className="p-0 text-center border select-none print:bg-white relative"
                    style={{ 
                        width: `${columnWidths[colIndex] || DEFAULT_COLUMN_WIDTH}px`, 
>>>>>>> 3cd4ffaa439f3afbedf88f6042b7b8f5a2da87f2
                        minWidth: `${columnWidths[colIndex] || DEFAULT_COLUMN_WIDTH}px`,
                        height: `${DEFAULT_ROW_HEIGHT}px`
                    }}
                    onMouseDown={(e) => handleColumnHeaderMouseDown(colIndex, e)}
                    onMouseMove={handleColumnHeaderMouseMove}
                    onMouseLeave={handleHeaderMouseLeave}
                >
                  {getColumnName(colIndex)}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: sheet.rowCount }).map((_, rowIndex) => (
              <TableRow key={`row-${rowIndex}`} style={{ height: `${rowHeights[rowIndex] || DEFAULT_ROW_HEIGHT}px` }}>
<<<<<<< HEAD
                <TableHead
=======
                <TableHead 
>>>>>>> 3cd4ffaa439f3afbedf88f6042b7b8f5a2da87f2
                    className="w-12 min-w-[3rem] p-0 text-center border sticky left-0 bg-card z-10 select-none print:bg-white relative"
                    style={{ width: '3rem', minWidth: '3rem', height: `${rowHeights[rowIndex] || DEFAULT_ROW_HEIGHT}px` }}
                    onMouseDown={(e) => handleRowHeaderMouseDown(rowIndex, e)}
                    onMouseMove={handleRowHeaderMouseMove}
                    onMouseLeave={handleHeaderMouseLeave}
                >
                  {rowIndex + 1}
                </TableHead>
                {Array.from({ length: sheet.columnCount }).map((_, colIndex) => {
                  if (renderedCells.has(`${rowIndex}-${colIndex}`)) {
<<<<<<< HEAD
                      return null;
                  }
                  const cellData = sheet.cells[rowIndex]?.[colIndex];
                  if (!cellData) {
=======
                      return null; // This cell is covered by a previous cell's colSpan/rowSpan
                  }
                  const cellData = sheet.cells[rowIndex]?.[colIndex];
                  if (!cellData) { // Should not happen if sheet.cells is well-formed
>>>>>>> 3cd4ffaa439f3afbedf88f6042b7b8f5a2da87f2
                     return <TableCell key={`${rowIndex}-${colIndex}`} className="border p-0" style={{width: `${columnWidths[colIndex] || DEFAULT_COLUMN_WIDTH}px`}} />;
                  }

                  const currentCellAddress: CellAddress = { sheetId: sheet.id, rowIndex, colIndex };
                  const isCurrentActive = !isActivelyEditingFormula && activeCell?.sheetId === sheet.id && activeCell.rowIndex === rowIndex && activeCell.colIndex === colIndex;
<<<<<<< HEAD
                  const isEditingThis = !isActivelyEditingFormula && editingCellAddress?.sheetId === sheet.id && editingCellAddress.rowIndex === rowIndex && editingCellAddress.colIndex === colIndex;

=======
                  const isEditingThis = !isActivelyEditingFormula && editingCell?.sheetId === sheet.id && editingCell.rowIndex === rowIndex && editingCell.colIndex === colIndex;
                  
>>>>>>> 3cd4ffaa439f3afbedf88f6042b7b8f5a2da87f2
                  let cellColSpan = cellData.colSpan || 1;
                  let cellRowSpan = cellData.rowSpan || 1;
                  let isActuallyMergedSub = cellData.isMerged || false;

                  if (cellColSpan > 1 || cellRowSpan > 1) {
                      for (let r = rowIndex; r < rowIndex + cellRowSpan; r++) {
                          for (let c = colIndex; c < colIndex + cellColSpan; c++) {
                              if (r === rowIndex && c === colIndex) continue;
                              renderedCells.add(`${r}-${c}`);
                          }
                      }
                  }
<<<<<<< HEAD

                  return (
                    <Cell
                      key={cellData.id || `${rowIndex}-${colIndex}`}
=======
                  
                  return (
                    <Cell
                      key={cellData.id || `${rowIndex}-${colIndex}`} 
>>>>>>> 3cd4ffaa439f3afbedf88f6042b7b8f5a2da87f2
                      cellData={cellData}
                      address={currentCellAddress}
                      onCellChange={handleCellChange}
                      isActive={isCurrentActive}
                      isInSelectionRange={!isActivelyEditingFormula && isCellInSelection(rowIndex, colIndex)}
                      isFormulaHighlightTarget={isCellInFormulaHighlight(rowIndex, colIndex)}
                      onSelect={handleCellSelect}
                      startEditing={startCellEditing}
                      stopEditing={stopCellEditing}
                      isEditingThisCell={isEditingThis}
                      width={columnWidths[colIndex] || DEFAULT_COLUMN_WIDTH}
                      height={rowHeights[rowIndex] || DEFAULT_ROW_HEIGHT}
                      isActivelyEditingFormulaGlobal={isActivelyEditingFormula}
                      conditionalFormatRules={sheet.conditionalFormatRules}
                      rowSpan={cellRowSpan}
                      colSpan={cellColSpan}
                      isActuallyMergedSubCell={isActuallyMergedSub}
<<<<<<< HEAD
                      onCellInputBlur={handleCellInputBlur}
                      onCellInputKeyDown={handleCellInputKeyDown}
=======
>>>>>>> 3cd4ffaa439f3afbedf88f6042b7b8f5a2da87f2
                    />
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
<<<<<<< HEAD
      <div className="h-4"></div>
    </div>
=======
      <div className="h-4"></div> 
    </ScrollArea>
>>>>>>> 3cd4ffaa439f3afbedf88f6042b7b8f5a2da87f2
  );
}

interface GridProps {
  sheet: SheetData;
}

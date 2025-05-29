
"use client";

import type { MouseEvent as ReactMouseEvent, WheelEvent } from 'react';
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
  
  const startId = getCellIdUtil(minR, minC);
  const endId = getCellIdUtil(maxR, maxC);

  return startId === endId ? startId : `${startId}:${endId}`;
}


export default function Grid({ sheet }: GridProps) {
  const { 
    spreadsheet, 
    updateCell, 
    activeCell, 
    selectionRange, 
    setActiveCellAndSelection,
    isActivelyEditingFormula,
    formulaBarApiRef,
    updateColumnWidth,
    updateRowHeight,
  } = useSpreadsheet();
  
  const [editingCell, setEditingCell] = useState<CellAddress | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const isMouseDownRef = useRef(false); 

  const formulaSelectionStartCellRef = useRef<CellAddress | null>(null);
  const currentFormulaDragRangeStringRef = useRef<string | null>(null); 
  const [formulaHighlightRange, setFormulaHighlightRange] = useState<SelectionRange | null>(null);

  const [resizingColumn, setResizingColumn] = useState<{ index: number; startX: number; initialWidth: number } | null>(null);
  const [resizingRow, setResizingRow] = useState<{ index: number; startY: number; initialHeight: number } | null>(null);
  const resizerTolerance = 5;


  const handleCellChange = useCallback((rowIndex: number, colIndex: number, rawValue: string | number) => {
    updateCell(sheet.id, rowIndex, colIndex, { rawValue });
  },[updateCell, sheet.id]);


  const handleCellSelect = useCallback((address: CellAddress, isShiftKey: boolean, isDrag: boolean) => {
    if (formulaBarApiRef.current && isActivelyEditingFormula) {
        const newCellId = getCellIdUtil(address.rowIndex, address.colIndex);

        if (isDrag) { 
            if (!formulaSelectionStartCellRef.current) { 
                formulaSelectionStartCellRef.current = address;
                currentFormulaDragRangeStringRef.current = newCellId;
                formulaBarApiRef.current.appendText(newCellId); 
                setFormulaHighlightRange({ start: address, end: address });
            } else { 
                const newRangeString = makeRangeString(formulaSelectionStartCellRef.current, address);
                const currentFullFormula = formulaBarApiRef.current.getValue();
                const oldRangeToken = currentFormulaDragRangeStringRef.current;

                // More robust replacement: look for the specific old token, even if not exactly at the end.
                // This regex tries to find the last cell/range reference that might be the one we're dragging.
                const endsWithCellOrRangeRegex = /([A-Z]+[1-9]\d*(?::[A-Z]+[1-9]\d*)?)$/;
                const formulaEndsWithMatch = currentFullFormula.match(endsWithCellOrRangeRegex);

                if(oldRangeToken && currentFullFormula.endsWith(oldRangeToken)) {
                    const baseFormula = currentFullFormula.slice(0, -oldRangeToken.length);
                    formulaBarApiRef.current.setText(baseFormula + newRangeString);
                } else if (formulaEndsWithMatch && formulaEndsWithMatch[1] === oldRangeToken) {
                    const baseFormula = currentFullFormula.slice(0, -(oldRangeToken?.length || 0));
                    formulaBarApiRef.current.setText(baseFormula + newRangeString);
                } else {
                    // Fallback: if a clear replacement isn't obvious, append after ensuring an operator or comma.
                    const endsWithOperatorOrParenOrComma = /[+\-*/,(]$/.test(currentFullFormula);
                     if (endsWithOperatorOrParenOrComma || currentFullFormula === "=" || currentFullFormula.endsWith("(")) {
                        formulaBarApiRef.current.appendText(newRangeString);
                    } else {
                        // If user likely wants to replace, but we couldn't match, just append with a comma.
                        // This might need user correction but avoids breaking the formula too much.
                        // Or, better, if oldToken is set, it implies a previous selection was made.
                        if(oldRangeToken && currentFullFormula.includes(oldRangeToken)){
                             // This is tricky. If oldToken is in the middle, replacing is complex.
                             // For now, let's assume a simple append after comma if not ending.
                             formulaBarApiRef.current.appendText("," + newRangeString);
                        } else {
                           formulaBarApiRef.current.appendText(newRangeString);
                        }
                    }
                }
                currentFormulaDragRangeStringRef.current = newRangeString;
                setFormulaHighlightRange({ start: formulaSelectionStartCellRef.current, end: address });
            }
        } else { // Single click during formula editing
            const currentFullFormula = formulaBarApiRef.current.getValue();
            // Regex to check if formula ends with an operator, opening parenthesis, or comma
            const endsWithSeparator = /[+\-*/(,]$/.test(currentFullFormula);
            const isFormulaEmptyIsh = currentFullFormula === "=" || currentFullFormula === "";

            if (endsWithSeparator || isFormulaEmptyIsh || currentFullFormula.endsWith("(")) {
                formulaBarApiRef.current.appendText(newCellId);
            } else {
                 // If it ends with a cell/range, replace it.
                const endsWithCellOrRangeRegex = /([A-Z]+[1-9]\d*(?::[A-Z]+[1-9]\d*)?)$/;
                const formulaEndsWithMatch = currentFullFormula.match(endsWithCellOrRangeRegex);
                if (formulaEndsWithMatch) {
                    const oldToken = formulaEndsWithMatch[1];
                    const baseFormula = currentFullFormula.slice(0, -oldToken.length);
                    formulaBarApiRef.current.setText(baseFormula + newCellId);
                } else {
                    formulaBarApiRef.current.appendText(newCellId); // Default append
                }
            }
            
            formulaSelectionStartCellRef.current = address; 
            currentFormulaDragRangeStringRef.current = newCellId;
            setFormulaHighlightRange({ start: address, end: address });
        }
        formulaBarApiRef.current.focus();
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
    const cellData = sheet.cells[address.rowIndex]?.[address.colIndex];
    let masterAddress = address;
    if(cellData?.isMerged && cellData.mergeMaster){
        masterAddress = cellData.mergeMaster;
    }

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
  }, []);

  const handleGridMouseUp = useCallback(() => {
    isMouseDownRef.current = false;
    if (isActivelyEditingFormula && formulaBarApiRef.current) {
        formulaBarApiRef.current.focus();
      // Keep formulaSelectionStartCellRef and currentFormulaDragRangeStringRef for potential further edits.
      // They get cleared if formula mode ends (e.g., on Enter/Escape in formula bar).
    }
  }, [isActivelyEditingFormula, formulaBarApiRef]);

  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (resizingColumn) {
        const newWidth = Math.max(20, resizingColumn.initialWidth + (e.clientX - resizingColumn.startX));
        // Live update: For smooth resize, update a temporary width here and apply on mouseup,
        // or directly call updateColumnWidth but be mindful of performance.
        // For now, we update on mouse up.
        if (gridRef.current) { // To change cursor style
            const colHeaderCells = gridRef.current.querySelectorAll('table > thead > tr > th');
            if(colHeaderCells[resizingColumn.index + 1]) { // +1 because of row number header
                 // (colHeaderCells[resizingColumn.index + 1] as HTMLElement).style.width = `${newWidth}px`;
            }
        }
      }
      if (resizingRow) {
        const newHeight = Math.max(20, resizingRow.initialHeight + (e.clientY - resizingRow.startY));
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
        updateRowHeight(sheet.id, resizingRow.index, finalHeight);
      }
      setResizingColumn(null);
      setResizingRow(null);
      if (document.body.style.cursor !== 'default') document.body.style.cursor = 'default';
      handleGridMouseUp();
    };

    document.addEventListener('mousemove', handleGlobalMouseMove);
    document.addEventListener('mouseup', handleGlobalMouseUpForResize);
    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUpForResize);
    };
  }, [resizingColumn, resizingRow, sheet.id, updateColumnWidth, updateRowHeight, handleGridMouseUp, spreadsheet]);


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
      if (gridRef.current && !gridRef.current.contains(event.target as Node) && editingCell) {
          const activeInputElement = document.querySelector(`td[data-cell-id="${getCellIdUtil(editingCell.rowIndex, editingCell.colIndex)}"] input`) as HTMLInputElement;
          activeInputElement?.blur(); 
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [editingCell]); 

  useEffect(() => {
    if (!isActivelyEditingFormula) {
      setFormulaHighlightRange(null);
      currentFormulaDragRangeStringRef.current = null; 
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
  
  if (!sheet || !sheet.cells || sheet.cells.length === 0) {
    return <div className="p-4">Loading sheet data or sheet is empty...</div>;
  }

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
                className="w-12 min-w-[3rem] p-0 text-center border sticky left-0 bg-card z-30 select-none print:bg-white"
                style={{ width: '3rem', minWidth: '3rem', height: `${DEFAULT_ROW_HEIGHT}px` }}
              >
              </TableHead>
              {Array.from({ length: sheet.columnCount }).map((_, colIndex) => (
                <TableHead 
                    key={`header-${colIndex}`} 
                    className="p-0 text-center border select-none print:bg-white relative"
                    style={{ 
                        width: `${columnWidths[colIndex] || DEFAULT_COLUMN_WIDTH}px`, 
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
                <TableHead 
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
                      return null; // This cell is covered by a previous cell's colSpan/rowSpan
                  }
                  const cellData = sheet.cells[rowIndex]?.[colIndex];
                  if (!cellData) { // Should not happen if sheet.cells is well-formed
                     return <TableCell key={`${rowIndex}-${colIndex}`} className="border p-0" style={{width: `${columnWidths[colIndex] || DEFAULT_COLUMN_WIDTH}px`}} />;
                  }

                  const currentCellAddress: CellAddress = { sheetId: sheet.id, rowIndex, colIndex };
                  const isCurrentActive = !isActivelyEditingFormula && activeCell?.sheetId === sheet.id && activeCell.rowIndex === rowIndex && activeCell.colIndex === colIndex;
                  const isEditingThis = !isActivelyEditingFormula && editingCell?.sheetId === sheet.id && editingCell.rowIndex === rowIndex && editingCell.colIndex === colIndex;
                  
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
                  
                  return (
                    <Cell
                      key={cellData.id || `${rowIndex}-${colIndex}`} 
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
                    />
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      <div className="h-4"></div> 
    </ScrollArea>
  );
}

interface GridProps {
  sheet: SheetData;
}

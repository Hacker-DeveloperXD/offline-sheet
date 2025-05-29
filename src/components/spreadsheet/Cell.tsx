
"use client";

import type { FocusEvent, MouseEvent as ReactMouseEvent } from 'react';
import { useState, useEffect, useRef } from 'react';
import type { CellData, CellAddress, ConditionalFormatRule, SelectionRange } from '@/types/spreadsheet';
import { Input } from "@/components/ui/input";
import { cn } from '@/lib/utils';
import { getCellId as getCellIdUtil, isCellAddressInRange } from '@/types/spreadsheet';
import { useSpreadsheet } from '@/hooks/useSpreadsheet';


interface CellProps {
  cellData: CellData;
  address: CellAddress;
  onCellChange: (rowIndex: number, colIndex: number, rawValue: string | number) => void;
  isActive: boolean; 
  isInSelectionRange: boolean;
  isFormulaHighlightTarget: boolean;
  onSelect: (address: CellAddress, isShiftKey: boolean, isDrag: boolean) => void; 
  startEditing: (address: CellAddress) => void; 
  stopEditing: () => void;
  isEditingThisCell: boolean;
  width?: number;
  height?: number;
  isActivelyEditingFormulaGlobal?: boolean;
  conditionalFormatRules?: ConditionalFormatRule[];
  rowSpan?: number;
  colSpan?: number;
  isActuallyMergedSubCell?: boolean; // True if this cell is part of a merge but not the top-left
}


function getConditionalFormatClass(
    cellData: CellData,
    address: CellAddress,
    rules?: ConditionalFormatRule[],
    spreadsheet?: any // Pass full spreadsheet if needed for context, not used currently
): string | null {
    if (rules) {
        for (const rule of rules) {
            if (isCellAddressInRange(address, rule.range)) { // Updated to use new utility
                const cellValue = typeof cellData.value === 'number' ? cellData.value : parseFloat(String(cellData.value));
                let conditionMet = false;
                if (!isNaN(cellValue)) {
                    switch (rule.type) {
                        case 'greaterThan': conditionMet = cellValue > rule.value; break;
                        case 'lessThan': conditionMet = cellValue < rule.value; break;
                        case 'equalTo': conditionMet = cellValue === rule.value; break;
                    }
                }
                if (conditionMet) return `cf-${rule.styleKey}`;
            }
        }
    }
    return null;
}


export default function Cell({ 
  cellData, 
  address, 
  onCellChange, 
  isActive, 
  isInSelectionRange,
  isFormulaHighlightTarget,
  onSelect,
  startEditing,
  stopEditing,
  isEditingThisCell,
  width,
  height,
  isActivelyEditingFormulaGlobal,
  conditionalFormatRules,
  rowSpan = 1,
  colSpan = 1,
  isActuallyMergedSubCell = false,
}: CellProps) {
  const [editValue, setEditValue] = useState(cellData.rawValue || '');
  const inputRef = useRef<HTMLInputElement>(null);
  const { spreadsheet } = useSpreadsheet();


  useEffect(() => {
    if (!isEditingThisCell) {
      setEditValue(cellData.rawValue?.toString() || '');
    }
  }, [cellData.rawValue, isEditingThisCell]);

  useEffect(() => {
    if (isEditingThisCell && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.selectionStart = inputRef.current.selectionEnd = inputRef.current.value.length;
    }
  }, [isEditingThisCell]);
  
  const handleMouseDown = (e: ReactMouseEvent<HTMLTableCellElement>) => {
    if (isEditingThisCell && inputRef.current && inputRef.current.contains(e.target as Node)) {
      return; 
    }
    onSelect(address, e.shiftKey, false); 
  };
  
  const handleClick = (e: ReactMouseEvent<HTMLTableCellElement>) => {
    if (isActivelyEditingFormulaGlobal) {
        e.preventDefault(); 
        return;
    }
    if (isEditingThisCell && inputRef.current && inputRef.current.contains(e.target as Node)) {
        return;
    }
    // For merged cells, editing should always start on the master cell.
    // The Grid component should ideally ensure that clicks on merged cells redirect to master for editing.
    // For now, if a subordinate merged cell is clicked for editing, it might be confusing.
    // The `startEditing` logic in Grid will ensure only the activeCell (which should be master) is editable.
    if (isActive && !isEditingThisCell) { // Single click on an already active cell starts editing
        startEditing(address);
    }
  };

  const handleDoubleClick = (e: ReactMouseEvent<HTMLTableCellElement>) => {
    if (isActivelyEditingFormulaGlobal) {
        e.preventDefault();
        return;
    }
    if (!isEditingThisCell) {
        startEditing(address);
    }
  };

  const handleMouseEnter = (e: ReactMouseEvent<HTMLTableCellElement>) => {
    if (e.buttons === 1 && !isActivelyEditingFormulaGlobal) { 
      onSelect(address, false, true); 
    } else if (e.buttons === 1 && isActivelyEditingFormulaGlobal) {
        // Formula drag selection logic is handled in Grid's onSelect
        onSelect(address, false, true); // Still call onSelect for formula highlighting
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditValue(e.target.value);
  };

  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    // Check if focus is moving to a formula bar button
     if (e.relatedTarget && (e.relatedTarget as HTMLElement).closest('.formula-bar-action-button')) {
        return; // Don't blur if focus is moving to a formula bar button
    }
    if (String(editValue) !== String(cellData.rawValue) || String(editValue).startsWith('=')) { 
      onCellChange(address.rowIndex, address.colIndex, editValue);
    }
    stopEditing(); 
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === 'Tab') {
      e.preventDefault(); 
      inputRef.current?.blur();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setEditValue(cellData.rawValue?.toString() || ''); 
      inputRef.current?.blur(); 
    }
  };

  const cellStyleFromData = cellData.style || {};
  const conditionalClass = getConditionalFormatClass(cellData, address, conditionalFormatRules, spreadsheet || undefined);

  const appliedStyle: React.CSSProperties = {
    fontWeight: cellStyleFromData.bold ? 'bold' : 'normal',
    fontStyle: cellStyleFromData.italic ? 'italic' : 'normal',
    textDecoration: cellStyleFromData.underline ? 'underline' : 'none',
    textAlign: cellStyleFromData.textAlign as React.CSSProperties['textAlign'],
    fontFamily: cellStyleFromData.fontFamily || 'inherit',
    fontSize: cellStyleFromData.fontSize || 'inherit',
    width: width ? `${width}px` : undefined,
    height: height ? `${height}px` : undefined,
  };

  const cellClasses = cn(
    "p-1.5 border text-sm truncate min-w-[var(--default-cell-width,120px)] relative select-none outline-none",
    "overflow-hidden whitespace-nowrap",
    {"font-bold": cellData.style?.bold},
    {"italic": cellData.style?.italic},
    {"underline": cellData.style?.underline},
    cellData.style?.textAlign === 'left' && "text-left",
    cellData.style?.textAlign === 'center' && "text-center",
    cellData.style?.textAlign === 'right' && "text-right",
    cellData.style?.hasBorder && "border-gray-400",
    isInSelectionRange && !isActive && !isActivelyEditingFormulaGlobal && "bg-primary/20", 
    isFormulaHighlightTarget && "bg-green-500/30 border-green-700 border-dashed !border-2 z-10", 
    conditionalClass,
    isActuallyMergedSubCell && "bg-muted/10 pointer-events-none", // Style for non-master merged cells
    // For merged cells, ensure text alignment from master cell style is respected
    (cellData.colSpan && cellData.colSpan > 1 || cellData.rowSpan && cellData.rowSpan > 1) && cellData.style?.textAlign === 'center' && "text-center items-center justify-center",
    (cellData.colSpan && cellData.colSpan > 1 || cellData.rowSpan && cellData.rowSpan > 1) && cellData.style?.textAlign === 'left' && "text-left items-start justify-start",
    (cellData.colSpan && cellData.colSpan > 1 || cellData.rowSpan && cellData.rowSpan > 1) && cellData.style?.textAlign === 'right' && "text-right items-end justify-end",
  );

  if (isActuallyMergedSubCell) {
    return (
      <td 
        className={cn(cellClasses, "border-transparent")} // Sub-cells might not need their own borders if master has it
        style={{...appliedStyle, minWidth: 0, minHeight: 0, width:0, height:0, padding:0, margin:0, overflow: 'hidden'}} // Effectively hide
        // No interaction for sub-cells of a merge
      />
    );
  }


  if (isEditingThisCell && !isActivelyEditingFormulaGlobal) { 
    return (
      <td 
        className={cn(cellClasses, "p-0 z-20", {"border-gray-400": cellData.style?.hasBorder})} 
        style={{...appliedStyle, minWidth: width ? `${width}px` : '120px', minHeight: height ? `${height}px` : '28px'}}
        onMouseDown={(e) => { 
            if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
                handleMouseDown(e);
            }
        }}
        onMouseEnter={handleMouseEnter}
        rowSpan={rowSpan}
        colSpan={colSpan}
      >
        {isActive && !isActivelyEditingFormulaGlobal && (
            <div className="absolute inset-[-1px] border-2 border-primary pointer-events-none rounded-[1px] z-30" />
        )}
        <Input
          ref={inputRef}
          type="text"
          value={editValue}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="w-full h-full p-1.5 box-border text-sm outline-none rounded-none border-transparent focus:ring-0 focus:border-transparent bg-background"
          style={{ 
            fontWeight: appliedStyle.fontWeight,
            fontStyle: appliedStyle.fontStyle,
            textDecoration: appliedStyle.textDecoration,
            textAlign: appliedStyle.textAlign,
            fontFamily: appliedStyle.fontFamily,
            fontSize: appliedStyle.fontSize,
            height: '100%',
          }}
          aria-label={`Edit cell ${getCellIdUtil(address.rowIndex, address.colIndex)}`}
        />
      </td>
    );
  }

  return (
    <td
      className={cellClasses}
      style={{...appliedStyle, minWidth: width ? `${width}px` : '120px', height: height ? `${height}px` : undefined}}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onMouseDown={handleMouseDown}
      onMouseEnter={handleMouseEnter}
      tabIndex={0} 
      aria-readonly={true} 
      data-cell-id={getCellIdUtil(address.rowIndex, address.colIndex)}
      rowSpan={rowSpan}
      colSpan={colSpan}
    >
      {isActive && !isActivelyEditingFormulaGlobal && (
          <div className="absolute inset-[-1px] border-2 border-primary pointer-events-none rounded-[1px] z-20" />
      )}
      {isFormulaHighlightTarget && !isActive && (
         <div className="absolute inset-[-1px] border-2 border-dashed border-green-700 pointer-events-none rounded-[1px] z-10" />
      )}
      {String(cellData.value ?? '')}
    </td>
  );
}

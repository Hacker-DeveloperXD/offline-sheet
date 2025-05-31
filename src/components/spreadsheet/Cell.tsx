
"use client";

<<<<<<< HEAD
import type { FocusEvent, MouseEvent as ReactMouseEvent, KeyboardEvent as ReactKeyboardEvent } from 'react';
import React, { useState, useEffect, useRef } from 'react'; // Import React for React.memo
import type { CellData, CellAddress, ConditionalFormatRule, SelectionRange, NumberFormatStyle } from '@/types/spreadsheet';
=======
import type { FocusEvent, MouseEvent as ReactMouseEvent } from 'react';
import { useState, useEffect, useRef } from 'react';
import type { CellData, CellAddress, ConditionalFormatRule, SelectionRange } from '@/types/spreadsheet';
>>>>>>> 3cd4ffaa439f3afbedf88f6042b7b8f5a2da87f2
import { Input } from "@/components/ui/input";
import { cn } from '@/lib/utils';
import { getCellId as getCellIdUtil, isCellAddressInRange } from '@/types/spreadsheet';
import { useSpreadsheet } from '@/hooks/useSpreadsheet';


interface CellProps {
  cellData: CellData;
  address: CellAddress;
<<<<<<< HEAD
  onCellChange: (rowIndex: number, colIndex: number, rawValue: string | number, typedChar?: string) => void;
  isActive: boolean;
  isInSelectionRange: boolean;
  isFormulaHighlightTarget: boolean;
  onSelect: (address: CellAddress, isShiftKey: boolean, isDrag: boolean) => void;
  startEditing: (address: CellAddress, initialValue?: string) => void;
=======
  onCellChange: (rowIndex: number, colIndex: number, rawValue: string | number) => void;
  isActive: boolean; 
  isInSelectionRange: boolean;
  isFormulaHighlightTarget: boolean;
  onSelect: (address: CellAddress, isShiftKey: boolean, isDrag: boolean) => void; 
  startEditing: (address: CellAddress) => void; 
>>>>>>> 3cd4ffaa439f3afbedf88f6042b7b8f5a2da87f2
  stopEditing: () => void;
  isEditingThisCell: boolean;
  width?: number;
  height?: number;
  isActivelyEditingFormulaGlobal?: boolean;
  conditionalFormatRules?: ConditionalFormatRule[];
  rowSpan?: number;
  colSpan?: number;
<<<<<<< HEAD
  isActuallyMergedSubCell?: boolean;
  onCellInputBlur: () => void;
  onCellInputKeyDown: (e: ReactKeyboardEvent<HTMLInputElement>, address: CellAddress) => void;
=======
  isActuallyMergedSubCell?: boolean; // True if this cell is part of a merge but not the top-left
>>>>>>> 3cd4ffaa439f3afbedf88f6042b7b8f5a2da87f2
}


function getConditionalFormatClass(
    cellData: CellData,
    address: CellAddress,
    rules?: ConditionalFormatRule[],
<<<<<<< HEAD
    // spreadsheet?: any // Spreadsheet not needed if we rely on cellData.value
): string | null {
    if (!rules || !cellData) return null;
    for (const rule of rules) {
        if (isCellAddressInRange(address, rule.range)) {
            // Ensure cellData.value is numeric for comparison
            const cellValueNumber = typeof cellData.value === 'number' ? cellData.value : parseFloat(String(cellData.value));
            let conditionMet = false;
            if (!isNaN(cellValueNumber)) {
                switch (rule.type) {
                    case 'greaterThan': conditionMet = cellValueNumber > rule.value; break;
                    case 'lessThan': conditionMet = cellValueNumber < rule.value; break;
                    case 'equalTo': conditionMet = cellValueNumber === rule.value; break;
                }
            }
            if (conditionMet) return `cf-${rule.styleKey}`;
=======
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
>>>>>>> 3cd4ffaa439f3afbedf88f6042b7b8f5a2da87f2
        }
    }
    return null;
}

<<<<<<< HEAD
function formatNumberForDisplay(value: number, format?: NumberFormatStyle): string {
  if (format === 'number_2dp') {
    return value.toFixed(2);
  }
  if (format === 'currency_usd_2dp') {
    return `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  if (format === 'percentage_0dp') {
    return `${(value * 100).toFixed(0)}%`;
  }
  // Default to general formatting, ensure it doesn't show excessive decimals for floats
  return Number(value.toPrecision(15)).toString(); // toPrecision to avoid floating point artifacts for display
}


function CellComponent({ // Renamed to CellComponent for React.memo
  cellData,
  address,
  onCellChange,
  isActive,
=======

export default function Cell({ 
  cellData, 
  address, 
  onCellChange, 
  isActive, 
>>>>>>> 3cd4ffaa439f3afbedf88f6042b7b8f5a2da87f2
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
<<<<<<< HEAD
  onCellInputBlur,
  onCellInputKeyDown,
}: CellProps) {
  const [editValue, setEditValue] = useState(cellData?.rawValue?.toString() || '');
  const inputRef = useRef<HTMLInputElement>(null);
  // const { spreadsheet } = useSpreadsheet(); // Potentially not needed if conditional formatting relies on cellData.value
=======
}: CellProps) {
  const [editValue, setEditValue] = useState(cellData.rawValue || '');
  const inputRef = useRef<HTMLInputElement>(null);
  const { spreadsheet } = useSpreadsheet();
>>>>>>> 3cd4ffaa439f3afbedf88f6042b7b8f5a2da87f2


  useEffect(() => {
    if (!isEditingThisCell) {
<<<<<<< HEAD
      // If not editing, ensure editValue reflects the latest rawValue from props
      setEditValue(cellData?.rawValue?.toString() || '');
    } else if (isEditingThisCell && cellData?.rawValue !== undefined && editValue !== cellData.rawValue.toString() && !isActivelyEditingFormulaGlobal) {
      // If cell becomes editing and its rawValue (from context/props) differs from local editValue
      // (e.g., due to programmatic edit start with an initial char that updated rawValue in context),
      // then sync local editValue to this new rawValue.
      setEditValue(cellData.rawValue.toString());
    }
  }, [cellData?.rawValue, isEditingThisCell, isActivelyEditingFormulaGlobal]); // Removed editValue from deps to avoid loop
=======
      setEditValue(cellData.rawValue?.toString() || '');
    }
  }, [cellData.rawValue, isEditingThisCell]);
>>>>>>> 3cd4ffaa439f3afbedf88f6042b7b8f5a2da87f2

  useEffect(() => {
    if (isEditingThisCell && inputRef.current) {
      inputRef.current.focus();
<<<<<<< HEAD
      // Select all text if editing was initiated by F2 or double-click (rawValue is usually same as editValue then)
      // Or, if initiated by typing, cursor should be at end (which is default for focus)
      const rawValStr = cellData?.rawValue?.toString() || '';
      if (rawValStr === inputRef.current.value && !inputRef.current.value.startsWith('=')) { // Also check not a formula to avoid selecting parts of it
         inputRef.current.select();
      } else {
        // For new input or formula editing, place cursor at the end
        inputRef.current.selectionStart = inputRef.current.selectionEnd = inputRef.current.value.length;
      }
    }
  }, [isEditingThisCell, cellData?.rawValue]); // cellData.rawValue added to re-run if it changes while editing starts

  const handleMouseDown = (e: ReactMouseEvent<HTMLTableCellElement>) => {
    if (isEditingThisCell && inputRef.current && inputRef.current.contains(e.target as Node)) {
      // Click inside the input while already editing this cell, do nothing here
      return;
    }
    onSelect(address, e.shiftKey, false); // isDrag is false on mousedown
  };

  const handleClick = (e: ReactMouseEvent<HTMLTableCellElement>) => {
    if (isActivelyEditingFormulaGlobal) { // If global formula editing mode (e.g. formula bar has focus)
        // Cell click should interact with formula bar, not start editing cell directly.
        // This logic is handled by onSelect when isActivelyEditingFormulaGlobal is true.
=======
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
>>>>>>> 3cd4ffaa439f3afbedf88f6042b7b8f5a2da87f2
        e.preventDefault(); 
        return;
    }
    if (isEditingThisCell && inputRef.current && inputRef.current.contains(e.target as Node)) {
<<<<<<< HEAD
        // Already editing this cell and click was inside input, do nothing.
        return;
    }
    // If cell is active but not editing, single click should start editing.
    // If cell is not active, onMouseDown already made it active, so this click makes it editing.
    if (!isEditingThisCell) { 
        startEditing(address, cellData?.rawValue?.toString());
=======
        return;
    }
    // For merged cells, editing should always start on the master cell.
    // The Grid component should ideally ensure that clicks on merged cells redirect to master for editing.
    // For now, if a subordinate merged cell is clicked for editing, it might be confusing.
    // The `startEditing` logic in Grid will ensure only the activeCell (which should be master) is editable.
    if (isActive && !isEditingThisCell) { // Single click on an already active cell starts editing
        startEditing(address);
>>>>>>> 3cd4ffaa439f3afbedf88f6042b7b8f5a2da87f2
    }
  };

  const handleDoubleClick = (e: ReactMouseEvent<HTMLTableCellElement>) => {
    if (isActivelyEditingFormulaGlobal) {
        e.preventDefault();
        return;
    }
    if (!isEditingThisCell) {
<<<<<<< HEAD
        startEditing(address, cellData?.rawValue?.toString());
=======
        startEditing(address);
>>>>>>> 3cd4ffaa439f3afbedf88f6042b7b8f5a2da87f2
    }
  };

  const handleMouseEnter = (e: ReactMouseEvent<HTMLTableCellElement>) => {
<<<<<<< HEAD
    // If left mouse button is pressed (e.buttons === 1)
    if (e.buttons === 1) { 
      // Allow selection drag whether in formula mode or not.
      // The onSelect handler in Grid.tsx will decide what to do based on isActivelyEditingFormulaGlobal.
      onSelect(address, false, true); // isDrag is true
=======
    if (e.buttons === 1 && !isActivelyEditingFormulaGlobal) { 
      onSelect(address, false, true); 
    } else if (e.buttons === 1 && isActivelyEditingFormulaGlobal) {
        // Formula drag selection logic is handled in Grid's onSelect
        onSelect(address, false, true); // Still call onSelect for formula highlighting
>>>>>>> 3cd4ffaa439f3afbedf88f6042b7b8f5a2da87f2
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditValue(e.target.value);
  };

  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
<<<<<<< HEAD
     // Prevent blur action if focus is moving to a formula bar button.
     // This is a common pattern to keep formula editing active.
     if (e.relatedTarget && (e.relatedTarget as HTMLElement).closest('.formula-bar-action-button')) {
        return;
    }
    // Only commit change if editValue differs from original rawValue, or if it's a formula
    if (String(editValue) !== String(cellData?.rawValue) || String(editValue).startsWith('=')) {
      onCellChange(address.rowIndex, address.colIndex, editValue);
    }
    stopEditing(); // Signal to Grid that editing is finished
    onCellInputBlur(); // Notify grid that input is blurred (for focus management)
  };

  const handleKeyDownInInput = (e: ReactKeyboardEvent<HTMLInputElement>) => {
    onCellInputKeyDown(e, address); // Forward to grid for navigation handling (Enter, Tab)
    // Cell-specific handling if needed (e.g., if grid doesn't preventDefault for Enter/Tab)
    if (e.key === 'Escape') {
      e.preventDefault();
      setEditValue(cellData?.rawValue?.toString() || ''); // Revert to original value
      inputRef.current?.blur(); // This will trigger stopEditing and onCellInputBlur
    }
  };

  if (!cellData) {
    return <td className="border p-1.5" style={{ width: width ? `${width}px` : undefined, height: height ? `${height}px` : undefined }} />;
  }


  const cellStyleFromData = cellData.style || {};
  const conditionalClass = getConditionalFormatClass(cellData, address, conditionalFormatRules);
=======
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
>>>>>>> 3cd4ffaa439f3afbedf88f6042b7b8f5a2da87f2

  const appliedStyle: React.CSSProperties = {
    fontWeight: cellStyleFromData.bold ? 'bold' : 'normal',
    fontStyle: cellStyleFromData.italic ? 'italic' : 'normal',
    textDecoration: cellStyleFromData.underline ? 'underline' : 'none',
    textAlign: cellStyleFromData.textAlign as React.CSSProperties['textAlign'],
    fontFamily: cellStyleFromData.fontFamily || 'inherit',
    fontSize: cellStyleFromData.fontSize || 'inherit',
    width: width ? `${width}px` : undefined,
    height: height ? `${height}px` : undefined,
<<<<<<< HEAD
    // Error background applied via class for consistency with Tailwind and HSL vars
=======
>>>>>>> 3cd4ffaa439f3afbedf88f6042b7b8f5a2da87f2
  };

  const cellClasses = cn(
    "p-1.5 border text-sm truncate min-w-[var(--default-cell-width,120px)] relative select-none outline-none",
<<<<<<< HEAD
    "overflow-hidden whitespace-nowrap", // Default is nowrap, truncate
    // Override whitespace for merged cells if they need to wrap, or if specific style is applied
    // (cellData.rowSpan && cellData.rowSpan > 1) && "whitespace-normal break-words", 
    {"font-bold": cellStyleFromData.bold},
    {"italic": cellStyleFromData.italic},
    {"underline": cellStyleFromData.underline},
    cellStyleFromData.textAlign === 'left' && "text-left",
    cellStyleFromData.textAlign === 'center' && "text-center",
    cellStyleFromData.textAlign === 'right' && "text-right",
    cellStyleFromData.hasBorder && "border-gray-400", // This could be more specific if needed
    isInSelectionRange && !isActive && !isActivelyEditingFormulaGlobal && "bg-primary/20", // General selection
    isFormulaHighlightTarget && "bg-green-500/30 border-green-700 !border-dashed !border-2 z-10", // Formula highlight
    conditionalClass,
    isActuallyMergedSubCell && "bg-muted/10 pointer-events-none", // Visually a sub-cell
    // Centering for merged cells (if master cell is centered)
    (cellData.colSpan && cellData.colSpan > 1 || cellData.rowSpan && cellData.rowSpan > 1) && cellStyleFromData.textAlign === 'center' && "flex items-center justify-center",
    (cellData.colSpan && cellData.colSpan > 1 || cellData.rowSpan && cellData.rowSpan > 1) && cellStyleFromData.textAlign === 'left' && "flex items-start justify-start",
    (cellData.colSpan && cellData.colSpan > 1 || cellData.rowSpan && cellData.rowSpan > 1) && cellStyleFromData.textAlign === 'right' && "flex items-end justify-end",
    cellStyleFromData.validationError && "cell-validation-error" // Class for data type validation error
=======
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
>>>>>>> 3cd4ffaa439f3afbedf88f6042b7b8f5a2da87f2
  );

  if (isActuallyMergedSubCell) {
    return (
<<<<<<< HEAD
      <td
        className={cn(cellClasses, "border-transparent")} // Sub-cells of a merge have transparent borders typically
        style={{...appliedStyle, minWidth: 0, minHeight: 0, width:0, height:0, padding:0, margin:0, overflow: 'hidden'}}
=======
      <td 
        className={cn(cellClasses, "border-transparent")} // Sub-cells might not need their own borders if master has it
        style={{...appliedStyle, minWidth: 0, minHeight: 0, width:0, height:0, padding:0, margin:0, overflow: 'hidden'}} // Effectively hide
        // No interaction for sub-cells of a merge
>>>>>>> 3cd4ffaa439f3afbedf88f6042b7b8f5a2da87f2
      />
    );
  }

<<<<<<< HEAD
  let displayValue = cellData.value;
  if (cellData.style?.validationError && cellData.style?.dataType === 'number') {
    displayValue = "#VALUE!"; // Standard error for data type mismatch
  } else if (typeof cellData.value === 'number' && cellData.style?.numberFormat && cellData.style.numberFormat !== 'general') {
    displayValue = formatNumberForDisplay(cellData.value, cellData.style.numberFormat);
  } else if (cellData.value === undefined || cellData.value === null) {
    displayValue = ''; // Display blank for undefined/null values
  }


  if (isEditingThisCell && !isActivelyEditingFormulaGlobal) {
    return (
      <td
        className={cn(cellClasses, "p-0 z-20", {"border-gray-400": cellData.style?.hasBorder})}
        style={{...appliedStyle, minWidth: width ? `${width}px` : '120px', minHeight: height ? `${height}px` : '28px'}}
        onMouseDown={(e) => { // Ensure mousedown on the TD (not input) still selects cell
            if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
                handleMouseDown(e); // Call original mousedown if outside input
            }
        }}
        onClick={(e) => { // Prevent click on TD from re-triggering edit if already editing
            if (inputRef.current && inputRef.current.contains(e.target as Node)) {
                return;
            }
            handleClick(e);
        }}
        onDoubleClick={handleDoubleClick} // Double click might be handled by input for selection
=======

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
>>>>>>> 3cd4ffaa439f3afbedf88f6042b7b8f5a2da87f2
        onMouseEnter={handleMouseEnter}
        rowSpan={rowSpan}
        colSpan={colSpan}
      >
<<<<<<< HEAD
        {/* Active cell border overlay */}
=======
>>>>>>> 3cd4ffaa439f3afbedf88f6042b7b8f5a2da87f2
        {isActive && !isActivelyEditingFormulaGlobal && (
            <div className="absolute inset-[-1px] border-2 border-primary pointer-events-none rounded-[1px] z-30" />
        )}
        <Input
          ref={inputRef}
          type="text"
          value={editValue}
          onChange={handleChange}
          onBlur={handleBlur}
<<<<<<< HEAD
          onKeyDown={handleKeyDownInInput}
          className="w-full h-full p-1.5 box-border text-sm outline-none rounded-none border-transparent focus:ring-0 focus:border-transparent bg-background"
          style={{ // Pass text styles to input
=======
          onKeyDown={handleKeyDown}
          className="w-full h-full p-1.5 box-border text-sm outline-none rounded-none border-transparent focus:ring-0 focus:border-transparent bg-background"
          style={{ 
>>>>>>> 3cd4ffaa439f3afbedf88f6042b7b8f5a2da87f2
            fontWeight: appliedStyle.fontWeight,
            fontStyle: appliedStyle.fontStyle,
            textDecoration: appliedStyle.textDecoration,
            textAlign: appliedStyle.textAlign,
            fontFamily: appliedStyle.fontFamily,
            fontSize: appliedStyle.fontSize,
<<<<<<< HEAD
            height: '100%', // Ensure input fills cell
=======
            height: '100%',
>>>>>>> 3cd4ffaa439f3afbedf88f6042b7b8f5a2da87f2
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
<<<<<<< HEAD
      tabIndex={-1} // Cells themselves are not directly focusable for keyboard nav, grid container is.
      aria-readonly={true} // Indicates cell is not directly editable until switched to edit mode
=======
      tabIndex={0} 
      aria-readonly={true} 
>>>>>>> 3cd4ffaa439f3afbedf88f6042b7b8f5a2da87f2
      data-cell-id={getCellIdUtil(address.rowIndex, address.colIndex)}
      rowSpan={rowSpan}
      colSpan={colSpan}
    >
<<<<<<< HEAD
      {/* Active cell border overlay - shown when cell is active but NOT in editing mode and NOT in global formula edit */}
      {isActive && !isEditingThisCell && !isActivelyEditingFormulaGlobal && (
          <div className="absolute inset-[-1px] border-2 border-primary pointer-events-none rounded-[1px] z-20" />
      )}
      {/* Formula highlight target overlay */}
      {isFormulaHighlightTarget && !isActive && ( // Show only if not also the active cell (active has its own stronger border)
         <div className="absolute inset-[-1px] border-2 border-dashed border-green-700 pointer-events-none rounded-[1px] z-10" />
      )}
      {String(displayValue ?? '')}
    </td>
  );
}

const Cell = React.memo(CellComponent);
export default Cell;
=======
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
>>>>>>> 3cd4ffaa439f3afbedf88f6042b7b8f5a2da87f2

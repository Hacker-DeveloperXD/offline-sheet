
"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useSpreadsheet } from "@/hooks/useSpreadsheet";
import type { FormulaBarApi } from '@/contexts/SpreadsheetContext';
import { getCellId } from '@/types/spreadsheet'; 
import { Check, XIcon, FunctionSquare } from 'lucide-react'; 

export default function FormulaBar() {
  const { 
    spreadsheet, 
    activeCell, 
    updateCell, 
    setIsActivelyEditingFormula,
    formulaBarApiRef,
    evaluateFormula // Get evaluateFormula from context for preview if needed
  } = useSpreadsheet(); 

  const [currentFormula, setCurrentFormula] = useState('');
  const [showConfirmCancel, setShowConfirmCancel] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Expose API to context
  useEffect(() => {
    if (formulaBarApiRef) { // Check if formulaBarApiRef itself is defined
      const api: FormulaBarApi = {
        appendText: (text) => {
          setCurrentFormula(prev => {
            const input = inputRef.current;
            if (input) {
                const start = input.selectionStart ?? prev.length; // Default to end if null
                const end = input.selectionEnd ?? prev.length;   // Default to end if null
                const newValue = prev.substring(0, start) + text + prev.substring(end);
                // Set timeout to allow React to re-render before setting selection
                // This ensures the input value is updated in the DOM first.
                setTimeout(() => {
                    input.focus(); // Re-focus just in case
                    input.selectionStart = input.selectionEnd = start + text.length;
                }, 0);
                return newValue;
            }
            return prev + text; // Fallback if input ref not available
          });
          if (!showConfirmCancel) setShowConfirmCancel(true);
        },
        replaceText: (oldTextSubString, newText) => {
             setCurrentFormula(prev => {
                // This is a simple replacement, primarily for live range updates.
                // It assumes oldTextSubString is likely at the end.
                if (prev.endsWith(oldTextSubString)) {
                     return prev.slice(0, -oldTextSubString.length) + newText;
                }
                // If not at the end, this simple version might not behave as expected for complex edits.
                // For now, if it's not at the end, we'll append. A more robust solution would require
                // knowledge of what specific token to replace if not simply the end.
                return prev + newText; 
             });
             if (!showConfirmCancel) setShowConfirmCancel(true);
        },
        setText: (text) => {
          setCurrentFormula(text);
          if (!showConfirmCancel && text !== (cellData?.rawValue?.toString() || '')) {
            setShowConfirmCancel(true);
          }
        },
        focus: () => {
          inputRef.current?.focus();
        },
        getValue: () => {
          // Prefer inputRef.current.value if available, as it's the most up-to-date during typing
          return inputRef.current?.value ?? currentFormula;
        }
      };
      formulaBarApiRef.current = api;
    }
    return () => {
        if (formulaBarApiRef) { // Check if formulaBarApiRef itself is defined
            formulaBarApiRef.current = null;
        }
    }
  }, [formulaBarApiRef, showConfirmCancel, currentFormula]); // Added currentFormula for getValue freshness, showConfirmCancel

  const activeSheet = spreadsheet?.sheets.find(s => s.id === spreadsheet.activeSheetId);
  const cellData = activeCell && activeSheet ? activeSheet.cells[activeCell.rowIndex]?.[activeCell.colIndex] : null;

  const { isActivelyEditingFormula: isFormulaContextEditing } = useSpreadsheet(); // Get read-only value

  useEffect(() => {
    if (!isFormulaContextEditing && cellData) {
      setCurrentFormula(cellData.rawValue?.toString() || '');
      setShowConfirmCancel(false); // Hide buttons if not editing formula and cell changes
    } else if (!isFormulaContextEditing && !activeCell) {
      setCurrentFormula('');
      setShowConfirmCancel(false);
    }
  }, [activeCell, cellData, spreadsheet?.activeSheetId, isFormulaContextEditing]);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentFormula(e.target.value);
    if (!showConfirmCancel) setShowConfirmCancel(true);
    if (e.target.value.startsWith('=')) { // If user types '=', enter formula editing mode
        setIsActivelyEditingFormula(true);
    }
  };

  const submitFormula = useCallback(() => {
    if (activeCell && spreadsheet && activeSheet) {
      // Use formulaBarApiRef.current.getValue() to get the most up-to-date value from the input
      const formulaToSubmit = formulaBarApiRef.current?.getValue() ?? currentFormula;
      updateCell(activeSheet.id, activeCell.rowIndex, activeCell.colIndex, { rawValue: formulaToSubmit });
    }
    setIsActivelyEditingFormula(false);
    setShowConfirmCancel(false);
  }, [activeCell, spreadsheet, activeSheet, updateCell, setIsActivelyEditingFormula, currentFormula, formulaBarApiRef]);

  const cancelEdit = useCallback(() => {
    if (cellData) {
      setCurrentFormula(cellData.rawValue?.toString() || '');
    } else {
      setCurrentFormula('');
    }
    setIsActivelyEditingFormula(false);
    setShowConfirmCancel(false);
    // Consider blurring the input or focusing the grid, depending on desired UX
  }, [cellData, setIsActivelyEditingFormula]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      submitFormula();
      // Focus might shift to grid or next cell after submit, handled by grid navigation later
    } else if (e.key === 'Escape') {
      e.preventDefault();
      cancelEdit();
      // inputRef.current?.blur(); // Blurring might be too aggressive, let user click away
    }
  }, [submitFormula, cancelEdit]);

  const handleFocus = useCallback(() => {
    // When formula bar is focused, always show confirm/cancel
    setShowConfirmCancel(true);
    // If the content starts with '=', ensure we are in formula editing mode
    if (inputRef.current?.value.startsWith('=')) {
      setIsActivelyEditingFormula(true);
    }
  }, [setIsActivelyEditingFormula]);
  
  const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    // Delay to allow click on confirm/cancel buttons to register
    setTimeout(() => {
      // Check if focus moved to a formula bar action button or if still in formula bar
      const activeEl = document.activeElement;
      if (activeEl !== inputRef.current && 
          !activeEl?.classList.contains('formula-bar-action-button') &&
          !e.relatedTarget?.classList.contains('formula-bar-action-button')) {
        // If blurred to something else, and confirm/cancel were visible (meaning an edit was in progress)
        if (showConfirmCancel) {
            // If value changed, submit, otherwise cancel (revert to original cell value)
            const currentValInBar = inputRef.current?.value ?? currentFormula;
            if (currentValInBar !== (cellData?.rawValue?.toString() || '')) {
                // submitFormula(); // Auto-submit on blur if changed - can be aggressive
                                 // For now, let's prefer explicit submit/cancel.
                                 // Or, if it starts with =, assume it's a formula to be kept.
                if (!currentValInBar.startsWith('=')) cancelEdit(); // if not a formula, and blurred, cancel if changed

            } else {
                 // No change, or was already equal. Treat as cancel to hide buttons.
                 cancelEdit();
            }
        }
        // Always set formula editing to false on blur if not to its own buttons
        setIsActivelyEditingFormula(false);
        // setShowConfirmCancel(false); // This is handled by cancelEdit or submitFormula
      }
    }, 0);
  }, [setIsActivelyEditingFormula, showConfirmCancel, currentFormula, cellData, submitFormula, cancelEdit]);


  const selectedCellName = activeCell && spreadsheet
    ? getCellId(activeCell.rowIndex, activeCell.colIndex)
    : ' '; 

  return (
    <div className="p-2 border-b bg-card flex items-center gap-2 shadow-sm print:hidden">
      <Input
        type="text"
        value={selectedCellName}
        readOnly
        className="w-20 h-10 text-sm text-center font-mono bg-muted border-r-0 rounded-r-none focus-visible:ring-0 focus-visible:ring-offset-0"
        aria-label="Selected cell name"
        tabIndex={-1}
      />
      
      {(showConfirmCancel || isFormulaContextEditing) && ( // Show if explicitly editing or formula context says so
         <>
            <Button variant="ghost" size="icon" onClick={cancelEdit} className="h-10 w-10 text-destructive formula-bar-action-button" aria-label="Cancel formula edit">
                <XIcon size={18}/>
            </Button>
            <Button variant="ghost" size="icon" onClick={submitFormula} className="h-10 w-10 text-green-600 formula-bar-action-button" aria-label="Confirm formula edit">
                <Check size={18}/>
            </Button>
         </>
      )}
      
      <Label htmlFor="formula-input" className="font-mono text-sm p-2 bg-muted/50 rounded-l-md border h-10 flex items-center"
        onClick={() => inputRef.current?.focus()} 
        title="Formula"
      >
        <FunctionSquare size={16} />
      </Label>
      <Input
        ref={inputRef}
        id="formula-input"
        type="text"
        placeholder={activeCell ? "Enter value or formula..." : "Select a cell to edit..."}
        value={currentFormula}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className="flex-grow h-10 rounded-l-none focus-visible:ring-inset"
        aria-label="Formula input bar"
        disabled={!spreadsheet} // Only truly disable if no spreadsheet is loaded at all.
                               // Allow typing even if no cell is active yet, if user wants to start formula first.
      />
    </div>
  );
}

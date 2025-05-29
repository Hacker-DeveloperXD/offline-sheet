
"use client";

import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSpreadsheet } from '@/hooks/useSpreadsheet';
import type { ConditionalFormatRule, SelectionRange, PredefinedStyleKey, CellAddress } from '@/types/spreadsheet';
import { getCellId } from '@/types/spreadsheet';

interface ConditionalFormattingDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  activeSheetId: string | undefined;
  selectionRange: SelectionRange | null; // To prefill range
}

const predefinedStyles: { key: PredefinedStyleKey; label: string }[] = [
  { key: 'lightRedFillDarkRedText', label: 'Light Red Fill with Dark Red Text' },
  { key: 'yellowFillDarkYellowText', label: 'Yellow Fill with Dark Yellow Text' },
  { key: 'greenFillDarkGreenText', label: 'Green Fill with Dark Green Text' },
];

function rangeToString(range: SelectionRange | null): string {
    if (!range) return "";
    const startId = getCellId(range.start.rowIndex, range.start.colIndex);
    const endId = getCellId(range.end.rowIndex, range.end.colIndex);
    return startId === endId ? startId : `${startId}:${endId}`;
}

function parseRangeString(rangeStr: string, currentSheetId: string): SelectionRange | null {
    const parts = rangeStr.split(':');
    const startAddrStr = parts[0];
    const endAddrStr = parts.length > 1 ? parts[1] : startAddrStr;

    const parseSingleCellId = (idStr: string): CellAddress | null => {
        const colMatch = idStr.match(/[A-Z]+/i);
        const rowMatch = idStr.match(/\d+/);
        if (!colMatch || !rowMatch) return null;
        
        let colIndex = 0;
        const colChars = colMatch[0].toUpperCase();
        for (let i = 0; i < colChars.length; i++) {
            colIndex = colIndex * 26 + (colChars.charCodeAt(i) - 64);
        }
        colIndex -=1;

        const rowIndex = parseInt(rowMatch[0], 10) - 1;
        if (isNaN(colIndex) || isNaN(rowIndex) || colIndex < 0 || rowIndex < 0) return null;
        return { sheetId: currentSheetId, rowIndex, colIndex };
    };

    const start = parseSingleCellId(startAddrStr);
    const end = parseSingleCellId(endAddrStr);

    if (start && end) {
        return { start, end };
    }
    return null;
}


export function ConditionalFormattingDialog({ 
    isOpen, 
    onOpenChange, 
    activeSheetId,
    selectionRange: initialSelectionRange 
}: ConditionalFormattingDialogProps) {
  const { addConditionalFormatRule, spreadsheet } = useSpreadsheet();
  
  const [ruleType, setRuleType] = useState<'greaterThan' | 'lessThan' | 'equalTo'>('greaterThan');
  const [comparisonValue, setComparisonValue] = useState('');
  const [styleKey, setStyleKey] = useState<PredefinedStyleKey>('lightRedFillDarkRedText');
  const [rangeStr, setRangeStr] = useState<string>(rangeToString(initialSelectionRange));
  const [error, setError] = useState<string>('');

  useEffect(() => {
    setRangeStr(rangeToString(initialSelectionRange)); // Update when dialog opens with new selection
  }, [initialSelectionRange, isOpen]);


  const handleSubmit = () => {
    setError('');
    if (!activeSheetId) {
      setError("No active sheet selected.");
      return;
    }
    const parsedRange = parseRangeString(rangeStr, activeSheetId);
    if (!parsedRange) {
      setError("Invalid range format. Use A1 or A1:B2.");
      return;
    }
    const numValue = parseFloat(comparisonValue);
    if (isNaN(numValue)) {
      setError("Comparison value must be a number.");
      return;
    }

    const newRule: ConditionalFormatRule = {
      id: uuidv4(),
      range: parsedRange,
      type: ruleType,
      value: numValue,
      styleKey: styleKey,
    };
    addConditionalFormatRule(activeSheetId, newRule);
    onOpenChange(false); // Close dialog
    // Reset form for next time
    setComparisonValue('');
    setRuleType('greaterThan');
    setStyleKey('lightRedFillDarkRedText');
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
        onOpenChange(open);
        if (!open) setError(''); // Clear errors when closing
    }}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Conditional Formatting Rule</DialogTitle>
          <DialogDescription>
            Highlight cells that meet certain criteria.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="range" className="text-right">
              Range
            </Label>
            <Input
              id="range"
              value={rangeStr}
              onChange={(e) => setRangeStr(e.target.value.toUpperCase())}
              className="col-span-3"
              placeholder="e.g., A1:B10 or C5"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="ruleType" className="text-right">
              Rule Type
            </Label>
            <Select value={ruleType} onValueChange={(value) => setRuleType(value as any)}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a rule type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="greaterThan">Cell Value Is Greater Than</SelectItem>
                <SelectItem value="lessThan">Cell Value Is Less Than</SelectItem>
                <SelectItem value="equalTo">Cell Value Is Equal To</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="value" className="text-right">
              Value
            </Label>
            <Input
              id="value"
              type="number"
              value={comparisonValue}
              onChange={(e) => setComparisonValue(e.target.value)}
              className="col-span-3"
              placeholder="Enter a number"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="style" className="text-right">
              Style
            </Label>
            <Select value={styleKey} onValueChange={(value) => setStyleKey(value as PredefinedStyleKey)}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a style" />
              </SelectTrigger>
              <SelectContent>
                {predefinedStyles.map(style => (
                  <SelectItem key={style.key} value={style.key}>{style.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {error && (
            <p className="col-span-4 text-sm text-destructive text-center">{error}</p>
          )}
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button type="submit" onClick={handleSubmit}>Apply Rule</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

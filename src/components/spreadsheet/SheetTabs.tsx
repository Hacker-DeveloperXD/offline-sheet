"use client";

import { Button } from "@/components/ui/button";
import type { SheetData } from "@/types/spreadsheet";
import { useSpreadsheet } from "@/hooks/useSpreadsheet";
import { PlusCircle, Edit2, Trash2, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useRef, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { v4 as uuidv4 } from 'uuid';
import { createInitialSheet } from '@/types/spreadsheet';
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";


interface SheetTabsProps {
  sheets: SheetData[];
  activeSheetId: string;
}

export default function SheetTabs({ sheets, activeSheetId }: SheetTabsProps) {
  const { spreadsheet, setSpreadsheet, saveSpreadsheet } = useSpreadsheet();
  const [editingSheetId, setEditingSheetId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (editingSheetId && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingSheetId]);

  const handleTabClick = (sheetId: string) => {
    if (spreadsheet && setSpreadsheet && spreadsheet.activeSheetId !== sheetId) {
      setSpreadsheet({ ...spreadsheet, activeSheetId: sheetId, updatedAt: Date.now() });
    }
  };

  const handleAddSheet = () => {
    if (spreadsheet && setSpreadsheet) {
      const newSheetName = `Sheet${spreadsheet.sheets.length + 1}`;
      const newSheetId = uuidv4();
      const newSheet = createInitialSheet(newSheetId, newSheetName);
      const updatedSheets = [...spreadsheet.sheets, newSheet];
      setSpreadsheet({
        ...spreadsheet,
        sheets: updatedSheets,
        activeSheetId: newSheetId,
        updatedAt: Date.now(),
      });
      // Optionally save immediately or let user save via toolbar
      // saveSpreadsheet(); 
    }
  };

  const handleRenameSheet = (sheetId: string, currentName: string) => {
    setEditingSheetId(sheetId);
    setEditingName(currentName);
  };

  const handleSaveRename = () => {
    if (spreadsheet && setSpreadsheet && editingSheetId && editingName.trim()) {
      const updatedSheets = spreadsheet.sheets.map(sheet =>
        sheet.id === editingSheetId ? { ...sheet, name: editingName.trim() } : sheet
      );
      setSpreadsheet({ ...spreadsheet, sheets: updatedSheets, updatedAt: Date.now() });
      setEditingSheetId(null);
      setEditingName('');
    } else if (!editingName.trim()) {
        toast({title: "Error", description: "Sheet name cannot be empty.", variant: "destructive"});
    }
  };

  const handleCancelRename = () => {
    setEditingSheetId(null);
    setEditingName('');
  };

  const handleDeleteSheet = (sheetIdToDelete: string) => {
     if (spreadsheet && setSpreadsheet) {
        if (spreadsheet.sheets.length <= 1) {
            toast({title: "Cannot Delete", description: "A spreadsheet must have at least one sheet.", variant: "destructive"});
            return;
        }
        const updatedSheets = spreadsheet.sheets.filter(sheet => sheet.id !== sheetIdToDelete);
        let newActiveSheetId = spreadsheet.activeSheetId;
        if (spreadsheet.activeSheetId === sheetIdToDelete) {
            // If active sheet is deleted, make the first remaining sheet active
            newActiveSheetId = updatedSheets[0].id;
        }
        setSpreadsheet({
            ...spreadsheet,
            sheets: updatedSheets,
            activeSheetId: newActiveSheetId,
            updatedAt: Date.now(),
        });
     }
  };


  return (
    <div className="p-2 border-t bg-card flex items-center gap-1 overflow-x-auto">
      {sheets.map((sheet) => (
        <div key={sheet.id} className="flex items-center">
          {editingSheetId === sheet.id ? (
            <div className="flex items-center gap-1 p-1 bg-background rounded-md">
              <Input
                ref={inputRef}
                type="text"
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
                onBlur={handleSaveRename} // Save on blur
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveRename();
                  if (e.key === 'Escape') handleCancelRename();
                }}
                className="h-8 text-sm"
                aria-label="Edit sheet name"
              />
              <Button variant="ghost" size="icon" onClick={handleSaveRename} className="h-8 w-8" aria-label="Save sheet name"><Check size={16}/></Button>
              <Button variant="ghost" size="icon" onClick={handleCancelRename} className="h-8 w-8" aria-label="Cancel rename"><X size={16}/></Button>
            </div>
          ) : (
            <Button
              variant={sheet.id === activeSheetId ? "secondary" : "ghost"}
              size="sm"
              onClick={() => handleTabClick(sheet.id)}
              onDoubleClick={() => handleRenameSheet(sheet.id, sheet.name)}
              className={cn(
                "px-3 py-1.5 h-auto text-sm rounded-md",
                sheet.id === activeSheetId && "font-semibold bg-primary text-primary-foreground hover:bg-primary/90"
              )}
            >
              {sheet.name}
            </Button>
          )}
          {editingSheetId !== sheet.id && (
            <div className="flex">
                <Button variant="ghost" size="icon" onClick={() => handleRenameSheet(sheet.id, sheet.name)} className="h-6 w-6 opacity-60 hover:opacity-100" aria-label={`Rename ${sheet.name}`}>
                    <Edit2 size={12} />
                </Button>
                 <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-6 w-6 opacity-60 hover:opacity-100 text-destructive hover:text-destructive" aria-label={`Delete ${sheet.name}`}>
                        <Trash2 size={12} />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Sheet "{sheet.name}"?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. Are you sure you want to delete this sheet?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDeleteSheet(sheet.id)}>
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
            </div>
          )}
        </div>
      ))}
      <Button variant="ghost" size="icon" onClick={handleAddSheet} className="ml-2" aria-label="Add new sheet">
        <PlusCircle size={18} />
      </Button>
    </div>
  );
}

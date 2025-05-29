
"use client";

import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSpreadsheet } from "@/hooks/useSpreadsheet";
import { OfflineSheetLogo } from "../icons/OfflineSheetLogo";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { 
    Save, Home, Upload, Download, Undo, Redo, Bold, Italic, Underline, 
    AlignLeft, AlignCenter, AlignRight, FileText, RowsIcon, Columns, Trash2, 
    PlusSquare, ListChecks, Sun, Moon, FilePlus, ClipboardCopy, Eraser, Edit,
    TableIcon, Wand2, Sigma, GridIcon, Printer, Merge, Split, Search, Palette,
    CaseSensitive, WholeWord, Replace, Pilcrow, Share2
} from "lucide-react"; 
import {
  Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarSeparator, MenubarShortcut,
  MenubarTrigger, MenubarGroup, MenubarSub, MenubarSubContent, MenubarSubTrigger, 
} from "@/components/ui/menubar";
import { Separator } from "@/components/ui/separator"; 
import { cn } from '@/lib/utils';
import { AvailableFunctionsDialog } from './AvailableFunctionsDialog';
import { ConditionalFormattingDialog } from './ConditionalFormattingDialog';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { useToast } from '@/hooks/use-toast';
import type { SpreadsheetData } from '@/types/spreadsheet';
import { saveSpreadsheet as dbSaveSpreadsheet } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

const FONT_FAMILIES = ["Arial", "Verdana", "Tahoma", "Times New Roman", "Georgia", "Courier New"];
const FONT_SIZES = ["8pt", "9pt", "10pt", "11pt", "12pt", "14pt", "16pt", "18pt", "20pt", "24pt", "30pt", "36pt"];


interface ToolbarProps {
  spreadsheetName: string;
  theme: string | undefined;
  setTheme: (theme: string) => void;
}

export default function Toolbar({ spreadsheetName, theme, setTheme }: ToolbarProps) {
  const { 
    saveSpreadsheet, spreadsheet, setSpreadsheet: setContextSpreadsheet, activeCell, selectionRange, 
    updateSelectedCellStyle, formatSelectionAsTable, insertRow, deleteRow, insertColumn, deleteColumn,
    appendRow, appendColumn, undo, redo, canUndo, canRedo, copySelectionToClipboard, 
    deleteSelectionContents, updateMultipleCellsRawValue, addConditionalFormatRule,
    mergeSelection, unmergeSelection, findInSheet, setActiveCellAndSelection
  } = useSpreadsheet();
  const router = useRouter(); 
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isFunctionsDialogOpen, setIsFunctionsDialogOpen] = React.useState(false);
  const [isConditionalFormattingDialogOpen, setIsConditionalFormattingDialogOpen] = React.useState(false);
  const [isFindDialogOpen, setIsFindDialogOpen] = React.useState(false);
  const [findTerm, setFindTerm] = React.useState('');
  const [findMatchCase, setFindMatchCase] = React.useState(false);
  const [findEntireCell, setFindEntireCell] = React.useState(false);
  const [findInFormulas, setFindInFormulas] = React.useState(false);


  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (spreadsheet && setContextSpreadsheet) {
      setContextSpreadsheet(prev => prev ? ({ ...prev, name: e.target.value, updatedAt: Date.now() }) : null);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const selectedCellStyle = React.useMemo(() => {
    if (!spreadsheet || !activeCell || !activeCell.sheetId) return {};
    const sheet = spreadsheet.sheets.find(s => s.id === activeCell.sheetId);
    if (!sheet) return {};
    const cellData = sheet.cells[activeCell.rowIndex]?.[activeCell.colIndex];
    if(cellData?.isMerged && cellData.mergeMaster){
        return sheet.cells[cellData.mergeMaster.rowIndex]?.[cellData.mergeMaster.colIndex]?.style || {};
    }
    return cellData?.style || {};
  }, [spreadsheet, activeCell]);

  const handleToggleBold = () => { if (isSelectionActive) updateSelectedCellStyle({ bold: !selectedCellStyle?.bold }); };
  const handleToggleItalic = () => { if (isSelectionActive) updateSelectedCellStyle({ italic: !selectedCellStyle?.italic }); };
  const handleToggleUnderline = () => { if (isSelectionActive) updateSelectedCellStyle({ underline: !selectedCellStyle?.underline }); };
  const handleFontFamilyChange = (family: string) => { if (isSelectionActive) updateSelectedCellStyle({ fontFamily: family }); };
  const handleFontSizeChange = (size: string) => { if (isSelectionActive) updateSelectedCellStyle({ fontSize: size }); };


  const handleExport = (format: 'xlsx' | 'csv') => {
    setTimeout(() => toast({ title: "Export", description: `Export as ${format} is not yet implemented.`, variant: "default" }), 0);
    console.log(`Export as ${format} (Not implemented)`);
  };

  const handleShare = () => {
    if (!spreadsheet) {
      setTimeout(() => toast({ title: "Share Failed", description: "No spreadsheet data to share.", variant: "destructive" }), 0);
      return;
    }
    try {
      const spreadsheetJson = JSON.stringify(spreadsheet, null, 2);
      const blob = new Blob([spreadsheetJson], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const safeName = spreadsheet.name.replace(/[^a-z0-9]/gi, '_').toLowerCase() || "spreadsheet";
      a.download = `${safeName}.offlinesheet.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setTimeout(() => toast({ title: "Shared", description: "Spreadsheet data downloaded as JSON." }), 0);
    } catch (error) {
      console.error("Failed to share spreadsheet:", error);
      setTimeout(() => toast({ title: "Share Error", description: "Could not prepare spreadsheet for sharing.", variant: "destructive" }), 0);
    }
  };

  const handleLoadFromFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelected = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const text = e.target?.result as string;
        const importedData = JSON.parse(text) as SpreadsheetData;

        // Basic validation
        if (!importedData || typeof importedData.id !== 'string' || typeof importedData.name !== 'string' || !Array.isArray(importedData.sheets)) {
          throw new Error("Invalid file format.");
        }

        const newId = uuidv4();
        const originalName = importedData.name || "Untitled";
        
        const newSpreadsheetData: SpreadsheetData = {
          ...importedData,
          id: newId,
          name: `Imported - ${originalName}`.substring(0, 50), // Limit name length
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        
        // Ensure sheets have rowCount and columnCount, and cells are initialized
        newSpreadsheetData.sheets = newSpreadsheetData.sheets.map(sheet => ({
          ...sheet,
          rowCount: sheet.rowCount || 50, // Provide defaults if missing
          columnCount: sheet.columnCount || 20,
          cells: sheet.cells || Array.from({ length: sheet.rowCount || 50 }, () => 
            Array.from({ length: sheet.columnCount || 20 }, () => ({ id: '', rawValue: ''}))
          )
        }));


        const saveResult = await dbSaveSpreadsheet(newSpreadsheetData);
        if (saveResult.success) {
          setTimeout(() => toast({ title: "Import Successful", description: `Spreadsheet "${newSpreadsheetData.name}" imported and saved.` }), 0);
          router.push(`/spreadsheet/${newId}`);
        } else {
          throw new Error(saveResult.error || "Failed to save imported spreadsheet.");
        }

      } catch (error: any) {
        console.error("Failed to load spreadsheet from file:", error);
        setTimeout(() => toast({ title: "Import Error", description: `Could not load spreadsheet: ${error.message}`, variant: "destructive" }), 0);
      } finally {
        // Reset file input to allow selecting the same file again
        if(fileInputRef.current) fileInputRef.current.value = "";
      }
    };
    reader.readAsText(file);
  };
  
  const handleInsertRowAction = () => { if (spreadsheet?.activeSheetId) insertRow(spreadsheet.activeSheetId, activeCell?.rowIndex ?? 0); };
  const handleDeleteRowAction = () => { if (spreadsheet && activeCell) deleteRow(activeCell.sheetId, activeCell.rowIndex); };
  const handleInsertColumnAction = () => {  if (spreadsheet?.activeSheetId) insertColumn(spreadsheet.activeSheetId, activeCell?.colIndex ?? 0); };
  const handleDeleteColumnAction = () => { if (spreadsheet && activeCell) deleteColumn(activeCell.sheetId, activeCell.colIndex); };
  const handleAppendRowAction = () => { if (spreadsheet?.activeSheetId) appendRow(spreadsheet.activeSheetId); };
  const handleAppendColumnAction = () => { if (spreadsheet?.activeSheetId) appendColumn(spreadsheet.activeSheetId); };
  
  const setTextAlign = (align: 'left' | 'center' | 'right') => { if (isSelectionActive) updateSelectedCellStyle({ textAlign: align }); };
  const handleNewSpreadsheet = () => router.push('/'); 
  const handleEditSelectedCells = () => {
    if (!isSelectionActive) return;
    const newValue = window.prompt("Enter new value for all selected cells:", "");
    if (newValue !== null) updateMultipleCellsRawValue(newValue);
  };
  const handleFormatAsTableAction = () => { if (isSelectionActive) formatSelectionAsTable(); };

  const handleFindNext = () => {
    if (!spreadsheet?.activeSheetId || !findTerm) return;
    const foundCell = findInSheet(findTerm, {
        matchCase: findMatchCase,
        entireCell: findEntireCell,
        searchFormulas: findInFormulas,
        sheetId: spreadsheet.activeSheetId,
        from: activeCell 
    });
    if (foundCell) {
        setActiveCellAndSelection(foundCell, false, false);
    } else {
        setTimeout(() => toast({title: "Find", description: "No more occurrences found."}), 0);
    }
  };

  const isSelectionActive = !!selectionRange; 

  return (
    <div className="p-2 border-b bg-card flex flex-col md:flex-row items-start md:items-center justify-between gap-2 shadow-sm flex-wrap print:hidden">
      <input type="file" ref={fileInputRef} onChange={handleFileSelected} accept=".json,.offlinesheet.json" style={{ display: 'none' }} />
      <div className="flex items-center gap-2 w-full md:w-auto">
        <Link href="/" aria-label="Back to dashboard">
          <OfflineSheetLogo className="h-8 w-8"/>
        </Link>
        <Input 
          value={spreadsheetName} 
          onChange={handleNameChange}
          className="font-semibold text-lg w-auto min-w-[150px] max-w-[300px]"
          aria-label="Spreadsheet Name"
          disabled={!spreadsheet}
        />
        <Button onClick={toggleTheme} variant="ghost" size="icon" className="ml-auto md:ml-2" title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
            {theme === 'dark' ? <Sun /> : <Moon />}
        </Button>
         <Menubar className="border-none shadow-none p-0 h-auto">
          <MenubarMenu>
            <MenubarTrigger className="px-3 py-1.5">File</MenubarTrigger>
            <MenubarContent>
              <MenubarItem onClick={handleNewSpreadsheet}><FilePlus className="mr-2 h-4 w-4" /> New</MenubarItem>
              <MenubarSeparator />
              <MenubarItem onClick={saveSpreadsheet} disabled={!spreadsheet}><Save className="mr-2 h-4 w-4" /> Save</MenubarItem>
              <MenubarItem onClick={handleLoadFromFileClick}><Upload className="mr-2 h-4 w-4" /> Load from File...</MenubarItem>
              <MenubarSeparator />
              <MenubarItem onClick={() => handleExport('xlsx')}><Download className="mr-2 h-4 w-4" /> Export as .xlsx</MenubarItem>
              <MenubarItem onClick={() => handleExport('csv')}><FileText className="mr-2 h-4 w-4" /> Export as .csv</MenubarItem>
              <MenubarSeparator />
              <MenubarItem onClick={() => window.print()}><Printer className="mr-2 h-4 w-4" /> Print</MenubarItem>
              <MenubarSeparator />
              <MenubarItem onClick={handleShare}><Share2 className="mr-2 h-4 w-4" /> Share (Download JSON)...</MenubarItem>
              <MenubarSeparator />
              <MenubarItem asChild><Link href="/"><Home className="mr-2 h-4 w-4" /> Dashboard</Link></MenubarItem>
            </MenubarContent>
          </MenubarMenu>

          <MenubarMenu>
            <MenubarTrigger className="px-3 py-1.5">Edit</MenubarTrigger>
            <MenubarContent>
              <MenubarItem onClick={undo} disabled={!canUndo}><Undo className="mr-2 h-4 w-4" /> Undo <MenubarShortcut>Ctrl+Z</MenubarShortcut></MenubarItem>
              <MenubarItem onClick={redo} disabled={!canRedo}><Redo className="mr-2 h-4 w-4" /> Redo <MenubarShortcut>Ctrl+Y</MenubarShortcut></MenubarItem>
              <MenubarSeparator />
              <MenubarItem onClick={copySelectionToClipboard} disabled={!isSelectionActive}><ClipboardCopy className="mr-2 h-4 w-4" /> Copy</MenubarItem>
              <MenubarSeparator />
              <MenubarItem onClick={deleteSelectionContents} disabled={!isSelectionActive}><Eraser className="mr-2 h-4 w-4" /> Clear Contents</MenubarItem>
              <MenubarItem onClick={handleEditSelectedCells} disabled={!isSelectionActive}>
                <Edit className="mr-2 h-4 w-4" /> Edit Selected Cells...
              </MenubarItem>
              <MenubarSeparator />
              <MenubarItem onClick={() => setIsFindDialogOpen(true)}><Search className="mr-2 h-4 w-4" /> Find...</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
          
          <MenubarMenu>
            <MenubarTrigger className="px-3 py-1.5">Insert</MenubarTrigger>
            <MenubarContent>
                <MenubarItem onClick={handleInsertRowAction} disabled={!spreadsheet}><RowsIcon className="mr-2 h-4 w-4" /> Insert Row Above</MenubarItem>
                <MenubarItem onClick={handleAppendRowAction} disabled={!spreadsheet}><PlusSquare className="mr-2 h-4 w-4" /> Add Row to End</MenubarItem>
                <MenubarSeparator />
                <MenubarItem onClick={handleInsertColumnAction} disabled={!spreadsheet}><Columns className="mr-2 h-4 w-4" /> Insert Column Left</MenubarItem>
                <MenubarItem onClick={handleAppendColumnAction} disabled={!spreadsheet}><PlusSquare className="mr-2 h-4 w-4" /> Add Column to End</MenubarItem>
                 <MenubarSeparator />
                <MenubarItem onClick={handleDeleteRowAction} disabled={!activeCell}><Trash2 className="mr-2 h-4 w-4 text-destructive" /> Delete Active Row</MenubarItem>
                <MenubarItem onClick={handleDeleteColumnAction} disabled={!activeCell}><Trash2 className="mr-2 h-4 w-4 text-destructive" /> Delete Active Column</MenubarItem>
                <MenubarSeparator />
                <MenubarItem onClick={handleFormatAsTableAction} disabled={!isSelectionActive}>
                    <GridIcon className="mr-2 h-4 w-4" /> Format as Table
                </MenubarItem>
                 <MenubarItem onClick={() => setIsFunctionsDialogOpen(true)}>
                    <Sigma className="mr-2 h-4 w-4" /> Functions...
                </MenubarItem>
            </MenubarContent>
          </MenubarMenu>

          <MenubarMenu>
            <MenubarTrigger className="px-3 py-1.5">Format</MenubarTrigger>
            <MenubarContent>
              <MenubarGroup>
                  <MenubarItem onClick={handleToggleBold} disabled={!isSelectionActive} className={cn(selectedCellStyle?.bold && "bg-accent")}>
                    <Bold className="mr-2 h-4 w-4" /> Bold
                  </MenubarItem>
                  <MenubarItem onClick={handleToggleItalic} disabled={!isSelectionActive} className={cn(selectedCellStyle?.italic && "bg-accent")}>
                    <Italic className="mr-2 h-4 w-4" /> Italic
                  </MenubarItem>
                  <MenubarItem onClick={handleToggleUnderline} disabled={!isSelectionActive} className={cn(selectedCellStyle?.underline && "bg-accent")}>
                    <Underline className="mr-2 h-4 w-4" /> Underline
                  </MenubarItem>
              </MenubarGroup>
              <MenubarSeparator />
                <MenubarSub>
                    <MenubarSubTrigger disabled={!isSelectionActive}><Palette className="mr-2 h-4 w-4" /> Font Family</MenubarSubTrigger>
                    <MenubarSubContent>
                        {FONT_FAMILIES.map(family => (
                            <MenubarItem key={family} onClick={() => handleFontFamilyChange(family)} className={cn(selectedCellStyle?.fontFamily === family && "bg-accent")}>{family}</MenubarItem>
                        ))}
                    </MenubarSubContent>
                </MenubarSub>
                <MenubarSub>
                    <MenubarSubTrigger disabled={!isSelectionActive}><Pilcrow className="mr-2 h-4 w-4" /> Font Size</MenubarSubTrigger>
                    <MenubarSubContent>
                        {FONT_SIZES.map(size => (
                            <MenubarItem key={size} onClick={() => handleFontSizeChange(size)} className={cn(selectedCellStyle?.fontSize === size && "bg-accent")}>{size}</MenubarItem>
                        ))}
                    </MenubarSubContent>
                </MenubarSub>
              <MenubarSeparator />
              <MenubarSub>
                  <MenubarSubTrigger disabled={!isSelectionActive}>
                      <AlignLeft className="mr-2 h-4 w-4" /> Align Text
                  </MenubarSubTrigger>
                  <MenubarSubContent>
                      <MenubarItem onClick={() => setTextAlign('left')} className={cn(selectedCellStyle?.textAlign === 'left' && "bg-accent")}><AlignLeft className="mr-2 h-4 w-4" /> Left</MenubarItem>
                      <MenubarItem onClick={() => setTextAlign('center')} className={cn(selectedCellStyle?.textAlign === 'center' && "bg-accent")}><AlignCenter className="mr-2 h-4 w-4" /> Center</MenubarItem>
                      <MenubarItem onClick={() => setTextAlign('right')} className={cn(selectedCellStyle?.textAlign === 'right' && "bg-accent")}><AlignRight className="mr-2 h-4 w-4" /> Right</MenubarItem>
                  </MenubarSubContent>
              </MenubarSub>
              <MenubarSeparator />
              <MenubarItem onClick={mergeSelection} disabled={!isSelectionActive}><Merge className="mr-2 h-4 w-4" /> Merge & Center</MenubarItem>
              <MenubarItem onClick={unmergeSelection} disabled={!activeCell}><Split className="mr-2 h-4 w-4" /> Unmerge Cells</MenubarItem>
              <MenubarSeparator />
              <MenubarItem onClick={() => setIsConditionalFormattingDialogOpen(true)}>
                <Wand2 className="mr-2 h-4 w-4" /> Conditional Formatting...
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </div>

      <div className="flex items-center gap-1 flex-wrap mt-2 md:mt-0 border-t md:border-t-0 pt-2 md:pt-0 w-full md:w-auto">
        <Button variant="ghost" size="icon" onClick={saveSpreadsheet} aria-label="Save Spreadsheet" title="Save" disabled={!spreadsheet}><Save /></Button>
        <Button variant="ghost" size="icon" onClick={undo} aria-label="Undo" title="Undo" disabled={!canUndo}><Undo /></Button>
        <Button variant="ghost" size="icon" onClick={redo} aria-label="Redo" title="Redo" disabled={!canRedo}><Redo /></Button>
        <Button variant="ghost" size="icon" onClick={() => window.print()} aria-label="Print Spreadsheet" title="Print"><Printer /></Button>
        <Button variant="ghost" size="icon" onClick={handleShare} aria-label="Share Spreadsheet (Download JSON)" title="Share (Download JSON)"><Share2 /></Button>
        
        <Separator orientation="vertical" className="h-6 mx-1"/>
        <Button variant="ghost" size="icon" onClick={copySelectionToClipboard} aria-label="Copy Selection" title="Copy Selection" disabled={!isSelectionActive}><ClipboardCopy /></Button>
        <Button variant="ghost" size="icon" onClick={deleteSelectionContents} aria-label="Clear Contents of Selection" title="Clear Contents" disabled={!isSelectionActive}><Eraser /></Button>
        
        <Separator orientation="vertical" className="h-6 mx-1"/>
        
        <Select value={selectedCellStyle?.fontFamily || FONT_FAMILIES[0]} onValueChange={handleFontFamilyChange} disabled={!isSelectionActive}>
          <SelectTrigger className="h-9 w-[120px] text-xs" title="Font Family">
            <SelectValue placeholder="Font" />
          </SelectTrigger>
          <SelectContent>
            {FONT_FAMILIES.map(family => <SelectItem key={family} value={family} className="text-xs">{family}</SelectItem>)}
          </SelectContent>
        </Select>

        <Select value={selectedCellStyle?.fontSize || FONT_SIZES[4]} onValueChange={handleFontSizeChange} disabled={!isSelectionActive}>
          <SelectTrigger className="h-9 w-[70px] text-xs" title="Font Size">
            <SelectValue placeholder="Size" />
          </SelectTrigger>
          <SelectContent>
            {FONT_SIZES.map(size => <SelectItem key={size} value={size} className="text-xs">{size.replace('pt','')}</SelectItem>)}
          </SelectContent>
        </Select>

        <Separator orientation="vertical" className="h-6 mx-1"/>

        <Button 
          variant={selectedCellStyle?.bold ? "secondary" : "ghost"} 
          size="icon" 
          onClick={handleToggleBold} 
          aria-label="Bold" 
          title="Bold (Ctrl+B)"
          disabled={!isSelectionActive}
        ><Bold /></Button>
        <Button 
          variant={selectedCellStyle?.italic ? "secondary" : "ghost"} 
          size="icon" 
          onClick={handleToggleItalic} 
          aria-label="Italic" 
          title="Italic (Ctrl+I)"
          disabled={!isSelectionActive}
        ><Italic /></Button>
        <Button 
          variant={selectedCellStyle?.underline ? "secondary" : "ghost"} 
          size="icon" 
          onClick={handleToggleUnderline} 
          aria-label="Underline" 
          title="Underline (Ctrl+U)"
          disabled={!isSelectionActive}
        ><Underline /></Button>

        <Separator orientation="vertical" className="h-6 mx-1"/>
        
        <Button 
          variant={selectedCellStyle?.textAlign === 'left' ? "secondary" : "ghost"} 
          size="icon" 
          onClick={() => setTextAlign('left')} 
          aria-label="Align Left" 
          title="Align Left"
          disabled={!isSelectionActive}
        ><AlignLeft /></Button>
        <Button 
          variant={selectedCellStyle?.textAlign === 'center' ? "secondary" : "ghost"} 
          size="icon" 
          onClick={() => setTextAlign('center')} 
          aria-label="Align Center"
          title="Align Center" 
          disabled={!isSelectionActive}
        ><AlignCenter /></Button>
        <Button 
          variant={selectedCellStyle?.textAlign === 'right' ? "secondary" : "ghost"} 
          size="icon" 
          onClick={() => setTextAlign('right')} 
          aria-label="Align Right" 
          title="Align Right"
          disabled={!isSelectionActive}
        ><AlignRight /></Button>
         <Separator orientation="vertical" className="h-6 mx-1"/>
         <Button variant="ghost" size="icon" onClick={mergeSelection} disabled={!isSelectionActive} title="Merge & Center"><Merge /></Button>
         <Button variant="ghost" size="icon" onClick={unmergeSelection} disabled={!activeCell} title="Unmerge Cells"><Split /></Button>
      </div>
      <AvailableFunctionsDialog isOpen={isFunctionsDialogOpen} onOpenChange={setIsFunctionsDialogOpen} />
      <ConditionalFormattingDialog 
        isOpen={isConditionalFormattingDialogOpen} 
        onOpenChange={setIsConditionalFormattingDialogOpen}
        activeSheetId={spreadsheet?.activeSheetId}
        selectionRange={selectionRange}
      />
      
      <Dialog open={isFindDialogOpen} onOpenChange={setIsFindDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Find</DialogTitle>
            <DialogDescription>Find text in the current sheet.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="find-term" className="text-right">Find what:</Label>
              <Input id="find-term" value={findTerm} onChange={(e) => setFindTerm(e.target.value)} className="col-span-3" />
            </div>
            <div className="flex items-center space-x-2 col-start-2 col-span-3">
                <Checkbox id="find-match-case" checked={findMatchCase} onCheckedChange={(checked) => setFindMatchCase(Boolean(checked))} />
                <Label htmlFor="find-match-case" className="text-sm font-normal">Match case</Label>
            </div>
             <div className="flex items-center space-x-2 col-start-2 col-span-3">
                <Checkbox id="find-entire-cell" checked={findEntireCell} onCheckedChange={(checked) => setFindEntireCell(Boolean(checked))} />
                <Label htmlFor="find-entire-cell" className="text-sm font-normal">Match entire cell contents</Label>
            </div>
            <div className="flex items-center space-x-2 col-start-2 col-span-3">
                <Checkbox id="find-in-formulas" checked={findInFormulas} onCheckedChange={(checked) => setFindInFormulas(Boolean(checked))} />
                <Label htmlFor="find-in-formulas" className="text-sm font-normal">Search in formulas</Label>
            </div>
          </div>
          <DialogFooter className="sm:justify-between">
            <DialogClose asChild>
              <Button type="button" variant="outline">Close</Button>
            </DialogClose>
            <Button type="button" onClick={handleFindNext} disabled={!findTerm}>Find Next</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}

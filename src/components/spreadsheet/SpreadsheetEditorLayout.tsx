
"use client";

import { useEffect, useState } from 'react'; // Added useState, useEffect
import { useSpreadsheet } from '@/hooks/useSpreadsheet';
import Toolbar from './Toolbar';
import SheetTabs from './SheetTabs';
import Grid from './Grid';
import FormulaBar from './FormulaBar';
import { ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"; // Removed ResizableHandle for now

export default function SpreadsheetEditorLayout() {
  const { spreadsheet } = useSpreadsheet();
  const [theme, setThemeState] = useState<string | undefined>(undefined);

  useEffect(() => {
    // Get theme from localStorage on mount
    const storedTheme = localStorage.getItem('spreadsheet-theme') || 'light';
    setThemeState(storedTheme);
    if (storedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const setTheme = (newTheme: string) => {
    setThemeState(newTheme);
    localStorage.setItem('spreadsheet-theme', newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };


  if (!spreadsheet) {
    return <div className="flex items-center justify-center h-screen">Spreadsheet data not available.</div>;
  }
  
  const activeSheet = spreadsheet.sheets.find(s => s.id === spreadsheet.activeSheetId);

  if (!activeSheet) {
    return <div className="flex items-center justify-center h-screen">Active sheet not found.</div>;
  }

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      <Toolbar spreadsheetName={spreadsheet.name} theme={theme} setTheme={setTheme} />
      <FormulaBar />
      <div className="flex-grow overflow-hidden">
        <ResizablePanelGroup direction="vertical">
          <ResizablePanel defaultSize={100} className="min-h-[200px]">
            <Grid sheet={activeSheet} />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
      <SheetTabs sheets={spreadsheet.sheets} activeSheetId={spreadsheet.activeSheetId} />
    </div>
  );
}

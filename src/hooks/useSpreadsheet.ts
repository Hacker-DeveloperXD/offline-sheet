"use client";

import { useContext } from 'react';
import { SpreadsheetContext } from '@/contexts/SpreadsheetContext';

export function useSpreadsheet() {
  const context = useContext(SpreadsheetContext);
  if (context === undefined) {
    throw new Error('useSpreadsheet must be used within a SpreadsheetProvider');
  }
  return context;
}

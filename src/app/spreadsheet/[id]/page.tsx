"use client";

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { SpreadsheetProvider } from '@/contexts/SpreadsheetContext';
import { useSpreadsheet } from '@/hooks/useSpreadsheet'; // Corrected import path
import SpreadsheetEditorLayout from '@/components/spreadsheet/SpreadsheetEditorLayout';
import { Loader2 } from 'lucide-react';

function SpreadsheetEditorPageContents() {
  const params = useParams();
  const spreadsheetId = params.id as string;
  const { spreadsheet, isLoading, loadSpreadsheet } = useSpreadsheet();
  const router = useRouter();

  useEffect(() => {
    if (spreadsheetId) {
      loadSpreadsheet(spreadsheetId);
    }
  }, [spreadsheetId, loadSpreadsheet]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full flex-grow">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-lg text-muted-foreground">Loading spreadsheet...</p>
      </div>
    );
  }

  if (!spreadsheet && !isLoading) {
     // Could be due to error or not found, context handles toast.
     // Allow user to go back.
    return (
      <div className="flex flex-col items-center justify-center h-full flex-grow p-8 text-center">
        <h2 className="text-2xl font-semibold text-destructive mb-4">Spreadsheet Not Found</h2>
        <p className="text-muted-foreground mb-6">
          The requested spreadsheet could not be loaded. It might have been deleted or an error occurred.
        </p>
        <button
          onClick={() => router.push('/')}
          className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          Go to Dashboard
        </button>
      </div>
    );
  }
  
  // Spreadsheet is loaded (or still loading, covered by above)
  return <SpreadsheetEditorLayout />;
}


export default function SpreadsheetPage() {
  return (
    <SpreadsheetProvider>
      <SpreadsheetEditorPageContents />
    </SpreadsheetProvider>
  );
}

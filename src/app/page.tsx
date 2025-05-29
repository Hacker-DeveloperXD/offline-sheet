
"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { OfflineSheetLogo } from '@/components/icons/OfflineSheetLogo';
import { CreateSpreadsheetDialog } from '@/components/CreateSpreadsheetDialog';
import { useToast } from '@/hooks/use-toast';
import { saveSpreadsheet, getAllSpreadsheetInfo, deleteSpreadsheet as dbDeleteSpreadsheet } from '@/lib/db';
import type { SpreadsheetData, SpreadsheetInfo, SheetData } from '@/types/spreadsheet';
import { createInitialSheet } from '@/types/spreadsheet';
import { FileText, Trash2, Edit3, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
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
} from "@/components/ui/alert-dialog"


export default function HomePage() {
  const [spreadsheets, setSpreadsheets] = useState<SpreadsheetInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    loadSpreadsheets();
  }, []);

  async function loadSpreadsheets() {
    setIsLoading(true);
    const result = await getAllSpreadsheetInfo();
    if (result.success && result.data) {
      setSpreadsheets(result.data);
    } else {
      toast({ title: "Error", description: "Could not load spreadsheets.", variant: "destructive" });
    }
    setIsLoading(false);
  }

  const handleCreateSpreadsheet = async (name: string) => {
    const newSheetId = uuidv4();
    const initialSheet = createInitialSheet(newSheetId, 'Sheet1');
    
    const newSpreadsheet: SpreadsheetData = {
      id: uuidv4(),
      name,
      sheets: [initialSheet],
      activeSheetId: newSheetId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    const result = await saveSpreadsheet(newSpreadsheet);
    if (result.success) {
      toast({ title: "Success", description: `Spreadsheet "${name}" created.` });
      loadSpreadsheets(); // Refresh list
      router.push(`/spreadsheet/${newSpreadsheet.id}`);
    } else {
      toast({ title: "Error", description: `Failed to create spreadsheet: ${result.error}`, variant: "destructive" });
    }
  };

  const handleDeleteSpreadsheet = async (id: string, name: string) => {
    const result = await dbDeleteSpreadsheet(id);
    if (result.success) {
      toast({ title: "Success", description: `Spreadsheet "${name}" deleted.` });
      loadSpreadsheets(); // Refresh list
    } else {
      toast({ title: "Error", description: `Failed to delete spreadsheet: ${result.error}`, variant: "destructive" });
    }
  };
  
  return (
    <div className="flex flex-col items-center p-4 md:p-8 min-h-screen bg-background">
      <header className="mb-8 text-center">
        <div className="flex items-center justify-center gap-3 mb-2">
          <OfflineSheetLogo className="h-12 w-12" />
          <h1 className="text-4xl font-bold text-primary">OfflineSheet</h1>
        </div>
        <p className="text-muted-foreground">Your powerful offline spreadsheet solution.</p>
      </header>

      <div className="w-full max-w-4xl mb-8">
        <CreateSpreadsheetDialog onCreate={handleCreateSpreadsheet} />
      </div>

      {isLoading ? (
        <p>Loading spreadsheets...</p>
      ) : spreadsheets.length === 0 ? (
        <Card className="w-full max-w-md text-center shadow-lg">
          <CardHeader>
            <CardTitle>No Spreadsheets Yet</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Click "Create New Spreadsheet" to get started.
            </CardDescription>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-4xl">
          {spreadsheets.map((sheet) => (
            <Card key={sheet.id} className="flex flex-col justify-between shadow-lg hover:shadow-xl transition-shadow duration-200">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <FileText className="h-8 w-8 text-primary mb-2" />
                </div>
                <CardTitle className="truncate text-xl">{sheet.name}</CardTitle>
                <CardDescription className="text-xs text-muted-foreground flex items-center">
                  <Clock size={14} className="mr-1"/> Last updated {formatDistanceToNow(new Date(sheet.updatedAt), { addSuffix: true })}
                </CardDescription>
              </CardHeader>
              <CardFooter className="flex justify-between items-center border-t pt-4 mt-auto">
                <Link href={`/spreadsheet/${sheet.id}`} passHref>
                  <Button variant="outline" size="sm" className="flex items-center">
                    <Edit3 size={16} className="mr-2" /> Open
                  </Button>
                </Link>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm" className="flex items-center">
                      <Trash2 size={16} className="mr-2" /> Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the spreadsheet
                        "{sheet.name}".
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDeleteSpreadsheet(sheet.id, sheet.name)}>
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      <footer className="mt-12 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} OfflineSheet by Chaitanya Dixit. All rights reserved.</p>
        <p>All data stored locally in your browser.</p>
      </footer>
    </div>
  );
}

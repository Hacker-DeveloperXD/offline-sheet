
"use client";

<<<<<<< HEAD
import { useEffect, useState, useCallback } from 'react';
=======
import { useEffect, useState } from 'react';
>>>>>>> 3cd4ffaa439f3afbedf88f6042b7b8f5a2da87f2
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { OfflineSheetLogo } from '@/components/icons/OfflineSheetLogo';
import { CreateSpreadsheetDialog } from '@/components/CreateSpreadsheetDialog';
import { useToast } from '@/hooks/use-toast';
<<<<<<< HEAD
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, serverTimestamp, query, orderBy, Timestamp, writeBatch, setDoc } from 'firebase/firestore'; // Added setDoc

import type { SpreadsheetData, SpreadsheetInfo, SheetData } from '@/types/spreadsheet';
import { createInitialSheet, DEFAULT_COLUMN_COUNT, DEFAULT_ROW_COUNT, getCellId } from '@/types/spreadsheet';
import { FileText, Trash2, Edit3, Clock, ExternalLink, CloudLightning } from 'lucide-react';
=======
import { saveSpreadsheet, getAllSpreadsheetInfo, deleteSpreadsheet as dbDeleteSpreadsheet } from '@/lib/db';
import type { SpreadsheetData, SpreadsheetInfo, SheetData } from '@/types/spreadsheet';
import { createInitialSheet } from '@/types/spreadsheet';
import { FileText, Trash2, Edit3, Clock } from 'lucide-react';
>>>>>>> 3cd4ffaa439f3afbedf88f6042b7b8f5a2da87f2
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


<<<<<<< HEAD
// Placeholder for current user ID - replace with actual Firebase Auth user
const PLACEHOLDER_USER_ID = "anonymous_user";

=======
>>>>>>> 3cd4ffaa439f3afbedf88f6042b7b8f5a2da87f2
export default function HomePage() {
  const [spreadsheets, setSpreadsheets] = useState<SpreadsheetInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

<<<<<<< HEAD
  const loadSpreadsheets = useCallback(async () => {
    setIsLoading(true);
    try {
      const q = query(collection(db, "spreadsheets"), orderBy("updatedAt", "desc"));
      const querySnapshot = await getDocs(q);
      const fsSpreadsheets = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name,
          createdAt: (data.createdAt as Timestamp)?.toDate().getTime() || Date.now(),
          updatedAt: (data.updatedAt as Timestamp)?.toDate().getTime() || Date.now(),
        } as SpreadsheetInfo;
      });
      setSpreadsheets(fsSpreadsheets);
    } catch (error) {
      console.error("Error loading spreadsheets from Firestore:", error);
      toast({ title: "Error", description: "Could not load spreadsheets from cloud.", variant: "destructive" });
      setSpreadsheets([]);
    }
    setIsLoading(false);
  }, [toast]);


  useEffect(() => {
    loadSpreadsheets();
  }, [loadSpreadsheets]);


  const handleCreateSpreadsheet = async (name: string) => {
    const newSpreadsheetId = uuidv4(); // Use this as the document ID
    const newSheetId = uuidv4();
    const initialSheetMetadata = createInitialSheet(newSheetId, 'Sheet1');

    // Remove cells from metadata to avoid storing all cells in the main doc
    const { cells, ...sheetMetadataToStore } = initialSheetMetadata;

    const newSpreadsheetDocData = {
      name,
      activeSheetId: newSheetId,
      sheetsMetadata: [sheetMetadataToStore], // Store only metadata here
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      ownerId: PLACEHOLDER_USER_ID,
    };

    try {
      setIsLoading(true);
      const newDocRef = doc(db, "spreadsheets", newSpreadsheetId);
      await setDoc(newDocRef, newSpreadsheetDocData); // Use setDoc here

      // Cell documents are not created here; they will be created on first edit
      // or when the sheet is loaded by SpreadsheetContext.

      toast({ title: "Success", description: `Spreadsheet "${name}" created in the cloud.` });
      router.push(`/spreadsheet/${newSpreadsheetId}`);

    } catch (error) {
      console.error("Error creating spreadsheet in Firestore:", error);
      toast({ title: "Error", description: `Failed to create spreadsheet: ${error instanceof Error ? error.message : String(error)}`, variant: "destructive" });
    } finally {
      setIsLoading(false);
=======
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
>>>>>>> 3cd4ffaa439f3afbedf88f6042b7b8f5a2da87f2
    }
  };

  const handleDeleteSpreadsheet = async (id: string, name: string) => {
<<<<<<< HEAD
    setIsLoading(true);
    try {
      // Note: Deleting a document does not delete its subcollections in Firestore automatically.
      // For full cleanup of sheet and cell subcollections, a Cloud Function is recommended.
      await deleteDoc(doc(db, "spreadsheets", id));
      toast({ title: "Success", description: `Spreadsheet "${name}" deleted. (Note: Sub-collections may require manual cleanup or a Cloud Function).` });
      loadSpreadsheets();
    } catch (error) {
      console.error("Error deleting spreadsheet from Firestore:", error);
      toast({ title: "Error", description: `Failed to delete spreadsheet: ${error instanceof Error ? error.message : String(error)}`, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const openPortfolio = () => {
    window.open('https://chaitanyadixit.framer.website', '_blank', 'noopener,noreferrer');
  };

=======
    const result = await dbDeleteSpreadsheet(id);
    if (result.success) {
      toast({ title: "Success", description: `Spreadsheet "${name}" deleted.` });
      loadSpreadsheets(); // Refresh list
    } else {
      toast({ title: "Error", description: `Failed to delete spreadsheet: ${result.error}`, variant: "destructive" });
    }
  };
  
>>>>>>> 3cd4ffaa439f3afbedf88f6042b7b8f5a2da87f2
  return (
    <div className="flex flex-col items-center p-4 md:p-8 min-h-screen bg-background">
      <header className="mb-8 text-center">
        <div className="flex items-center justify-center gap-3 mb-2">
          <OfflineSheetLogo className="h-12 w-12" />
<<<<<<< HEAD
          <h1 className="text-4xl font-bold text-primary">OfflineSheet Cloud</h1>
        </div>
        <p className="text-muted-foreground">Your powerful cloud-enabled spreadsheet solution.</p>
      </header>

      <div className="w-full max-w-4xl mb-8 flex flex-col sm:flex-row justify-center items-center gap-4">
        <CreateSpreadsheetDialog onCreate={handleCreateSpreadsheet} />
        <Button onClick={openPortfolio} variant="outline">
          <ExternalLink className="mr-2 h-4 w-4" /> Chaitanya's Portfolio
        </Button>
      </div>

      {isLoading && spreadsheets.length === 0 ? ( // Show loading only if list is empty initially
        <p>Loading spreadsheets from cloud...</p>
      ) : !isLoading && spreadsheets.length === 0 ? (
        <Card className="w-full max-w-md text-center shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center justify-center gap-2"><CloudLightning />No Cloud Spreadsheets</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Click "Create New Spreadsheet" to get started with a cloud-saved sheet.
=======
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
>>>>>>> 3cd4ffaa439f3afbedf88f6042b7b8f5a2da87f2
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
<<<<<<< HEAD
                        "{sheet.name}" from the cloud. Sub-collections like sheets and cells may require separate cleanup.
=======
                        "{sheet.name}".
>>>>>>> 3cd4ffaa439f3afbedf88f6042b7b8f5a2da87f2
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
<<<<<<< HEAD
        <p>&copy; {new Date().getFullYear()} OfflineSheet Cloud by Chaitanya Dixit. All rights reserved.</p>
        <p>Spreadsheet data is now intended to be stored in Firestore for collaboration.</p>
=======
        <p>&copy; {new Date().getFullYear()} OfflineSheet by Chaitanya Dixit. All rights reserved.</p>
        <p>All data stored locally in your browser.</p>
>>>>>>> 3cd4ffaa439f3afbedf88f6042b7b8f5a2da87f2
      </footer>
    </div>
  );
}

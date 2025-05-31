
<<<<<<< HEAD
export type NumberFormatStyle = 'general' | 'number_2dp' | 'currency_usd_2dp' | 'percentage_0dp';
export type CellDataType = 'general' | 'text' | 'number'; // Added CellDataType

=======
>>>>>>> 3cd4ffaa439f3afbedf88f6042b7b8f5a2da87f2
export interface CellStyle {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  textAlign?: 'left' | 'center' | 'right';
<<<<<<< HEAD
  hasBorder?: boolean;
  fontSize?: string;
  fontFamily?: string;
  numberFormat?: NumberFormatStyle;
  dataType?: CellDataType; // Added dataType to CellStyle
  validationError?: boolean; // For visual feedback on data type error
=======
  hasBorder?: boolean; // For "Format as Table"
  fontSize?: string; // e.g., '10pt', '12px'
  fontFamily?: string; // e.g., 'Arial', 'Verdana'
  // backgroundColor?: string; // Removed as per user request
  // color?: string; // Removed as per user request
>>>>>>> 3cd4ffaa439f3afbedf88f6042b7b8f5a2da87f2
}

export interface CellAddress {
  sheetId: string;
  rowIndex: number;
  colIndex: number;
}

export interface SelectionRange {
  start: CellAddress;
  end: CellAddress;
}

<<<<<<< HEAD
export interface CellHistoryEntry {
  rawValue: string | number | undefined;
  timestamp: number;
  comment?: string;
}

export interface CellData {
  id: string;
  rawValue?: string | number;
  value?: string | number | boolean;
  style?: CellStyle;
  formula?: string;
  isMerged?: boolean;
  mergeMaster?: CellAddress;
  colSpan?: number;
  rowSpan?: number;
  history?: CellHistoryEntry[];
}

export type RowData = CellData[];
=======
export interface CellData {
  id: string; // e.g., "A1", "B2"
  rawValue?: string | number; // Content entered by user, could be "123", "abc", or "=SUM(A1:A2)"
  value?: string | number | boolean; // Calculated value or display value for non-formulas
  style?: CellStyle;
  formula?: string; // If rawValue starts with '=', this holds the formula part, e.g., "SUM(A1:A2)"
  // For merged cells, only the top-left cell of a merge has content.
  // Other cells within the merge might be placeholders or have specific props.
  isMerged?: boolean; // Indicates if this cell is part of a merged area (but not the top-left)
  mergeMaster?: CellAddress; // If isMerged, points to the top-left master cell
  colSpan?: number; // If this is the top-left cell of a merge
  rowSpan?: number; // If this is the top-left cell of a merge
}

export type RowData = CellData[]; // An array of cells representing a row
>>>>>>> 3cd4ffaa439f3afbedf88f6042b7b8f5a2da87f2

export type PredefinedStyleKey = 'lightRedFillDarkRedText' | 'yellowFillDarkYellowText' | 'greenFillDarkGreenText';

export interface ConditionalFormatRule {
  id: string;
  range: SelectionRange;
  type: 'greaterThan' | 'lessThan' | 'equalTo';
  value: number;
  styleKey: PredefinedStyleKey;
}

export interface SheetData {
  id: string;
  name: string;
  cells: CellData[][];
  rowCount: number;
  columnCount: number;
  columnWidths?: number[];
  rowHeights?: number[];
  conditionalFormatRules?: ConditionalFormatRule[];
<<<<<<< HEAD
  mergedCells?: SelectionRange[];
=======
  mergedCells?: SelectionRange[]; // Stores ranges of merged cells
>>>>>>> 3cd4ffaa439f3afbedf88f6042b7b8f5a2da87f2
}

export interface SpreadsheetInfo {
  id:string;
  name: string;
  createdAt: number;
  updatedAt: number;
}

export interface SpreadsheetData extends SpreadsheetInfo {
  sheets: SheetData[];
  activeSheetId: string;
}

export const DEFAULT_ROW_COUNT = 100;
export const DEFAULT_COLUMN_COUNT = 50;
export const DEFAULT_COLUMN_WIDTH = 120;
export const DEFAULT_ROW_HEIGHT = 28;
<<<<<<< HEAD
export const MAX_CELL_HISTORY = 10;


=======


// Helper to generate cell ID like "A1", "B2"
>>>>>>> 3cd4ffaa439f3afbedf88f6042b7b8f5a2da87f2
export function getCellId(rowIndex: number, colIndex: number): string {
  let colName = "";
  let n = colIndex;
  do {
    colName = String.fromCharCode((n % 26) + 65) + colName;
    n = Math.floor(n / 26) - 1;
  } while (n >= 0);
  return `${colName}${rowIndex + 1}`;
}

export function createEmptyCell(rowIndex: number, colIndex: number): CellData {
  return {
    id: getCellId(rowIndex, colIndex),
    rawValue: '',
<<<<<<< HEAD
    value: '',
    colSpan: 1,
    rowSpan: 1,
    isMerged: false,
    style: { numberFormat: 'general', dataType: 'general' }, // Initialize dataType
    history: [],
=======
    value: '', // Initialize value to empty string for display
    colSpan: 1,
    rowSpan: 1,
    isMerged: false,
>>>>>>> 3cd4ffaa439f3afbedf88f6042b7b8f5a2da87f2
  };
}

export function createInitialSheet(id: string, name: string): SheetData {
  const cells: CellData[][] = [];
  for (let i = 0; i < DEFAULT_ROW_COUNT; i++) {
    const row: CellData[] = [];
    for (let j = 0; j < DEFAULT_COLUMN_COUNT; j++) {
      row.push(createEmptyCell(i, j));
    }
    cells.push(row);
  }
  const columnWidths = Array(DEFAULT_COLUMN_COUNT).fill(DEFAULT_COLUMN_WIDTH);
  const rowHeights = Array(DEFAULT_ROW_COUNT).fill(DEFAULT_ROW_HEIGHT);
  return {
    id,
    name,
    cells,
    rowCount: DEFAULT_ROW_COUNT,
    columnCount: DEFAULT_COLUMN_COUNT,
    columnWidths,
    rowHeights,
    conditionalFormatRules: [],
    mergedCells: [],
  };
}

<<<<<<< HEAD
=======
// Helper to check if a cell address is within a selection range
>>>>>>> 3cd4ffaa439f3afbedf88f6042b7b8f5a2da87f2
export function isCellAddressInRange(address: CellAddress, range: SelectionRange): boolean {
  const minR = Math.min(range.start.rowIndex, range.end.rowIndex);
  const maxR = Math.max(range.start.rowIndex, range.end.rowIndex);
  const minC = Math.min(range.start.colIndex, range.end.colIndex);
  const maxC = Math.max(range.start.colIndex, range.end.colIndex);
  return address.rowIndex >= minR && address.rowIndex <= maxR &&
<<<<<<< HEAD
         address.colIndex >= minC && address.colIndex <= maxC &&
         address.sheetId === range.start.sheetId; // Ensure sheetId matches
=======
         address.colIndex >= minC && address.colIndex <= maxC;
>>>>>>> 3cd4ffaa439f3afbedf88f6042b7b8f5a2da87f2
}

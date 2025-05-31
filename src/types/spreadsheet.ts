
export type NumberFormatStyle = 'general' | 'number_2dp' | 'currency_usd_2dp' | 'percentage_0dp';
export type CellDataType = 'general' | 'text' | 'number'; // Added CellDataType

export interface CellStyle {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  textAlign?: 'left' | 'center' | 'right';
  hasBorder?: boolean;
  fontSize?: string;
  fontFamily?: string;
  numberFormat?: NumberFormatStyle;
  dataType?: CellDataType; // Added dataType to CellStyle
  validationError?: boolean; // For visual feedback on data type error
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
  mergedCells?: SelectionRange[];
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
export const MAX_CELL_HISTORY = 10;


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
    value: '',
    colSpan: 1,
    rowSpan: 1,
    isMerged: false,
    style: { numberFormat: 'general', dataType: 'general' }, // Initialize dataType
    history: [],
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

export function isCellAddressInRange(address: CellAddress, range: SelectionRange): boolean {
  const minR = Math.min(range.start.rowIndex, range.end.rowIndex);
  const maxR = Math.max(range.start.rowIndex, range.end.rowIndex);
  const minC = Math.min(range.start.colIndex, range.end.colIndex);
  const maxC = Math.max(range.start.colIndex, range.end.colIndex);
  return address.rowIndex >= minR && address.rowIndex <= maxR &&
         address.colIndex >= minC && address.colIndex <= maxC &&
         address.sheetId === range.start.sheetId; // Ensure sheetId matches
}

(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push(["static/chunks/src_613ef052._.js", {

"[project]/src/lib/db.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "deleteSpreadsheet": (()=>deleteSpreadsheet),
    "getAllSpreadsheetInfo": (()=>getAllSpreadsheetInfo),
    "getSpreadsheet": (()=>getSpreadsheet),
    "saveSpreadsheet": (()=>saveSpreadsheet)
});
const DB_NAME = 'OfflineSheetDB';
const DB_VERSION = 1;
const SPREADSHEET_STORE_NAME = 'spreadsheets';
function openDB() {
    return new Promise((resolve, reject)=>{
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        request.onerror = ()=>reject(request.error);
        request.onsuccess = ()=>resolve(request.result);
        request.onupgradeneeded = (event)=>{
            const db = event.target.result;
            if (!db.objectStoreNames.contains(SPREADSHEET_STORE_NAME)) {
                const store = db.createObjectStore(SPREADSHEET_STORE_NAME, {
                    keyPath: 'id'
                });
                store.createIndex('name', 'name', {
                    unique: false
                });
                store.createIndex('updatedAt', 'updatedAt', {
                    unique: false
                });
            }
        };
    });
}
async function saveSpreadsheet(spreadsheet) {
    try {
        const db = await openDB();
        const transaction = db.transaction(SPREADSHEET_STORE_NAME, 'readwrite');
        const store = transaction.objectStore(SPREADSHEET_STORE_NAME);
        return new Promise((resolve, reject)=>{
            const request = store.put(spreadsheet);
            request.onsuccess = ()=>resolve({
                    success: true
                });
            request.onerror = ()=>reject(request.error);
            transaction.oncomplete = ()=>db.close();
            transaction.onerror = ()=>reject(transaction.error);
        });
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : String(error)
        };
    }
}
async function getSpreadsheet(id) {
    try {
        const db = await openDB();
        const transaction = db.transaction(SPREADSHEET_STORE_NAME, 'readonly');
        const store = transaction.objectStore(SPREADSHEET_STORE_NAME);
        return new Promise((resolve, reject)=>{
            const request = store.get(id);
            request.onsuccess = ()=>resolve({
                    success: true,
                    data: request.result
                });
            request.onerror = ()=>reject(request.error);
            transaction.oncomplete = ()=>db.close();
            transaction.onerror = ()=>reject(transaction.error);
        });
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : String(error)
        };
    }
}
async function getAllSpreadsheetInfo() {
    try {
        const db = await openDB();
        const transaction = db.transaction(SPREADSHEET_STORE_NAME, 'readonly');
        const store = transaction.objectStore(SPREADSHEET_STORE_NAME);
        const index = store.index('updatedAt'); // Sort by most recently updated
        return new Promise((resolve, reject)=>{
            const spreadsheetsInfo = [];
            // Iterate in reverse to get newest first
            const cursorRequest = index.openCursor(null, "prev");
            cursorRequest.onsuccess = (event)=>{
                const cursor = event.target.result;
                if (cursor) {
                    const { id, name, createdAt, updatedAt } = cursor.value;
                    spreadsheetsInfo.push({
                        id,
                        name,
                        createdAt,
                        updatedAt
                    });
                    cursor.continue();
                } else {
                    resolve({
                        success: true,
                        data: spreadsheetsInfo
                    });
                }
            };
            cursorRequest.onerror = ()=>reject(cursorRequest.error);
            transaction.oncomplete = ()=>db.close();
            transaction.onerror = ()=>reject(transaction.error);
        });
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : String(error)
        };
    }
}
async function deleteSpreadsheet(id) {
    try {
        const db = await openDB();
        const transaction = db.transaction(SPREADSHEET_STORE_NAME, 'readwrite');
        const store = transaction.objectStore(SPREADSHEET_STORE_NAME);
        return new Promise((resolve, reject)=>{
            const request = store.delete(id);
            request.onsuccess = ()=>resolve({
                    success: true
                });
            request.onerror = ()=>reject(request.error);
            transaction.oncomplete = ()=>db.close();
            transaction.onerror = ()=>reject(transaction.error);
        });
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : String(error)
        };
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/types/spreadsheet.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "DEFAULT_COLUMN_COUNT": (()=>DEFAULT_COLUMN_COUNT),
    "DEFAULT_COLUMN_WIDTH": (()=>DEFAULT_COLUMN_WIDTH),
    "DEFAULT_ROW_COUNT": (()=>DEFAULT_ROW_COUNT),
    "DEFAULT_ROW_HEIGHT": (()=>DEFAULT_ROW_HEIGHT),
    "createEmptyCell": (()=>createEmptyCell),
    "createInitialSheet": (()=>createInitialSheet),
    "getCellId": (()=>getCellId)
});
const DEFAULT_ROW_COUNT = 100;
const DEFAULT_COLUMN_COUNT = 50;
const DEFAULT_COLUMN_WIDTH = 120; // Default width for columns in pixels
const DEFAULT_ROW_HEIGHT = 28; // Default height for rows in pixels (approx for typical text line)
function getCellId(rowIndex, colIndex) {
    let colName = "";
    let n = colIndex;
    do {
        colName = String.fromCharCode(n % 26 + 65) + colName;
        n = Math.floor(n / 26) - 1;
    }while (n >= 0)
    return `${colName}${rowIndex + 1}`;
}
function createEmptyCell(rowIndex, colIndex) {
    return {
        id: getCellId(rowIndex, colIndex),
        rawValue: '',
        value: ''
    };
}
function createInitialSheet(id, name) {
    const cells = [];
    for(let i = 0; i < DEFAULT_ROW_COUNT; i++){
        const row = [];
        for(let j = 0; j < DEFAULT_COLUMN_COUNT; j++){
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
        conditionalFormatRules: []
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/contexts/SpreadsheetContext.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "SpreadsheetContext": (()=>SpreadsheetContext),
    "SpreadsheetProvider": (()=>SpreadsheetProvider)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/db.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$use$2d$toast$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/use-toast.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$spreadsheet$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/types/spreadsheet.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$core$2f$create$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/mathjs/lib/esm/core/create.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$entry$2f$allFactoriesAny$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/mathjs/lib/esm/entry/allFactoriesAny.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
const MAX_UNDO_HISTORY = 20;
const MAX_FORMULA_RECURSION_DEPTH = 20; // Max depth for recursive formula evaluation
const CUSTOM_FUNCTION_REGEX = /^([A-Z_][A-Z0-9_]*)\((.*)\)$/i;
const CELL_REF_REGEX = /^[A-Z]+[1-9]\d*$/i;
const RANGE_REF_REGEX = /^([A-Z]+[1-9]\d*):([A-Z]+[1-9]\d*)$/i;
const NUMERIC_LITERAL_REGEX = /^-?\d+(\.\d+)?$/;
function parseCellId(id) {
    if (!id || typeof id !== 'string') return null;
    const match = id.toUpperCase().match(CELL_REF_REGEX);
    if (!match) return null;
    const lettersMatch = id.toUpperCase().match(/^([A-Z]+)/);
    const numbersMatch = id.toUpperCase().match(/([1-9]\d*)$/);
    if (!lettersMatch || !numbersMatch) return null;
    const colStr = lettersMatch[1];
    const rowStr = numbersMatch[1];
    let colIndex = 0;
    for(let i = 0; i < colStr.length; i++){
        colIndex = colIndex * 26 + (colStr.charCodeAt(i) - 64);
    }
    colIndex -= 1;
    const rowIndex = parseInt(rowStr, 10) - 1;
    if (isNaN(colIndex) || isNaN(rowIndex) || colIndex < 0 || rowIndex < 0) return null;
    return {
        rowIndex,
        colIndex
    };
}
let actualEvaluateFormulaLogic;
const getResolvedCellValue = (spreadsheetData, targetSheetId, address, visitedCellsInCurrentEvalPath)=>{
    const cellIdForVisited = `${targetSheetId}:${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$spreadsheet$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCellId"])(address.rowIndex, address.colIndex)}`;
    if (visitedCellsInCurrentEvalPath.has(cellIdForVisited)) {
        return "#CIRCREF!";
    }
    if (visitedCellsInCurrentEvalPath.size > MAX_FORMULA_RECURSION_DEPTH) {
        return "#CIRCREF!"; // Exceeded max depth
    }
    const sheet = spreadsheetData.sheets.find((s)=>s.id === targetSheetId);
    if (!sheet || address.rowIndex < 0 || address.rowIndex >= sheet.rowCount || address.colIndex < 0 || address.colIndex >= sheet.columnCount) {
        return "#REF!";
    }
    const cell = sheet.cells[address.rowIndex]?.[address.colIndex];
    if (!cell) {
        return "#REF!";
    }
    const raw = cell.rawValue;
    if (raw === undefined || raw === null || String(raw).trim() === '') {
        return 0; // Treat truly empty cells as 0 for formula evaluation
    }
    if (typeof raw === 'number') {
        return raw;
    }
    if (typeof raw === 'string') {
        if (raw.startsWith('=')) {
            const newVisitedPath = new Set(visitedCellsInCurrentEvalPath);
            newVisitedPath.add(cellIdForVisited);
            if (typeof actualEvaluateFormulaLogic === 'function') {
                return actualEvaluateFormulaLogic(spreadsheetData, targetSheetId, raw, newVisitedPath);
            } else {
                console.error("actualEvaluateFormulaLogic not yet defined when resolving cell value");
                return "#ERROR!";
            }
        }
        const num = parseFloat(raw); // Try to parse string as number
        return isNaN(num) ? raw : num; // If NaN, return original string, otherwise parsed number
    }
    return String(raw); // Fallback for other types (e.g. boolean, though not typical in rawValue)
};
const resolveRangeToArray = (rangeStr, spreadsheetData, currentSheetId, visitedCells)=>{
    const rangeMatch = rangeStr.toUpperCase().match(RANGE_REF_REGEX);
    if (!rangeMatch) return "#VALUE!"; // Or #NAME? if it's not a valid range string
    const startCellStr = rangeMatch[1];
    const endCellStr = rangeMatch[2];
    const startCoord = parseCellId(startCellStr);
    const endCoord = parseCellId(endCellStr);
    const currentSheet = spreadsheetData.sheets.find((s)=>s.id === currentSheetId);
    if (!startCoord || !endCoord || !currentSheet) {
        return "#REF!";
    }
    const minRow = Math.min(startCoord.rowIndex, endCoord.rowIndex);
    const maxRow = Math.max(startCoord.rowIndex, endCoord.rowIndex);
    const minCol = Math.min(startCoord.colIndex, endCoord.colIndex);
    const maxCol = Math.max(startCoord.colIndex, endCoord.colIndex);
    if (minRow < 0 || maxRow >= currentSheet.rowCount || minCol < 0 || maxCol >= currentSheet.columnCount) {
        return "#REF!";
    }
    const result = [];
    for(let r = minRow; r <= maxRow; r++){
        const rowValues = [];
        for(let c = minCol; c <= maxCol; c++){
            const cellVal = getResolvedCellValue(spreadsheetData, currentSheetId, {
                rowIndex: r,
                colIndex: c
            }, new Set(visitedCells));
            rowValues.push(cellVal);
        }
        result.push(rowValues);
    }
    return result;
};
function parseCustomFunctionArgs(argsString) {
    if (argsString.trim() === "") return [];
    let balance = 0;
    let currentArg = "";
    const args = [];
    for(let i = 0; i < argsString.length; i++){
        const char = argsString[i];
        if (char === '(') balance++;
        else if (char === ')') balance--;
        if (char === ',' && balance === 0) {
            args.push(currentArg.trim());
            currentArg = "";
        } else {
            currentArg += char;
        }
    }
    args.push(currentArg.trim());
    return args;
}
const processAggregateArg = (argString, spreadsheetData, sheetId, visitedCells)=>{
    const trimmedArg = argString.trim();
    if (NUMERIC_LITERAL_REGEX.test(trimmedArg)) {
        return parseFloat(trimmedArg);
    }
    if (CELL_REF_REGEX.test(trimmedArg)) {
        const coord = parseCellId(trimmedArg);
        return coord ? getResolvedCellValue(spreadsheetData, sheetId, coord, new Set(visitedCells)) : "#NAME?";
    }
    if (RANGE_REF_REGEX.test(trimmedArg)) {
        return resolveRangeToArray(trimmedArg, spreadsheetData, sheetId, new Set(visitedCells));
    }
    // If it looks like an expression, evaluate it
    if (trimmedArg.includes('+') || trimmedArg.includes('-') || trimmedArg.includes('*') || trimmedArg.includes('/') || trimmedArg.includes('(')) {
        const subExpressionResult = actualEvaluateFormulaLogic(spreadsheetData, sheetId, '=' + trimmedArg, new Set(visitedCells));
        return subExpressionResult;
    }
    return `"${trimmedArg}"`; // Treat as string literal, often ignored by aggregates or causes #VALUE!
};
const aggregateHelper = (args, processFn, ignoreText = true)=>{
    const flatValues = args.flat(Infinity);
    let firstError = null;
    for (const val of flatValues){
        if (typeof val === 'string' && val.startsWith('#')) {
            firstError = val;
            break;
        }
    }
    if (firstError) return firstError;
    const numbers = flatValues.filter((val)=>{
        if (typeof val === 'number' && isFinite(val)) return true;
        if (typeof val === 'string' && NUMERIC_LITERAL_REGEX.test(val)) return true; // Count "123" as a number for COUNT
        return false;
    }).map((val)=>typeof val === 'number' ? val : parseFloat(val));
    if (!ignoreText && numbers.length !== flatValues.length) {
    // If we shouldn't ignore text, and there was text or non-numeric, it's a #VALUE! for some functions
    // For SUM, AVG, MIN, MAX, text is ignored. For COUNT, text is ignored.
    // This logic might need refinement based on specific function behavior if they differ.
    }
    return processFn(numbers);
};
actualEvaluateFormulaLogic = (currentSpreadsheetData, sheetId, formulaExpressionWithEquals, visitedCellsInCurrentChain)=>{
    if (visitedCellsInCurrentChain.size > MAX_FORMULA_RECURSION_DEPTH) {
        return "#CIRCREF!";
    }
    const currentSheet = currentSpreadsheetData.sheets.find((s)=>s.id === sheetId);
    if (!currentSheet) return "#REF!";
    const cleanExpression = formulaExpressionWithEquals.startsWith('=') ? formulaExpressionWithEquals.substring(1).trim() : formulaExpressionWithEquals.trim();
    const topLevelFunctionMatch = cleanExpression.match(CUSTOM_FUNCTION_REGEX);
    if (topLevelFunctionMatch) {
        const functionName = topLevelFunctionMatch[1].toUpperCase();
        const argsString = topLevelFunctionMatch[2];
        const rawArgs = parseCustomFunctionArgs(argsString);
        const resolvedArgValues = rawArgs.map((rawArg)=>processAggregateArg(rawArg, currentSpreadsheetData, sheetId, new Set(visitedCellsInCurrentChain)));
        switch(functionName){
            case 'SUM':
                return aggregateHelper(resolvedArgValues, (nums)=>nums.reduce((acc, val)=>acc + val, 0));
            case 'AVERAGE':
                return aggregateHelper(resolvedArgValues, (nums)=>nums.length === 0 ? "#DIV/0!" : nums.reduce((acc, val)=>acc + val, 0) / nums.length);
            case 'COUNT':
                return aggregateHelper(resolvedArgValues, (nums)=>nums.length, false); // COUNT should count numbers, ignore text/errors.
            case 'MAX':
                return aggregateHelper(resolvedArgValues, (nums)=>nums.length === 0 ? 0 : Math.max(...nums));
            case 'MIN':
                return aggregateHelper(resolvedArgValues, (nums)=>nums.length === 0 ? 0 : Math.min(...nums));
            case 'IF':
                {
                    if (resolvedArgValues.length < 2) return "#N/A";
                    let conditionResult;
                    const conditionValue = resolvedArgValues[0];
                    if (typeof conditionValue === 'string' && conditionValue.startsWith('#')) return conditionValue;
                    if (typeof conditionValue === 'number') conditionResult = conditionValue !== 0;
                    else if (typeof conditionValue === 'boolean') conditionResult = conditionValue;
                    else {
                        const upperCond = String(conditionValue).toUpperCase();
                        if (upperCond === "TRUE") conditionResult = true;
                        else if (upperCond === "FALSE") conditionResult = false;
                        else if (String(conditionValue).trim() === "") conditionResult = false;
                        else return "#VALUE!";
                    }
                    const valueIfTrue = resolvedArgValues[1];
                    if (typeof valueIfTrue === 'string' && valueIfTrue.startsWith('#')) return valueIfTrue;
                    if (conditionResult) {
                        return valueIfTrue;
                    } else {
                        if (resolvedArgValues.length > 2) {
                            const valueIfFalse = resolvedArgValues[2];
                            if (typeof valueIfFalse === 'string' && valueIfFalse.startsWith('#')) return valueIfFalse;
                            return valueIfFalse;
                        }
                        return false;
                    }
                }
        }
    }
    // Fallback to math.js for arithmetic and other functions
    const scope = {};
    const cellRefRegexForScope = /[A-Z]+[1-9]\d*(?![A-Z0-9_.:(])/gi;
    const uniqueCellRefs = new Set();
    let match;
    while((match = cellRefRegexForScope.exec(cleanExpression)) !== null){
        uniqueCellRefs.add(match[0].toUpperCase());
    }
    for (const cellRef of uniqueCellRefs){
        const coord = parseCellId(cellRef);
        if (coord) {
            const val = getResolvedCellValue(currentSpreadsheetData, sheetId, coord, new Set(visitedCellsInCurrentChain));
            scope[cellRef] = val;
            if (typeof val === 'string' && val.startsWith('#')) {
                return val; // Error propagation
            }
        }
    }
    const mathInstance = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$core$2f$create$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["create"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$entry$2f$allFactoriesAny$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["all"]);
    const customFunctionsForMathJS = {
        SUM: (...args)=>aggregateHelper(args, (nums)=>nums.reduce((acc, val)=>acc + val, 0)),
        AVERAGE: (...args)=>aggregateHelper(args, (nums)=>nums.length === 0 ? "#DIV/0!" : nums.reduce((acc, val)=>acc + val, 0) / nums.length),
        COUNT: (...args)=>aggregateHelper(args, (nums)=>nums.length, false),
        MAX: (...args)=>aggregateHelper(args, (nums)=>nums.length === 0 ? 0 : Math.max(...nums)),
        MIN: (...args)=>aggregateHelper(args, (nums)=>nums.length === 0 ? 0 : Math.min(...nums)),
        IF: (condition, value_if_true, value_if_false)=>{
            let condResult;
            if (typeof condition === 'string' && condition.startsWith('#')) return condition;
            if (typeof condition === 'number') condResult = condition !== 0;
            else if (typeof condition === 'boolean') condResult = condition;
            else {
                const upperCond = String(condition).toUpperCase();
                if (upperCond === "TRUE") condResult = true;
                else if (upperCond === "FALSE") condResult = false;
                else if (String(condition).trim() === "") condResult = false;
                else return "#VALUE!";
            }
            const trueValResolved = typeof value_if_true === 'object' && value_if_true?.isMatrix === true ? value_if_true.toArray()[0][0] : value_if_true;
            if (typeof trueValResolved === 'string' && trueValResolved.startsWith('#')) return trueValResolved;
            let falseValResolved = value_if_false;
            if (value_if_false !== undefined && typeof value_if_false === 'object' && value_if_false?.isMatrix === true) {
                falseValResolved = value_if_false.toArray()[0][0];
            }
            if (typeof falseValResolved === 'string' && falseValResolved.startsWith('#')) return falseValResolved;
            if (condResult) return trueValResolved;
            else return value_if_false === undefined ? false : falseValResolved;
        }
    };
    mathInstance.import(customFunctionsForMathJS, {
        override: true
    });
    try {
        const evalResultNode = mathInstance.parse(cleanExpression);
        const evalResult = evalResultNode.evaluate(scope);
        if (evalResult === undefined || evalResult === null) return 0;
        if (typeof evalResult === 'number') return isFinite(evalResult) ? evalResult : "#NUM!";
        if (typeof evalResult === 'string' && evalResult.startsWith('#')) return evalResult;
        if (evalResult?.isMatrix === true) {
            const matrixData = evalResult.toArray();
            if (Array.isArray(matrixData) && matrixData.length > 0 && Array.isArray(matrixData[0]) && matrixData[0].length > 0) {
                const singleValue = matrixData[0][0];
                if (typeof singleValue === 'number' && isFinite(singleValue)) return singleValue;
                if (typeof singleValue === 'string' && singleValue.startsWith('#')) return singleValue;
                return String(singleValue);
            }
            return "#VALUE!";
        }
        if (evalResult && typeof evalResult.valueOf === 'function' && typeof evalResult !== 'function') {
            const primitiveResult = evalResult.valueOf();
            if (typeof primitiveResult === 'number' && isFinite(primitiveResult)) return primitiveResult;
            if (primitiveResult === undefined || primitiveResult === null) return 0;
            return String(primitiveResult);
        }
        return String(evalResult);
    } catch (error) {
        const msgLower = String(error?.message || '').toLowerCase();
        if (msgLower.includes("undefined symbol") || msgLower.includes("unknown function")) return "#NAME?";
        if (msgLower.includes("division by zero")) return "#DIV/0!";
        if (msgLower.includes("value expected") || msgLower.includes("typeerror") || msgLower.includes("cannot convert") || msgLower.includes("unexpected type of argument") || msgLower.includes("dimension mismatch")) return "#VALUE!";
        if (msgLower.includes("incorrect number of arguments")) return "#N/A";
        return "#ERROR!";
    }
};
function reevaluateSheetFormulas(spreadsheetData, sheetToReevaluateId) {
    const updatedSpreadsheet = JSON.parse(JSON.stringify(spreadsheetData));
    const sheetToUpdate = updatedSpreadsheet.sheets.find((s)=>s.id === sheetToReevaluateId);
    if (sheetToUpdate) {
        const cellsToUpdate = [];
        for(let r = 0; r < sheetToUpdate.rowCount; r++){
            for(let c = 0; c < sheetToUpdate.columnCount; c++){
                if (!sheetToUpdate.cells[r]) sheetToUpdate.cells[r] = [];
                if (!sheetToUpdate.cells[r][c]) sheetToUpdate.cells[r][c] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$spreadsheet$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createEmptyCell"])(r, c);
                const cell = sheetToUpdate.cells[r][c];
                if (typeof cell.rawValue === 'string' && cell.rawValue.startsWith('=')) {
                    cellsToUpdate.push({
                        r,
                        c
                    });
                } else {
                    cell.formula = undefined;
                    if (cell.rawValue === undefined || cell.rawValue === null || String(cell.rawValue).trim() === '') {
                        cell.value = ''; // Display empty string for blank raw values
                    } else if (typeof cell.rawValue === 'number') {
                        cell.value = cell.rawValue;
                    } else if (typeof cell.rawValue === 'string') {
                        const num = parseFloat(cell.rawValue);
                        cell.value = isNaN(num) ? cell.rawValue : num;
                    } else {
                        cell.value = String(cell.rawValue);
                    }
                }
            }
        }
        // For simplicity, one pass re-evaluation. Complex dependencies might need more.
        cellsToUpdate.forEach((pos)=>{
            const cell = sheetToUpdate.cells[pos.r][pos.c];
            if (typeof cell.rawValue === 'string' && cell.rawValue.startsWith('=')) {
                cell.formula = cell.rawValue;
                // Pass a clone of the *current state* of updatedSpreadsheet for this specific eval
                // This allows formulas to see results of other formulas calculated earlier in this same pass.
                const spreadsheetForThisSpecificEval = JSON.parse(JSON.stringify(updatedSpreadsheet));
                cell.value = actualEvaluateFormulaLogic(spreadsheetForThisSpecificEval, sheetToReevaluateId, cell.formula, new Set());
            }
        });
    }
    return updatedSpreadsheet;
}
const SpreadsheetContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function SpreadsheetProvider({ children }) {
    _s();
    const [internalSpreadsheetState, setInternalSpreadsheetState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const internalSpreadsheetRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SpreadsheetProvider.useEffect": ()=>{
            internalSpreadsheetRef.current = internalSpreadsheetState;
        }
    }["SpreadsheetProvider.useEffect"], [
        internalSpreadsheetState
    ]);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const { toast } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$use$2d$toast$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useToast"])();
    const [activeCell, setActiveCellState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [selectionRange, setSelectionRangeState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [undoStack, setUndoStack] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [redoStack, setRedoStack] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [isActivelyEditingFormula, setIsActivelyEditingFormulaState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const formulaBarApiRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const setIsActivelyEditingFormula = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "SpreadsheetProvider.useCallback[setIsActivelyEditingFormula]": (isEditing)=>{
            setIsActivelyEditingFormulaState(isEditing);
        }
    }["SpreadsheetProvider.useCallback[setIsActivelyEditingFormula]"], []);
    const setSpreadsheetWithHistory = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "SpreadsheetProvider.useCallback[setSpreadsheetWithHistory]": (updater, actionSource)=>{
            setInternalSpreadsheetState({
                "SpreadsheetProvider.useCallback[setSpreadsheetWithHistory]": (current)=>{
                    const currentDeepCloneForHistory = current ? JSON.parse(JSON.stringify(current)) : null;
                    let newSpreadsheetRaw;
                    if (typeof updater === 'function') {
                        newSpreadsheetRaw = updater(currentDeepCloneForHistory ? JSON.parse(JSON.stringify(currentDeepCloneForHistory)) : null);
                    } else {
                        newSpreadsheetRaw = updater;
                    }
                    let newSpreadsheet = newSpreadsheetRaw ? JSON.parse(JSON.stringify(newSpreadsheetRaw)) : null;
                    if (newSpreadsheet && actionSource !== 'reeval' && actionSource !== 'load_no_reeval') {
                        newSpreadsheet.sheets.forEach({
                            "SpreadsheetProvider.useCallback[setSpreadsheetWithHistory]": (sheet)=>{
                                newSpreadsheet = reevaluateSheetFormulas(newSpreadsheet, sheet.id);
                            }
                        }["SpreadsheetProvider.useCallback[setSpreadsheetWithHistory]"]);
                    }
                    if (actionSource !== 'undo' && actionSource !== 'redo' && actionSource !== 'internal_no_history' && actionSource !== 'save' && actionSource !== 'reeval' && actionSource !== 'load_no_reeval' && currentDeepCloneForHistory && newSpreadsheet && JSON.stringify(currentDeepCloneForHistory) !== JSON.stringify(newSpreadsheet)) {
                        setUndoStack({
                            "SpreadsheetProvider.useCallback[setSpreadsheetWithHistory]": (prev)=>[
                                    ...prev.slice(-MAX_UNDO_HISTORY + 1),
                                    currentDeepCloneForHistory
                                ]
                        }["SpreadsheetProvider.useCallback[setSpreadsheetWithHistory]"]);
                        setRedoStack([]);
                    }
                    internalSpreadsheetRef.current = newSpreadsheet;
                    return newSpreadsheet;
                }
            }["SpreadsheetProvider.useCallback[setSpreadsheetWithHistory]"]);
        }
    }["SpreadsheetProvider.useCallback[setSpreadsheetWithHistory]"], []);
    const exposedSetSpreadsheet = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "SpreadsheetProvider.useCallback[exposedSetSpreadsheet]": (value)=>{
            setSpreadsheetWithHistory(value, 'user_action');
        }
    }["SpreadsheetProvider.useCallback[exposedSetSpreadsheet]"], [
        setSpreadsheetWithHistory
    ]);
    const evaluateFormulaContext = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "SpreadsheetProvider.useCallback[evaluateFormulaContext]": (sheetId, formulaExpressionWithEquals)=>{
            if (!internalSpreadsheetRef.current) {
                return "#REF!";
            }
            const spreadsheetClone = JSON.parse(JSON.stringify(internalSpreadsheetRef.current));
            return actualEvaluateFormulaLogic(spreadsheetClone, sheetId, formulaExpressionWithEquals, new Set());
        }
    }["SpreadsheetProvider.useCallback[evaluateFormulaContext]"], []);
    const loadSpreadsheet = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "SpreadsheetProvider.useCallback[loadSpreadsheet]": async (id)=>{
            setIsLoading(true);
            setActiveCellState(null);
            setSelectionRangeState(null);
            setUndoStack([]);
            setRedoStack([]);
            const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getSpreadsheet"])(id);
            if (result.success && result.data) {
                let loadedSpreadsheet = JSON.parse(JSON.stringify(result.data));
                loadedSpreadsheet.sheets = loadedSpreadsheet.sheets.map({
                    "SpreadsheetProvider.useCallback[loadSpreadsheet]": (sheet_from_db)=>{
                        const rowCount = sheet_from_db.rowCount > 0 ? sheet_from_db.rowCount : __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$spreadsheet$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_ROW_COUNT"];
                        const columnCount = sheet_from_db.columnCount > 0 ? sheet_from_db.columnCount : __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$spreadsheet$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_COLUMN_COUNT"];
                        let cellsFromDb = sheet_from_db.cells || [];
                        const newCells = Array.from({
                            length: rowCount
                        }, {
                            "SpreadsheetProvider.useCallback[loadSpreadsheet].newCells": (_, r)=>Array.from({
                                    length: columnCount
                                }, {
                                    "SpreadsheetProvider.useCallback[loadSpreadsheet].newCells": (_, c)=>{
                                        const existingCellData = cellsFromDb[r]?.[c];
                                        const baseCell = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$spreadsheet$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createEmptyCell"])(r, c);
                                        return existingCellData ? {
                                            ...baseCell,
                                            ...existingCellData,
                                            id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$spreadsheet$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCellId"])(r, c)
                                        } : baseCell;
                                    }
                                }["SpreadsheetProvider.useCallback[loadSpreadsheet].newCells"])
                        }["SpreadsheetProvider.useCallback[loadSpreadsheet].newCells"]);
                        const currentProcessingSheet = {
                            ...sheet_from_db,
                            cells: newCells,
                            rowCount,
                            columnCount,
                            columnWidths: sheet_from_db.columnWidths && sheet_from_db.columnWidths.length === columnCount ? sheet_from_db.columnWidths : Array(columnCount).fill(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$spreadsheet$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_COLUMN_WIDTH"]),
                            rowHeights: sheet_from_db.rowHeights && sheet_from_db.rowHeights.length === rowCount ? sheet_from_db.rowHeights : Array(rowCount).fill(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$spreadsheet$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_ROW_HEIGHT"]),
                            conditionalFormatRules: sheet_from_db.conditionalFormatRules || []
                        };
                        return currentProcessingSheet;
                    }
                }["SpreadsheetProvider.useCallback[loadSpreadsheet]"]);
                let spreadsheetAfterInitialEval = loadedSpreadsheet;
                loadedSpreadsheet.sheets.forEach({
                    "SpreadsheetProvider.useCallback[loadSpreadsheet]": (sheet)=>{
                        spreadsheetAfterInitialEval = reevaluateSheetFormulas(spreadsheetAfterInitialEval, sheet.id);
                    }
                }["SpreadsheetProvider.useCallback[loadSpreadsheet]"]);
                setSpreadsheetWithHistory({
                    "SpreadsheetProvider.useCallback[loadSpreadsheet]": ()=>spreadsheetAfterInitialEval
                }["SpreadsheetProvider.useCallback[loadSpreadsheet]"], 'load_no_reeval');
            } else {
                setSpreadsheetWithHistory({
                    "SpreadsheetProvider.useCallback[loadSpreadsheet]": ()=>null
                }["SpreadsheetProvider.useCallback[loadSpreadsheet]"], 'internal_no_history');
                setTimeout({
                    "SpreadsheetProvider.useCallback[loadSpreadsheet]": ()=>{
                        toast({
                            title: "Error",
                            description: `Failed to load spreadsheet: ${result.error || 'Not found'}.`,
                            variant: "destructive"
                        });
                    }
                }["SpreadsheetProvider.useCallback[loadSpreadsheet]"], 0);
            }
            setIsLoading(false);
        }
    }["SpreadsheetProvider.useCallback[loadSpreadsheet]"], [
        toast,
        setSpreadsheetWithHistory
    ]);
    const saveSpreadsheet = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "SpreadsheetProvider.useCallback[saveSpreadsheet]": async ()=>{
            if (!internalSpreadsheetRef.current) {
                setTimeout({
                    "SpreadsheetProvider.useCallback[saveSpreadsheet]": ()=>{
                        toast({
                            title: "Error",
                            description: "No spreadsheet data to save.",
                            variant: "destructive"
                        });
                    }
                }["SpreadsheetProvider.useCallback[saveSpreadsheet]"], 0);
                return;
            }
            setIsLoading(true);
            const spreadsheetToSave = JSON.parse(JSON.stringify(internalSpreadsheetRef.current));
            spreadsheetToSave.updatedAt = Date.now();
            const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["saveSpreadsheet"])(spreadsheetToSave);
            if (result.success) {
                setSpreadsheetWithHistory({
                    "SpreadsheetProvider.useCallback[saveSpreadsheet]": (prev)=>prev ? {
                            ...prev,
                            updatedAt: spreadsheetToSave.updatedAt
                        } : null
                }["SpreadsheetProvider.useCallback[saveSpreadsheet]"], 'save');
                setTimeout({
                    "SpreadsheetProvider.useCallback[saveSpreadsheet]": ()=>{
                        toast({
                            title: "Success",
                            description: "Spreadsheet saved locally."
                        });
                    }
                }["SpreadsheetProvider.useCallback[saveSpreadsheet]"], 0);
            } else {
                setTimeout({
                    "SpreadsheetProvider.useCallback[saveSpreadsheet]": ()=>{
                        toast({
                            title: "Error",
                            description: `Failed to save spreadsheet: ${result.error}.`,
                            variant: "destructive"
                        });
                    }
                }["SpreadsheetProvider.useCallback[saveSpreadsheet]"], 0);
            }
            setIsLoading(false);
        }
    }["SpreadsheetProvider.useCallback[saveSpreadsheet]"], [
        toast,
        setSpreadsheetWithHistory
    ]);
    const updateCell = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "SpreadsheetProvider.useCallback[updateCell]": (sheetId, rowIndex, colIndex, newCellData)=>{
            setSpreadsheetWithHistory({
                "SpreadsheetProvider.useCallback[updateCell]": (prevSpreadsheet)=>{
                    if (!prevSpreadsheet) return null;
                    let spreadsheetCopy = JSON.parse(JSON.stringify(prevSpreadsheet));
                    const sheetToUpdate = spreadsheetCopy.sheets.find({
                        "SpreadsheetProvider.useCallback[updateCell].sheetToUpdate": (sheet)=>sheet.id === sheetId
                    }["SpreadsheetProvider.useCallback[updateCell].sheetToUpdate"]);
                    if (!sheetToUpdate || rowIndex < 0 || rowIndex >= sheetToUpdate.rowCount || colIndex < 0 || colIndex >= sheetToUpdate.columnCount) {
                        console.error("updateCell called with invalid address or sheet not found:", sheetId, rowIndex, colIndex);
                        return prevSpreadsheet;
                    }
                    if (!sheetToUpdate.cells[rowIndex]) sheetToUpdate.cells[rowIndex] = [];
                    if (!sheetToUpdate.cells[rowIndex][colIndex]) sheetToUpdate.cells[rowIndex][colIndex] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$spreadsheet$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createEmptyCell"])(rowIndex, colIndex);
                    const cellToUpdate = sheetToUpdate.cells[rowIndex][colIndex];
                    if (newCellData.rawValue !== undefined) {
                        cellToUpdate.rawValue = newCellData.rawValue;
                    }
                    if (newCellData.style) {
                        cellToUpdate.style = {
                            ...cellToUpdate.style || {},
                            ...newCellData.style
                        };
                    }
                    spreadsheetCopy.updatedAt = Date.now();
                    return spreadsheetCopy; // Re-evaluation happens in setSpreadsheetWithHistory
                }
            }["SpreadsheetProvider.useCallback[updateCell]"], 'user_action');
        }
    }["SpreadsheetProvider.useCallback[updateCell]"], [
        setSpreadsheetWithHistory
    ]);
    const setActiveCellAndSelection = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "SpreadsheetProvider.useCallback[setActiveCellAndSelection]": (newCellAddress, isShiftKey, isDrag)=>{
            if (isActivelyEditingFormula) {
                return;
            }
            setActiveCellState({
                "SpreadsheetProvider.useCallback[setActiveCellAndSelection]": (currentActiveCell)=>{
                    if (newCellAddress === null) {
                        setSelectionRangeState(null);
                        return null;
                    }
                    const nextActiveCell = isDrag ? currentActiveCell || newCellAddress : newCellAddress;
                    setSelectionRangeState({
                        "SpreadsheetProvider.useCallback[setActiveCellAndSelection]": (currentSelRange)=>{
                            let startAddress = newCellAddress;
                            let endAddress = newCellAddress;
                            if (isDrag && currentSelRange?.start && currentSelRange.start.sheetId === newCellAddress.sheetId) {
                                startAddress = currentSelRange.start;
                                endAddress = newCellAddress;
                            } else if (isShiftKey && activeCell && activeCell.sheetId === newCellAddress.sheetId) {
                                startAddress = activeCell; // The anchor is the *current* active cell
                                endAddress = newCellAddress;
                            }
                            return {
                                start: startAddress,
                                end: endAddress
                            };
                        }
                    }["SpreadsheetProvider.useCallback[setActiveCellAndSelection]"]);
                    return nextActiveCell;
                }
            }["SpreadsheetProvider.useCallback[setActiveCellAndSelection]"]);
        }
    }["SpreadsheetProvider.useCallback[setActiveCellAndSelection]"], [
        isActivelyEditingFormula,
        activeCell,
        selectionRange
    ]); // selectionRange might be needed if drag uses its previous state
    const updateSelectedCellStyle = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "SpreadsheetProvider.useCallback[updateSelectedCellStyle]": (styleChanges)=>{
            if (!selectionRange || !internalSpreadsheetRef.current) return;
            setSpreadsheetWithHistory({
                "SpreadsheetProvider.useCallback[updateSelectedCellStyle]": (prevSpreadsheet)=>{
                    if (!prevSpreadsheet) return null;
                    const spreadsheetCopy = JSON.parse(JSON.stringify(prevSpreadsheet));
                    const { start, end } = selectionRange;
                    const sheetIdToUpdate = start.sheetId;
                    const sheetToUpdate = spreadsheetCopy.sheets.find({
                        "SpreadsheetProvider.useCallback[updateSelectedCellStyle].sheetToUpdate": (sheet)=>sheet.id === sheetIdToUpdate
                    }["SpreadsheetProvider.useCallback[updateSelectedCellStyle].sheetToUpdate"]);
                    if (!sheetToUpdate) return prevSpreadsheet;
                    const minRow = Math.min(start.rowIndex, end.rowIndex);
                    const maxRow = Math.max(start.rowIndex, end.rowIndex);
                    const minCol = Math.min(start.colIndex, end.colIndex);
                    const maxCol = Math.max(start.colIndex, end.colIndex);
                    for(let rIdx = minRow; rIdx <= maxRow; rIdx++){
                        for(let cIdx = minCol; cIdx <= maxCol; cIdx++){
                            if (!sheetToUpdate.cells[rIdx]) sheetToUpdate.cells[rIdx] = [];
                            if (!sheetToUpdate.cells[rIdx][cIdx]) sheetToUpdate.cells[rIdx][cIdx] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$spreadsheet$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createEmptyCell"])(rIdx, cIdx);
                            const cell = sheetToUpdate.cells[rIdx][cIdx];
                            cell.style = {
                                ...cell.style || {},
                                ...styleChanges
                            };
                        }
                    }
                    spreadsheetCopy.updatedAt = Date.now();
                    return spreadsheetCopy;
                }
            }["SpreadsheetProvider.useCallback[updateSelectedCellStyle]"], 'user_action');
        }
    }["SpreadsheetProvider.useCallback[updateSelectedCellStyle]"], [
        selectionRange,
        setSpreadsheetWithHistory
    ]);
    const formatSelectionAsTable = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "SpreadsheetProvider.useCallback[formatSelectionAsTable]": ()=>{
            if (!selectionRange || !internalSpreadsheetRef.current) return;
            setSpreadsheetWithHistory({
                "SpreadsheetProvider.useCallback[formatSelectionAsTable]": (prevSpreadsheet)=>{
                    if (!prevSpreadsheet) return null;
                    const spreadsheetCopy = JSON.parse(JSON.stringify(prevSpreadsheet));
                    const { start, end } = selectionRange;
                    const sheetIdToUpdate = start.sheetId;
                    const sheetToUpdate = spreadsheetCopy.sheets.find({
                        "SpreadsheetProvider.useCallback[formatSelectionAsTable].sheetToUpdate": (sheet)=>sheet.id === sheetIdToUpdate
                    }["SpreadsheetProvider.useCallback[formatSelectionAsTable].sheetToUpdate"]);
                    if (!sheetToUpdate) return prevSpreadsheet;
                    const minRow = Math.min(start.rowIndex, end.rowIndex);
                    const maxRow = Math.max(start.rowIndex, end.rowIndex);
                    const minCol = Math.min(start.colIndex, end.colIndex);
                    const maxCol = Math.max(start.colIndex, end.colIndex);
                    for(let r = minRow; r <= maxRow; r++){
                        for(let c = minCol; c <= maxCol; c++){
                            if (!sheetToUpdate.cells[r]) sheetToUpdate.cells[r] = [];
                            if (!sheetToUpdate.cells[r][c]) sheetToUpdate.cells[r][c] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$spreadsheet$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createEmptyCell"])(r, c);
                            const cell = sheetToUpdate.cells[r][c];
                            const isHeaderRow = r === minRow;
                            cell.style = {
                                ...cell.style || {},
                                bold: isHeaderRow,
                                hasBorder: true
                            };
                        }
                    }
                    spreadsheetCopy.updatedAt = Date.now();
                    setTimeout({
                        "SpreadsheetProvider.useCallback[formatSelectionAsTable]": ()=>toast({
                                title: "Table Formatted",
                                description: "Selected range formatted with header and borders."
                            })
                    }["SpreadsheetProvider.useCallback[formatSelectionAsTable]"], 0);
                    return spreadsheetCopy;
                }
            }["SpreadsheetProvider.useCallback[formatSelectionAsTable]"], 'user_action');
        }
    }["SpreadsheetProvider.useCallback[formatSelectionAsTable]"], [
        selectionRange,
        setSpreadsheetWithHistory,
        toast
    ]);
    const modifySheetStructure = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "SpreadsheetProvider.useCallback[modifySheetStructure]": (sheetId, operation, index)=>{
            setSpreadsheetWithHistory({
                "SpreadsheetProvider.useCallback[modifySheetStructure]": (prevSpreadsheet)=>{
                    if (!prevSpreadsheet) return null;
                    let spreadsheetCopy = JSON.parse(JSON.stringify(prevSpreadsheet));
                    const sheet = spreadsheetCopy.sheets.find({
                        "SpreadsheetProvider.useCallback[modifySheetStructure].sheet": (s)=>s.id === sheetId
                    }["SpreadsheetProvider.useCallback[modifySheetStructure].sheet"]);
                    if (!sheet) return prevSpreadsheet;
                    let updateRowCount = sheet.rowCount;
                    let updateColCount = sheet.columnCount;
                    let toastInfo = null;
                    switch(operation){
                        case 'insertRow':
                            if (index === undefined || index < 0 || index > updateRowCount) return prevSpreadsheet;
                            const newRowData = Array.from({
                                length: updateColCount
                            }, {
                                "SpreadsheetProvider.useCallback[modifySheetStructure].newRowData": (_, cIdx)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$spreadsheet$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createEmptyCell"])(index, cIdx)
                            }["SpreadsheetProvider.useCallback[modifySheetStructure].newRowData"]);
                            sheet.cells.splice(index, 0, newRowData);
                            if (sheet.rowHeights) sheet.rowHeights.splice(index, 0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$spreadsheet$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_ROW_HEIGHT"]);
                            else sheet.rowHeights = Array(updateRowCount + 1).fill(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$spreadsheet$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_ROW_HEIGHT"]);
                            updateRowCount++;
                            toastInfo = {
                                title: "Row Inserted",
                                description: `Row inserted at index ${index + 1}.`
                            };
                            break;
                        case 'deleteRow':
                            if (index === undefined || updateRowCount <= 1 || index < 0 || index >= updateRowCount) {
                                if (updateRowCount <= 1) toastInfo = {
                                    title: "Cannot Delete",
                                    description: "Spreadsheet must have at least one row.",
                                    variant: "destructive"
                                };
                                if (toastInfo) setTimeout({
                                    "SpreadsheetProvider.useCallback[modifySheetStructure]": ()=>{
                                        toast(toastInfo);
                                    }
                                }["SpreadsheetProvider.useCallback[modifySheetStructure]"], 0);
                                return prevSpreadsheet;
                            }
                            sheet.cells.splice(index, 1);
                            if (sheet.rowHeights) sheet.rowHeights.splice(index, 1);
                            updateRowCount--;
                            toastInfo = {
                                title: "Row Deleted",
                                description: `Row at index ${index + 1} deleted.`
                            };
                            break;
                        case 'appendRow':
                            const appendRowIndex = updateRowCount;
                            const appendedRowData = Array.from({
                                length: updateColCount
                            }, {
                                "SpreadsheetProvider.useCallback[modifySheetStructure].appendedRowData": (_, cIdx)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$spreadsheet$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createEmptyCell"])(appendRowIndex, cIdx)
                            }["SpreadsheetProvider.useCallback[modifySheetStructure].appendedRowData"]);
                            sheet.cells.push(appendedRowData);
                            if (sheet.rowHeights) sheet.rowHeights.push(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$spreadsheet$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_ROW_HEIGHT"]);
                            else sheet.rowHeights = Array(updateRowCount + 1).fill(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$spreadsheet$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_ROW_HEIGHT"]);
                            updateRowCount++;
                            toastInfo = {
                                title: "Row Added",
                                description: `Row added at the end.`
                            };
                            break;
                        case 'insertColumn':
                            if (index === undefined || index < 0 || index > updateColCount) return prevSpreadsheet;
                            sheet.cells.forEach({
                                "SpreadsheetProvider.useCallback[modifySheetStructure]": (row, rIdx)=>{
                                    row.splice(index, 0, (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$spreadsheet$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createEmptyCell"])(rIdx, index));
                                }
                            }["SpreadsheetProvider.useCallback[modifySheetStructure]"]);
                            if (sheet.columnWidths) sheet.columnWidths.splice(index, 0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$spreadsheet$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_COLUMN_WIDTH"]);
                            else sheet.columnWidths = Array(updateColCount + 1).fill(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$spreadsheet$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_COLUMN_WIDTH"]);
                            updateColCount++;
                            toastInfo = {
                                title: "Column Inserted",
                                description: `Column inserted at index ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$spreadsheet$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCellId"])(0, index).replace(/[0-9]/g, '')}.`
                            };
                            break;
                        case 'deleteColumn':
                            if (index === undefined || updateColCount <= 1 || index < 0 || index >= updateColCount) {
                                if (updateColCount <= 1) toastInfo = {
                                    title: "Cannot Delete",
                                    description: "Spreadsheet must have at least one column.",
                                    variant: "destructive"
                                };
                                if (toastInfo) setTimeout({
                                    "SpreadsheetProvider.useCallback[modifySheetStructure]": ()=>{
                                        toast(toastInfo);
                                    }
                                }["SpreadsheetProvider.useCallback[modifySheetStructure]"], 0);
                                return prevSpreadsheet;
                            }
                            sheet.cells.forEach({
                                "SpreadsheetProvider.useCallback[modifySheetStructure]": (row)=>row.splice(index, 1)
                            }["SpreadsheetProvider.useCallback[modifySheetStructure]"]);
                            if (sheet.columnWidths && sheet.columnWidths.length > index) sheet.columnWidths.splice(index, 1);
                            updateColCount--;
                            toastInfo = {
                                title: "Column Deleted",
                                description: `Column ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$spreadsheet$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCellId"])(0, index).replace(/[0-9]/g, '')} deleted.`
                            };
                            break;
                        case 'appendColumn':
                            const appendColIndex = updateColCount;
                            sheet.cells.forEach({
                                "SpreadsheetProvider.useCallback[modifySheetStructure]": (row, rIdx)=>row.push((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$spreadsheet$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createEmptyCell"])(rIdx, appendColIndex))
                            }["SpreadsheetProvider.useCallback[modifySheetStructure]"]);
                            if (sheet.columnWidths) sheet.columnWidths.push(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$spreadsheet$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_COLUMN_WIDTH"]);
                            else sheet.columnWidths = Array(updateColCount + 1).fill(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$spreadsheet$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_COLUMN_WIDTH"]);
                            updateColCount++;
                            toastInfo = {
                                title: "Column Added",
                                description: `Column added at the end.`
                            };
                            break;
                    }
                    if (toastInfo) {
                        setTimeout({
                            "SpreadsheetProvider.useCallback[modifySheetStructure]": ()=>toast(toastInfo)
                        }["SpreadsheetProvider.useCallback[modifySheetStructure]"], 0);
                    }
                    sheet.rowCount = updateRowCount;
                    sheet.columnCount = updateColCount;
                    for(let r = 0; r < sheet.rowCount; r++){
                        if (!sheet.cells[r]) sheet.cells[r] = Array.from({
                            length: sheet.columnCount
                        }, {
                            "SpreadsheetProvider.useCallback[modifySheetStructure]": (_, c)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$spreadsheet$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createEmptyCell"])(r, c)
                        }["SpreadsheetProvider.useCallback[modifySheetStructure]"]);
                        for(let c = 0; c < sheet.columnCount; c++){
                            if (sheet.cells[r]?.[c]) {
                                sheet.cells[r][c].id = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$spreadsheet$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCellId"])(r, c);
                            } else {
                                if (!sheet.cells[r]) sheet.cells[r] = [];
                                sheet.cells[r][c] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$spreadsheet$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createEmptyCell"])(r, c);
                            }
                        }
                    }
                    spreadsheetCopy.updatedAt = Date.now();
                    return spreadsheetCopy; // Re-evaluation happens in setSpreadsheetWithHistory
                }
            }["SpreadsheetProvider.useCallback[modifySheetStructure]"], 'user_action');
        }
    }["SpreadsheetProvider.useCallback[modifySheetStructure]"], [
        setSpreadsheetWithHistory,
        toast
    ]);
    const insertRow = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "SpreadsheetProvider.useCallback[insertRow]": (sheetId, rowIndex)=>modifySheetStructure(sheetId, 'insertRow', rowIndex)
    }["SpreadsheetProvider.useCallback[insertRow]"], [
        modifySheetStructure
    ]);
    const deleteRow = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "SpreadsheetProvider.useCallback[deleteRow]": (sheetId, rowIndex)=>modifySheetStructure(sheetId, 'deleteRow', rowIndex)
    }["SpreadsheetProvider.useCallback[deleteRow]"], [
        modifySheetStructure
    ]);
    const insertColumn = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "SpreadsheetProvider.useCallback[insertColumn]": (sheetId, colIndex)=>modifySheetStructure(sheetId, 'insertColumn', colIndex)
    }["SpreadsheetProvider.useCallback[insertColumn]"], [
        modifySheetStructure
    ]);
    const deleteColumn = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "SpreadsheetProvider.useCallback[deleteColumn]": (sheetId, colIndex)=>modifySheetStructure(sheetId, 'deleteColumn', colIndex)
    }["SpreadsheetProvider.useCallback[deleteColumn]"], [
        modifySheetStructure
    ]);
    const appendRow = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "SpreadsheetProvider.useCallback[appendRow]": (sheetId)=>modifySheetStructure(sheetId, 'appendRow')
    }["SpreadsheetProvider.useCallback[appendRow]"], [
        modifySheetStructure
    ]);
    const appendColumn = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "SpreadsheetProvider.useCallback[appendColumn]": (sheetId)=>modifySheetStructure(sheetId, 'appendColumn')
    }["SpreadsheetProvider.useCallback[appendColumn]"], [
        modifySheetStructure
    ]);
    const undo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "SpreadsheetProvider.useCallback[undo]": ()=>{
            if (undoStack.length > 0) {
                const previousState = undoStack[undoStack.length - 1];
                if (internalSpreadsheetRef.current) {
                    const currentCopyForRedo = JSON.parse(JSON.stringify(internalSpreadsheetRef.current));
                    setRedoStack({
                        "SpreadsheetProvider.useCallback[undo]": (prev)=>[
                                currentCopyForRedo,
                                ...prev.slice(0, MAX_UNDO_HISTORY - 1)
                            ]
                    }["SpreadsheetProvider.useCallback[undo]"]);
                }
                setUndoStack({
                    "SpreadsheetProvider.useCallback[undo]": (prev)=>prev.slice(0, -1)
                }["SpreadsheetProvider.useCallback[undo]"]);
                setSpreadsheetWithHistory({
                    "SpreadsheetProvider.useCallback[undo]": ()=>JSON.parse(JSON.stringify(previousState))
                }["SpreadsheetProvider.useCallback[undo]"], 'undo');
                setActiveCellState(null);
                setSelectionRangeState(null);
                setTimeout({
                    "SpreadsheetProvider.useCallback[undo]": ()=>{
                        toast({
                            title: "Undo",
                            description: "Last action reverted."
                        });
                    }
                }["SpreadsheetProvider.useCallback[undo]"], 0);
            }
        }
    }["SpreadsheetProvider.useCallback[undo]"], [
        undoStack,
        setSpreadsheetWithHistory,
        toast
    ]);
    const redo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "SpreadsheetProvider.useCallback[redo]": ()=>{
            if (redoStack.length > 0) {
                const nextState = redoStack[0];
                if (internalSpreadsheetRef.current) {
                    const currentCopyForUndo = JSON.parse(JSON.stringify(internalSpreadsheetRef.current));
                    setUndoStack({
                        "SpreadsheetProvider.useCallback[redo]": (prev)=>[
                                ...prev.slice(-MAX_UNDO_HISTORY + 1),
                                currentCopyForUndo
                            ]
                    }["SpreadsheetProvider.useCallback[redo]"]);
                }
                setRedoStack({
                    "SpreadsheetProvider.useCallback[redo]": (prev)=>prev.slice(1)
                }["SpreadsheetProvider.useCallback[redo]"]);
                setSpreadsheetWithHistory({
                    "SpreadsheetProvider.useCallback[redo]": ()=>JSON.parse(JSON.stringify(nextState))
                }["SpreadsheetProvider.useCallback[redo]"], 'redo');
                setActiveCellState(null);
                setSelectionRangeState(null);
                setTimeout({
                    "SpreadsheetProvider.useCallback[redo]": ()=>{
                        toast({
                            title: "Redo",
                            description: "Last undone action applied."
                        });
                    }
                }["SpreadsheetProvider.useCallback[redo]"], 0);
            }
        }
    }["SpreadsheetProvider.useCallback[redo]"], [
        redoStack,
        setSpreadsheetWithHistory,
        toast
    ]);
    const copySelectionToClipboard = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "SpreadsheetProvider.useCallback[copySelectionToClipboard]": async ()=>{
            if (!selectionRange || !internalSpreadsheetRef.current) {
                setTimeout({
                    "SpreadsheetProvider.useCallback[copySelectionToClipboard]": ()=>{
                        toast({
                            title: "Copy Failed",
                            description: "No cells selected to copy.",
                            variant: "destructive"
                        });
                    }
                }["SpreadsheetProvider.useCallback[copySelectionToClipboard]"], 0);
                return;
            }
            const { start, end } = selectionRange;
            const sheet = internalSpreadsheetRef.current.sheets.find({
                "SpreadsheetProvider.useCallback[copySelectionToClipboard].sheet": (s)=>s.id === start.sheetId
            }["SpreadsheetProvider.useCallback[copySelectionToClipboard].sheet"]);
            if (!sheet) {
                setTimeout({
                    "SpreadsheetProvider.useCallback[copySelectionToClipboard]": ()=>{
                        toast({
                            title: "Copy Failed",
                            description: "Sheet not found for selection.",
                            variant: "destructive"
                        });
                    }
                }["SpreadsheetProvider.useCallback[copySelectionToClipboard]"], 0);
                return;
            }
            const minRow = Math.min(start.rowIndex, end.rowIndex);
            const maxRow = Math.max(start.rowIndex, end.rowIndex);
            const minCol = Math.min(start.colIndex, end.colIndex);
            const maxCol = Math.max(start.colIndex, end.colIndex);
            let textToCopy = "";
            for(let r = minRow; r <= maxRow; r++){
                for(let c = minCol; c <= maxCol; c++){
                    const cell = sheet.cells[r]?.[c];
                    // For copy, prefer rawValue if it's a formula, otherwise displayed value
                    const valueToCopy = cell?.formula ? cell.formula : cell?.value === '' && (cell?.rawValue === '' || cell?.rawValue === null || cell?.rawValue === undefined) ? '' : cell?.value?.toString() ?? "";
                    textToCopy += valueToCopy;
                    if (c < maxCol) {
                        textToCopy += "\t";
                    }
                }
                if (r < maxRow) {
                    textToCopy += "\n";
                }
            }
            try {
                await navigator.clipboard.writeText(textToCopy);
                setTimeout({
                    "SpreadsheetProvider.useCallback[copySelectionToClipboard]": ()=>{
                        toast({
                            title: "Copied",
                            description: "Selected cells copied to clipboard."
                        });
                    }
                }["SpreadsheetProvider.useCallback[copySelectionToClipboard]"], 0);
            } catch (err) {
                console.error("Failed to copy text: ", err);
                setTimeout({
                    "SpreadsheetProvider.useCallback[copySelectionToClipboard]": ()=>{
                        toast({
                            title: "Copy Failed",
                            description: "Could not copy cells to clipboard.",
                            variant: "destructive"
                        });
                    }
                }["SpreadsheetProvider.useCallback[copySelectionToClipboard]"], 0);
            }
        }
    }["SpreadsheetProvider.useCallback[copySelectionToClipboard]"], [
        selectionRange,
        toast
    ]);
    const deleteSelectionContents = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "SpreadsheetProvider.useCallback[deleteSelectionContents]": ()=>{
            if (!selectionRange || !internalSpreadsheetRef.current) return;
            setSpreadsheetWithHistory({
                "SpreadsheetProvider.useCallback[deleteSelectionContents]": (prevSpreadsheet)=>{
                    if (!prevSpreadsheet) return null;
                    let spreadsheetCopy = JSON.parse(JSON.stringify(prevSpreadsheet));
                    const { start, end } = selectionRange;
                    const sheetToUpdate = spreadsheetCopy.sheets.find({
                        "SpreadsheetProvider.useCallback[deleteSelectionContents].sheetToUpdate": (s)=>s.id === start.sheetId
                    }["SpreadsheetProvider.useCallback[deleteSelectionContents].sheetToUpdate"]);
                    if (!sheetToUpdate) return prevSpreadsheet;
                    const minRow = Math.min(start.rowIndex, end.rowIndex);
                    const maxRow = Math.max(start.rowIndex, end.rowIndex);
                    const minCol = Math.min(start.colIndex, end.colIndex);
                    const maxCol = Math.max(start.colIndex, end.colIndex);
                    let changed = false;
                    for(let r = minRow; r <= maxRow; r++){
                        for(let c = minCol; c <= maxCol; c++){
                            if (!sheetToUpdate.cells[r]) sheetToUpdate.cells[r] = [];
                            if (!sheetToUpdate.cells[r][c]) sheetToUpdate.cells[r][c] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$spreadsheet$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createEmptyCell"])(r, c);
                            const cell = sheetToUpdate.cells[r][c];
                            if (cell.rawValue !== '' || cell.formula !== undefined) {
                                changed = true;
                            }
                            cell.rawValue = '';
                            cell.formula = undefined;
                        }
                    }
                    if (changed) {
                        spreadsheetCopy.updatedAt = Date.now();
                        setTimeout({
                            "SpreadsheetProvider.useCallback[deleteSelectionContents]": ()=>{
                                toast({
                                    title: "Contents Cleared",
                                    description: "Contents of selected cells have been cleared."
                                });
                            }
                        }["SpreadsheetProvider.useCallback[deleteSelectionContents]"], 0);
                    }
                    return spreadsheetCopy; // Re-evaluation happens in setSpreadsheetWithHistory
                }
            }["SpreadsheetProvider.useCallback[deleteSelectionContents]"], 'user_action');
        }
    }["SpreadsheetProvider.useCallback[deleteSelectionContents]"], [
        selectionRange,
        setSpreadsheetWithHistory,
        toast
    ]);
    const updateMultipleCellsRawValue = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "SpreadsheetProvider.useCallback[updateMultipleCellsRawValue]": (newValue)=>{
            if (!selectionRange || !internalSpreadsheetRef.current) return;
            setSpreadsheetWithHistory({
                "SpreadsheetProvider.useCallback[updateMultipleCellsRawValue]": (prevSpreadsheet)=>{
                    if (!prevSpreadsheet) return null;
                    let spreadsheetCopy = JSON.parse(JSON.stringify(prevSpreadsheet));
                    const { start, end } = selectionRange;
                    const sheetToUpdate = spreadsheetCopy.sheets.find({
                        "SpreadsheetProvider.useCallback[updateMultipleCellsRawValue].sheetToUpdate": (s)=>s.id === start.sheetId
                    }["SpreadsheetProvider.useCallback[updateMultipleCellsRawValue].sheetToUpdate"]);
                    if (!sheetToUpdate) return prevSpreadsheet;
                    const minRow = Math.min(start.rowIndex, end.rowIndex);
                    const maxRow = Math.max(start.rowIndex, end.rowIndex);
                    const minCol = Math.min(start.colIndex, end.colIndex);
                    const maxCol = Math.max(start.colIndex, end.colIndex);
                    for(let r = minRow; r <= maxRow; r++){
                        for(let c = minCol; c <= maxCol; c++){
                            if (!sheetToUpdate.cells[r]) sheetToUpdate.cells[r] = [];
                            if (!sheetToUpdate.cells[r][c]) sheetToUpdate.cells[r][c] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$spreadsheet$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createEmptyCell"])(r, c);
                            const cell = sheetToUpdate.cells[r][c];
                            cell.rawValue = newValue;
                        }
                    }
                    spreadsheetCopy.updatedAt = Date.now();
                    setTimeout({
                        "SpreadsheetProvider.useCallback[updateMultipleCellsRawValue]": ()=>{
                            toast({
                                title: "Cells Updated",
                                description: "Selected cells have been updated."
                            });
                        }
                    }["SpreadsheetProvider.useCallback[updateMultipleCellsRawValue]"], 0);
                    return spreadsheetCopy; // Re-evaluation happens in setSpreadsheetWithHistory
                }
            }["SpreadsheetProvider.useCallback[updateMultipleCellsRawValue]"], 'user_action');
        }
    }["SpreadsheetProvider.useCallback[updateMultipleCellsRawValue]"], [
        selectionRange,
        setSpreadsheetWithHistory,
        toast
    ]);
    const updateColumnWidth = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "SpreadsheetProvider.useCallback[updateColumnWidth]": (sheetId, colIndex, newWidth)=>{
            setSpreadsheetWithHistory({
                "SpreadsheetProvider.useCallback[updateColumnWidth]": (prev)=>{
                    if (!prev) return null;
                    const newSheetData = JSON.parse(JSON.stringify(prev));
                    const sheet = newSheetData.sheets.find({
                        "SpreadsheetProvider.useCallback[updateColumnWidth].sheet": (s)=>s.id === sheetId
                    }["SpreadsheetProvider.useCallback[updateColumnWidth].sheet"]);
                    if (sheet && sheet.columnWidths && colIndex < sheet.columnWidths.length) {
                        sheet.columnWidths[colIndex] = Math.max(20, newWidth); // Min width 20px
                        newSheetData.updatedAt = Date.now();
                    }
                    return newSheetData;
                }
            }["SpreadsheetProvider.useCallback[updateColumnWidth]"], 'user_action');
        }
    }["SpreadsheetProvider.useCallback[updateColumnWidth]"], [
        setSpreadsheetWithHistory
    ]);
    const updateRowHeight = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "SpreadsheetProvider.useCallback[updateRowHeight]": (sheetId, rowIndex, newHeight)=>{
            setSpreadsheetWithHistory({
                "SpreadsheetProvider.useCallback[updateRowHeight]": (prev)=>{
                    if (!prev) return null;
                    const newSheetData = JSON.parse(JSON.stringify(prev));
                    const sheet = newSheetData.sheets.find({
                        "SpreadsheetProvider.useCallback[updateRowHeight].sheet": (s)=>s.id === sheetId
                    }["SpreadsheetProvider.useCallback[updateRowHeight].sheet"]);
                    if (sheet && sheet.rowHeights && rowIndex < sheet.rowHeights.length) {
                        sheet.rowHeights[rowIndex] = Math.max(20, newHeight); // Min height 20px
                        newSheetData.updatedAt = Date.now();
                    }
                    return newSheetData;
                }
            }["SpreadsheetProvider.useCallback[updateRowHeight]"], 'user_action');
        }
    }["SpreadsheetProvider.useCallback[updateRowHeight]"], [
        setSpreadsheetWithHistory
    ]);
    const addConditionalFormatRule = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "SpreadsheetProvider.useCallback[addConditionalFormatRule]": (sheetId, rule)=>{
            setSpreadsheetWithHistory({
                "SpreadsheetProvider.useCallback[addConditionalFormatRule]": (prev)=>{
                    if (!prev) return null;
                    const newSheetData = JSON.parse(JSON.stringify(prev));
                    const sheet = newSheetData.sheets.find({
                        "SpreadsheetProvider.useCallback[addConditionalFormatRule].sheet": (s)=>s.id === sheetId
                    }["SpreadsheetProvider.useCallback[addConditionalFormatRule].sheet"]);
                    if (sheet) {
                        if (!sheet.conditionalFormatRules) sheet.conditionalFormatRules = [];
                        sheet.conditionalFormatRules.push(rule);
                        newSheetData.updatedAt = Date.now();
                        setTimeout({
                            "SpreadsheetProvider.useCallback[addConditionalFormatRule]": ()=>toast({
                                    title: "Rule Added",
                                    description: "Conditional formatting rule applied."
                                })
                        }["SpreadsheetProvider.useCallback[addConditionalFormatRule]"], 0);
                    }
                    return newSheetData; // Re-evaluation needed to apply styles
                }
            }["SpreadsheetProvider.useCallback[addConditionalFormatRule]"], 'user_action');
        }
    }["SpreadsheetProvider.useCallback[addConditionalFormatRule]"], [
        setSpreadsheetWithHistory,
        toast
    ]);
    const removeConditionalFormatRule = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "SpreadsheetProvider.useCallback[removeConditionalFormatRule]": (sheetId, ruleId)=>{
            setSpreadsheetWithHistory({
                "SpreadsheetProvider.useCallback[removeConditionalFormatRule]": (prev)=>{
                    if (!prev) return null;
                    const newSheetData = JSON.parse(JSON.stringify(prev));
                    const sheet = newSheetData.sheets.find({
                        "SpreadsheetProvider.useCallback[removeConditionalFormatRule].sheet": (s)=>s.id === sheetId
                    }["SpreadsheetProvider.useCallback[removeConditionalFormatRule].sheet"]);
                    if (sheet && sheet.conditionalFormatRules) {
                        sheet.conditionalFormatRules = sheet.conditionalFormatRules.filter({
                            "SpreadsheetProvider.useCallback[removeConditionalFormatRule]": (r)=>r.id !== ruleId
                        }["SpreadsheetProvider.useCallback[removeConditionalFormatRule]"]);
                        newSheetData.updatedAt = Date.now();
                        setTimeout({
                            "SpreadsheetProvider.useCallback[removeConditionalFormatRule]": ()=>toast({
                                    title: "Rule Removed",
                                    description: "Conditional formatting rule removed."
                                })
                        }["SpreadsheetProvider.useCallback[removeConditionalFormatRule]"], 0);
                    }
                    return newSheetData; // Re-evaluation needed
                }
            }["SpreadsheetProvider.useCallback[removeConditionalFormatRule]"], 'user_action');
        }
    }["SpreadsheetProvider.useCallback[removeConditionalFormatRule]"], [
        setSpreadsheetWithHistory,
        toast
    ]);
    const updateConditionalFormatRule = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "SpreadsheetProvider.useCallback[updateConditionalFormatRule]": (sheetId, updatedRule)=>{
            setSpreadsheetWithHistory({
                "SpreadsheetProvider.useCallback[updateConditionalFormatRule]": (prev)=>{
                    if (!prev) return null;
                    const newSheetData = JSON.parse(JSON.stringify(prev));
                    const sheet = newSheetData.sheets.find({
                        "SpreadsheetProvider.useCallback[updateConditionalFormatRule].sheet": (s)=>s.id === sheetId
                    }["SpreadsheetProvider.useCallback[updateConditionalFormatRule].sheet"]);
                    if (sheet && sheet.conditionalFormatRules) {
                        const ruleIndex = sheet.conditionalFormatRules.findIndex({
                            "SpreadsheetProvider.useCallback[updateConditionalFormatRule].ruleIndex": (r)=>r.id === updatedRule.id
                        }["SpreadsheetProvider.useCallback[updateConditionalFormatRule].ruleIndex"]);
                        if (ruleIndex !== -1) {
                            sheet.conditionalFormatRules[ruleIndex] = updatedRule;
                            newSheetData.updatedAt = Date.now();
                            setTimeout({
                                "SpreadsheetProvider.useCallback[updateConditionalFormatRule]": ()=>toast({
                                        title: "Rule Updated",
                                        description: "Conditional formatting rule updated."
                                    })
                            }["SpreadsheetProvider.useCallback[updateConditionalFormatRule]"], 0);
                        }
                    }
                    return newSheetData; // Re-evaluation needed
                }
            }["SpreadsheetProvider.useCallback[updateConditionalFormatRule]"], 'user_action');
        }
    }["SpreadsheetProvider.useCallback[updateConditionalFormatRule]"], [
        setSpreadsheetWithHistory,
        toast
    ]);
    const canUndo = undoStack.length > 0;
    const canRedo = redoStack.length > 0;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SpreadsheetContext.Provider, {
        value: {
            spreadsheet: internalSpreadsheetState,
            setSpreadsheet: exposedSetSpreadsheet,
            isLoading,
            loadSpreadsheet,
            saveSpreadsheet,
            updateCell,
            activeCell: activeCell,
            selectionRange: selectionRange,
            setActiveCellAndSelection,
            updateSelectedCellStyle,
            formatSelectionAsTable,
            insertRow,
            deleteRow,
            insertColumn,
            deleteColumn,
            appendRow,
            appendColumn,
            undo,
            redo,
            canUndo,
            canRedo,
            evaluateFormula: evaluateFormulaContext,
            copySelectionToClipboard,
            deleteSelectionContents,
            updateMultipleCellsRawValue,
            isActivelyEditingFormula: isActivelyEditingFormula,
            setIsActivelyEditingFormula,
            formulaBarApiRef,
            updateColumnWidth,
            updateRowHeight,
            addConditionalFormatRule,
            removeConditionalFormatRule,
            updateConditionalFormatRule
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/src/contexts/SpreadsheetContext.tsx",
        lineNumber: 1115,
        columnNumber: 5
    }, this);
}
_s(SpreadsheetProvider, "geeniFx6M/7p4pxuGuWz7XwCiA8=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$use$2d$toast$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useToast"]
    ];
});
_c = SpreadsheetProvider;
var _c;
__turbopack_context__.k.register(_c, "SpreadsheetProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/hooks/useSpreadsheet.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "useSpreadsheet": (()=>useSpreadsheet)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$SpreadsheetContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/contexts/SpreadsheetContext.tsx [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
;
function useSpreadsheet() {
    _s();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$SpreadsheetContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SpreadsheetContext"]);
    if (context === undefined) {
        throw new Error('useSpreadsheet must be used within a SpreadsheetProvider');
    }
    return context;
}
_s(useSpreadsheet, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/components/ui/button.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "Button": (()=>Button),
    "buttonVariants": (()=>buttonVariants)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@radix-ui/react-slot/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/class-variance-authority/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
;
;
;
;
;
const buttonVariants = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cva"])("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", {
    variants: {
        variant: {
            default: "bg-primary text-primary-foreground hover:bg-primary/90",
            destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
            outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
            secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
            ghost: "hover:bg-accent hover:text-accent-foreground",
            link: "text-primary underline-offset-4 hover:underline"
        },
        size: {
            default: "h-10 px-4 py-2",
            sm: "h-9 rounded-md px-3",
            lg: "h-11 rounded-md px-8",
            icon: "h-10 w-10"
        }
    },
    defaultVariants: {
        variant: "default",
        size: "default"
    }
});
const Button = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c = ({ className, variant, size, asChild = false, ...props }, ref)=>{
    const Comp = asChild ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Slot"] : "button";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Comp, {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(buttonVariants({
            variant,
            size,
            className
        })),
        ref: ref,
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/button.tsx",
        lineNumber: 46,
        columnNumber: 7
    }, this);
});
_c1 = Button;
Button.displayName = "Button";
;
var _c, _c1;
__turbopack_context__.k.register(_c, "Button$React.forwardRef");
__turbopack_context__.k.register(_c1, "Button");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/components/ui/input.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "Input": (()=>Input)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
;
;
;
const Input = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c = ({ className, type, ...props }, ref)=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
        type: type,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", className),
        ref: ref,
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/input.tsx",
        lineNumber: 8,
        columnNumber: 7
    }, this);
});
_c1 = Input;
Input.displayName = "Input";
;
var _c, _c1;
__turbopack_context__.k.register(_c, "Input$React.forwardRef");
__turbopack_context__.k.register(_c1, "Input");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/components/icons/OfflineSheetLogo.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "OfflineSheetLogo": (()=>OfflineSheetLogo)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
;
function OfflineSheetLogo(props) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 100 100",
        width: "40",
        height: "40",
        "aria-label": "OfflineSheet Logo",
        ...props,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("defs", {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("linearGradient", {
                    id: "logoGradient",
                    x1: "0%",
                    y1: "0%",
                    x2: "100%",
                    y2: "100%",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                            offset: "0%",
                            style: {
                                stopColor: 'hsl(var(--primary))',
                                stopOpacity: 1
                            }
                        }, void 0, false, {
                            fileName: "[project]/src/components/icons/OfflineSheetLogo.tsx",
                            lineNumber: 15,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                            offset: "100%",
                            style: {
                                stopColor: 'hsl(var(--accent))',
                                stopOpacity: 1
                            }
                        }, void 0, false, {
                            fileName: "[project]/src/components/icons/OfflineSheetLogo.tsx",
                            lineNumber: 16,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/icons/OfflineSheetLogo.tsx",
                    lineNumber: 14,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/icons/OfflineSheetLogo.tsx",
                lineNumber: 13,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                width: "100",
                height: "100",
                rx: "15",
                fill: "url(#logoGradient)"
            }, void 0, false, {
                fileName: "[project]/src/components/icons/OfflineSheetLogo.tsx",
                lineNumber: 19,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M25 75 L25 25 L75 25 M25 40 L65 40 M25 55 L65 55 M40 25 L40 75 M55 25 L55 75",
                stroke: "hsl(var(--primary-foreground))",
                strokeWidth: "5",
                fill: "none",
                strokeLinecap: "round",
                strokeLinejoin: "round"
            }, void 0, false, {
                fileName: "[project]/src/components/icons/OfflineSheetLogo.tsx",
                lineNumber: 20,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/icons/OfflineSheetLogo.tsx",
        lineNumber: 5,
        columnNumber: 5
    }, this);
}
_c = OfflineSheetLogo;
var _c;
__turbopack_context__.k.register(_c, "OfflineSheetLogo");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/components/ui/menubar.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "Menubar": (()=>Menubar),
    "MenubarCheckboxItem": (()=>MenubarCheckboxItem),
    "MenubarContent": (()=>MenubarContent),
    "MenubarGroup": (()=>MenubarGroup),
    "MenubarItem": (()=>MenubarItem),
    "MenubarLabel": (()=>MenubarLabel),
    "MenubarMenu": (()=>MenubarMenu),
    "MenubarPortal": (()=>MenubarPortal),
    "MenubarRadioGroup": (()=>MenubarRadioGroup),
    "MenubarRadioItem": (()=>MenubarRadioItem),
    "MenubarSeparator": (()=>MenubarSeparator),
    "MenubarShortcut": (()=>MenubarShortcut),
    "MenubarSub": (()=>MenubarSub),
    "MenubarSubContent": (()=>MenubarSubContent),
    "MenubarSubTrigger": (()=>MenubarSubTrigger),
    "MenubarTrigger": (()=>MenubarTrigger)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$menubar$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@radix-ui/react-menubar/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/check.js [app-client] (ecmascript) <export default as Check>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-right.js [app-client] (ecmascript) <export default as ChevronRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Circle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle.js [app-client] (ecmascript) <export default as Circle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
"use client";
;
;
;
;
;
function MenubarMenu({ ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$menubar$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Menu"], {
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/menubar.tsx",
        lineNumber: 12,
        columnNumber: 10
    }, this);
}
_c = MenubarMenu;
function MenubarGroup({ ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$menubar$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Group"], {
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/menubar.tsx",
        lineNumber: 18,
        columnNumber: 10
    }, this);
}
_c1 = MenubarGroup;
function MenubarPortal({ ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$menubar$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Portal"], {
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/menubar.tsx",
        lineNumber: 24,
        columnNumber: 10
    }, this);
}
_c2 = MenubarPortal;
function MenubarRadioGroup({ ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$menubar$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RadioGroup"], {
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/menubar.tsx",
        lineNumber: 30,
        columnNumber: 10
    }, this);
}
_c3 = MenubarRadioGroup;
function MenubarSub({ ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$menubar$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Sub"], {
        "data-slot": "menubar-sub",
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/menubar.tsx",
        lineNumber: 36,
        columnNumber: 10
    }, this);
}
_c4 = MenubarSub;
const Menubar = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c5 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$menubar$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex h-10 items-center space-x-1 rounded-md border bg-background p-1", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/menubar.tsx",
        lineNumber: 43,
        columnNumber: 3
    }, this));
_c6 = Menubar;
Menubar.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$menubar$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"].displayName;
const MenubarTrigger = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c7 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$menubar$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Trigger"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex cursor-default select-none items-center rounded-sm px-3 py-1.5 text-sm font-medium outline-none focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/menubar.tsx",
        lineNumber: 58,
        columnNumber: 3
    }, this));
_c8 = MenubarTrigger;
MenubarTrigger.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$menubar$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Trigger"].displayName;
const MenubarSubTrigger = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c9 = ({ className, inset, children, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$menubar$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SubTrigger"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground", inset && "pl-8", className),
        ...props,
        children: [
            children,
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__["ChevronRight"], {
                className: "ml-auto h-4 w-4"
            }, void 0, false, {
                fileName: "[project]/src/components/ui/menubar.tsx",
                lineNumber: 85,
                columnNumber: 5
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ui/menubar.tsx",
        lineNumber: 75,
        columnNumber: 3
    }, this));
_c10 = MenubarSubTrigger;
MenubarSubTrigger.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$menubar$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SubTrigger"].displayName;
const MenubarSubContent = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c11 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$menubar$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SubContent"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/menubar.tsx",
        lineNumber: 94,
        columnNumber: 3
    }, this));
_c12 = MenubarSubContent;
MenubarSubContent.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$menubar$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SubContent"].displayName;
const MenubarContent = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c13 = ({ className, align = "start", alignOffset = -4, sideOffset = 8, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$menubar$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Portal"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$menubar$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Content"], {
            ref: ref,
            align: align,
            alignOffset: alignOffset,
            sideOffset: sideOffset,
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("z-50 min-w-[12rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2", className),
            ...props
        }, void 0, false, {
            fileName: "[project]/src/components/ui/menubar.tsx",
            lineNumber: 114,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/ui/menubar.tsx",
        lineNumber: 113,
        columnNumber: 5
    }, this));
_c14 = MenubarContent;
MenubarContent.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$menubar$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Content"].displayName;
const MenubarItem = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c15 = ({ className, inset, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$menubar$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Item"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", inset && "pl-8", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/menubar.tsx",
        lineNumber: 136,
        columnNumber: 3
    }, this));
_c16 = MenubarItem;
MenubarItem.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$menubar$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Item"].displayName;
const MenubarCheckboxItem = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c17 = ({ className, children, checked, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$menubar$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CheckboxItem"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className),
        checked: checked,
        ...props,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$menubar$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ItemIndicator"], {
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                        className: "h-4 w-4"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/menubar.tsx",
                        lineNumber: 163,
                        columnNumber: 9
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/ui/menubar.tsx",
                    lineNumber: 162,
                    columnNumber: 7
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/ui/menubar.tsx",
                lineNumber: 161,
                columnNumber: 5
            }, this),
            children
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ui/menubar.tsx",
        lineNumber: 152,
        columnNumber: 3
    }, this));
_c18 = MenubarCheckboxItem;
MenubarCheckboxItem.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$menubar$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CheckboxItem"].displayName;
const MenubarRadioItem = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c19 = ({ className, children, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$menubar$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RadioItem"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className),
        ...props,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$menubar$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ItemIndicator"], {
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Circle$3e$__["Circle"], {
                        className: "h-2 w-2 fill-current"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/menubar.tsx",
                        lineNumber: 185,
                        columnNumber: 9
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/ui/menubar.tsx",
                    lineNumber: 184,
                    columnNumber: 7
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/ui/menubar.tsx",
                lineNumber: 183,
                columnNumber: 5
            }, this),
            children
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ui/menubar.tsx",
        lineNumber: 175,
        columnNumber: 3
    }, this));
_c20 = MenubarRadioItem;
MenubarRadioItem.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$menubar$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RadioItem"].displayName;
const MenubarLabel = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c21 = ({ className, inset, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$menubar$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("px-2 py-1.5 text-sm font-semibold", inset && "pl-8", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/menubar.tsx",
        lineNumber: 199,
        columnNumber: 3
    }, this));
_c22 = MenubarLabel;
MenubarLabel.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$menubar$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"].displayName;
const MenubarSeparator = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c23 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$menubar$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Separator"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("-mx-1 my-1 h-px bg-muted", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/menubar.tsx",
        lineNumber: 215,
        columnNumber: 3
    }, this));
_c24 = MenubarSeparator;
MenubarSeparator.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$menubar$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Separator"].displayName;
const MenubarShortcut = ({ className, ...props })=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("ml-auto text-xs tracking-widest text-muted-foreground", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/menubar.tsx",
        lineNumber: 228,
        columnNumber: 5
    }, this);
};
_c25 = MenubarShortcut;
MenubarShortcut.displayname = "MenubarShortcut";
;
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7, _c8, _c9, _c10, _c11, _c12, _c13, _c14, _c15, _c16, _c17, _c18, _c19, _c20, _c21, _c22, _c23, _c24, _c25;
__turbopack_context__.k.register(_c, "MenubarMenu");
__turbopack_context__.k.register(_c1, "MenubarGroup");
__turbopack_context__.k.register(_c2, "MenubarPortal");
__turbopack_context__.k.register(_c3, "MenubarRadioGroup");
__turbopack_context__.k.register(_c4, "MenubarSub");
__turbopack_context__.k.register(_c5, "Menubar$React.forwardRef");
__turbopack_context__.k.register(_c6, "Menubar");
__turbopack_context__.k.register(_c7, "MenubarTrigger$React.forwardRef");
__turbopack_context__.k.register(_c8, "MenubarTrigger");
__turbopack_context__.k.register(_c9, "MenubarSubTrigger$React.forwardRef");
__turbopack_context__.k.register(_c10, "MenubarSubTrigger");
__turbopack_context__.k.register(_c11, "MenubarSubContent$React.forwardRef");
__turbopack_context__.k.register(_c12, "MenubarSubContent");
__turbopack_context__.k.register(_c13, "MenubarContent$React.forwardRef");
__turbopack_context__.k.register(_c14, "MenubarContent");
__turbopack_context__.k.register(_c15, "MenubarItem$React.forwardRef");
__turbopack_context__.k.register(_c16, "MenubarItem");
__turbopack_context__.k.register(_c17, "MenubarCheckboxItem$React.forwardRef");
__turbopack_context__.k.register(_c18, "MenubarCheckboxItem");
__turbopack_context__.k.register(_c19, "MenubarRadioItem$React.forwardRef");
__turbopack_context__.k.register(_c20, "MenubarRadioItem");
__turbopack_context__.k.register(_c21, "MenubarLabel$React.forwardRef");
__turbopack_context__.k.register(_c22, "MenubarLabel");
__turbopack_context__.k.register(_c23, "MenubarSeparator$React.forwardRef");
__turbopack_context__.k.register(_c24, "MenubarSeparator");
__turbopack_context__.k.register(_c25, "MenubarShortcut");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/components/ui/separator.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "Separator": (()=>Separator)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$separator$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@radix-ui/react-separator/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
"use client";
;
;
;
;
const Separator = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c = ({ className, orientation = "horizontal", decorative = true, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$separator$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"], {
        ref: ref,
        decorative: decorative,
        orientation: orientation,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("shrink-0 bg-border", orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/separator.tsx",
        lineNumber: 17,
        columnNumber: 5
    }, this));
_c1 = Separator;
Separator.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$separator$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"].displayName;
;
var _c, _c1;
__turbopack_context__.k.register(_c, "Separator$React.forwardRef");
__turbopack_context__.k.register(_c1, "Separator");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/components/ui/dialog.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "Dialog": (()=>Dialog),
    "DialogClose": (()=>DialogClose),
    "DialogContent": (()=>DialogContent),
    "DialogDescription": (()=>DialogDescription),
    "DialogFooter": (()=>DialogFooter),
    "DialogHeader": (()=>DialogHeader),
    "DialogOverlay": (()=>DialogOverlay),
    "DialogPortal": (()=>DialogPortal),
    "DialogTitle": (()=>DialogTitle),
    "DialogTrigger": (()=>DialogTrigger)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@radix-ui/react-dialog/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
"use client";
;
;
;
;
;
const Dialog = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"];
const DialogTrigger = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Trigger"];
const DialogPortal = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Portal"];
const DialogClose = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Close"];
const DialogOverlay = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Overlay"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/dialog.tsx",
        lineNumber: 21,
        columnNumber: 3
    }, this));
_c = DialogOverlay;
DialogOverlay.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Overlay"].displayName;
const DialogContent = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c1 = ({ className, children, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DialogPortal, {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DialogOverlay, {}, void 0, false, {
                fileName: "[project]/src/components/ui/dialog.tsx",
                lineNumber: 37,
                columnNumber: 5
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Content"], {
                ref: ref,
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg", className),
                ...props,
                children: [
                    children,
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Close"], {
                        className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                className: "h-4 w-4"
                            }, void 0, false, {
                                fileName: "[project]/src/components/ui/dialog.tsx",
                                lineNumber: 48,
                                columnNumber: 9
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "sr-only",
                                children: "Close"
                            }, void 0, false, {
                                fileName: "[project]/src/components/ui/dialog.tsx",
                                lineNumber: 49,
                                columnNumber: 9
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/ui/dialog.tsx",
                        lineNumber: 47,
                        columnNumber: 7
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ui/dialog.tsx",
                lineNumber: 38,
                columnNumber: 5
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ui/dialog.tsx",
        lineNumber: 36,
        columnNumber: 3
    }, this));
_c2 = DialogContent;
DialogContent.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Content"].displayName;
const DialogHeader = ({ className, ...props })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex flex-col space-y-1.5 text-center sm:text-left", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/dialog.tsx",
        lineNumber: 60,
        columnNumber: 3
    }, this);
_c3 = DialogHeader;
DialogHeader.displayName = "DialogHeader";
const DialogFooter = ({ className, ...props })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/dialog.tsx",
        lineNumber: 74,
        columnNumber: 3
    }, this);
_c4 = DialogFooter;
DialogFooter.displayName = "DialogFooter";
const DialogTitle = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c5 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Title"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("text-lg font-semibold leading-none tracking-tight", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/dialog.tsx",
        lineNumber: 88,
        columnNumber: 3
    }, this));
_c6 = DialogTitle;
DialogTitle.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Title"].displayName;
const DialogDescription = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c7 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Description"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("text-sm text-muted-foreground", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/dialog.tsx",
        lineNumber: 103,
        columnNumber: 3
    }, this));
_c8 = DialogDescription;
DialogDescription.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Description"].displayName;
;
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7, _c8;
__turbopack_context__.k.register(_c, "DialogOverlay");
__turbopack_context__.k.register(_c1, "DialogContent$React.forwardRef");
__turbopack_context__.k.register(_c2, "DialogContent");
__turbopack_context__.k.register(_c3, "DialogHeader");
__turbopack_context__.k.register(_c4, "DialogFooter");
__turbopack_context__.k.register(_c5, "DialogTitle$React.forwardRef");
__turbopack_context__.k.register(_c6, "DialogTitle");
__turbopack_context__.k.register(_c7, "DialogDescription$React.forwardRef");
__turbopack_context__.k.register(_c8, "DialogDescription");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/components/ui/scroll-area.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "ScrollArea": (()=>ScrollArea),
    "ScrollBar": (()=>ScrollBar)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$scroll$2d$area$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@radix-ui/react-scroll-area/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
"use client";
;
;
;
;
const ScrollArea = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c = ({ className, children, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$scroll$2d$area$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("relative overflow-hidden", className),
        ...props,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$scroll$2d$area$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Viewport"], {
                className: "h-full w-full rounded-[inherit]",
                children: children
            }, void 0, false, {
                fileName: "[project]/src/components/ui/scroll-area.tsx",
                lineNumber: 17,
                columnNumber: 5
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ScrollBar, {}, void 0, false, {
                fileName: "[project]/src/components/ui/scroll-area.tsx",
                lineNumber: 20,
                columnNumber: 5
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$scroll$2d$area$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Corner"], {}, void 0, false, {
                fileName: "[project]/src/components/ui/scroll-area.tsx",
                lineNumber: 21,
                columnNumber: 5
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ui/scroll-area.tsx",
        lineNumber: 12,
        columnNumber: 3
    }, this));
_c1 = ScrollArea;
ScrollArea.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$scroll$2d$area$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"].displayName;
const ScrollBar = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(({ className, orientation = "vertical", ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$scroll$2d$area$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ScrollAreaScrollbar"], {
        ref: ref,
        orientation: orientation,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex touch-none select-none transition-colors", orientation === "vertical" && "h-full w-2.5 border-l border-l-transparent p-[1px]", orientation === "horizontal" && "h-2.5 flex-col border-t border-t-transparent p-[1px]", className),
        ...props,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$scroll$2d$area$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ScrollAreaThumb"], {
            className: "relative flex-1 rounded-full bg-border"
        }, void 0, false, {
            fileName: "[project]/src/components/ui/scroll-area.tsx",
            lineNumber: 43,
            columnNumber: 5
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/ui/scroll-area.tsx",
        lineNumber: 30,
        columnNumber: 3
    }, this));
_c2 = ScrollBar;
ScrollBar.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$scroll$2d$area$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ScrollAreaScrollbar"].displayName;
;
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "ScrollArea$React.forwardRef");
__turbopack_context__.k.register(_c1, "ScrollArea");
__turbopack_context__.k.register(_c2, "ScrollBar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/components/ui/table.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "Table": (()=>Table),
    "TableBody": (()=>TableBody),
    "TableCaption": (()=>TableCaption),
    "TableCell": (()=>TableCell),
    "TableFooter": (()=>TableFooter),
    "TableHead": (()=>TableHead),
    "TableHeader": (()=>TableHeader),
    "TableRow": (()=>TableRow)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
;
;
;
const Table = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "relative w-full overflow-auto",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
            ref: ref,
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("w-full caption-bottom text-sm", className),
            ...props
        }, void 0, false, {
            fileName: "[project]/src/components/ui/table.tsx",
            lineNumber: 10,
            columnNumber: 5
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/ui/table.tsx",
        lineNumber: 9,
        columnNumber: 3
    }, this));
_c1 = Table;
Table.displayName = "Table";
const TableHeader = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c2 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("[&_tr]:border-b", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/table.tsx",
        lineNumber: 23,
        columnNumber: 3
    }, this));
_c3 = TableHeader;
TableHeader.displayName = "TableHeader";
const TableBody = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c4 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("[&_tr:last-child]:border-0", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/table.tsx",
        lineNumber: 31,
        columnNumber: 3
    }, this));
_c5 = TableBody;
TableBody.displayName = "TableBody";
const TableFooter = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c6 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tfoot", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("border-t bg-muted/50 font-medium [&>tr]:last:border-b-0", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/table.tsx",
        lineNumber: 43,
        columnNumber: 3
    }, this));
_c7 = TableFooter;
TableFooter.displayName = "TableFooter";
const TableRow = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c8 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/table.tsx",
        lineNumber: 58,
        columnNumber: 3
    }, this));
_c9 = TableRow;
TableRow.displayName = "TableRow";
const TableHead = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c10 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/table.tsx",
        lineNumber: 73,
        columnNumber: 3
    }, this));
_c11 = TableHead;
TableHead.displayName = "TableHead";
const TableCell = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c12 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("p-4 align-middle [&:has([role=checkbox])]:pr-0", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/table.tsx",
        lineNumber: 88,
        columnNumber: 3
    }, this));
_c13 = TableCell;
TableCell.displayName = "TableCell";
const TableCaption = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c14 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("caption", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("mt-4 text-sm text-muted-foreground", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/table.tsx",
        lineNumber: 100,
        columnNumber: 3
    }, this));
_c15 = TableCaption;
TableCaption.displayName = "TableCaption";
;
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7, _c8, _c9, _c10, _c11, _c12, _c13, _c14, _c15;
__turbopack_context__.k.register(_c, "Table$React.forwardRef");
__turbopack_context__.k.register(_c1, "Table");
__turbopack_context__.k.register(_c2, "TableHeader$React.forwardRef");
__turbopack_context__.k.register(_c3, "TableHeader");
__turbopack_context__.k.register(_c4, "TableBody$React.forwardRef");
__turbopack_context__.k.register(_c5, "TableBody");
__turbopack_context__.k.register(_c6, "TableFooter$React.forwardRef");
__turbopack_context__.k.register(_c7, "TableFooter");
__turbopack_context__.k.register(_c8, "TableRow$React.forwardRef");
__turbopack_context__.k.register(_c9, "TableRow");
__turbopack_context__.k.register(_c10, "TableHead$React.forwardRef");
__turbopack_context__.k.register(_c11, "TableHead");
__turbopack_context__.k.register(_c12, "TableCell$React.forwardRef");
__turbopack_context__.k.register(_c13, "TableCell");
__turbopack_context__.k.register(_c14, "TableCaption$React.forwardRef");
__turbopack_context__.k.register(_c15, "TableCaption");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/components/spreadsheet/AvailableFunctionsDialog.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "AvailableFunctionsDialog": (()=>AvailableFunctionsDialog)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/dialog.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$scroll$2d$area$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/scroll-area.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/table.tsx [app-client] (ecmascript)");
"use client";
;
;
;
;
const functionsList = [
    // Math & Trig
    {
        name: "SUM",
        syntax: "SUM(number1, [number2], ...)",
        description: "Adds all the numbers in a range of cells."
    },
    {
        name: "AVERAGE",
        syntax: "AVERAGE(number1, [number2], ...)",
        description: "Returns the average (arithmetic mean) of its arguments."
    },
    {
        name: "COUNT",
        syntax: "COUNT(value1, [value2], ...)",
        description: "Counts the number of cells that contain numbers."
    },
    {
        name: "MAX",
        syntax: "MAX(number1, [number2], ...)",
        description: "Returns the largest value in a set of values."
    },
    {
        name: "MIN",
        syntax: "MIN(number1, [number2], ...)",
        description: "Returns the smallest number in a set of values."
    },
    {
        name: "ROUND",
        syntax: "ROUND(number, num_digits)",
        description: "Rounds a number to a specified number of digits."
    },
    {
        name: "RAND",
        syntax: "RAND()",
        description: "Returns an evenly distributed random real number greater than or equal to 0 and less than 1."
    },
    {
        name: "RANDBETWEEN",
        syntax: "RANDBETWEEN(bottom, top)",
        description: "Returns a random integer number between the numbers you specify."
    },
    {
        name: "ABS",
        syntax: "ABS(number)",
        description: "Returns the absolute value of a number."
    },
    {
        name: "INT",
        syntax: "INT(number)",
        description: "Rounds a number down to the nearest integer."
    },
    {
        name: "MOD",
        syntax: "MOD(number, divisor)",
        description: "Returns the remainder after a number is divided by a divisor."
    },
    {
        name: "POWER",
        syntax: "POWER(number, power)",
        description: "Returns the result of a number raised to a power."
    },
    {
        name: "PRODUCT",
        syntax: "PRODUCT(number1, [number2], ...)",
        description: "Multiplies all the numbers given as arguments."
    },
    {
        name: "SQRT",
        syntax: "SQRT(number)",
        description: "Returns a positive square root."
    },
    {
        name: "SUBTOTAL",
        syntax: "SUBTOTAL(function_num, ref1, [ref2],...)",
        description: "Returns a subtotal in a list or database. It is versatile, allowing various functions like SUM, AVERAGE, COUNT, etc., while ignoring other subtotals and optionally hidden rows."
    },
    // Text
    {
        name: "CONCATENATE",
        syntax: "CONCATENATE(text1, [text2], ...)",
        description: "Joins several text strings into one text string. (Excel also supports CONCAT)."
    },
    {
        name: "TEXT",
        syntax: "TEXT(value, format_text)",
        description: "Converts a value to text in a specific number format."
    },
    {
        name: "LEFT",
        syntax: "LEFT(text, [num_chars])",
        description: "Returns the specified number of characters from the start of a text string."
    },
    {
        name: "RIGHT",
        syntax: "RIGHT(text, [num_chars])",
        description: "Returns the specified number of characters from the end of a text string."
    },
    {
        name: "MID",
        syntax: "MID(text, start_num, num_chars)",
        description: "Returns a specific number of characters from a text string, starting at the position you specify."
    },
    {
        name: "LEN",
        syntax: "LEN(text)",
        description: "Returns the number of characters in a text string."
    },
    {
        name: "FIND",
        syntax: "FIND(find_text, within_text, [start_num])",
        description: "Finds one text string within another (case-sensitive)."
    },
    {
        name: "REPLACE",
        syntax: "REPLACE(old_text, start_num, num_chars, new_text)",
        description: "Replaces part of a text string with a different text string."
    },
    {
        name: "SUBSTITUTE",
        syntax: "SUBSTITUTE(text, old_text, new_text, [instance_num])",
        description: "Substitutes new_text for old_text in a text string."
    },
    {
        name: "TRIM",
        syntax: "TRIM(text)",
        description: "Removes leading and trailing spaces from text."
    },
    // Logical
    {
        name: "IF",
        syntax: "IF(logical_test, value_if_true, [value_if_false])",
        description: "Checks whether a condition is met, and returns one value if TRUE, and another value if FALSE."
    },
    {
        name: "AND",
        syntax: "AND(logical1, [logical2], ...)",
        description: "Returns TRUE if all its arguments are TRUE; returns FALSE if one or more arguments are FALSE."
    },
    {
        name: "OR",
        syntax: "OR(logical1, [logical2], ...)",
        description: "Returns TRUE if any argument is TRUE; returns FALSE if all arguments are FALSE."
    },
    {
        name: "NOT",
        syntax: "NOT(logical)",
        description: "Reverses the logical value of its argument."
    },
    {
        name: "IFERROR",
        syntax: "IFERROR(value, value_if_error)",
        description: "Returns value_if_error if expression is an error and the value of the expression itself otherwise."
    },
    // Date & Time
    {
        name: "TODAY",
        syntax: "TODAY()",
        description: "Returns the current date as a serial number."
    },
    {
        name: "NOW",
        syntax: "NOW()",
        description: "Returns the current date and time as a serial number."
    },
    {
        name: "DATE",
        syntax: "DATE(year, month, day)",
        description: "Returns the serial number of a particular date."
    },
    {
        name: "YEAR",
        syntax: "YEAR(serial_number)",
        description: "Returns the year corresponding to a date."
    },
    {
        name: "MONTH",
        syntax: "MONTH(serial_number)",
        description: "Returns the month, a number from 1 (January) to 12 (December)."
    },
    {
        name: "DAY",
        syntax: "DAY(serial_number)",
        description: "Returns the day of the month, a number from 1 to 31."
    },
    {
        name: "HOUR",
        syntax: "HOUR(serial_number)",
        description: "Returns the hour as a number from 0 (12:00 A.M.) to 23 (11:00 P.M.)."
    },
    {
        name: "MINUTE",
        syntax: "MINUTE(serial_number)",
        description: "Returns the minute as a number from 0 to 59."
    },
    {
        name: "SECOND",
        syntax: "SECOND(serial_number)",
        description: "Returns the second as a number from 0 to 59."
    },
    {
        name: "EDATE",
        syntax: "EDATE(start_date, months)",
        description: "Returns the serial number of the date that is the indicated number of months before or after the start date."
    },
    // Lookup & Reference
    {
        name: "VLOOKUP",
        syntax: "VLOOKUP(lookup_value, table_array, col_index_num, [range_lookup])",
        description: "Looks for a value in the leftmost column of a table, and then returns a value in the same row from a column you specify."
    },
    {
        name: "HLOOKUP",
        syntax: "HLOOKUP(lookup_value, table_array, row_index_num, [range_lookup])",
        description: "Looks for a value in the top row of a table or array of values and returns the value in the same column from a row you specify."
    },
    {
        name: "INDEX",
        syntax: "INDEX(array, row_num, [column_num])",
        description: "Returns a value or reference of the cell at the intersection of a particular row and column, in a given range."
    },
    {
        name: "MATCH",
        syntax: "MATCH(lookup_value, lookup_array, [match_type])",
        description: "Returns the relative position of an item in an array that matches a specified value in a specified order."
    },
    {
        name: "OFFSET",
        syntax: "OFFSET(reference, rows, cols, [height], [width])",
        description: "Returns a reference to a range that is a specified number of rows and columns from a cell or range of cells."
    },
    {
        name: "CHOOSE",
        syntax: "CHOOSE(index_num, value1, [value2], ...)",
        description: "Uses index_num to return a value from the list of value arguments."
    },
    {
        name: "INDIRECT",
        syntax: "INDIRECT(ref_text, [a1])",
        description: "Returns the reference specified by a text string."
    },
    // Statistical
    {
        name: "COUNTA",
        syntax: "COUNTA(value1, [value2], ...)",
        description: "Counts the number of cells that are not empty."
    },
    {
        name: "COUNTBLANK",
        syntax: "COUNTBLANK(range)",
        description: "Counts the number of empty cells in a specified range of cells."
    },
    {
        name: "COUNTIF",
        syntax: "COUNTIF(range, criteria)",
        description: "Counts the number of cells within a range that meet the given criteria."
    },
    {
        name: "COUNTIFS",
        syntax: "COUNTIFS(criteria_range1, criteria1, [criteria_range2, criteria2]…)",
        description: "Counts the number of cells specified by a given set of conditions or criteria."
    },
    {
        name: "AVERAGEIF",
        syntax: "AVERAGEIF(range, criteria, [average_range])",
        description: "Finds average for the cells specified by a given condition or criteria."
    },
    {
        name: "AVERAGEIFS",
        syntax: "AVERAGEIFS(average_range, criteria_range1, criteria1, [criteria_range2, criteria2]…)",
        description: "Finds average for the cells specified by a given set of conditions or criteria."
    },
    {
        name: "SUMIF",
        syntax: "SUMIF(range, criteria, [sum_range])",
        description: "Adds the cells specified by a given criteria."
    },
    {
        name: "SUMIFS",
        syntax: "SUMIFS(sum_range, criteria_range1, criteria1, [criteria_range2, criteria2]…)",
        description: "Adds all of its arguments that meet multiple criteria."
    },
    {
        name: "MEDIAN",
        syntax: "MEDIAN(number1, [number2], ...)",
        description: "Returns the median of the given numbers. The median is the number in the middle of a set of numbers."
    },
    {
        name: "MODE.SNGL",
        syntax: "MODE.SNGL(number1, [number2], ...)",
        description: "Returns the most frequently occurring, or repetitive, value in an array or range of data. (Older Excel versions use MODE)."
    },
    // Financial
    {
        name: "PMT",
        syntax: "PMT(rate, nper, pv, [fv], [type])",
        description: "Calculates the payment for a loan based on constant payments and a constant interest rate."
    },
    {
        name: "FV",
        syntax: "FV(rate, nper, pmt, [pv], [type])",
        description: "Returns the future value of an investment based on periodic, constant payments and a constant interest rate."
    },
    {
        name: "PV",
        syntax: "PV(rate, nper, pmt, [fv], [type])",
        description: "Returns the present value of an investment."
    },
    {
        name: "NPER",
        syntax: "NPER(rate, pmt, pv, [fv], [type])",
        description: "Returns the number of periods for an investment based on periodic, constant payments and a constant interest rate."
    },
    {
        name: "RATE",
        syntax: "RATE(nper, pmt, pv, [fv], [type], [guess])",
        description: "Returns the interest rate per period of an annuity."
    },
    {
        name: "NPV",
        syntax: "NPV(rate, value1, [value2], ...)",
        description: "Returns the net present value of an investment based on a series of periodic cash flows and a discount rate."
    },
    {
        name: "IRR",
        syntax: "IRR(values, [guess])",
        description: "Returns the internal rate of return for a series of cash flows."
    },
    {
        name: "DB",
        syntax: "DB(cost, salvage, life, period, [month])",
        description: "Returns the depreciation of an asset for a specified period using the fixed-declining balance method."
    },
    {
        name: "SLN",
        syntax: "SLN(cost, salvage, life)",
        description: "Returns the straight-line depreciation of an asset for one period."
    },
    {
        name: "SYD",
        syntax: "SYD(cost, salvage, life, per)",
        description: "Returns the sum-of-years' digits depreciation of an asset for a specified period."
    },
    {
        name: "IPMT",
        syntax: "IPMT(rate, per, nper, pv, [fv], [type])",
        description: "Returns the interest payment for a given period for an investment based on periodic, constant payments and a constant interest rate."
    },
    {
        name: "PPMT",
        syntax: "PPMT(rate, per, nper, pv, [fv], [type])",
        description: "Returns the payment on the principal for a given period for an investment based on periodic, constant payments and a constant interest rate."
    }
];
function AvailableFunctionsDialog({ isOpen, onOpenChange }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Dialog"], {
        open: isOpen,
        onOpenChange: onOpenChange,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogContent"], {
            className: "sm:max-w-3xl max-h-[80vh]",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogHeader"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogTitle"], {
                            children: "Available Functions (Reference)"
                        }, void 0, false, {
                            fileName: "[project]/src/components/spreadsheet/AvailableFunctionsDialog.tsx",
                            lineNumber: 104,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogDescription"], {
                            children: "This is a list of commonly used spreadsheet functions. The application currently stores formulas as text and does not perform calculations."
                        }, void 0, false, {
                            fileName: "[project]/src/components/spreadsheet/AvailableFunctionsDialog.tsx",
                            lineNumber: 105,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/spreadsheet/AvailableFunctionsDialog.tsx",
                    lineNumber: 103,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$scroll$2d$area$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ScrollArea"], {
                    className: "h-[60vh] w-full rounded-md border p-4",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Table"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableHeader"], {
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableRow"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableHead"], {
                                            className: "w-[150px]",
                                            children: "Function"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/spreadsheet/AvailableFunctionsDialog.tsx",
                                            lineNumber: 113,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableHead"], {
                                            className: "w-[250px]",
                                            children: "Syntax"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/spreadsheet/AvailableFunctionsDialog.tsx",
                                            lineNumber: 114,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableHead"], {
                                            children: "Description"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/spreadsheet/AvailableFunctionsDialog.tsx",
                                            lineNumber: 115,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/spreadsheet/AvailableFunctionsDialog.tsx",
                                    lineNumber: 112,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/spreadsheet/AvailableFunctionsDialog.tsx",
                                lineNumber: 111,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableBody"], {
                                children: functionsList.map((func)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableRow"], {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableCell"], {
                                                className: "font-medium",
                                                children: func.name
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/spreadsheet/AvailableFunctionsDialog.tsx",
                                                lineNumber: 121,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableCell"], {
                                                className: "font-mono text-xs",
                                                children: func.syntax
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/spreadsheet/AvailableFunctionsDialog.tsx",
                                                lineNumber: 122,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableCell"], {
                                                children: func.description
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/spreadsheet/AvailableFunctionsDialog.tsx",
                                                lineNumber: 123,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, func.name, true, {
                                        fileName: "[project]/src/components/spreadsheet/AvailableFunctionsDialog.tsx",
                                        lineNumber: 120,
                                        columnNumber: 17
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/src/components/spreadsheet/AvailableFunctionsDialog.tsx",
                                lineNumber: 118,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/spreadsheet/AvailableFunctionsDialog.tsx",
                        lineNumber: 110,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/spreadsheet/AvailableFunctionsDialog.tsx",
                    lineNumber: 109,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/spreadsheet/AvailableFunctionsDialog.tsx",
            lineNumber: 102,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/spreadsheet/AvailableFunctionsDialog.tsx",
        lineNumber: 101,
        columnNumber: 5
    }, this);
}
_c = AvailableFunctionsDialog;
var _c;
__turbopack_context__.k.register(_c, "AvailableFunctionsDialog");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/components/ui/label.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "Label": (()=>Label)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$label$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@radix-ui/react-label/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/class-variance-authority/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
"use client";
;
;
;
;
;
const labelVariants = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cva"])("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70");
const Label = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$label$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(labelVariants(), className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/label.tsx",
        lineNumber: 18,
        columnNumber: 3
    }, this));
_c1 = Label;
Label.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$label$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"].displayName;
;
var _c, _c1;
__turbopack_context__.k.register(_c, "Label$React.forwardRef");
__turbopack_context__.k.register(_c1, "Label");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/components/ui/select.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "Select": (()=>Select),
    "SelectContent": (()=>SelectContent),
    "SelectGroup": (()=>SelectGroup),
    "SelectItem": (()=>SelectItem),
    "SelectLabel": (()=>SelectLabel),
    "SelectScrollDownButton": (()=>SelectScrollDownButton),
    "SelectScrollUpButton": (()=>SelectScrollUpButton),
    "SelectSeparator": (()=>SelectSeparator),
    "SelectTrigger": (()=>SelectTrigger),
    "SelectValue": (()=>SelectValue)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@radix-ui/react-select/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/check.js [app-client] (ecmascript) <export default as Check>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-down.js [app-client] (ecmascript) <export default as ChevronDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronUp$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-up.js [app-client] (ecmascript) <export default as ChevronUp>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
"use client";
;
;
;
;
;
const Select = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"];
const SelectGroup = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Group"];
const SelectValue = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Value"];
const SelectTrigger = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c = ({ className, children, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Trigger"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1", className),
        ...props,
        children: [
            children,
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Icon"], {
                asChild: true,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                    className: "h-4 w-4 opacity-50"
                }, void 0, false, {
                    fileName: "[project]/src/components/ui/select.tsx",
                    lineNumber: 29,
                    columnNumber: 7
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/ui/select.tsx",
                lineNumber: 28,
                columnNumber: 5
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ui/select.tsx",
        lineNumber: 19,
        columnNumber: 3
    }, this));
_c1 = SelectTrigger;
SelectTrigger.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Trigger"].displayName;
const SelectScrollUpButton = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ScrollUpButton"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex cursor-default items-center justify-center py-1", className),
        ...props,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronUp$3e$__["ChevronUp"], {
            className: "h-4 w-4"
        }, void 0, false, {
            fileName: "[project]/src/components/ui/select.tsx",
            lineNumber: 47,
            columnNumber: 5
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/ui/select.tsx",
        lineNumber: 39,
        columnNumber: 3
    }, this));
_c2 = SelectScrollUpButton;
SelectScrollUpButton.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ScrollUpButton"].displayName;
const SelectScrollDownButton = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ScrollDownButton"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex cursor-default items-center justify-center py-1", className),
        ...props,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
            className: "h-4 w-4"
        }, void 0, false, {
            fileName: "[project]/src/components/ui/select.tsx",
            lineNumber: 64,
            columnNumber: 5
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/ui/select.tsx",
        lineNumber: 56,
        columnNumber: 3
    }, this));
_c3 = SelectScrollDownButton;
SelectScrollDownButton.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ScrollDownButton"].displayName;
const SelectContent = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c4 = ({ className, children, position = "popper", ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Portal"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Content"], {
            ref: ref,
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2", position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1", className),
            position: position,
            ...props,
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SelectScrollUpButton, {}, void 0, false, {
                    fileName: "[project]/src/components/ui/select.tsx",
                    lineNumber: 86,
                    columnNumber: 7
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Viewport"], {
                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("p-1", position === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"),
                    children: children
                }, void 0, false, {
                    fileName: "[project]/src/components/ui/select.tsx",
                    lineNumber: 87,
                    columnNumber: 7
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SelectScrollDownButton, {}, void 0, false, {
                    fileName: "[project]/src/components/ui/select.tsx",
                    lineNumber: 96,
                    columnNumber: 7
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/ui/select.tsx",
            lineNumber: 75,
            columnNumber: 5
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/ui/select.tsx",
        lineNumber: 74,
        columnNumber: 3
    }, this));
_c5 = SelectContent;
SelectContent.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Content"].displayName;
const SelectLabel = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c6 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("py-1.5 pl-8 pr-2 text-sm font-semibold", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/select.tsx",
        lineNumber: 106,
        columnNumber: 3
    }, this));
_c7 = SelectLabel;
SelectLabel.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"].displayName;
const SelectItem = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c8 = ({ className, children, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Item"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className),
        ...props,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ItemIndicator"], {
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                        className: "h-4 w-4"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/select.tsx",
                        lineNumber: 128,
                        columnNumber: 9
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/ui/select.tsx",
                    lineNumber: 127,
                    columnNumber: 7
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/ui/select.tsx",
                lineNumber: 126,
                columnNumber: 5
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ItemText"], {
                children: children
            }, void 0, false, {
                fileName: "[project]/src/components/ui/select.tsx",
                lineNumber: 132,
                columnNumber: 5
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ui/select.tsx",
        lineNumber: 118,
        columnNumber: 3
    }, this));
_c9 = SelectItem;
SelectItem.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Item"].displayName;
const SelectSeparator = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c10 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Separator"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("-mx-1 my-1 h-px bg-muted", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/select.tsx",
        lineNumber: 141,
        columnNumber: 3
    }, this));
_c11 = SelectSeparator;
SelectSeparator.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Separator"].displayName;
;
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7, _c8, _c9, _c10, _c11;
__turbopack_context__.k.register(_c, "SelectTrigger$React.forwardRef");
__turbopack_context__.k.register(_c1, "SelectTrigger");
__turbopack_context__.k.register(_c2, "SelectScrollUpButton");
__turbopack_context__.k.register(_c3, "SelectScrollDownButton");
__turbopack_context__.k.register(_c4, "SelectContent$React.forwardRef");
__turbopack_context__.k.register(_c5, "SelectContent");
__turbopack_context__.k.register(_c6, "SelectLabel$React.forwardRef");
__turbopack_context__.k.register(_c7, "SelectLabel");
__turbopack_context__.k.register(_c8, "SelectItem$React.forwardRef");
__turbopack_context__.k.register(_c9, "SelectItem");
__turbopack_context__.k.register(_c10, "SelectSeparator$React.forwardRef");
__turbopack_context__.k.register(_c11, "SelectSeparator");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/components/spreadsheet/ConditionalFormattingDialog.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "ConditionalFormattingDialog": (()=>ConditionalFormattingDialog)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$browser$2f$v4$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__v4$3e$__ = __turbopack_context__.i("[project]/node_modules/uuid/dist/esm-browser/v4.js [app-client] (ecmascript) <export default as v4>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/dialog.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/input.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/label.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/select.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useSpreadsheet$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/useSpreadsheet.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$spreadsheet$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/types/spreadsheet.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
;
;
const predefinedStyles = [
    {
        key: 'lightRedFillDarkRedText',
        label: 'Light Red Fill with Dark Red Text'
    },
    {
        key: 'yellowFillDarkYellowText',
        label: 'Yellow Fill with Dark Yellow Text'
    },
    {
        key: 'greenFillDarkGreenText',
        label: 'Green Fill with Dark Green Text'
    }
];
function rangeToString(range) {
    if (!range) return "";
    const startId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$spreadsheet$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCellId"])(range.start.rowIndex, range.start.colIndex);
    const endId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$spreadsheet$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCellId"])(range.end.rowIndex, range.end.colIndex);
    return startId === endId ? startId : `${startId}:${endId}`;
}
function parseRangeString(rangeStr, currentSheetId) {
    const parts = rangeStr.split(':');
    const startAddrStr = parts[0];
    const endAddrStr = parts.length > 1 ? parts[1] : startAddrStr;
    const parseSingleCellId = (idStr)=>{
        const colMatch = idStr.match(/[A-Z]+/i);
        const rowMatch = idStr.match(/\d+/);
        if (!colMatch || !rowMatch) return null;
        let colIndex = 0;
        const colChars = colMatch[0].toUpperCase();
        for(let i = 0; i < colChars.length; i++){
            colIndex = colIndex * 26 + (colChars.charCodeAt(i) - 64);
        }
        colIndex -= 1;
        const rowIndex = parseInt(rowMatch[0], 10) - 1;
        if (isNaN(colIndex) || isNaN(rowIndex) || colIndex < 0 || rowIndex < 0) return null;
        return {
            sheetId: currentSheetId,
            rowIndex,
            colIndex
        };
    };
    const start = parseSingleCellId(startAddrStr);
    const end = parseSingleCellId(endAddrStr);
    if (start && end) {
        return {
            start,
            end
        };
    }
    return null;
}
function ConditionalFormattingDialog({ isOpen, onOpenChange, activeSheetId, selectionRange: initialSelectionRange }) {
    _s();
    const { addConditionalFormatRule, spreadsheet } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useSpreadsheet$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSpreadsheet"])();
    const [ruleType, setRuleType] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('greaterThan');
    const [comparisonValue, setComparisonValue] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [styleKey, setStyleKey] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('lightRedFillDarkRedText');
    const [rangeStr, setRangeStr] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(rangeToString(initialSelectionRange));
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ConditionalFormattingDialog.useEffect": ()=>{
            setRangeStr(rangeToString(initialSelectionRange)); // Update when dialog opens with new selection
        }
    }["ConditionalFormattingDialog.useEffect"], [
        initialSelectionRange,
        isOpen
    ]);
    const handleSubmit = ()=>{
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
        const newRule = {
            id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$browser$2f$v4$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__v4$3e$__["v4"])(),
            range: parsedRange,
            type: ruleType,
            value: numValue,
            styleKey: styleKey
        };
        addConditionalFormatRule(activeSheetId, newRule);
        onOpenChange(false); // Close dialog
        // Reset form for next time
        setComparisonValue('');
        setRuleType('greaterThan');
        setStyleKey('lightRedFillDarkRedText');
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Dialog"], {
        open: isOpen,
        onOpenChange: (open)=>{
            onOpenChange(open);
            if (!open) setError(''); // Clear errors when closing
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogContent"], {
            className: "sm:max-w-[425px]",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogHeader"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogTitle"], {
                            children: "Add Conditional Formatting Rule"
                        }, void 0, false, {
                            fileName: "[project]/src/components/spreadsheet/ConditionalFormattingDialog.tsx",
                            lineNumber: 139,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogDescription"], {
                            children: "Highlight cells that meet certain criteria."
                        }, void 0, false, {
                            fileName: "[project]/src/components/spreadsheet/ConditionalFormattingDialog.tsx",
                            lineNumber: 140,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/spreadsheet/ConditionalFormattingDialog.tsx",
                    lineNumber: 138,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid gap-4 py-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-4 items-center gap-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                                    htmlFor: "range",
                                    className: "text-right",
                                    children: "Range"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/spreadsheet/ConditionalFormattingDialog.tsx",
                                    lineNumber: 146,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                    id: "range",
                                    value: rangeStr,
                                    onChange: (e)=>setRangeStr(e.target.value.toUpperCase()),
                                    className: "col-span-3",
                                    placeholder: "e.g., A1:B10 or C5"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/spreadsheet/ConditionalFormattingDialog.tsx",
                                    lineNumber: 149,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/spreadsheet/ConditionalFormattingDialog.tsx",
                            lineNumber: 145,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-4 items-center gap-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                                    htmlFor: "ruleType",
                                    className: "text-right",
                                    children: "Rule Type"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/spreadsheet/ConditionalFormattingDialog.tsx",
                                    lineNumber: 158,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Select"], {
                                    value: ruleType,
                                    onValueChange: (value)=>setRuleType(value),
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectTrigger"], {
                                            className: "col-span-3",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectValue"], {
                                                placeholder: "Select a rule type"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/spreadsheet/ConditionalFormattingDialog.tsx",
                                                lineNumber: 163,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/spreadsheet/ConditionalFormattingDialog.tsx",
                                            lineNumber: 162,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectContent"], {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectItem"], {
                                                    value: "greaterThan",
                                                    children: "Cell Value Is Greater Than"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/spreadsheet/ConditionalFormattingDialog.tsx",
                                                    lineNumber: 166,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectItem"], {
                                                    value: "lessThan",
                                                    children: "Cell Value Is Less Than"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/spreadsheet/ConditionalFormattingDialog.tsx",
                                                    lineNumber: 167,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectItem"], {
                                                    value: "equalTo",
                                                    children: "Cell Value Is Equal To"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/spreadsheet/ConditionalFormattingDialog.tsx",
                                                    lineNumber: 168,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/spreadsheet/ConditionalFormattingDialog.tsx",
                                            lineNumber: 165,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/spreadsheet/ConditionalFormattingDialog.tsx",
                                    lineNumber: 161,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/spreadsheet/ConditionalFormattingDialog.tsx",
                            lineNumber: 157,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-4 items-center gap-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                                    htmlFor: "value",
                                    className: "text-right",
                                    children: "Value"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/spreadsheet/ConditionalFormattingDialog.tsx",
                                    lineNumber: 173,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                    id: "value",
                                    type: "number",
                                    value: comparisonValue,
                                    onChange: (e)=>setComparisonValue(e.target.value),
                                    className: "col-span-3",
                                    placeholder: "Enter a number"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/spreadsheet/ConditionalFormattingDialog.tsx",
                                    lineNumber: 176,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/spreadsheet/ConditionalFormattingDialog.tsx",
                            lineNumber: 172,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-4 items-center gap-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                                    htmlFor: "style",
                                    className: "text-right",
                                    children: "Style"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/spreadsheet/ConditionalFormattingDialog.tsx",
                                    lineNumber: 186,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Select"], {
                                    value: styleKey,
                                    onValueChange: (value)=>setStyleKey(value),
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectTrigger"], {
                                            className: "col-span-3",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectValue"], {
                                                placeholder: "Select a style"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/spreadsheet/ConditionalFormattingDialog.tsx",
                                                lineNumber: 191,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/spreadsheet/ConditionalFormattingDialog.tsx",
                                            lineNumber: 190,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectContent"], {
                                            children: predefinedStyles.map((style)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectItem"], {
                                                    value: style.key,
                                                    children: style.label
                                                }, style.key, false, {
                                                    fileName: "[project]/src/components/spreadsheet/ConditionalFormattingDialog.tsx",
                                                    lineNumber: 195,
                                                    columnNumber: 19
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/spreadsheet/ConditionalFormattingDialog.tsx",
                                            lineNumber: 193,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/spreadsheet/ConditionalFormattingDialog.tsx",
                                    lineNumber: 189,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/spreadsheet/ConditionalFormattingDialog.tsx",
                            lineNumber: 185,
                            columnNumber: 11
                        }, this),
                        error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "col-span-4 text-sm text-destructive text-center",
                            children: error
                        }, void 0, false, {
                            fileName: "[project]/src/components/spreadsheet/ConditionalFormattingDialog.tsx",
                            lineNumber: 201,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/spreadsheet/ConditionalFormattingDialog.tsx",
                    lineNumber: 144,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogFooter"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                            type: "button",
                            variant: "outline",
                            onClick: ()=>onOpenChange(false),
                            children: "Cancel"
                        }, void 0, false, {
                            fileName: "[project]/src/components/spreadsheet/ConditionalFormattingDialog.tsx",
                            lineNumber: 205,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                            type: "submit",
                            onClick: handleSubmit,
                            children: "Apply Rule"
                        }, void 0, false, {
                            fileName: "[project]/src/components/spreadsheet/ConditionalFormattingDialog.tsx",
                            lineNumber: 206,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/spreadsheet/ConditionalFormattingDialog.tsx",
                    lineNumber: 204,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/spreadsheet/ConditionalFormattingDialog.tsx",
            lineNumber: 137,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/spreadsheet/ConditionalFormattingDialog.tsx",
        lineNumber: 133,
        columnNumber: 5
    }, this);
}
_s(ConditionalFormattingDialog, "dKQXI4ek7NQ2Ny6FbHl2cF9mob0=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useSpreadsheet$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSpreadsheet"]
    ];
});
_c = ConditionalFormattingDialog;
var _c;
__turbopack_context__.k.register(_c, "ConditionalFormattingDialog");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/components/spreadsheet/Toolbar.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>Toolbar)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/input.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useSpreadsheet$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/useSpreadsheet.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$icons$2f$OfflineSheetLogo$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/icons/OfflineSheetLogo.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$save$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Save$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/save.js [app-client] (ecmascript) <export default as Save>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$house$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Home$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/house.js [app-client] (ecmascript) <export default as Home>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$upload$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Upload$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/upload.js [app-client] (ecmascript) <export default as Upload>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/download.js [app-client] (ecmascript) <export default as Download>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$undo$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Undo$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/undo.js [app-client] (ecmascript) <export default as Undo>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$redo$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Redo$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/redo.js [app-client] (ecmascript) <export default as Redo>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bold$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bold$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/bold.js [app-client] (ecmascript) <export default as Bold>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$italic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Italic$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/italic.js [app-client] (ecmascript) <export default as Italic>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$underline$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Underline$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/underline.js [app-client] (ecmascript) <export default as Underline>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$align$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlignLeft$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/align-left.js [app-client] (ecmascript) <export default as AlignLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$align$2d$center$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlignCenter$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/align-center.js [app-client] (ecmascript) <export default as AlignCenter>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$align$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlignRight$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/align-right.js [app-client] (ecmascript) <export default as AlignRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/file-text.js [app-client] (ecmascript) <export default as FileText>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$rows$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RowsIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/rows-2.js [app-client] (ecmascript) <export default as RowsIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$columns$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Columns$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/columns-2.js [app-client] (ecmascript) <export default as Columns>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/trash-2.js [app-client] (ecmascript) <export default as Trash2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2d$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__PlusSquare$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/square-plus.js [app-client] (ecmascript) <export default as PlusSquare>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sun$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sun$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/sun.js [app-client] (ecmascript) <export default as Sun>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$moon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Moon$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/moon.js [app-client] (ecmascript) <export default as Moon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FilePlus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/file-plus.js [app-client] (ecmascript) <export default as FilePlus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clipboard$2d$copy$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ClipboardCopy$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/clipboard-copy.js [app-client] (ecmascript) <export default as ClipboardCopy>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eraser$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Eraser$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/eraser.js [app-client] (ecmascript) <export default as Eraser>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2d$pen$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Edit$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/square-pen.js [app-client] (ecmascript) <export default as Edit>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wand$2d$sparkles$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Wand2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/wand-sparkles.js [app-client] (ecmascript) <export default as Wand2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sigma$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sigma$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/sigma.js [app-client] (ecmascript) <export default as Sigma>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$grid$2d$3x3$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__GridIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/grid-3x3.js [app-client] (ecmascript) <export default as GridIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$menubar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/menubar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$separator$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/separator.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$spreadsheet$2f$AvailableFunctionsDialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/spreadsheet/AvailableFunctionsDialog.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$spreadsheet$2f$ConditionalFormattingDialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/spreadsheet/ConditionalFormattingDialog.tsx [app-client] (ecmascript)"); // Import new dialog
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
;
;
;
;
;
;
function Toolbar({ spreadsheetName, theme, setTheme }) {
    _s();
    const { saveSpreadsheet, spreadsheet, setSpreadsheet: setContextSpreadsheet, activeCell, selectionRange, updateSelectedCellStyle, formatSelectionAsTable, insertRow, deleteRow, insertColumn, deleteColumn, appendRow, appendColumn, undo, redo, canUndo, canRedo, copySelectionToClipboard, deleteSelectionContents, updateMultipleCellsRawValue, addConditionalFormatRule } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useSpreadsheet$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSpreadsheet"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [isFunctionsDialogOpen, setIsFunctionsDialogOpen] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useState(false);
    const [isConditionalFormattingDialogOpen, setIsConditionalFormattingDialogOpen] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useState(false);
    const handleNameChange = (e)=>{
        if (spreadsheet && setContextSpreadsheet) {
            setContextSpreadsheet((prev)=>prev ? {
                    ...prev,
                    name: e.target.value,
                    updatedAt: Date.now()
                } : null);
        }
    };
    const toggleTheme = ()=>{
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };
    const selectedCellStyle = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useMemo({
        "Toolbar.useMemo[selectedCellStyle]": ()=>{
            if (!spreadsheet || !activeCell || !activeCell.sheetId) return {};
            const sheet = spreadsheet.sheets.find({
                "Toolbar.useMemo[selectedCellStyle].sheet": (s)=>s.id === activeCell.sheetId
            }["Toolbar.useMemo[selectedCellStyle].sheet"]);
            if (!sheet) return {};
            const cell = sheet.cells[activeCell.rowIndex]?.[activeCell.colIndex];
            return cell?.style || {};
        }
    }["Toolbar.useMemo[selectedCellStyle]"], [
        spreadsheet,
        activeCell
    ]);
    const handleToggleBold = ()=>{
        if (activeCell || selectionRange) updateSelectedCellStyle({
            bold: !selectedCellStyle?.bold
        });
    };
    const handleToggleItalic = ()=>{
        if (activeCell || selectionRange) updateSelectedCellStyle({
            italic: !selectedCellStyle?.italic
        });
    };
    const handleToggleUnderline = ()=>{
        if (activeCell || selectionRange) updateSelectedCellStyle({
            underline: !selectedCellStyle?.underline
        });
    };
    const handleExport = (format)=>console.log(`Export as ${format} (Not implemented)`);
    const handleLoadFromFile = ()=>console.log("Load from file (Not implemented)");
    const handleInsertRowAction = ()=>{
        if (spreadsheet && activeCell) {
            insertRow(activeCell.sheetId, activeCell.rowIndex);
        } else if (spreadsheet?.activeSheetId) {
            insertRow(spreadsheet.activeSheetId, 0);
        }
    };
    const handleDeleteRowAction = ()=>{
        if (spreadsheet && activeCell) {
            deleteRow(activeCell.sheetId, activeCell.rowIndex);
        }
    };
    const handleInsertColumnAction = ()=>{
        if (spreadsheet && activeCell) {
            insertColumn(activeCell.sheetId, activeCell.colIndex);
        } else if (spreadsheet?.activeSheetId) {
            insertColumn(spreadsheet.activeSheetId, 0);
        }
    };
    const handleDeleteColumnAction = ()=>{
        if (spreadsheet && activeCell) {
            deleteColumn(activeCell.sheetId, activeCell.colIndex);
        }
    };
    const handleAppendRowAction = ()=>{
        if (spreadsheet?.activeSheetId) appendRow(spreadsheet.activeSheetId);
    };
    const handleAppendColumnAction = ()=>{
        if (spreadsheet?.activeSheetId) appendColumn(spreadsheet.activeSheetId);
    };
    const setTextAlign = (align)=>{
        if (activeCell || selectionRange) updateSelectedCellStyle({
            textAlign: align
        });
    };
    const handleNewSpreadsheet = ()=>{
        router.push('/');
    };
    const handleEditSelectedCells = ()=>{
        if (!selectionRange) return;
        const newValue = window.prompt("Enter new value for all selected cells:", "");
        if (newValue !== null) {
            updateMultipleCellsRawValue(newValue);
        }
    };
    const handleFormatAsTableAction = ()=>{
        if (selectionRange) {
            formatSelectionAsTable();
        }
    };
    const isSelectionActive = !!selectionRange && (selectionRange.start.rowIndex !== selectionRange.end.rowIndex || selectionRange.start.colIndex !== selectionRange.end.colIndex || !!activeCell);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "p-2 border-b bg-card flex flex-col md:flex-row items-start md:items-center justify-between gap-2 shadow-sm flex-wrap print:hidden",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-2 w-full md:w-auto",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        href: "/",
                        "aria-label": "Back to dashboard",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$icons$2f$OfflineSheetLogo$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["OfflineSheetLogo"], {
                            className: "h-8 w-8"
                        }, void 0, false, {
                            fileName: "[project]/src/components/spreadsheet/Toolbar.tsx",
                            lineNumber: 175,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/spreadsheet/Toolbar.tsx",
                        lineNumber: 174,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                        value: spreadsheetName,
                        onChange: handleNameChange,
                        className: "font-semibold text-lg w-auto min-w-[150px] max-w-[300px]",
                        "aria-label": "Spreadsheet Name",
                        disabled: !spreadsheet
                    }, void 0, false, {
                        fileName: "[project]/src/components/spreadsheet/Toolbar.tsx",
                        lineNumber: 177,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                        onClick: toggleTheme,
                        variant: "ghost",
                        size: "icon",
                        className: "ml-auto md:ml-2",
                        title: theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode',
                        children: theme === 'dark' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sun$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sun$3e$__["Sun"], {}, void 0, false, {
                            fileName: "[project]/src/components/spreadsheet/Toolbar.tsx",
                            lineNumber: 185,
                            columnNumber: 33
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$moon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Moon$3e$__["Moon"], {}, void 0, false, {
                            fileName: "[project]/src/components/spreadsheet/Toolbar.tsx",
                            lineNumber: 185,
                            columnNumber: 43
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/spreadsheet/Toolbar.tsx",
                        lineNumber: 184,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$menubar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Menubar"], {
                        className: "border-none shadow-none p-0 h-auto",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$menubar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MenubarMenu"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$menubar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MenubarTrigger"], {
                                        className: "px-3 py-1.5",
                                        children: "File"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/spreadsheet/Toolbar.tsx",
                                        lineNumber: 189,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$menubar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MenubarContent"], {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$menubar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MenubarItem"], {
                                                onClick: handleNewSpreadsheet,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FilePlus$3e$__["FilePlus"], {
                                                        className: "mr-2 h-4 w-4"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/spreadsheet/Toolbar.tsx",
                                                        lineNumber: 191,
                                                        columnNumber: 59
                                                    }, this),
                                                    " New"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/spreadsheet/Toolbar.tsx",
                                                lineNumber: 191,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$menubar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MenubarSeparator"], {}, void 0, false, {
                                                fileName: "[project]/src/components/spreadsheet/Toolbar.tsx",
                                                lineNumber: 192,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$menubar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MenubarItem"], {
                                                onClick: saveSpreadsheet,
                                                disabled: !spreadsheet,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$save$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Save$3e$__["Save"], {
                                                        className: "mr-2 h-4 w-4"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/spreadsheet/Toolbar.tsx",
                                                        lineNumber: 193,
                                                        columnNumber: 78
                                                    }, this),
                                                    " Save"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/spreadsheet/Toolbar.tsx",
                                                lineNumber: 193,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$menubar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MenubarItem"], {
                                                onClick: handleLoadFromFile,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$upload$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Upload$3e$__["Upload"], {
                                                        className: "mr-2 h-4 w-4"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/spreadsheet/Toolbar.tsx",
                                                        lineNumber: 194,
                                                        columnNumber: 57
                                                    }, this),
                                                    " Load from File..."
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/spreadsheet/Toolbar.tsx",
                                                lineNumber: 194,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$menubar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MenubarSeparator"], {}, void 0, false, {
                                                fileName: "[project]/src/components/spreadsheet/Toolbar.tsx",
                                                lineNumber: 195,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$menubar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MenubarItem"], {
                                                onClick: ()=>handleExport('xlsx'),
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__["Download"], {
                                                        className: "mr-2 h-4 w-4"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/spreadsheet/Toolbar.tsx",
                                                        lineNumber: 196,
                                                        columnNumber: 65
                                                    }, this),
                                                    " Export as .xlsx"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/spreadsheet/Toolbar.tsx",
                                                lineNumber: 196,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$menubar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MenubarItem"], {
                                                onClick: ()=>handleExport('csv'),
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"], {
                                                        className: "mr-2 h-4 w-4"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/spreadsheet/Toolbar.tsx",
                                                        lineNumber: 197,
                                                        columnNumber: 64
                                                    }, this),
                                                    " Export as .csv"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/spreadsheet/Toolbar.tsx",
                                                lineNumber: 197,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$menubar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MenubarSeparator"], {}, void 0, false, {
                                                fileName: "[project]/src/components/spreadsheet/Toolbar.tsx",
                                                lineNumber: 198,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$menubar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MenubarItem"], {
                                                asChild: true,
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                    href: "/",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$house$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Home$3e$__["Home"], {
                                                            className: "mr-2 h-4 w-4"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/spreadsheet/Toolbar.tsx",
                                                            lineNumber: 199,
                                                            columnNumber: 51
                                                        }, this),
                                                        " Dashboard"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/spreadsheet/Toolbar.tsx",
                                                    lineNumber: 199,
                                                    columnNumber: 36
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/spreadsheet/Toolbar.tsx",
                                                lineNumber: 199,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/spreadsheet/Toolbar.tsx",
                                        lineNumber: 190,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/spreadsheet/Toolbar.tsx",
                                lineNumber: 188,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$menubar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MenubarMenu"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$menubar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MenubarTrigger"], {
                                        className: "px-3 py-1.5",
                                        children: "Edit"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/spreadsheet/Toolbar.tsx",
                                        lineNumber: 204,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$menubar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MenubarContent"], {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$menubar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MenubarItem"], {
                                                onClick: undo,
                                                disabled: !canUndo,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$undo$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Undo$3e$__["Undo"], {
                                                        className: "mr-2 h-4 w-4"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/spreadsheet/Toolbar.tsx",
                                                        lineNumber: 206,
                                                        columnNumber: 63
                                                    }, this),
                                                    " Undo ",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$menubar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MenubarShortcut"], {
                                                        children: "Ctrl+Z"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/spreadsheet/Toolbar.tsx",
                                                        lineNumber: 206,
                                                        columnNumber: 102
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/spreadsheet/Toolbar.tsx",
                                                lineNumber: 206,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$menubar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MenubarItem"], {
                                                onClick: redo,
                                                disabled: !canRedo,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$redo$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Redo$3e$__["Redo"], {
                                                        className: "mr-2 h-4 w-4"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/spreadsheet/Toolbar.tsx",
                                                        lineNumber: 207,
                                                        columnNumber: 63
                                                    }, this),
                                                    " Redo ",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$menubar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MenubarShortcut"], {
                                                        children: "Ctrl+Y"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/spreadsheet/Toolbar.tsx",
                                                        lineNumber: 207,
                                                        columnNumber: 102
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/spreadsheet/Toolbar.tsx",
                                                lineNumber: 207,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$menubar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MenubarSeparator"], {}, void 0, false, {
                                                fileName: "[project]/src/components/spreadsheet/Toolbar.tsx",
                                                lineNumber: 208,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$menubar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MenubarItem"], {
                                                onClick: copySelectionToClipboard,
                                                disabled: !isSelectionActive,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clipboard$2d$copy$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ClipboardCopy$3e$__["ClipboardCopy"], {
                                                        className: "mr-2 h-4 w-4"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/spreadsheet/Toolbar.tsx",
                                                        lineNumber: 209,
                                                        columnNumber: 93
                                                    }, this),
                                                    " Copy"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/spreadsheet/Toolbar.tsx",
                                                lineNumber: 209,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$menubar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MenubarSeparator"], {}, void 0, false, {
                                                fileName: "[project]/src/components/spreadsheet/Toolbar.tsx",
                                                lineNumber: 210,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$menubar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MenubarItem"], {
                                                onClick: deleteSelectionContents,
                                                disabled: !isSelectionActive,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eraser$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Eraser$3e$__["Eraser"], {
                                                        className: "mr-2 h-4 w-4"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/spreadsheet/Toolbar.tsx",
                                                        lineNumber: 211,
                                                        columnNumber: 92
                                                    }, this),
                                                    " Clear Contents"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/spreadsheet/Toolbar.tsx",
                                                lineNumber: 211,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$menubar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MenubarItem"], {
                                                onClick: handleEditSelectedCells,
                                                disabled: !isSelectionActive,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2d$pen$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Edit$3e$__["Edit"], {
                                                        className: "mr-2 h-4 w-4"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/spreadsheet/Toolbar.tsx",
                                                        lineNumber: 213,
                                                        columnNumber: 17
                                                    }, this),
                                                    " Edit Selected Cells..."
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/spreadsheet/Toolbar.tsx",
                                                lineNumber: 212,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/spreadsheet/Toolbar.tsx",
                                        lineNumber: 205,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/spreadsheet/Toolbar.tsx",
                                lineNumber: 203,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$menubar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MenubarMenu"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$menubar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MenubarTrigger"], {
                                        className: "px-3 py-1.5",
                                        children: "Insert"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/spreadsheet/Toolbar.tsx",
                                        lineNumber: 219,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$menubar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MenubarContent"], {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$menubar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MenubarItem"], {
                                                onClick: handleInsertRowAction,
                                                disabled: !spreadsheet,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$rows$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RowsIcon$3e$__["RowsIcon"], {
                                                        className: "mr-2 h-4 w-4"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/spreadsheet/Toolbar.tsx",
                                                        lineNumber: 221,
                                                        columnNumber: 86
                                                    }, this),
                                                    " Insert Row Above"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/spreadsheet/Toolbar.tsx",
                                                lineNumber: 221,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$menubar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MenubarItem"], {
                                                onClick: handleAppendRowAction,
                                                disabled: !spreadsheet,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2d$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__PlusSquare$3e$__["PlusSquare"], {
                                                        className: "mr-2 h-4 w-4"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/spreadsheet/Toolbar.tsx",
                                                        lineNumber: 222,
                                                        columnNumber: 86
                                                    }, this),
                                                    " Add Row to End"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/spreadsheet/Toolbar.tsx",
                                                lineNumber: 222,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$menubar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MenubarSeparator"], {}, void 0, false, {
                                                fileName: "[project]/src/components/spreadsheet/Toolbar.tsx",
                                                lineNumber: 223,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$menubar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MenubarItem"], {
                                                onClick: handleInsertColumnAction,
                                                disabled: !spreadsheet,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$columns$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Columns$3e$__["Columns"], {
                                                        className: "mr-2 h-4 w-4"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/spreadsheet/Toolbar.tsx",
                                                        lineNumber: 224,
                                                        columnNumber: 89
                                                    }, this),
                                                    " Insert Column Left"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/spreadsheet/Toolbar.tsx",
                                                lineNumber: 224,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$menubar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MenubarItem"], {
                                                onClick: handleAppendColumnAction,
                                                disabled: !spreadsheet,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2d$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__PlusSquare$3e$__["PlusSquare"], {
                                                        className: "mr-2 h-4 w-4"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/spreadsheet/Toolbar.tsx",
                                                        lineNumber: 225,
                                                        columnNumber: 89
                                                    }, this),
                                                    " Add Column to End"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/spreadsheet/Toolbar.tsx",
                                                lineNumber: 225,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$menubar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MenubarSeparator"], {}, void 0, false, {
                                                fileName: "[project]/src/components/spreadsheet/Toolbar.tsx",
                                                lineNumber: 226,
                                                columnNumber: 18
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$menubar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MenubarItem"], {
                                                onClick: handleDeleteRowAction,
                                                disabled: !activeCell,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                                        className: "mr-2 h-4 w-4 text-destructive"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/spreadsheet/Toolbar.tsx",
                                                        lineNumber: 227,
                                                        columnNumber: 85
                                                    }, this),
                                                    " Delete Active Row"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/spreadsheet/Toolbar.tsx",
                                                lineNumber: 227,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$menubar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MenubarItem"], {
                                                onClick: handleDeleteColumnAction,
                                                disabled: !activeCell,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                                        className: "mr-2 h-4 w-4 text-destructive"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/spreadsheet/Toolbar.tsx",
                                                        lineNumber: 228,
                                                        columnNumber: 88
                                                    }, this),
                                                    " Delete Active Column"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/spreadsheet/Toolbar.tsx",
                                                lineNumber: 228,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$menubar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MenubarSeparator"], {}, void 0, false, {
                                                fileName: "[project]/src/components/spreadsheet/Toolbar.tsx",
                                                lineNumber: 229,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$menubar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MenubarItem"], {
                                                onClick: handleFormatAsTableAction,
                                                disabled: !isSelectionActive,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$grid$2d$3x3$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__GridIcon$3e$__["GridIcon"], {
                                                        className: "mr-2 h-4 w-4"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/spreadsheet/Toolbar.tsx",
                                                        lineNumber: 231,
                                                        columnNumber: 21
                                                    }, this),
                                                    " Format as Table"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/spreadsheet/Toolbar.tsx",
                                                lineNumber: 230,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$menubar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MenubarItem"], {
                                                onClick: ()=>setIsFunctionsDialogOpen(true),
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sigma$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sigma$3e$__["Sigma"], {
                                                        className: "mr-2 h-4 w-4"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/spreadsheet/Toolbar.tsx",
                                                        lineNumber: 234,
                                                        columnNumber: 21
                                                    }, this),
                                                    " Functions..."
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/spreadsheet/Toolbar.tsx",
                                                lineNumber: 233,
                                                columnNumber: 18
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/spreadsheet/Toolbar.tsx",
                                        lineNumber: 220,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/spreadsheet/Toolbar.tsx",
                                lineNumber: 218,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$menubar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MenubarMenu"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$menubar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MenubarTrigger"], {
                                        className: "px-3 py-1.5",
                                        children: "Format"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/spreadsheet/Toolbar.tsx",
                                        lineNumber: 240,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$menubar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MenubarContent"], {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$menubar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MenubarGroup"], {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$menubar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MenubarItem"], {
                                                        onClick: handleToggleBold,
                                                        disabled: !isSelectionActive,
                                                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(selectedCellStyle?.bold && "bg-accent"),
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bold$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bold$3e$__["Bold"], {
                                                                className: "mr-2 h-4 w-4"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/spreadsheet/Toolbar.tsx",
                                                                lineNumber: 244,
                                                                columnNumber: 21
                                                            }, this),
                                                            " Bold"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/spreadsheet/Toolbar.tsx",
                                                        lineNumber: 243,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$menubar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MenubarItem"], {
                                                        onClick: handleToggleItalic,
                                                        disabled: !isSelectionActive,
                                                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(selectedCellStyle?.italic && "bg-accent"),
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$italic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Italic$3e$__["Italic"], {
                                                                className: "mr-2 h-4 w-4"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/spreadsheet/Toolbar.tsx",
                                                                lineNumber: 247,
                                                                columnNumber: 21
                                                            }, this),
                                                            " Italic"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/spreadsheet/Toolbar.tsx",
                                                        lineNumber: 246,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$menubar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MenubarItem"], {
                                                        onClick: handleToggleUnderline,
                                                        disabled: !isSelectionActive,
                                                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(selectedCellStyle?.underline && "bg-accent"),
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$underline$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Underline$3e$__["Underline"], {
                                                                className: "mr-2 h-4 w-4"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/spreadsheet/Toolbar.tsx",
                                                                lineNumber: 250,
                                                                columnNumber: 21
                                                            }, this),
                                                            " Underline"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/spreadsheet/Toolbar.tsx",
                                                        lineNumber: 249,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/spreadsheet/Toolbar.tsx",
                                                lineNumber: 242,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$menubar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MenubarSeparator"], {}, void 0, false, {
                                                fileName: "[project]/src/components/spreadsheet/Toolbar.tsx",
                                                lineNumber: 253,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$menubar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MenubarSub"], {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$menubar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MenubarSubTrigger"], {
                                                        disabled: !isSelectionActive,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$align$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlignLeft$3e$__["AlignLeft"], {
                                                                className: "mr-2 h-4 w-4"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/spreadsheet/Toolbar.tsx",
                                                                lineNumber: 256,
                                                                columnNumber: 23
                                                            }, this),
                                                            " Align Text"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/spreadsheet/Toolbar.tsx",
                                                        lineNumber: 255,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$menubar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MenubarSubContent"], {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$menubar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MenubarItem"], {
                                                                onClick: ()=>setTextAlign('left'),
                                                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(selectedCellStyle?.textAlign === 'left' && "bg-accent"),
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$align$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlignLeft$3e$__["AlignLeft"], {
                                                                        className: "mr-2 h-4 w-4"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/spreadsheet/Toolbar.tsx",
                                                                        lineNumber: 259,
                                                                        columnNumber: 144
                                                                    }, this),
                                                                    " Left"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/spreadsheet/Toolbar.tsx",
                                                                lineNumber: 259,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$menubar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MenubarItem"], {
                                                                onClick: ()=>setTextAlign('center'),
                                                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(selectedCellStyle?.textAlign === 'center' && "bg-accent"),
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$align$2d$center$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlignCenter$3e$__["AlignCenter"], {
                                                                        className: "mr-2 h-4 w-4"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/spreadsheet/Toolbar.tsx",
                                                                        lineNumber: 260,
                                                                        columnNumber: 148
                                                                    }, this),
                                                                    " Center"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/spreadsheet/Toolbar.tsx",
                                                                lineNumber: 260,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$menubar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MenubarItem"], {
                                                                onClick: ()=>setTextAlign('right'),
                                                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(selectedCellStyle?.textAlign === 'right' && "bg-accent"),
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$align$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlignRight$3e$__["AlignRight"], {
                                                                        className: "mr-2 h-4 w-4"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/spreadsheet/Toolbar.tsx",
                                                                        lineNumber: 261,
                                                                        columnNumber: 146
                                                                    }, this),
                                                                    " Right"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/spreadsheet/Toolbar.tsx",
                                                                lineNumber: 261,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/spreadsheet/Toolbar.tsx",
                                                        lineNumber: 258,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/spreadsheet/Toolbar.tsx",
                                                lineNumber: 254,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$menubar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MenubarSeparator"], {}, void 0, false, {
                                                fileName: "[project]/src/components/spreadsheet/Toolbar.tsx",
                                                lineNumber: 264,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$menubar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MenubarItem"], {
                                                onClick: ()=>setIsConditionalFormattingDialogOpen(true),
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wand$2d$sparkles$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Wand2$3e$__["Wand2"], {
                                                        className: "mr-2 h-4 w-4"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/spreadsheet/Toolbar.tsx",
                                                        lineNumber: 266,
                                                        columnNumber: 17
                                                    }, this),
                                                    " Conditional Formatting..."
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/spreadsheet/Toolbar.tsx",
                                                lineNumber: 265,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/spreadsheet/Toolbar.tsx",
                                        lineNumber: 241,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/spreadsheet/Toolbar.tsx",
                                lineNumber: 239,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/spreadsheet/Toolbar.tsx",
                        lineNumber: 187,
                        columnNumber: 10
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/spreadsheet/Toolbar.tsx",
                lineNumber: 173,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-1 flex-wrap mt-2 md:mt-0 border-t md:border-t-0 pt-2 md:pt-0 w-full md:w-auto",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                        variant: "ghost",
                        size: "icon",
                        onClick: saveSpreadsheet,
                        "aria-label": "Save Spreadsheet",
                        title: "Save",
                        disabled: !spreadsheet,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$save$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Save$3e$__["Save"], {}, void 0, false, {
                            fileName: "[project]/src/components/spreadsheet/Toolbar.tsx",
                            lineNumber: 274,
                            columnNumber: 138
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/spreadsheet/Toolbar.tsx",
                        lineNumber: 274,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                        variant: "ghost",
                        size: "icon",
                        onClick: undo,
                        "aria-label": "Undo",
                        title: "Undo",
                        disabled: !canUndo,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$undo$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Undo$3e$__["Undo"], {}, void 0, false, {
                            fileName: "[project]/src/components/spreadsheet/Toolbar.tsx",
                            lineNumber: 275,
                            columnNumber: 111
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/spreadsheet/Toolbar.tsx",
                        lineNumber: 275,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                        variant: "ghost",
                        size: "icon",
                        onClick: redo,
                        "aria-label": "Redo",
                        title: "Redo",
                        disabled: !canRedo,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$redo$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Redo$3e$__["Redo"], {}, void 0, false, {
                            fileName: "[project]/src/components/spreadsheet/Toolbar.tsx",
                            lineNumber: 276,
                            columnNumber: 111
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/spreadsheet/Toolbar.tsx",
                        lineNumber: 276,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$separator$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Separator"], {
                        orientation: "vertical",
                        className: "h-6 mx-1"
                    }, void 0, false, {
                        fileName: "[project]/src/components/spreadsheet/Toolbar.tsx",
                        lineNumber: 278,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                        variant: "ghost",
                        size: "icon",
                        onClick: copySelectionToClipboard,
                        "aria-label": "Copy Selection",
                        title: "Copy Selection",
                        disabled: !isSelectionActive,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clipboard$2d$copy$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ClipboardCopy$3e$__["ClipboardCopy"], {}, void 0, false, {
                            fileName: "[project]/src/components/spreadsheet/Toolbar.tsx",
                            lineNumber: 279,
                            columnNumber: 161
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/spreadsheet/Toolbar.tsx",
                        lineNumber: 279,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                        variant: "ghost",
                        size: "icon",
                        onClick: deleteSelectionContents,
                        "aria-label": "Clear Contents of Selection",
                        title: "Clear Contents",
                        disabled: !isSelectionActive,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eraser$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Eraser$3e$__["Eraser"], {}, void 0, false, {
                            fileName: "[project]/src/components/spreadsheet/Toolbar.tsx",
                            lineNumber: 280,
                            columnNumber: 173
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/spreadsheet/Toolbar.tsx",
                        lineNumber: 280,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$separator$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Separator"], {
                        orientation: "vertical",
                        className: "h-6 mx-1"
                    }, void 0, false, {
                        fileName: "[project]/src/components/spreadsheet/Toolbar.tsx",
                        lineNumber: 282,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                        variant: selectedCellStyle?.bold ? "secondary" : "ghost",
                        size: "icon",
                        onClick: handleToggleBold,
                        "aria-label": "Bold",
                        title: "Bold (Ctrl+B)",
                        disabled: !isSelectionActive,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bold$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bold$3e$__["Bold"], {}, void 0, false, {
                            fileName: "[project]/src/components/spreadsheet/Toolbar.tsx",
                            lineNumber: 291,
                            columnNumber: 10
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/spreadsheet/Toolbar.tsx",
                        lineNumber: 284,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                        variant: selectedCellStyle?.italic ? "secondary" : "ghost",
                        size: "icon",
                        onClick: handleToggleItalic,
                        "aria-label": "Italic",
                        title: "Italic (Ctrl+I)",
                        disabled: !isSelectionActive,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$italic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Italic$3e$__["Italic"], {}, void 0, false, {
                            fileName: "[project]/src/components/spreadsheet/Toolbar.tsx",
                            lineNumber: 299,
                            columnNumber: 10
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/spreadsheet/Toolbar.tsx",
                        lineNumber: 292,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                        variant: selectedCellStyle?.underline ? "secondary" : "ghost",
                        size: "icon",
                        onClick: handleToggleUnderline,
                        "aria-label": "Underline",
                        title: "Underline (Ctrl+U)",
                        disabled: !isSelectionActive,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$underline$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Underline$3e$__["Underline"], {}, void 0, false, {
                            fileName: "[project]/src/components/spreadsheet/Toolbar.tsx",
                            lineNumber: 307,
                            columnNumber: 10
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/spreadsheet/Toolbar.tsx",
                        lineNumber: 300,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$separator$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Separator"], {
                        orientation: "vertical",
                        className: "h-6 mx-1"
                    }, void 0, false, {
                        fileName: "[project]/src/components/spreadsheet/Toolbar.tsx",
                        lineNumber: 309,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                        variant: selectedCellStyle?.textAlign === 'left' ? "secondary" : "ghost",
                        size: "icon",
                        onClick: ()=>setTextAlign('left'),
                        "aria-label": "Align Left",
                        title: "Align Left",
                        disabled: !isSelectionActive,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$align$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlignLeft$3e$__["AlignLeft"], {}, void 0, false, {
                            fileName: "[project]/src/components/spreadsheet/Toolbar.tsx",
                            lineNumber: 318,
                            columnNumber: 10
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/spreadsheet/Toolbar.tsx",
                        lineNumber: 311,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                        variant: selectedCellStyle?.textAlign === 'center' ? "secondary" : "ghost",
                        size: "icon",
                        onClick: ()=>setTextAlign('center'),
                        "aria-label": "Align Center",
                        title: "Align Center",
                        disabled: !isSelectionActive,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$align$2d$center$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlignCenter$3e$__["AlignCenter"], {}, void 0, false, {
                            fileName: "[project]/src/components/spreadsheet/Toolbar.tsx",
                            lineNumber: 326,
                            columnNumber: 10
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/spreadsheet/Toolbar.tsx",
                        lineNumber: 319,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                        variant: selectedCellStyle?.textAlign === 'right' ? "secondary" : "ghost",
                        size: "icon",
                        onClick: ()=>setTextAlign('right'),
                        "aria-label": "Align Right",
                        title: "Align Right",
                        disabled: !isSelectionActive,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$align$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlignRight$3e$__["AlignRight"], {}, void 0, false, {
                            fileName: "[project]/src/components/spreadsheet/Toolbar.tsx",
                            lineNumber: 334,
                            columnNumber: 10
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/spreadsheet/Toolbar.tsx",
                        lineNumber: 327,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/spreadsheet/Toolbar.tsx",
                lineNumber: 273,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$spreadsheet$2f$AvailableFunctionsDialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AvailableFunctionsDialog"], {
                isOpen: isFunctionsDialogOpen,
                onOpenChange: setIsFunctionsDialogOpen
            }, void 0, false, {
                fileName: "[project]/src/components/spreadsheet/Toolbar.tsx",
                lineNumber: 336,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$spreadsheet$2f$ConditionalFormattingDialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ConditionalFormattingDialog"], {
                isOpen: isConditionalFormattingDialogOpen,
                onOpenChange: setIsConditionalFormattingDialogOpen,
                activeSheetId: spreadsheet?.activeSheetId,
                selectionRange: selectionRange
            }, void 0, false, {
                fileName: "[project]/src/components/spreadsheet/Toolbar.tsx",
                lineNumber: 337,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/spreadsheet/Toolbar.tsx",
        lineNumber: 172,
        columnNumber: 5
    }, this);
}
_s(Toolbar, "pAxCwHQ2cXkDWC7QmkwZH4qc8V8=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useSpreadsheet$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSpreadsheet"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = Toolbar;
var _c;
__turbopack_context__.k.register(_c, "Toolbar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/components/ui/alert-dialog.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "AlertDialog": (()=>AlertDialog),
    "AlertDialogAction": (()=>AlertDialogAction),
    "AlertDialogCancel": (()=>AlertDialogCancel),
    "AlertDialogContent": (()=>AlertDialogContent),
    "AlertDialogDescription": (()=>AlertDialogDescription),
    "AlertDialogFooter": (()=>AlertDialogFooter),
    "AlertDialogHeader": (()=>AlertDialogHeader),
    "AlertDialogOverlay": (()=>AlertDialogOverlay),
    "AlertDialogPortal": (()=>AlertDialogPortal),
    "AlertDialogTitle": (()=>AlertDialogTitle),
    "AlertDialogTrigger": (()=>AlertDialogTrigger)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$alert$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@radix-ui/react-alert-dialog/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/button.tsx [app-client] (ecmascript)");
"use client";
;
;
;
;
;
const AlertDialog = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$alert$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"];
const AlertDialogTrigger = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$alert$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Trigger"];
const AlertDialogPortal = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$alert$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Portal"];
const AlertDialogOverlay = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$alert$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Overlay"], {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
        ...props,
        ref: ref
    }, void 0, false, {
        fileName: "[project]/src/components/ui/alert-dialog.tsx",
        lineNumber: 19,
        columnNumber: 3
    }, this));
_c = AlertDialogOverlay;
AlertDialogOverlay.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$alert$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Overlay"].displayName;
const AlertDialogContent = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c1 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AlertDialogPortal, {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AlertDialogOverlay, {}, void 0, false, {
                fileName: "[project]/src/components/ui/alert-dialog.tsx",
                lineNumber: 35,
                columnNumber: 5
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$alert$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Content"], {
                ref: ref,
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg", className),
                ...props
            }, void 0, false, {
                fileName: "[project]/src/components/ui/alert-dialog.tsx",
                lineNumber: 36,
                columnNumber: 5
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ui/alert-dialog.tsx",
        lineNumber: 34,
        columnNumber: 3
    }, this));
_c2 = AlertDialogContent;
AlertDialogContent.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$alert$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Content"].displayName;
const AlertDialogHeader = ({ className, ...props })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex flex-col space-y-2 text-center sm:text-left", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/alert-dialog.tsx",
        lineNumber: 52,
        columnNumber: 3
    }, this);
_c3 = AlertDialogHeader;
AlertDialogHeader.displayName = "AlertDialogHeader";
const AlertDialogFooter = ({ className, ...props })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/alert-dialog.tsx",
        lineNumber: 66,
        columnNumber: 3
    }, this);
_c4 = AlertDialogFooter;
AlertDialogFooter.displayName = "AlertDialogFooter";
const AlertDialogTitle = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c5 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$alert$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Title"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("text-lg font-semibold", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/alert-dialog.tsx",
        lineNumber: 80,
        columnNumber: 3
    }, this));
_c6 = AlertDialogTitle;
AlertDialogTitle.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$alert$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Title"].displayName;
const AlertDialogDescription = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c7 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$alert$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Description"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("text-sm text-muted-foreground", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/alert-dialog.tsx",
        lineNumber: 92,
        columnNumber: 3
    }, this));
_c8 = AlertDialogDescription;
AlertDialogDescription.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$alert$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Description"].displayName;
const AlertDialogAction = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c9 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$alert$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Action"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["buttonVariants"])(), className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/alert-dialog.tsx",
        lineNumber: 105,
        columnNumber: 3
    }, this));
_c10 = AlertDialogAction;
AlertDialogAction.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$alert$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Action"].displayName;
const AlertDialogCancel = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c11 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$alert$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Cancel"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["buttonVariants"])({
            variant: "outline"
        }), "mt-2 sm:mt-0", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/alert-dialog.tsx",
        lineNumber: 117,
        columnNumber: 3
    }, this));
_c12 = AlertDialogCancel;
AlertDialogCancel.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$alert$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Cancel"].displayName;
;
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7, _c8, _c9, _c10, _c11, _c12;
__turbopack_context__.k.register(_c, "AlertDialogOverlay");
__turbopack_context__.k.register(_c1, "AlertDialogContent$React.forwardRef");
__turbopack_context__.k.register(_c2, "AlertDialogContent");
__turbopack_context__.k.register(_c3, "AlertDialogHeader");
__turbopack_context__.k.register(_c4, "AlertDialogFooter");
__turbopack_context__.k.register(_c5, "AlertDialogTitle$React.forwardRef");
__turbopack_context__.k.register(_c6, "AlertDialogTitle");
__turbopack_context__.k.register(_c7, "AlertDialogDescription$React.forwardRef");
__turbopack_context__.k.register(_c8, "AlertDialogDescription");
__turbopack_context__.k.register(_c9, "AlertDialogAction$React.forwardRef");
__turbopack_context__.k.register(_c10, "AlertDialogAction");
__turbopack_context__.k.register(_c11, "AlertDialogCancel$React.forwardRef");
__turbopack_context__.k.register(_c12, "AlertDialogCancel");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/components/spreadsheet/SheetTabs.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>SheetTabs)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useSpreadsheet$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/useSpreadsheet.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__PlusCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-plus.js [app-client] (ecmascript) <export default as PlusCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pen$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Edit2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/pen.js [app-client] (ecmascript) <export default as Edit2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/trash-2.js [app-client] (ecmascript) <export default as Trash2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/check.js [app-client] (ecmascript) <export default as Check>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/input.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$browser$2f$v4$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__v4$3e$__ = __turbopack_context__.i("[project]/node_modules/uuid/dist/esm-browser/v4.js [app-client] (ecmascript) <export default as v4>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$spreadsheet$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/types/spreadsheet.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$use$2d$toast$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/use-toast.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/alert-dialog.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
;
;
;
function SheetTabs({ sheets, activeSheetId }) {
    _s();
    const { spreadsheet, setSpreadsheet, saveSpreadsheet } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useSpreadsheet$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSpreadsheet"])();
    const [editingSheetId, setEditingSheetId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [editingName, setEditingName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const inputRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const { toast } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$use$2d$toast$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useToast"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SheetTabs.useEffect": ()=>{
            if (editingSheetId && inputRef.current) {
                inputRef.current.focus();
                inputRef.current.select();
            }
        }
    }["SheetTabs.useEffect"], [
        editingSheetId
    ]);
    const handleTabClick = (sheetId)=>{
        if (spreadsheet && setSpreadsheet && spreadsheet.activeSheetId !== sheetId) {
            setSpreadsheet({
                ...spreadsheet,
                activeSheetId: sheetId,
                updatedAt: Date.now()
            });
        }
    };
    const handleAddSheet = ()=>{
        if (spreadsheet && setSpreadsheet) {
            const newSheetName = `Sheet${spreadsheet.sheets.length + 1}`;
            const newSheetId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$browser$2f$v4$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__v4$3e$__["v4"])();
            const newSheet = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$spreadsheet$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createInitialSheet"])(newSheetId, newSheetName);
            const updatedSheets = [
                ...spreadsheet.sheets,
                newSheet
            ];
            setSpreadsheet({
                ...spreadsheet,
                sheets: updatedSheets,
                activeSheetId: newSheetId,
                updatedAt: Date.now()
            });
        // Optionally save immediately or let user save via toolbar
        // saveSpreadsheet(); 
        }
    };
    const handleRenameSheet = (sheetId, currentName)=>{
        setEditingSheetId(sheetId);
        setEditingName(currentName);
    };
    const handleSaveRename = ()=>{
        if (spreadsheet && setSpreadsheet && editingSheetId && editingName.trim()) {
            const updatedSheets = spreadsheet.sheets.map((sheet)=>sheet.id === editingSheetId ? {
                    ...sheet,
                    name: editingName.trim()
                } : sheet);
            setSpreadsheet({
                ...spreadsheet,
                sheets: updatedSheets,
                updatedAt: Date.now()
            });
            setEditingSheetId(null);
            setEditingName('');
        } else if (!editingName.trim()) {
            toast({
                title: "Error",
                description: "Sheet name cannot be empty.",
                variant: "destructive"
            });
        }
    };
    const handleCancelRename = ()=>{
        setEditingSheetId(null);
        setEditingName('');
    };
    const handleDeleteSheet = (sheetIdToDelete)=>{
        if (spreadsheet && setSpreadsheet) {
            if (spreadsheet.sheets.length <= 1) {
                toast({
                    title: "Cannot Delete",
                    description: "A spreadsheet must have at least one sheet.",
                    variant: "destructive"
                });
                return;
            }
            const updatedSheets = spreadsheet.sheets.filter((sheet)=>sheet.id !== sheetIdToDelete);
            let newActiveSheetId = spreadsheet.activeSheetId;
            if (spreadsheet.activeSheetId === sheetIdToDelete) {
                // If active sheet is deleted, make the first remaining sheet active
                newActiveSheetId = updatedSheets[0].id;
            }
            setSpreadsheet({
                ...spreadsheet,
                sheets: updatedSheets,
                activeSheetId: newActiveSheetId,
                updatedAt: Date.now()
            });
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "p-2 border-t bg-card flex items-center gap-1 overflow-x-auto",
        children: [
            sheets.map((sheet)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center",
                    children: [
                        editingSheetId === sheet.id ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-1 p-1 bg-background rounded-md",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                    ref: inputRef,
                                    type: "text",
                                    value: editingName,
                                    onChange: (e)=>setEditingName(e.target.value),
                                    onBlur: handleSaveRename,
                                    onKeyDown: (e)=>{
                                        if (e.key === 'Enter') handleSaveRename();
                                        if (e.key === 'Escape') handleCancelRename();
                                    },
                                    className: "h-8 text-sm",
                                    "aria-label": "Edit sheet name"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/spreadsheet/SheetTabs.tsx",
                                    lineNumber: 119,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                    variant: "ghost",
                                    size: "icon",
                                    onClick: handleSaveRename,
                                    className: "h-8 w-8",
                                    "aria-label": "Save sheet name",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                        size: 16
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/spreadsheet/SheetTabs.tsx",
                                        lineNumber: 132,
                                        columnNumber: 127
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/spreadsheet/SheetTabs.tsx",
                                    lineNumber: 132,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                    variant: "ghost",
                                    size: "icon",
                                    onClick: handleCancelRename,
                                    className: "h-8 w-8",
                                    "aria-label": "Cancel rename",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                        size: 16
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/spreadsheet/SheetTabs.tsx",
                                        lineNumber: 133,
                                        columnNumber: 127
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/spreadsheet/SheetTabs.tsx",
                                    lineNumber: 133,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/spreadsheet/SheetTabs.tsx",
                            lineNumber: 118,
                            columnNumber: 13
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                            variant: sheet.id === activeSheetId ? "secondary" : "ghost",
                            size: "sm",
                            onClick: ()=>handleTabClick(sheet.id),
                            onDoubleClick: ()=>handleRenameSheet(sheet.id, sheet.name),
                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("px-3 py-1.5 h-auto text-sm rounded-md", sheet.id === activeSheetId && "font-semibold bg-primary text-primary-foreground hover:bg-primary/90"),
                            children: sheet.name
                        }, void 0, false, {
                            fileName: "[project]/src/components/spreadsheet/SheetTabs.tsx",
                            lineNumber: 136,
                            columnNumber: 13
                        }, this),
                        editingSheetId !== sheet.id && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                    variant: "ghost",
                                    size: "icon",
                                    onClick: ()=>handleRenameSheet(sheet.id, sheet.name),
                                    className: "h-6 w-6 opacity-60 hover:opacity-100",
                                    "aria-label": `Rename ${sheet.name}`,
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pen$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Edit2$3e$__["Edit2"], {
                                        size: 12
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/spreadsheet/SheetTabs.tsx",
                                        lineNumber: 152,
                                        columnNumber: 21
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/spreadsheet/SheetTabs.tsx",
                                    lineNumber: 151,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AlertDialog"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AlertDialogTrigger"], {
                                            asChild: true,
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                variant: "ghost",
                                                size: "icon",
                                                className: "h-6 w-6 opacity-60 hover:opacity-100 text-destructive hover:text-destructive",
                                                "aria-label": `Delete ${sheet.name}`,
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                                    size: 12
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/spreadsheet/SheetTabs.tsx",
                                                    lineNumber: 157,
                                                    columnNumber: 25
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/spreadsheet/SheetTabs.tsx",
                                                lineNumber: 156,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/spreadsheet/SheetTabs.tsx",
                                            lineNumber: 155,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AlertDialogContent"], {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AlertDialogHeader"], {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AlertDialogTitle"], {
                                                            children: [
                                                                'Delete Sheet "',
                                                                sheet.name,
                                                                '"?'
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/spreadsheet/SheetTabs.tsx",
                                                            lineNumber: 162,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AlertDialogDescription"], {
                                                            children: "This action cannot be undone. Are you sure you want to delete this sheet?"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/spreadsheet/SheetTabs.tsx",
                                                            lineNumber: 163,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/spreadsheet/SheetTabs.tsx",
                                                    lineNumber: 161,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AlertDialogFooter"], {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AlertDialogCancel"], {
                                                            children: "Cancel"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/spreadsheet/SheetTabs.tsx",
                                                            lineNumber: 168,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AlertDialogAction"], {
                                                            onClick: ()=>handleDeleteSheet(sheet.id),
                                                            children: "Delete"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/spreadsheet/SheetTabs.tsx",
                                                            lineNumber: 169,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/spreadsheet/SheetTabs.tsx",
                                                    lineNumber: 167,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/spreadsheet/SheetTabs.tsx",
                                            lineNumber: 160,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/spreadsheet/SheetTabs.tsx",
                                    lineNumber: 154,
                                    columnNumber: 18
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/spreadsheet/SheetTabs.tsx",
                            lineNumber: 150,
                            columnNumber: 13
                        }, this)
                    ]
                }, sheet.id, true, {
                    fileName: "[project]/src/components/spreadsheet/SheetTabs.tsx",
                    lineNumber: 116,
                    columnNumber: 9
                }, this)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                variant: "ghost",
                size: "icon",
                onClick: handleAddSheet,
                className: "ml-2",
                "aria-label": "Add new sheet",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__PlusCircle$3e$__["PlusCircle"], {
                    size: 18
                }, void 0, false, {
                    fileName: "[project]/src/components/spreadsheet/SheetTabs.tsx",
                    lineNumber: 180,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/spreadsheet/SheetTabs.tsx",
                lineNumber: 179,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/spreadsheet/SheetTabs.tsx",
        lineNumber: 114,
        columnNumber: 5
    }, this);
}
_s(SheetTabs, "XuwJAcao7UqPVMudoJN29HMB9rU=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useSpreadsheet$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSpreadsheet"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$use$2d$toast$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useToast"]
    ];
});
_c = SheetTabs;
var _c;
__turbopack_context__.k.register(_c, "SheetTabs");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/components/spreadsheet/Cell.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>Cell)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/input.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$spreadsheet$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/types/spreadsheet.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useSpreadsheet$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/useSpreadsheet.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
// Helper to check if a cell is within a selection range
function isCellInRange(cellAddr, range) {
    const minR = Math.min(range.start.rowIndex, range.end.rowIndex);
    const maxR = Math.max(range.start.rowIndex, range.end.rowIndex);
    const minC = Math.min(range.start.colIndex, range.end.colIndex);
    const maxC = Math.max(range.start.colIndex, range.end.colIndex);
    return cellAddr.rowIndex >= minR && cellAddr.rowIndex <= maxR && cellAddr.colIndex >= minC && cellAddr.colIndex <= maxC;
}
// Helper to get the final style for a cell after applying conditional formatting
function getAppliedConditionalStyle(cellData, address, rules) {
    let appliedStyle = {};
    if (rules) {
        for (const rule of rules){
            if (isCellInRange(address, rule.range)) {
                const cellValue = typeof cellData.value === 'number' ? cellData.value : parseFloat(String(cellData.value));
                let conditionMet = false;
                if (!isNaN(cellValue)) {
                    switch(rule.type){
                        case 'greaterThan':
                            conditionMet = cellValue > rule.value;
                            break;
                        // Add other rule types here (lessThan, equalTo)
                        case 'lessThan':
                            conditionMet = cellValue < rule.value;
                            break;
                        case 'equalTo':
                            conditionMet = cellValue === rule.value;
                            break;
                    }
                }
                if (conditionMet) {
                // Apply predefined style. These would map to actual CSS or Tailwind classes
                // For now, just conceptual:
                // appliedStyle = { ...appliedStyle, ...mapStyleKeyToCss(rule.styleKey) };
                // In a real app, mapStyleKeyToCss would return {backgroundColor, color, fontWeight etc.}
                // For this example, we'll use a data attribute or a class for Tailwind.
                }
            }
        }
    }
    return appliedStyle;
}
function getConditionalFormatClass(cellData, address, rules) {
    if (rules) {
        for (const rule of rules){
            if (isCellInRange(address, rule.range)) {
                const cellValue = typeof cellData.value === 'number' ? cellData.value : parseFloat(String(cellData.value));
                let conditionMet = false;
                if (!isNaN(cellValue)) {
                    switch(rule.type){
                        case 'greaterThan':
                            conditionMet = cellValue > rule.value;
                            break;
                        case 'lessThan':
                            conditionMet = cellValue < rule.value;
                            break;
                        case 'equalTo':
                            conditionMet = cellValue === rule.value;
                            break;
                    }
                }
                if (conditionMet) return `cf-${rule.styleKey}`;
            }
        }
    }
    return null;
}
function Cell({ cellData, address, onCellChange, isActive, isInSelectionRange, isFormulaHighlightTarget, onSelect, startEditing, stopEditing, isEditingThisCell, width, height, isActivelyEditingFormulaGlobal, conditionalFormatRules }) {
    _s();
    const [editValue, setEditValue] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(cellData.rawValue || '');
    const inputRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const { spreadsheet } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useSpreadsheet$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSpreadsheet"])(); // To get sheet data for conditional formatting evaluation if needed
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Cell.useEffect": ()=>{
            if (!isEditingThisCell) {
                setEditValue(cellData.rawValue?.toString() || '');
            }
        }
    }["Cell.useEffect"], [
        cellData.rawValue,
        isEditingThisCell
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Cell.useEffect": ()=>{
            if (isEditingThisCell && inputRef.current) {
                inputRef.current.focus();
                inputRef.current.selectionStart = inputRef.current.selectionEnd = inputRef.current.value.length;
            }
        }
    }["Cell.useEffect"], [
        isEditingThisCell
    ]);
    const handleMouseDown = (e)=>{
        if (isEditingThisCell && inputRef.current && inputRef.current.contains(e.target)) {
            return;
        }
        onSelect(address, e.shiftKey, false);
    };
    const handleClick = (e)=>{
        if (isActivelyEditingFormulaGlobal) {
            e.preventDefault();
            return;
        }
        if (isEditingThisCell && inputRef.current && inputRef.current.contains(e.target)) {
            return;
        }
        if (!isEditingThisCell) {
            startEditing(address);
        }
    };
    const handleDoubleClick = (e)=>{
        if (isActivelyEditingFormulaGlobal) {
            e.preventDefault();
            return;
        }
        if (!isEditingThisCell) {
            startEditing(address);
        }
    };
    const handleMouseEnter = (e)=>{
        if (e.buttons === 1) {
            onSelect(address, false, true);
        }
    };
    const handleChange = (e)=>{
        setEditValue(e.target.value);
    };
    const handleBlur = (e)=>{
        if (String(editValue) !== String(cellData.rawValue) || String(editValue).startsWith('=')) {
            onCellChange(address.rowIndex, address.colIndex, editValue);
        }
        stopEditing();
    };
    const handleKeyDown = (e)=>{
        if (e.key === 'Enter' || e.key === 'Tab') {
            e.preventDefault();
            inputRef.current?.blur();
        } else if (e.key === 'Escape') {
            e.preventDefault();
            setEditValue(cellData.rawValue?.toString() || '');
            inputRef.current?.blur();
        }
    };
    const cellStyleFromData = cellData.style || {};
    // const conditionalStyle = getAppliedConditionalStyle(cellData, address, conditionalFormatRules); // For direct style obj
    const conditionalClass = getConditionalFormatClass(cellData, address, conditionalFormatRules);
    const appliedStyle = {
        fontWeight: cellStyleFromData.bold ? 'bold' : 'normal',
        fontStyle: cellStyleFromData.italic ? 'italic' : 'normal',
        textDecoration: cellStyleFromData.underline ? 'underline' : 'none',
        textAlign: cellStyleFromData.textAlign,
        width: width ? `${width}px` : undefined,
        height: height ? `${height}px` : undefined
    };
    const cellClasses = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("p-1.5 border text-sm truncate min-w-[var(--default-cell-width,120px)] relative select-none outline-none", "overflow-hidden whitespace-nowrap", {
        "font-bold": cellData.style?.bold
    }, {
        "italic": cellData.style?.italic
    }, {
        "underline": cellData.style?.underline
    }, cellData.style?.textAlign === 'left' && "text-left", cellData.style?.textAlign === 'center' && "text-center", cellData.style?.textAlign === 'right' && "text-right", cellData.style?.hasBorder && "border-gray-400", isInSelectionRange && !isActive && !isActivelyEditingFormulaGlobal && "bg-primary/20", isFormulaHighlightTarget && "bg-green-500/30 border-green-700 border-dashed !border-2", conditionalClass);
    if (isEditingThisCell && !isActivelyEditingFormulaGlobal) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(cellClasses, "p-0 z-10", {
                "border-gray-400": cellData.style?.hasBorder
            }),
            style: {
                ...appliedStyle,
                minWidth: width ? `${width}px` : '120px',
                minHeight: height ? `${height}px` : '28px'
            },
            onMouseDown: (e)=>{
                if (inputRef.current && !inputRef.current.contains(e.target)) {
                    handleMouseDown(e);
                }
            },
            onMouseEnter: handleMouseEnter,
            children: [
                isActive && !isActivelyEditingFormulaGlobal && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "absolute inset-[-1px] border-2 border-primary pointer-events-none rounded-[1px] z-20"
                }, void 0, false, {
                    fileName: "[project]/src/components/spreadsheet/Cell.tsx",
                    lineNumber: 241,
                    columnNumber: 13
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                    ref: inputRef,
                    type: "text",
                    value: editValue,
                    onChange: handleChange,
                    onBlur: handleBlur,
                    onKeyDown: handleKeyDown,
                    className: "w-full h-full p-1.5 box-border text-sm outline-none rounded-none border-transparent focus:ring-0 focus:border-transparent bg-background",
                    style: {
                        fontWeight: appliedStyle.fontWeight,
                        fontStyle: appliedStyle.fontStyle,
                        textDecoration: appliedStyle.textDecoration,
                        textAlign: appliedStyle.textAlign,
                        height: '100%'
                    },
                    "aria-label": `Edit cell ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$spreadsheet$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCellId"])(address.rowIndex, address.colIndex)}`
                }, void 0, false, {
                    fileName: "[project]/src/components/spreadsheet/Cell.tsx",
                    lineNumber: 243,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/spreadsheet/Cell.tsx",
            lineNumber: 230,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
        className: cellClasses,
        style: {
            ...appliedStyle,
            minWidth: width ? `${width}px` : '120px',
            height: height ? `${height}px` : undefined
        },
        onClick: handleClick,
        onDoubleClick: handleDoubleClick,
        onMouseDown: handleMouseDown,
        onMouseEnter: handleMouseEnter,
        tabIndex: 0,
        "aria-readonly": true,
        "data-cell-id": (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$spreadsheet$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCellId"])(address.rowIndex, address.colIndex),
        children: [
            isActive && !isActivelyEditingFormulaGlobal && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute inset-[-1px] border-2 border-primary pointer-events-none rounded-[1px] z-20"
            }, void 0, false, {
                fileName: "[project]/src/components/spreadsheet/Cell.tsx",
                lineNumber: 277,
                columnNumber: 11
            }, this),
            isFormulaHighlightTarget && !isActive && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute inset-[-1px] border-2 border-dashed border-green-700 pointer-events-none rounded-[1px] z-10"
            }, void 0, false, {
                fileName: "[project]/src/components/spreadsheet/Cell.tsx",
                lineNumber: 280,
                columnNumber: 10
            }, this),
            String(cellData.value ?? '')
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/spreadsheet/Cell.tsx",
        lineNumber: 265,
        columnNumber: 5
    }, this);
}
_s(Cell, "cKYVl4va89HOMJ8YhNPl6tXMOag=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useSpreadsheet$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSpreadsheet"]
    ];
});
_c = Cell;
var _c;
__turbopack_context__.k.register(_c, "Cell");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/components/spreadsheet/Grid.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>Grid)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useSpreadsheet$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/useSpreadsheet.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$spreadsheet$2f$Cell$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/spreadsheet/Cell.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$scroll$2d$area$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/scroll-area.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/table.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$spreadsheet$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/types/spreadsheet.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
const getColumnName = (index)=>{
    let name = '';
    let n = index;
    do {
        name = String.fromCharCode(65 + n % 26) + name;
        n = Math.floor(n / 26) - 1;
    }while (n >= 0)
    return name;
};
function makeRangeString(start, end) {
    const minR = Math.min(start.rowIndex, end.rowIndex);
    const maxR = Math.max(start.rowIndex, end.rowIndex);
    const minC = Math.min(start.colIndex, end.colIndex);
    const maxC = Math.max(start.colIndex, end.colIndex);
    const startId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$spreadsheet$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCellId"])(minR, minC);
    const endId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$spreadsheet$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCellId"])(maxR, maxC);
    return startId === endId ? startId : `${startId}:${endId}`;
}
function Grid({ sheet }) {
    _s();
    const { spreadsheet, updateCell, activeCell, selectionRange, setActiveCellAndSelection, isActivelyEditingFormula, formulaBarApiRef, updateColumnWidth, updateRowHeight } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useSpreadsheet$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSpreadsheet"])();
    const [editingCell, setEditingCell] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const gridRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const isMouseDownRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    const formulaSelectionStartCellRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const currentFormulaDragRangeStringRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [formulaHighlightRange, setFormulaHighlightRange] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // For resizing
    const [resizingColumn, setResizingColumn] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [resizingRow, setResizingRow] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const resizerTolerance = 5; // pixels
    const handleCellChange = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "Grid.useCallback[handleCellChange]": (rowIndex, colIndex, rawValue)=>{
            updateCell(sheet.id, rowIndex, colIndex, {
                rawValue
            });
        }
    }["Grid.useCallback[handleCellChange]"], [
        updateCell,
        sheet.id
    ]);
    const handleCellSelect = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "Grid.useCallback[handleCellSelect]": (address, isShiftKey, isDrag)=>{
            if (formulaBarApiRef.current && isActivelyEditingFormula) {
                const newCellId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$spreadsheet$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCellId"])(address.rowIndex, address.colIndex);
                if (isDrag) {
                    if (!formulaSelectionStartCellRef.current) {
                        formulaSelectionStartCellRef.current = address;
                        currentFormulaDragRangeStringRef.current = newCellId;
                        formulaBarApiRef.current.appendText(newCellId);
                        setFormulaHighlightRange({
                            start: address,
                            end: address
                        });
                    } else {
                        const newRangeString = makeRangeString(formulaSelectionStartCellRef.current, address);
                        const currentFullFormula = formulaBarApiRef.current.getValue();
                        const oldRangeToken = currentFormulaDragRangeStringRef.current;
                        if (oldRangeToken && currentFullFormula.endsWith(oldRangeToken)) {
                            const baseFormula = currentFullFormula.slice(0, -oldRangeToken.length);
                            formulaBarApiRef.current.setText(baseFormula + newRangeString);
                        } else {
                            // Check if the formula ends with any cell/range reference and replace that.
                            // This is a more robust way to handle mid-formula edits.
                            const endsWithCellOrRangeRegex = /([A-Z]+[1-9]\d*(?::[A-Z]+[1-9]\d*)?)$/;
                            const formulaEndsWithMatch = currentFullFormula.match(endsWithCellOrRangeRegex);
                            if (formulaEndsWithMatch && formulaEndsWithMatch[1] === oldRangeToken) {
                                const baseFormula = currentFullFormula.slice(0, -oldRangeToken.length);
                                formulaBarApiRef.current.setText(baseFormula + newRangeString);
                            } else {
                                // Fallback or more complex logic needed if not simply replacing the end.
                                // For now, we might just append or let the user manually correct.
                                // To avoid A1A1:B2, we check if the end is an operator or (
                                const endsWithOperatorOrParen = /[+\-*/,(]$/.test(currentFullFormula);
                                if (endsWithOperatorOrParen || currentFullFormula === "=") {
                                    formulaBarApiRef.current.appendText(newRangeString);
                                } else {
                                    // If it doesn't end with an operator, it's safer to replace the last token.
                                    // This assumes the last token *was* the one we're dragging from.
                                    if (oldRangeToken) {
                                        const baseFormula = currentFullFormula.slice(0, -oldRangeToken.length);
                                        formulaBarApiRef.current.setText(baseFormula + newRangeString);
                                    } else {
                                        formulaBarApiRef.current.appendText(newRangeString);
                                    }
                                }
                            }
                        }
                        currentFormulaDragRangeStringRef.current = newRangeString;
                        setFormulaHighlightRange({
                            start: formulaSelectionStartCellRef.current,
                            end: address
                        });
                    }
                } else {
                    const currentFullFormula = formulaBarApiRef.current.getValue();
                    const endsWithOperatorOrParenOrComma = /[+\-*/,(]$/.test(currentFullFormula);
                    const isFormulaEmptyIsh = currentFullFormula === "=" || currentFullFormula === "";
                    const endsWithCellOrRangeRegex = /([A-Z]+[1-9]\d*(?::[A-Z]+[1-9]\d*)?)$/;
                    const formulaEndsWithMatch = currentFullFormula.match(endsWithCellOrRangeRegex);
                    if (formulaEndsWithMatch && !endsWithOperatorOrParenOrComma && !isFormulaEmptyIsh) {
                        const oldToken = formulaEndsWithMatch[1];
                        const baseFormula = currentFullFormula.slice(0, -oldToken.length);
                        formulaBarApiRef.current.setText(baseFormula + newCellId);
                    } else {
                        formulaBarApiRef.current.appendText(newCellId);
                    }
                    formulaSelectionStartCellRef.current = address;
                    currentFormulaDragRangeStringRef.current = newCellId;
                    setFormulaHighlightRange({
                        start: address,
                        end: address
                    });
                }
                formulaBarApiRef.current.focus();
                return;
            }
            // Normal selection
            setActiveCellAndSelection(address, isShiftKey, isDrag);
            setFormulaHighlightRange(null);
        }
    }["Grid.useCallback[handleCellSelect]"], [
        setActiveCellAndSelection,
        isActivelyEditingFormula,
        formulaBarApiRef,
        sheet.id
    ]);
    const startCellEditing = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "Grid.useCallback[startCellEditing]": (address)=>{
            if (isActivelyEditingFormula) return;
            // Ensure cell is active before editing
            if (activeCell && activeCell.sheetId === address.sheetId && activeCell.rowIndex === address.rowIndex && activeCell.colIndex === address.colIndex) {
                if (editingCell?.rowIndex !== address.rowIndex || editingCell?.colIndex !== address.colIndex || editingCell?.sheetId !== address.sheetId) {
                    setEditingCell(address);
                }
            } else {
            // Make it active first, then edit. This might require a double click or a more refined click logic.
            // For now, single click makes active, second click (or direct type) on active cell edits.
            // The Cell component itself handles the transition from active to editing this cell.
            }
        }
    }["Grid.useCallback[startCellEditing]"], [
        editingCell,
        activeCell,
        isActivelyEditingFormula
    ]);
    const stopCellEditing = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "Grid.useCallback[stopCellEditing]": ()=>{
            setEditingCell(null);
        }
    }["Grid.useCallback[stopCellEditing]"], []);
    const handleGridMouseUp = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "Grid.useCallback[handleGridMouseUp]": ()=>{
            isMouseDownRef.current = false;
            if (isActivelyEditingFormula) {
                if (formulaBarApiRef.current) {
                    formulaBarApiRef.current.focus();
                }
            // Do not clear formulaSelectionStartCellRef or currentFormulaDragRangeStringRef here
            // as user might want to type after selecting. They get cleared if formula mode ends.
            }
        }
    }["Grid.useCallback[handleGridMouseUp]"], [
        isActivelyEditingFormula,
        formulaBarApiRef
    ]);
    // Global mouse move and up for resizing
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Grid.useEffect": ()=>{
            const handleGlobalMouseMove = {
                "Grid.useEffect.handleGlobalMouseMove": (e)=>{
                    if (resizingColumn) {
                        const newWidth = resizingColumn.initialWidth + (e.clientX - resizingColumn.startX);
                    // Optionally, live update a temporary width here if you want visual feedback during drag
                    // For now, we update on mouse up.
                    }
                    if (resizingRow) {
                        const newHeight = resizingRow.initialHeight + (e.clientY - resizingRow.startY);
                    // Live update temp height
                    }
                }
            }["Grid.useEffect.handleGlobalMouseMove"];
            const handleGlobalMouseUp = {
                "Grid.useEffect.handleGlobalMouseUp": ()=>{
                    if (resizingColumn && spreadsheet) {
                        const finalWidth = resizingColumn.initialWidth + (document.body.style.cursor === 'col-resize' ? event.clientX - resizingColumn.startX : 0);
                        updateColumnWidth(sheet.id, resizingColumn.index, Math.max(20, finalWidth));
                    }
                    if (resizingRow && spreadsheet) {
                        const finalHeight = resizingRow.initialHeight + (document.body.style.cursor === 'row-resize' ? event.clientY - resizingRow.startY : 0);
                        updateRowHeight(sheet.id, resizingRow.index, Math.max(20, finalHeight));
                    }
                    setResizingColumn(null);
                    setResizingRow(null);
                    document.body.style.cursor = 'default';
                    handleGridMouseUp(); // Also call general grid mouse up
                }
            }["Grid.useEffect.handleGlobalMouseUp"];
            document.addEventListener('mousemove', handleGlobalMouseMove);
            document.addEventListener('mouseup', handleGlobalMouseUp);
            return ({
                "Grid.useEffect": ()=>{
                    document.removeEventListener('mousemove', handleGlobalMouseMove);
                    document.removeEventListener('mouseup', handleGlobalMouseUp);
                }
            })["Grid.useEffect"];
        }
    }["Grid.useEffect"], [
        resizingColumn,
        resizingRow,
        sheet.id,
        updateColumnWidth,
        updateRowHeight,
        handleGridMouseUp,
        spreadsheet
    ]);
    const handleColumnHeaderMouseDown = (colIndex, e)=>{
        const rect = e.currentTarget.getBoundingClientRect();
        if (rect.right - e.clientX < resizerTolerance) {
            e.preventDefault();
            setResizingColumn({
                index: colIndex,
                startX: e.clientX,
                initialWidth: columnWidths[colIndex] || __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$spreadsheet$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_COLUMN_WIDTH"]
            });
            document.body.style.cursor = 'col-resize';
        }
    };
    const handleRowHeaderMouseDown = (rowIndex, e)=>{
        const rect = e.currentTarget.getBoundingClientRect();
        if (rect.bottom - e.clientY < resizerTolerance) {
            e.preventDefault();
            setResizingRow({
                index: rowIndex,
                startY: e.clientY,
                initialHeight: rowHeights[rowIndex] || __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$spreadsheet$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_ROW_HEIGHT"]
            });
            document.body.style.cursor = 'row-resize';
        }
    };
    const handleColumnHeaderMouseMove = (e)=>{
        if (resizingColumn || resizingRow) return; // If already resizing, global handler takes over
        const rect = e.currentTarget.getBoundingClientRect();
        if (rect.right - e.clientX < resizerTolerance) {
            e.currentTarget.style.cursor = 'col-resize';
        } else {
            e.currentTarget.style.cursor = 'default';
        }
    };
    const handleRowHeaderMouseMove = (e)=>{
        if (resizingColumn || resizingRow) return;
        const rect = e.currentTarget.getBoundingClientRect();
        if (rect.bottom - e.clientY < resizerTolerance) {
            e.currentTarget.style.cursor = 'row-resize';
        } else {
            e.currentTarget.style.cursor = 'default';
        }
    };
    const handleHeaderMouseLeave = (e)=>{
        if (!resizingColumn && !resizingRow) {
            e.currentTarget.style.cursor = 'default';
        }
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Grid.useEffect": ()=>{
            const handleClickOutside = {
                "Grid.useEffect.handleClickOutside": (event1)=>{
                    if (gridRef.current && !gridRef.current.contains(event1.target) && editingCell) {
                        const activeInputElement = document.querySelector(`td[data-cell-id="${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$spreadsheet$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCellId"])(editingCell.rowIndex, editingCell.colIndex)}"] input`);
                        activeInputElement?.blur();
                    }
                }
            }["Grid.useEffect.handleClickOutside"];
            document.addEventListener('mousedown', handleClickOutside);
            return ({
                "Grid.useEffect": ()=>{
                    document.removeEventListener('mousedown', handleClickOutside);
                }
            })["Grid.useEffect"];
        }
    }["Grid.useEffect"], [
        editingCell
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Grid.useEffect": ()=>{
            if (!isActivelyEditingFormula) {
                setFormulaHighlightRange(null);
                currentFormulaDragRangeStringRef.current = null;
                formulaSelectionStartCellRef.current = null;
            }
        }
    }["Grid.useEffect"], [
        isActivelyEditingFormula
    ]);
    const columnWidths = sheet.columnWidths || Array(sheet.columnCount).fill(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$spreadsheet$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_COLUMN_WIDTH"]);
    const rowHeights = sheet.rowHeights || Array(sheet.rowCount).fill(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$spreadsheet$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_ROW_HEIGHT"]);
    const isCellInSelection = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "Grid.useCallback[isCellInSelection]": (rowIndex, colIndex)=>{
            if (!selectionRange || selectionRange.start.sheetId !== sheet.id || selectionRange.end.sheetId !== sheet.id) return false;
            const { start, end } = selectionRange;
            const minRow = Math.min(start.rowIndex, end.rowIndex);
            const maxRow = Math.max(start.rowIndex, end.rowIndex);
            const minCol = Math.min(start.colIndex, end.colIndex);
            const maxCol = Math.max(start.colIndex, end.colIndex);
            return rowIndex >= minRow && rowIndex <= maxRow && colIndex >= minCol && colIndex <= maxCol;
        }
    }["Grid.useCallback[isCellInSelection]"], [
        selectionRange,
        sheet.id
    ]);
    const isCellInFormulaHighlight = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "Grid.useCallback[isCellInFormulaHighlight]": (rowIndex, colIndex)=>{
            if (!isActivelyEditingFormula || !formulaHighlightRange || formulaHighlightRange.start.sheetId !== sheet.id) return false;
            const { start, end } = formulaHighlightRange;
            const minRow = Math.min(start.rowIndex, end.rowIndex);
            const maxRow = Math.max(start.rowIndex, end.rowIndex);
            const minCol = Math.min(start.colIndex, end.colIndex);
            const maxCol = Math.max(start.colIndex, end.colIndex);
            return rowIndex >= minRow && rowIndex <= maxRow && colIndex >= minCol && colIndex <= maxCol;
        }
    }["Grid.useCallback[isCellInFormulaHighlight]"], [
        isActivelyEditingFormula,
        formulaHighlightRange,
        sheet.id
    ]);
    if (!sheet || !sheet.cells) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "p-4",
            children: "Loading sheet data..."
        }, void 0, false, {
            fileName: "[project]/src/components/spreadsheet/Grid.tsx",
            lineNumber: 315,
            columnNumber: 12
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$scroll$2d$area$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ScrollArea"], {
        className: "h-full w-full p-1 bg-muted/20 focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 rounded-md",
        tabIndex: -1,
        ref: gridRef,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Table"], {
                className: "min-w-full border-collapse table-fixed select-none",
                style: {
                    '--default-cell-width': `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$spreadsheet$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_COLUMN_WIDTH"]}px`,
                    '--default-row-height': `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$spreadsheet$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_ROW_HEIGHT"]}px`
                },
                onMouseDown: ()=>{
                    isMouseDownRef.current = true;
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableHeader"], {
                        className: "sticky top-0 bg-card z-20 shadow-sm print:bg-white",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableRow"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableHead"], {
                                    className: "w-12 min-w-[3rem] p-0 text-center border sticky left-0 bg-card z-30 select-none print:bg-white",
                                    style: {
                                        width: '3rem',
                                        minWidth: '3rem',
                                        height: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$spreadsheet$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_ROW_HEIGHT"]}px`
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/src/components/spreadsheet/Grid.tsx",
                                    lineNumber: 331,
                                    columnNumber: 15
                                }, this),
                                Array.from({
                                    length: sheet.columnCount
                                }).map((_, colIndex)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableHead"], {
                                        className: "p-0 text-center border select-none print:bg-white relative" // relative for resizer
                                        ,
                                        style: {
                                            width: `${columnWidths[colIndex] || __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$spreadsheet$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_COLUMN_WIDTH"]}px`,
                                            minWidth: `${columnWidths[colIndex] || __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$spreadsheet$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_COLUMN_WIDTH"]}px`,
                                            height: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$spreadsheet$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_ROW_HEIGHT"]}px` // Set header row height
                                        },
                                        onMouseDown: (e)=>handleColumnHeaderMouseDown(colIndex, e),
                                        onMouseMove: handleColumnHeaderMouseMove,
                                        onMouseLeave: handleHeaderMouseLeave,
                                        children: getColumnName(colIndex)
                                    }, `header-${colIndex}`, false, {
                                        fileName: "[project]/src/components/spreadsheet/Grid.tsx",
                                        lineNumber: 338,
                                        columnNumber: 17
                                    }, this))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/spreadsheet/Grid.tsx",
                            lineNumber: 330,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/spreadsheet/Grid.tsx",
                        lineNumber: 329,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableBody"], {
                        children: sheet.cells.map((row, rowIndex)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableRow"], {
                                style: {
                                    height: `${rowHeights[rowIndex] || __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$spreadsheet$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_ROW_HEIGHT"]}px`
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableHead"], {
                                        className: "w-12 min-w-[3rem] p-0 text-center border sticky left-0 bg-card z-10 select-none print:bg-white relative",
                                        style: {
                                            width: '3rem',
                                            minWidth: '3rem',
                                            height: `${rowHeights[rowIndex] || __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$spreadsheet$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_ROW_HEIGHT"]}px`
                                        },
                                        onMouseDown: (e)=>handleRowHeaderMouseDown(rowIndex, e),
                                        onMouseMove: handleRowHeaderMouseMove,
                                        onMouseLeave: handleHeaderMouseLeave,
                                        children: rowIndex + 1
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/spreadsheet/Grid.tsx",
                                        lineNumber: 358,
                                        columnNumber: 17
                                    }, this),
                                    row.map((cell, colIndex)=>{
                                        const currentCellAddress = {
                                            sheetId: sheet.id,
                                            rowIndex,
                                            colIndex
                                        };
                                        const isCurrentActive = !isActivelyEditingFormula && activeCell?.sheetId === sheet.id && activeCell.rowIndex === rowIndex && activeCell.colIndex === colIndex;
                                        const isEditingThis = !isActivelyEditingFormula && editingCell?.sheetId === sheet.id && editingCell.rowIndex === rowIndex && editingCell.colIndex === colIndex;
                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$spreadsheet$2f$Cell$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                            cellData: cell,
                                            address: currentCellAddress,
                                            onCellChange: handleCellChange,
                                            isActive: isCurrentActive,
                                            isInSelectionRange: !isActivelyEditingFormula && isCellInSelection(rowIndex, colIndex),
                                            isFormulaHighlightTarget: isCellInFormulaHighlight(rowIndex, colIndex),
                                            onSelect: handleCellSelect,
                                            startEditing: startCellEditing,
                                            stopEditing: stopCellEditing,
                                            isEditingThisCell: isEditingThis,
                                            width: columnWidths[colIndex] || __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$spreadsheet$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_COLUMN_WIDTH"],
                                            height: rowHeights[rowIndex] || __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$spreadsheet$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_ROW_HEIGHT"],
                                            isActivelyEditingFormulaGlobal: isActivelyEditingFormula,
                                            conditionalFormatRules: sheet.conditionalFormatRules
                                        }, cell.id, false, {
                                            fileName: "[project]/src/components/spreadsheet/Grid.tsx",
                                            lineNumber: 373,
                                            columnNumber: 21
                                        }, this);
                                    })
                                ]
                            }, `row-${rowIndex}`, true, {
                                fileName: "[project]/src/components/spreadsheet/Grid.tsx",
                                lineNumber: 357,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/components/spreadsheet/Grid.tsx",
                        lineNumber: 355,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/spreadsheet/Grid.tsx",
                lineNumber: 324,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "h-4"
            }, void 0, false, {
                fileName: "[project]/src/components/spreadsheet/Grid.tsx",
                lineNumber: 396,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/spreadsheet/Grid.tsx",
        lineNumber: 319,
        columnNumber: 5
    }, this);
}
_s(Grid, "psXe+tMZZ8HUiXk1eecRU8pXUhw=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useSpreadsheet$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSpreadsheet"]
    ];
});
_c = Grid;
var _c;
__turbopack_context__.k.register(_c, "Grid");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/components/spreadsheet/FormulaBar.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>FormulaBar)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/input.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/label.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useSpreadsheet$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/useSpreadsheet.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$spreadsheet$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/types/spreadsheet.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/check.js [app-client] (ecmascript) <export default as Check>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__XIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as XIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2d$function$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FunctionSquare$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/square-function.js [app-client] (ecmascript) <export default as FunctionSquare>");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
function FormulaBar() {
    _s();
    const { spreadsheet, activeCell, updateCell, setIsActivelyEditingFormula, formulaBarApiRef, evaluateFormula// Get evaluateFormula from context for preview if needed
     } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useSpreadsheet$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSpreadsheet"])();
    const [currentFormula, setCurrentFormula] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [showConfirmCancel, setShowConfirmCancel] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const inputRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    // Expose API to context
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "FormulaBar.useEffect": ()=>{
            if (formulaBarApiRef) {
                const api = {
                    appendText: {
                        "FormulaBar.useEffect": (text)=>{
                            setCurrentFormula({
                                "FormulaBar.useEffect": (prev)=>{
                                    const input = inputRef.current;
                                    if (input) {
                                        const start = input.selectionStart ?? prev.length; // Default to end if null
                                        const end = input.selectionEnd ?? prev.length; // Default to end if null
                                        const newValue = prev.substring(0, start) + text + prev.substring(end);
                                        // Set timeout to allow React to re-render before setting selection
                                        // This ensures the input value is updated in the DOM first.
                                        setTimeout({
                                            "FormulaBar.useEffect": ()=>{
                                                input.focus(); // Re-focus just in case
                                                input.selectionStart = input.selectionEnd = start + text.length;
                                            }
                                        }["FormulaBar.useEffect"], 0);
                                        return newValue;
                                    }
                                    return prev + text; // Fallback if input ref not available
                                }
                            }["FormulaBar.useEffect"]);
                            if (!showConfirmCancel) setShowConfirmCancel(true);
                        }
                    }["FormulaBar.useEffect"],
                    replaceText: {
                        "FormulaBar.useEffect": (oldTextSubString, newText)=>{
                            setCurrentFormula({
                                "FormulaBar.useEffect": (prev)=>{
                                    // This is a simple replacement, primarily for live range updates.
                                    // It assumes oldTextSubString is likely at the end.
                                    if (prev.endsWith(oldTextSubString)) {
                                        return prev.slice(0, -oldTextSubString.length) + newText;
                                    }
                                    // If not at the end, this simple version might not behave as expected for complex edits.
                                    // For now, if it's not at the end, we'll append. A more robust solution would require
                                    // knowledge of what specific token to replace if not simply the end.
                                    return prev + newText;
                                }
                            }["FormulaBar.useEffect"]);
                            if (!showConfirmCancel) setShowConfirmCancel(true);
                        }
                    }["FormulaBar.useEffect"],
                    setText: {
                        "FormulaBar.useEffect": (text)=>{
                            setCurrentFormula(text);
                            if (!showConfirmCancel && text !== (cellData?.rawValue?.toString() || '')) {
                                setShowConfirmCancel(true);
                            }
                        }
                    }["FormulaBar.useEffect"],
                    focus: {
                        "FormulaBar.useEffect": ()=>{
                            inputRef.current?.focus();
                        }
                    }["FormulaBar.useEffect"],
                    getValue: {
                        "FormulaBar.useEffect": ()=>{
                            // Prefer inputRef.current.value if available, as it's the most up-to-date during typing
                            return inputRef.current?.value ?? currentFormula;
                        }
                    }["FormulaBar.useEffect"]
                };
                formulaBarApiRef.current = api;
            }
            return ({
                "FormulaBar.useEffect": ()=>{
                    if (formulaBarApiRef) {
                        formulaBarApiRef.current = null;
                    }
                }
            })["FormulaBar.useEffect"];
        }
    }["FormulaBar.useEffect"], [
        formulaBarApiRef,
        showConfirmCancel,
        currentFormula
    ]); // Added currentFormula for getValue freshness, showConfirmCancel
    const activeSheet = spreadsheet?.sheets.find((s)=>s.id === spreadsheet.activeSheetId);
    const cellData = activeCell && activeSheet ? activeSheet.cells[activeCell.rowIndex]?.[activeCell.colIndex] : null;
    const { isActivelyEditingFormula: isFormulaContextEditing } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useSpreadsheet$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSpreadsheet"])(); // Get read-only value
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "FormulaBar.useEffect": ()=>{
            if (!isFormulaContextEditing && cellData) {
                setCurrentFormula(cellData.rawValue?.toString() || '');
                setShowConfirmCancel(false); // Hide buttons if not editing formula and cell changes
            } else if (!isFormulaContextEditing && !activeCell) {
                setCurrentFormula('');
                setShowConfirmCancel(false);
            }
        }
    }["FormulaBar.useEffect"], [
        activeCell,
        cellData,
        spreadsheet?.activeSheetId,
        isFormulaContextEditing
    ]);
    const handleInputChange = (e)=>{
        setCurrentFormula(e.target.value);
        if (!showConfirmCancel) setShowConfirmCancel(true);
        if (e.target.value.startsWith('=')) {
            setIsActivelyEditingFormula(true);
        }
    };
    const submitFormula = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "FormulaBar.useCallback[submitFormula]": ()=>{
            if (activeCell && spreadsheet && activeSheet) {
                // Use formulaBarApiRef.current.getValue() to get the most up-to-date value from the input
                const formulaToSubmit = formulaBarApiRef.current?.getValue() ?? currentFormula;
                updateCell(activeSheet.id, activeCell.rowIndex, activeCell.colIndex, {
                    rawValue: formulaToSubmit
                });
            }
            setIsActivelyEditingFormula(false);
            setShowConfirmCancel(false);
        }
    }["FormulaBar.useCallback[submitFormula]"], [
        activeCell,
        spreadsheet,
        activeSheet,
        updateCell,
        setIsActivelyEditingFormula,
        currentFormula,
        formulaBarApiRef
    ]);
    const cancelEdit = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "FormulaBar.useCallback[cancelEdit]": ()=>{
            if (cellData) {
                setCurrentFormula(cellData.rawValue?.toString() || '');
            } else {
                setCurrentFormula('');
            }
            setIsActivelyEditingFormula(false);
            setShowConfirmCancel(false);
        // Consider blurring the input or focusing the grid, depending on desired UX
        }
    }["FormulaBar.useCallback[cancelEdit]"], [
        cellData,
        setIsActivelyEditingFormula
    ]);
    const handleKeyDown = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "FormulaBar.useCallback[handleKeyDown]": (e)=>{
            if (e.key === 'Enter') {
                e.preventDefault();
                submitFormula();
            // Focus might shift to grid or next cell after submit, handled by grid navigation later
            } else if (e.key === 'Escape') {
                e.preventDefault();
                cancelEdit();
            // inputRef.current?.blur(); // Blurring might be too aggressive, let user click away
            }
        }
    }["FormulaBar.useCallback[handleKeyDown]"], [
        submitFormula,
        cancelEdit
    ]);
    const handleFocus = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "FormulaBar.useCallback[handleFocus]": ()=>{
            // When formula bar is focused, always show confirm/cancel
            setShowConfirmCancel(true);
            // If the content starts with '=', ensure we are in formula editing mode
            if (inputRef.current?.value.startsWith('=')) {
                setIsActivelyEditingFormula(true);
            }
        }
    }["FormulaBar.useCallback[handleFocus]"], [
        setIsActivelyEditingFormula
    ]);
    const handleBlur = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "FormulaBar.useCallback[handleBlur]": (e)=>{
            // Delay to allow click on confirm/cancel buttons to register
            setTimeout({
                "FormulaBar.useCallback[handleBlur]": ()=>{
                    // Check if focus moved to a formula bar action button or if still in formula bar
                    const activeEl = document.activeElement;
                    if (activeEl !== inputRef.current && !activeEl?.classList.contains('formula-bar-action-button') && !e.relatedTarget?.classList.contains('formula-bar-action-button')) {
                        // If blurred to something else, and confirm/cancel were visible (meaning an edit was in progress)
                        if (showConfirmCancel) {
                            // If value changed, submit, otherwise cancel (revert to original cell value)
                            const currentValInBar = inputRef.current?.value ?? currentFormula;
                            if (currentValInBar !== (cellData?.rawValue?.toString() || '')) {
                                // submitFormula(); // Auto-submit on blur if changed - can be aggressive
                                // For now, let's prefer explicit submit/cancel.
                                // Or, if it starts with =, assume it's a formula to be kept.
                                if (!currentValInBar.startsWith('=')) cancelEdit(); // if not a formula, and blurred, cancel if changed
                            } else {
                                // No change, or was already equal. Treat as cancel to hide buttons.
                                cancelEdit();
                            }
                        }
                        // Always set formula editing to false on blur if not to its own buttons
                        setIsActivelyEditingFormula(false);
                    // setShowConfirmCancel(false); // This is handled by cancelEdit or submitFormula
                    }
                }
            }["FormulaBar.useCallback[handleBlur]"], 0);
        }
    }["FormulaBar.useCallback[handleBlur]"], [
        setIsActivelyEditingFormula,
        showConfirmCancel,
        currentFormula,
        cellData,
        submitFormula,
        cancelEdit
    ]);
    const selectedCellName = activeCell && spreadsheet ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$spreadsheet$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCellId"])(activeCell.rowIndex, activeCell.colIndex) : ' ';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "p-2 border-b bg-card flex items-center gap-2 shadow-sm print:hidden",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                type: "text",
                value: selectedCellName,
                readOnly: true,
                className: "w-20 h-10 text-sm text-center font-mono bg-muted border-r-0 rounded-r-none focus-visible:ring-0 focus-visible:ring-offset-0",
                "aria-label": "Selected cell name",
                tabIndex: -1
            }, void 0, false, {
                fileName: "[project]/src/components/spreadsheet/FormulaBar.tsx",
                lineNumber: 190,
                columnNumber: 7
            }, this),
            (showConfirmCancel || isFormulaContextEditing) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                        variant: "ghost",
                        size: "icon",
                        onClick: cancelEdit,
                        className: "h-10 w-10 text-destructive formula-bar-action-button",
                        "aria-label": "Cancel formula edit",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__XIcon$3e$__["XIcon"], {
                            size: 18
                        }, void 0, false, {
                            fileName: "[project]/src/components/spreadsheet/FormulaBar.tsx",
                            lineNumber: 202,
                            columnNumber: 17
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/spreadsheet/FormulaBar.tsx",
                        lineNumber: 201,
                        columnNumber: 13
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                        variant: "ghost",
                        size: "icon",
                        onClick: submitFormula,
                        className: "h-10 w-10 text-green-600 formula-bar-action-button",
                        "aria-label": "Confirm formula edit",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                            size: 18
                        }, void 0, false, {
                            fileName: "[project]/src/components/spreadsheet/FormulaBar.tsx",
                            lineNumber: 205,
                            columnNumber: 17
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/spreadsheet/FormulaBar.tsx",
                        lineNumber: 204,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                htmlFor: "formula-input",
                className: "font-mono text-sm p-2 bg-muted/50 rounded-l-md border h-10 flex items-center",
                onClick: ()=>inputRef.current?.focus(),
                title: "Formula",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2d$function$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FunctionSquare$3e$__["FunctionSquare"], {
                    size: 16
                }, void 0, false, {
                    fileName: "[project]/src/components/spreadsheet/FormulaBar.tsx",
                    lineNumber: 214,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/spreadsheet/FormulaBar.tsx",
                lineNumber: 210,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                ref: inputRef,
                id: "formula-input",
                type: "text",
                placeholder: activeCell ? "Enter value or formula..." : "Select a cell to edit...",
                value: currentFormula,
                onChange: handleInputChange,
                onKeyDown: handleKeyDown,
                onFocus: handleFocus,
                onBlur: handleBlur,
                className: "flex-grow h-10 rounded-l-none focus-visible:ring-inset",
                "aria-label": "Formula input bar",
                disabled: !spreadsheet
            }, void 0, false, {
                fileName: "[project]/src/components/spreadsheet/FormulaBar.tsx",
                lineNumber: 216,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/spreadsheet/FormulaBar.tsx",
        lineNumber: 189,
        columnNumber: 5
    }, this);
}
_s(FormulaBar, "rOgC/+ZEOZc6ns1EGVOfpmL6eAk=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useSpreadsheet$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSpreadsheet"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useSpreadsheet$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSpreadsheet"]
    ];
});
_c = FormulaBar;
var _c;
__turbopack_context__.k.register(_c, "FormulaBar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/components/ui/resizable.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "ResizableHandle": (()=>ResizableHandle),
    "ResizablePanel": (()=>ResizablePanel),
    "ResizablePanelGroup": (()=>ResizablePanelGroup)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$resizable$2d$panels$2f$dist$2f$react$2d$resizable$2d$panels$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-resizable-panels/dist/react-resizable-panels.browser.development.esm.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
"use client";
;
;
;
;
const ResizablePanelGroup = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$resizable$2d$panels$2f$dist$2f$react$2d$resizable$2d$panels$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PanelGroup"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex h-full w-full data-[panel-group-direction=vertical]:flex-col", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/resizable.tsx",
        lineNumber: 13,
        columnNumber: 3
    }, this));
_c1 = ResizablePanelGroup;
ResizablePanelGroup.displayName = "ResizablePanelGroup";
const ResizablePanel = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$resizable$2d$panels$2f$dist$2f$react$2d$resizable$2d$panels$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Panel"];
ResizablePanel.displayName = "ResizablePanel";
const ResizableHandle = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c2 = ({ className, withHandle, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$resizable$2d$panels$2f$dist$2f$react$2d$resizable$2d$panels$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PanelGroup"].Handle, {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("relative flex w-px items-center justify-center bg-border after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 data-[panel-group-direction=vertical]:h-px data-[panel-group-direction=vertical]:w-full data-[panel-group-direction=vertical]:after:left-0 data-[panel-group-direction=vertical]:after:h-1 data-[panel-group-direction=vertical]:after:w-full data-[panel-group-direction=vertical]:after:-translate-y-1/2 data-[panel-group-direction=vertical]:after:translate-x-0 [&[data-panel-group-direction=vertical]>div]:rotate-90", className),
        ...props,
        children: withHandle && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "z-10 flex h-4 w-3 items-center justify-center rounded-sm border bg-border",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                xmlns: "http://www.w3.org/2000/svg",
                width: "24",
                height: "24",
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                strokeWidth: "2",
                strokeLinecap: "round",
                strokeLinejoin: "round",
                className: "lucide lucide-grip-vertical h-2.5 w-2.5",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                        cx: "9",
                        cy: "12",
                        r: "1"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/resizable.tsx",
                        lineNumber: 56,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                        cx: "9",
                        cy: "5",
                        r: "1"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/resizable.tsx",
                        lineNumber: 57,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                        cx: "9",
                        cy: "19",
                        r: "1"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/resizable.tsx",
                        lineNumber: 58,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                        cx: "15",
                        cy: "12",
                        r: "1"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/resizable.tsx",
                        lineNumber: 59,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                        cx: "15",
                        cy: "5",
                        r: "1"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/resizable.tsx",
                        lineNumber: 60,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                        cx: "15",
                        cy: "19",
                        r: "1"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/resizable.tsx",
                        lineNumber: 61,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ui/resizable.tsx",
                lineNumber: 44,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/ui/resizable.tsx",
            lineNumber: 43,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/ui/resizable.tsx",
        lineNumber: 34,
        columnNumber: 3
    }, this));
_c3 = ResizableHandle;
ResizableHandle.displayName = "ResizableHandle";
;
var _c, _c1, _c2, _c3;
__turbopack_context__.k.register(_c, "ResizablePanelGroup$React.forwardRef");
__turbopack_context__.k.register(_c1, "ResizablePanelGroup");
__turbopack_context__.k.register(_c2, "ResizableHandle$React.forwardRef");
__turbopack_context__.k.register(_c3, "ResizableHandle");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/components/spreadsheet/SpreadsheetEditorLayout.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>SpreadsheetEditorLayout)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)"); // Added useState, useEffect
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useSpreadsheet$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/useSpreadsheet.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$spreadsheet$2f$Toolbar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/spreadsheet/Toolbar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$spreadsheet$2f$SheetTabs$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/spreadsheet/SheetTabs.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$spreadsheet$2f$Grid$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/spreadsheet/Grid.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$spreadsheet$2f$FormulaBar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/spreadsheet/FormulaBar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$resizable$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/resizable.tsx [app-client] (ecmascript)"); // Removed ResizableHandle for now
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
function SpreadsheetEditorLayout() {
    _s();
    const { spreadsheet } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useSpreadsheet$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSpreadsheet"])();
    const [theme, setThemeState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(undefined);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SpreadsheetEditorLayout.useEffect": ()=>{
            // Get theme from localStorage on mount
            const storedTheme = localStorage.getItem('spreadsheet-theme') || 'light';
            setThemeState(storedTheme);
            if (storedTheme === 'dark') {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        }
    }["SpreadsheetEditorLayout.useEffect"], []);
    const setTheme = (newTheme)=>{
        setThemeState(newTheme);
        localStorage.setItem('spreadsheet-theme', newTheme);
        if (newTheme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    };
    if (!spreadsheet) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center justify-center h-screen",
            children: "Spreadsheet data not available."
        }, void 0, false, {
            fileName: "[project]/src/components/spreadsheet/SpreadsheetEditorLayout.tsx",
            lineNumber: 39,
            columnNumber: 12
        }, this);
    }
    const activeSheet = spreadsheet.sheets.find((s)=>s.id === spreadsheet.activeSheetId);
    if (!activeSheet) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center justify-center h-screen",
            children: "Active sheet not found."
        }, void 0, false, {
            fileName: "[project]/src/components/spreadsheet/SpreadsheetEditorLayout.tsx",
            lineNumber: 45,
            columnNumber: 12
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-col h-screen bg-background overflow-hidden",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$spreadsheet$2f$Toolbar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                spreadsheetName: spreadsheet.name,
                theme: theme,
                setTheme: setTheme
            }, void 0, false, {
                fileName: "[project]/src/components/spreadsheet/SpreadsheetEditorLayout.tsx",
                lineNumber: 50,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$spreadsheet$2f$FormulaBar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/src/components/spreadsheet/SpreadsheetEditorLayout.tsx",
                lineNumber: 51,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-grow overflow-hidden",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$resizable$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ResizablePanelGroup"], {
                    direction: "vertical",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$resizable$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ResizablePanel"], {
                        defaultSize: 100,
                        className: "min-h-[200px]",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$spreadsheet$2f$Grid$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            sheet: activeSheet
                        }, void 0, false, {
                            fileName: "[project]/src/components/spreadsheet/SpreadsheetEditorLayout.tsx",
                            lineNumber: 55,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/spreadsheet/SpreadsheetEditorLayout.tsx",
                        lineNumber: 54,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/spreadsheet/SpreadsheetEditorLayout.tsx",
                    lineNumber: 53,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/spreadsheet/SpreadsheetEditorLayout.tsx",
                lineNumber: 52,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$spreadsheet$2f$SheetTabs$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                sheets: spreadsheet.sheets,
                activeSheetId: spreadsheet.activeSheetId
            }, void 0, false, {
                fileName: "[project]/src/components/spreadsheet/SpreadsheetEditorLayout.tsx",
                lineNumber: 59,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/spreadsheet/SpreadsheetEditorLayout.tsx",
        lineNumber: 49,
        columnNumber: 5
    }, this);
}
_s(SpreadsheetEditorLayout, "pSxLcOry4M/pP+e3tf65V9wKcm0=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useSpreadsheet$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSpreadsheet"]
    ];
});
_c = SpreadsheetEditorLayout;
var _c;
__turbopack_context__.k.register(_c, "SpreadsheetEditorLayout");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/app/spreadsheet/[id]/page.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>SpreadsheetPage)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$SpreadsheetContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/contexts/SpreadsheetContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useSpreadsheet$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/useSpreadsheet.ts [app-client] (ecmascript)"); // Corrected import path
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$spreadsheet$2f$SpreadsheetEditorLayout$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/spreadsheet/SpreadsheetEditorLayout.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/loader-circle.js [app-client] (ecmascript) <export default as Loader2>");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
function SpreadsheetEditorPageContents() {
    _s();
    const params = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"])();
    const spreadsheetId = params.id;
    const { spreadsheet, isLoading, loadSpreadsheet } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useSpreadsheet$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSpreadsheet"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SpreadsheetEditorPageContents.useEffect": ()=>{
            if (spreadsheetId) {
                loadSpreadsheet(spreadsheetId);
            }
        }
    }["SpreadsheetEditorPageContents.useEffect"], [
        spreadsheetId,
        loadSpreadsheet
    ]);
    if (isLoading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex flex-col items-center justify-center h-full flex-grow",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                    className: "h-12 w-12 animate-spin text-primary"
                }, void 0, false, {
                    fileName: "[project]/src/app/spreadsheet/[id]/page.tsx",
                    lineNumber: 25,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "mt-4 text-lg text-muted-foreground",
                    children: "Loading spreadsheet..."
                }, void 0, false, {
                    fileName: "[project]/src/app/spreadsheet/[id]/page.tsx",
                    lineNumber: 26,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/spreadsheet/[id]/page.tsx",
            lineNumber: 24,
            columnNumber: 7
        }, this);
    }
    if (!spreadsheet && !isLoading) {
        // Could be due to error or not found, context handles toast.
        // Allow user to go back.
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex flex-col items-center justify-center h-full flex-grow p-8 text-center",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                    className: "text-2xl font-semibold text-destructive mb-4",
                    children: "Spreadsheet Not Found"
                }, void 0, false, {
                    fileName: "[project]/src/app/spreadsheet/[id]/page.tsx",
                    lineNumber: 36,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-muted-foreground mb-6",
                    children: "The requested spreadsheet could not be loaded. It might have been deleted or an error occurred."
                }, void 0, false, {
                    fileName: "[project]/src/app/spreadsheet/[id]/page.tsx",
                    lineNumber: 37,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: ()=>router.push('/'),
                    className: "px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors",
                    children: "Go to Dashboard"
                }, void 0, false, {
                    fileName: "[project]/src/app/spreadsheet/[id]/page.tsx",
                    lineNumber: 40,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/spreadsheet/[id]/page.tsx",
            lineNumber: 35,
            columnNumber: 7
        }, this);
    }
    // Spreadsheet is loaded (or still loading, covered by above)
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$spreadsheet$2f$SpreadsheetEditorLayout$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
        fileName: "[project]/src/app/spreadsheet/[id]/page.tsx",
        lineNumber: 51,
        columnNumber: 10
    }, this);
}
_s(SpreadsheetEditorPageContents, "8Qv7iomNYCY6edwU5DOqfeC4NMM=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useSpreadsheet$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSpreadsheet"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = SpreadsheetEditorPageContents;
function SpreadsheetPage() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$SpreadsheetContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SpreadsheetProvider"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SpreadsheetEditorPageContents, {}, void 0, false, {
            fileName: "[project]/src/app/spreadsheet/[id]/page.tsx",
            lineNumber: 58,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/spreadsheet/[id]/page.tsx",
        lineNumber: 57,
        columnNumber: 5
    }, this);
}
_c1 = SpreadsheetPage;
var _c, _c1;
__turbopack_context__.k.register(_c, "SpreadsheetEditorPageContents");
__turbopack_context__.k.register(_c1, "SpreadsheetPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
}]);

//# sourceMappingURL=src_613ef052._.js.map
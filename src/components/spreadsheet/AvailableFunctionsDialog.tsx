
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
<<<<<<< HEAD
import { Check, XIcon } from "lucide-react"; // Import icons
=======
>>>>>>> 3cd4ffaa439f3afbedf88f6042b7b8f5a2da87f2

interface AvailableFunctionsDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

<<<<<<< HEAD
// Keep this list updated with what's actually implemented in SpreadsheetContext.tsx
const implementedFunctions = new Set([
  "SUM", "AVERAGE", "COUNT", "MAX", "MIN", "IF",
  "CONCATENATE", "CONCAT", "LEN", "LEFT", "RIGHT", "MID", 
  "LOWER", "UPPER", "TRIM", "ROUND", "ABS"
  // Add more as they are implemented
]);

=======
>>>>>>> 3cd4ffaa439f3afbedf88f6042b7b8f5a2da87f2
const functionsList = [
  // Math & Trig
  { name: "SUM", syntax: "SUM(number1, [number2], ...)", description: "Adds all the numbers in a range of cells." },
  { name: "AVERAGE", syntax: "AVERAGE(number1, [number2], ...)", description: "Returns the average (arithmetic mean) of its arguments." },
  { name: "COUNT", syntax: "COUNT(value1, [value2], ...)", description: "Counts the number of cells that contain numbers." },
  { name: "MAX", syntax: "MAX(number1, [number2], ...)", description: "Returns the largest value in a set of values." },
  { name: "MIN", syntax: "MIN(number1, [number2], ...)", description: "Returns the smallest number in a set of values." },
  { name: "ROUND", syntax: "ROUND(number, num_digits)", description: "Rounds a number to a specified number of digits." },
<<<<<<< HEAD
=======
  { name: "RAND", syntax: "RAND()", description: "Returns an evenly distributed random real number greater than or equal to 0 and less than 1." },
  { name: "RANDBETWEEN", syntax: "RANDBETWEEN(bottom, top)", description: "Returns a random integer number between the numbers you specify." },
>>>>>>> 3cd4ffaa439f3afbedf88f6042b7b8f5a2da87f2
  { name: "ABS", syntax: "ABS(number)", description: "Returns the absolute value of a number." },
  { name: "INT", syntax: "INT(number)", description: "Rounds a number down to the nearest integer." },
  { name: "MOD", syntax: "MOD(number, divisor)", description: "Returns the remainder after a number is divided by a divisor." },
  { name: "POWER", syntax: "POWER(number, power)", description: "Returns the result of a number raised to a power." },
  { name: "PRODUCT", syntax: "PRODUCT(number1, [number2], ...)", description: "Multiplies all the numbers given as arguments." },
  { name: "SQRT", syntax: "SQRT(number)", description: "Returns a positive square root." },
<<<<<<< HEAD
  { name: "RAND", syntax: "RAND()", description: "Returns an evenly distributed random real number greater than or equal to 0 and less than 1." },
  { name: "RANDBETWEEN", syntax: "RANDBETWEEN(bottom, top)", description: "Returns a random integer number between the numbers you specify." },
  { name: "SUBTOTAL", syntax: "SUBTOTAL(function_num, ref1, [ref2],...)", description: "Returns a subtotal in a list or database. It is versatile, allowing various functions like SUM, AVERAGE, COUNT, etc., while ignoring other subtotals and optionally hidden rows." },
  // Text
  { name: "CONCATENATE", syntax: "CONCATENATE(text1, [text2], ...)", description: "Joins several text strings into one text string. (Excel also supports CONCAT)." },
  { name: "CONCAT", syntax: "CONCAT(text1, [text2], ...)", description: "Joins several text strings into one text string. (Modern Excel version of CONCATENATE)." },
=======
  { name: "SUBTOTAL", syntax: "SUBTOTAL(function_num, ref1, [ref2],...)", description: "Returns a subtotal in a list or database. It is versatile, allowing various functions like SUM, AVERAGE, COUNT, etc., while ignoring other subtotals and optionally hidden rows." },
  // Text
  { name: "CONCATENATE", syntax: "CONCATENATE(text1, [text2], ...)", description: "Joins several text strings into one text string. (Excel also supports CONCAT)." },
>>>>>>> 3cd4ffaa439f3afbedf88f6042b7b8f5a2da87f2
  { name: "TEXT", syntax: "TEXT(value, format_text)", description: "Converts a value to text in a specific number format." },
  { name: "LEFT", syntax: "LEFT(text, [num_chars])", description: "Returns the specified number of characters from the start of a text string." },
  { name: "RIGHT", syntax: "RIGHT(text, [num_chars])", description: "Returns the specified number of characters from the end of a text string." },
  { name: "MID", syntax: "MID(text, start_num, num_chars)", description: "Returns a specific number of characters from a text string, starting at the position you specify." },
  { name: "LEN", syntax: "LEN(text)", description: "Returns the number of characters in a text string." },
  { name: "FIND", syntax: "FIND(find_text, within_text, [start_num])", description: "Finds one text string within another (case-sensitive)." },
  { name: "REPLACE", syntax: "REPLACE(old_text, start_num, num_chars, new_text)", description: "Replaces part of a text string with a different text string." },
  { name: "SUBSTITUTE", syntax: "SUBSTITUTE(text, old_text, new_text, [instance_num])", description: "Substitutes new_text for old_text in a text string." },
  { name: "TRIM", syntax: "TRIM(text)", description: "Removes leading and trailing spaces from text." },
<<<<<<< HEAD
  { name: "LOWER", syntax: "LOWER(text)", description: "Converts all uppercase letters in a text string to lowercase." },
  { name: "UPPER", syntax: "UPPER(text)", description: "Converts text to uppercase." },
  { name: "PROPER", syntax: "PROPER(text)", description: "Capitalizes the first letter in each word of a text value." },

=======
>>>>>>> 3cd4ffaa439f3afbedf88f6042b7b8f5a2da87f2
  // Logical
  { name: "IF", syntax: "IF(logical_test, value_if_true, [value_if_false])", description: "Checks whether a condition is met, and returns one value if TRUE, and another value if FALSE." },
  { name: "AND", syntax: "AND(logical1, [logical2], ...)", description: "Returns TRUE if all its arguments are TRUE; returns FALSE if one or more arguments are FALSE." },
  { name: "OR", syntax: "OR(logical1, [logical2], ...)", description: "Returns TRUE if any argument is TRUE; returns FALSE if all arguments are FALSE." },
  { name: "NOT", syntax: "NOT(logical)", description: "Reverses the logical value of its argument." },
  { name: "IFERROR", syntax: "IFERROR(value, value_if_error)", description: "Returns value_if_error if expression is an error and the value of the expression itself otherwise." },
  // Date & Time
  { name: "TODAY", syntax: "TODAY()", description: "Returns the current date as a serial number." },
  { name: "NOW", syntax: "NOW()", description: "Returns the current date and time as a serial number." },
  { name: "DATE", syntax: "DATE(year, month, day)", description: "Returns the serial number of a particular date." },
  { name: "YEAR", syntax: "YEAR(serial_number)", description: "Returns the year corresponding to a date." },
  { name: "MONTH", syntax: "MONTH(serial_number)", description: "Returns the month, a number from 1 (January) to 12 (December)." },
  { name: "DAY", syntax: "DAY(serial_number)", description: "Returns the day of the month, a number from 1 to 31." },
  { name: "HOUR", syntax: "HOUR(serial_number)", description: "Returns the hour as a number from 0 (12:00 A.M.) to 23 (11:00 P.M.)." },
  { name: "MINUTE", syntax: "MINUTE(serial_number)", description: "Returns the minute as a number from 0 to 59." },
  { name: "SECOND", syntax: "SECOND(serial_number)", description: "Returns the second as a number from 0 to 59." },
  { name: "EDATE", syntax: "EDATE(start_date, months)", description: "Returns the serial number of the date that is the indicated number of months before or after the start date." },
  // Lookup & Reference
  { name: "VLOOKUP", syntax: "VLOOKUP(lookup_value, table_array, col_index_num, [range_lookup])", description: "Looks for a value in the leftmost column of a table, and then returns a value in the same row from a column you specify." },
  { name: "HLOOKUP", syntax: "HLOOKUP(lookup_value, table_array, row_index_num, [range_lookup])", description: "Looks for a value in the top row of a table or array of values and returns the value in the same column from a row you specify." },
  { name: "INDEX", syntax: "INDEX(array, row_num, [column_num])", description: "Returns a value or reference of the cell at the intersection of a particular row and column, in a given range." },
  { name: "MATCH", syntax: "MATCH(lookup_value, lookup_array, [match_type])", description: "Returns the relative position of an item in an array that matches a specified value in a specified order." },
  { name: "OFFSET", syntax: "OFFSET(reference, rows, cols, [height], [width])", description: "Returns a reference to a range that is a specified number of rows and columns from a cell or range of cells." },
  { name: "CHOOSE", syntax: "CHOOSE(index_num, value1, [value2], ...)", description: "Uses index_num to return a value from the list of value arguments." },
  { name: "INDIRECT", syntax: "INDIRECT(ref_text, [a1])", description: "Returns the reference specified by a text string." },
  // Statistical
  { name: "COUNTA", syntax: "COUNTA(value1, [value2], ...)", description: "Counts the number of cells that are not empty." },
  { name: "COUNTBLANK", syntax: "COUNTBLANK(range)", description: "Counts the number of empty cells in a specified range of cells." },
  { name: "COUNTIF", syntax: "COUNTIF(range, criteria)", description: "Counts the number of cells within a range that meet the given criteria." },
  { name: "COUNTIFS", syntax: "COUNTIFS(criteria_range1, criteria1, [criteria_range2, criteria2]…)", description: "Counts the number of cells specified by a given set of conditions or criteria." },
  { name: "AVERAGEIF", syntax: "AVERAGEIF(range, criteria, [average_range])", description: "Finds average for the cells specified by a given condition or criteria." },
  { name: "AVERAGEIFS", syntax: "AVERAGEIFS(average_range, criteria_range1, criteria1, [criteria_range2, criteria2]…)", description: "Finds average for the cells specified by a given set of conditions or criteria." },
  { name: "SUMIF", syntax: "SUMIF(range, criteria, [sum_range])", description: "Adds the cells specified by a given criteria." },
  { name: "SUMIFS", syntax: "SUMIFS(sum_range, criteria_range1, criteria1, [criteria_range2, criteria2]…)", description: "Adds all of its arguments that meet multiple criteria." },
  { name: "MEDIAN", syntax: "MEDIAN(number1, [number2], ...)", description: "Returns the median of the given numbers. The median is the number in the middle of a set of numbers." },
  { name: "MODE.SNGL", syntax: "MODE.SNGL(number1, [number2], ...)", description: "Returns the most frequently occurring, or repetitive, value in an array or range of data. (Older Excel versions use MODE)." },
  // Financial
  { name: "PMT", syntax: "PMT(rate, nper, pv, [fv], [type])", description: "Calculates the payment for a loan based on constant payments and a constant interest rate." },
  { name: "FV", syntax: "FV(rate, nper, pmt, [pv], [type])", description: "Returns the future value of an investment based on periodic, constant payments and a constant interest rate." },
  { name: "PV", syntax: "PV(rate, nper, pmt, [fv], [type])", description: "Returns the present value of an investment." },
  { name: "NPER", syntax: "NPER(rate, pmt, pv, [fv], [type])", description: "Returns the number of periods for an investment based on periodic, constant payments and a constant interest rate." },
  { name: "RATE", syntax: "RATE(nper, pmt, pv, [fv], [type], [guess])", description: "Returns the interest rate per period of an annuity." },
  { name: "NPV", syntax: "NPV(rate, value1, [value2], ...)", description: "Returns the net present value of an investment based on a series of periodic cash flows and a discount rate." },
  { name: "IRR", syntax: "IRR(values, [guess])", description: "Returns the internal rate of return for a series of cash flows." },
  { name: "DB", syntax: "DB(cost, salvage, life, period, [month])", description: "Returns the depreciation of an asset for a specified period using the fixed-declining balance method." },
  { name: "SLN", syntax: "SLN(cost, salvage, life)", description: "Returns the straight-line depreciation of an asset for one period." },
  { name: "SYD", syntax: "SYD(cost, salvage, life, per)", description: "Returns the sum-of-years' digits depreciation of an asset for a specified period." },
  { name: "IPMT", syntax: "IPMT(rate, per, nper, pv, [fv], [type])", description: "Returns the interest payment for a given period for an investment based on periodic, constant payments and a constant interest rate." },
  { name: "PPMT", syntax: "PPMT(rate, per, nper, pv, [fv], [type])", description: "Returns the payment on the principal for a given period for an investment based on periodic, constant payments and a constant interest rate." },
];


export function AvailableFunctionsDialog({ isOpen, onOpenChange }: AvailableFunctionsDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[80vh]">
        <DialogHeader>
<<<<<<< HEAD
          <DialogTitle>Available Functions Reference</DialogTitle>
          <DialogDescription>
            This is a list of commonly used spreadsheet functions. 
            <Check className="inline-block h-4 w-4 mx-1 text-green-600" /> indicates implemented. 
            <XIcon className="inline-block h-4 w-4 mx-1 text-red-600" /> indicates not yet implemented.
=======
          <DialogTitle>Available Functions (Reference)</DialogTitle>
          <DialogDescription>
            This is a list of commonly used spreadsheet functions. The application currently stores formulas as text and does not perform calculations.
>>>>>>> 3cd4ffaa439f3afbedf88f6042b7b8f5a2da87f2
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[60vh] w-full rounded-md border p-4">
          <Table>
            <TableHeader>
              <TableRow>
<<<<<<< HEAD
                <TableHead className="w-[50px]">Status</TableHead>
=======
>>>>>>> 3cd4ffaa439f3afbedf88f6042b7b8f5a2da87f2
                <TableHead className="w-[150px]">Function</TableHead>
                <TableHead className="w-[250px]">Syntax</TableHead>
                <TableHead>Description</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {functionsList.map((func) => (
                <TableRow key={func.name}>
<<<<<<< HEAD
                  <TableCell>
                    {implementedFunctions.has(func.name.toUpperCase()) ? (
                      <Check className="h-5 w-5 text-green-600" title="Implemented"/>
                    ) : (
                      <XIcon className="h-5 w-5 text-red-600" title="Not Implemented"/>
                    )}
                  </TableCell>
=======
>>>>>>> 3cd4ffaa439f3afbedf88f6042b7b8f5a2da87f2
                  <TableCell className="font-medium">{func.name}</TableCell>
                  <TableCell className="font-mono text-xs">{func.syntax}</TableCell>
                  <TableCell>{func.description}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
<<<<<<< HEAD
=======

>>>>>>> 3cd4ffaa439f3afbedf88f6042b7b8f5a2da87f2

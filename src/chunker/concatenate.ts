export type Concatenatable = {
  headers: (string | undefined)[]
  processedLines: (string | number | undefined)[][]
}
// export function Concatenate(cycles: Concatenatable) {
//   const table = [[]]
//   const columnCount = cycles[0].headers.length
// }
//
// export function ConcatenateWithHeaders(cycles: Concatenatable) {}

// Append one line to the table passed in..
// function appendToLine(
//   cycleNo: number,
//   line: (string | number)[],
//   lineNo: number,
//   table: (string | number)[][]
// ) {
//   // This cycle might be the longest one so far, so we may need to add a new
//   // empty line:
//   if (table.length < lineNo + 1) table.push([])
//
//   // Past cycles may not have been as long as this cycle. We need to insert
//   // empty values into this line until it's the correct length:
//   table[lineNo].length = line.length * cycleNo
//
//   table[lineNo].push(...line)
//
//   return table
// }

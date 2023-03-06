import { Concatenatable } from "./concatenate"

export default class Concatenator {
  // Tables in this application are an array of lines, each of which is an array
  // of column entries (just like PapaParse handles them). This class takes in
  // an array of cycles (which contain such tables), and appends them
  // side-by-side.
  cycles: Concatenatable[]
  table: (string | number | undefined)[][] = [[]]

  constructor(cycles: Concatenatable[]) {
    this.cycles = cycles
  }

  get columnCount() {
    return this.cycles[0]?.headers.length || 0
  }

  get concatenated() {
    // Without headers.
    this.cycles.forEach((cycle, cycleNo) => {
      cycle.processedLines.forEach((line, lineNo) => {
        this._appendToLine(cycleNo, line, lineNo)
      })
    })

    return this.table
  }

  get concatenatedWithHeaders() {
    const firstLine: (string | undefined)[] = []
    this.table = [firstLine]
    this.cycles.forEach((cycle, cycleNo) => {
      cycle.processedLines.forEach((line, lineNo) => {
        this._appendToLine(cycleNo, line, lineNo + 1)
      })

      firstLine.push(...cycle.headers)
    })

    return this.table
  }

  private _appendToLine(
    cycleNo: number,
    line: (string | number | undefined)[],
    lineNo: number
  ) {
    // This cycle might be the longest one so far, so we may need to add a new
    // empty line:
    const thisLine = this.table[lineNo] || []

    if (this.table.length < lineNo + 1) {
      this.table.push(thisLine)
    }

    // Past cycles may not have been as long as this cycle. We need to insert
    // empty values into this line until it's the correct length. We've checked
    thisLine.length = this.columnCount * cycleNo

    thisLine.push(...line)
  }
}

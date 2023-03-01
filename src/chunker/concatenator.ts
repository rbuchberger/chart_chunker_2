import { Concatenatable } from "./concatenate"

export default class Concatenator {
  // Tables in this application are an array of lines, each of which is an array
  // of column entries (just like PapaParse handles them). This class takes in
  // an array of cycles (which contain such tables), and appends them
  // side-by-side.
  cycles: Concatenatable[]
  table: (string | number)[][] = [[]]

  constructor(cycles: Concatenatable[]) {
    this.cycles = cycles
  }

  get columnCount() {
    return this.cycles[0].headers.length
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
    this.table = [[]]
    this.cycles.forEach((cycle, cycleNo) => {
      cycle.processedLines.forEach((line, lineNo) => {
        this._appendToLine(cycleNo, line, lineNo + 1)
      })

      this.table[0].push(...cycle.headers)
    })

    return this.table
  }

  private _appendToLine(
    cycleNo: number,
    line: (string | number)[],
    lineNo: number
  ) {
    // This cycle might be the longest one so far, so we may need to add a new
    // empty line:
    if (this.table.length < lineNo + 1) {
      this.table.push([])
    }

    // Past cycles may not have been as long as this cycle. We need to insert
    // empty values into this line until it's the correct length:
    this.table[lineNo].length = this.columnCount * cycleNo

    this.table[lineNo].push(...line)
  }
}

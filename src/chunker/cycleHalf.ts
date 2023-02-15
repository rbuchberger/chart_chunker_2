import { ChunkerConfig } from "./chunker"
import Parser, { RawLine } from "./parser"

export default class CycleHalf {
  lines: RawLine[]
  cycleNumber: number
  config: ChunkerConfig
  parser: Parser
  private _averageSplitBasis?: number
  private _processedLines?: number[][]
  private _headers?: string[]

  constructor(
    lines: RawLine[],
    cycleNumber: number,
    config: ChunkerConfig,
    parser: Parser
  ) {
    this.lines = lines
    this.cycleNumber = cycleNumber
    this.config = config
    this.parser = parser
  }

  get isCharge() {
    return this.averageSplitBasis > 0
  }

  get isDischarge() {
    return this.averageSplitBasis < 0
  }

  get maxVoltage() {
    return this._findLargest(this.config.voltageColumn).value
  }

  get minVoltage() {
    return this._findSmallest(this.config.voltageColumn).value
  }

  get maxSpecificCapacity() {
    return this._findLargest(this.config.spcColumn).value
  }

  get minSpecificCapacity() {
    return this._findSmallest(this.config.spcColumn).value
  }

  get specificCapacity() {
    return this.maxSpecificCapacity - this.minSpecificCapacity
  }

  get averageSplitBasis() {
    if (!this._averageSplitBasis) {
      const total = this.lines.reduce(
        (total, line) => total + parseFloat(line[this.config.splitBasis]),
        0
      )

      this._averageSplitBasis = total / this.lines.length
    }

    return this._averageSplitBasis
  }

  // Filters and converts to floats
  get processedLines() {
    if (!this._processedLines) {
      this._processedLines = this.lines.map((line) => {
        return this.filterColumns(line).map((val) => Math.abs(parseFloat(val)))
      })
    }

    return this._processedLines
  }

  get headers() {
    return (this._headers = this._headers || this._buildHeaders())
  }

  filterColumns(line: RawLine) {
    return line.filter((_element, index) =>
      this.config.keptColumns.includes(index)
    )
  }

  private _buildHeaders() {
    const baseTitles = this.filterColumns(this.parser.columns)
    const chargePrefix = this.isCharge ? "C" : "D"

    return baseTitles.map((item, index) => {
      if (index === 0) {
        return (
          chargePrefix +
          this.cycleNumber +
          `_(${this.averageSplitBasis.toExponential(1)})_` +
          item
        )
      } else {
        return chargePrefix + this.cycleNumber + "_" + item
      }
    })
  }

  private _findLargest(column: number) {
    return this.lines.reduce(
      (accumulator, item, index) => {
        const candidate = Math.abs(parseFloat(item[column]))
        if (candidate > accumulator.value) {
          accumulator.value = candidate
          accumulator.index = index
        }

        return accumulator
      },
      { value: 0, index: 0 }
    )
  }

  private _findSmallest(column: number) {
    return this.lines.reduce(
      (accumulator, item, index) => {
        const candidate = Math.abs(parseFloat(item[column]))
        if (candidate < accumulator.value) {
          accumulator.value = candidate
          accumulator.index = index
        }

        return accumulator
      },

      { value: parseFloat(this.lines[0][column]), index: 0 }
    )
  }
}

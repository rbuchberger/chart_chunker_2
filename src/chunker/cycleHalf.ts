import { Context } from "./chunk"
import { ChunkerConfig, HalfCycleLocation } from "./chunker"
import Parser, { RawLine } from "./parser"

export type PartialCycleHalf = Omit<
  CycleHalf,
  "lines" | "config" | "parser" | "processedLines" | "condensed"
>

export default class CycleHalf {
  lines: RawLine[]
  cycleNumber: number
  config: ChunkerConfig
  parser: Parser
  isCharge: boolean
  isDischarge: boolean
  averageSplitBasis: number
  maxVoltage: number
  minVoltage: number
  maxSpecificCapacity: number
  minSpecificCapacity: number
  specificCapacity: number
  processedLines: number[][]
  headers: string[]

  constructor(
    location: HalfCycleLocation,
    cycleNumber: number,
    context: Context
  ) {
    // Setup
    this.config = context.config
    this.parser = context.parser

    this.lines = this.parser.lines.slice(location.start, location.endExclusive)

    this.cycleNumber = cycleNumber

    // Analyze. Same caveats as in Cycle
    this.averageSplitBasis = this._buildAverageSplitBasis()
    this.isCharge = this.averageSplitBasis > 0
    this.isDischarge = this.averageSplitBasis < 0
    this.processedLines = this._buildProcessedLines()
    this.maxVoltage = this._findLargest(this.config.voltageColumn).value
    this.minVoltage = this._findSmallest(this.config.voltageColumn).value
    this.maxSpecificCapacity = this._findLargest(this.config.spcColumn).value
    this.minSpecificCapacity = this._findSmallest(this.config.spcColumn).value
    this.specificCapacity = this.maxSpecificCapacity - this.minSpecificCapacity
    this.headers = this._buildHeaders()
  }

  get condensed() {
    /* eslint-disable @typescript-eslint/no-unused-vars */
    const { lines, config, parser, processedLines, ...half } = this
    /* eslint-enable @typescript-eslint/no-unused-vars */

    return half
  }

  private _buildAverageSplitBasis() {
    const total = this.lines.reduce(
      (acc, line) => acc + parseFloat(line[this.config.splitBasis]),
      0
    )

    return total / this.lines.length
  }

  // Filters and converts to floats
  private _buildProcessedLines() {
    return this.lines.map((line) => {
      return this._filterColumns(line).map((val) => Math.abs(parseFloat(val)))
    })
  }

  private _buildHeaders() {
    const baseTitles = this._filterColumns(this.parser.columns)
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

  private _filterColumns(line: RawLine) {
    return this.config.keptColumns.map((i) => line[i])
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

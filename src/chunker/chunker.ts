import Cycle, { CyclePartial } from "./cycle"
import Parser, { RawLine } from "./parser"

// Take in an array of arrays (papa-parsed CSV table). Split it up into cycles.
//
// A charge-discharge cycle is determined by the splitBasis (probably current
// supplied to the battery.) When changes sign, that line is the first in a new
// half-cycle. If it's ~zero, end any cycle that's in progress and discard that
// line.

// The result is passed from a service worker, which means that we can't send
// functions or classes. We can only send JSON-serializable objects. All results
// must be calculated during construction.
export type ChunkerConfig = {
  splitBasis: number
  keptColumns: number[]
  spcColumn: number
  voltageColumn: number
}

export type ChunkerOverview = {
  headers: string[]
  lines: (number | null | undefined)[][]
  cycleCount: number
}

export type ChunkerPartial = Omit<
  Chunker,
  "cycles" | "config" | "parser" | "condensed"
> & {
  cycles: CyclePartial[]
}

export class Chunker {
  cycles: Cycle[] = []
  config: ChunkerConfig
  private halfCycle: RawLine[] | null = null
  parser: Parser
  chargeEffArray: (number | null)[]
  retentionArray: (number | null)[]
  overview: ChunkerOverview
  keptColumns: number[]

  constructor(config: ChunkerConfig, parser: Parser) {
    // Setup
    this.config = config
    this.parser = parser

    // Chunk
    this._buildCycles()

    // Presentation
    this.chargeEffArray = this.cycles.map((cycle) => cycle.chargeEfficiency)
    this.retentionArray = this.cycles.map((cycle) => this._getRetention(cycle))
    this.overview = this._overview()
    this.keptColumns = this._keptColumns()
  }

  get condensed(): ChunkerPartial {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { cycles, config, parser, ...chunker } = this

    const condensedCycles = cycles.map((cycle) => cycle.condensed)

    return { cycles: condensedCycles, ...chunker }
  }

  private _overview() {
    return {
      headers: [
        "Cycle #",
        "Charge Specific Capacity",
        "Discharge Specific Capacity",
        "Charge Efficiency [%]",
        "Retention [%]",
      ],
      lines: this.cycles.map((cycle) => {
        return [
          cycle.cycleNumber,
          cycle.charge?.specificCapacity,
          cycle.discharge?.specificCapacity,
          cycle.chargeEfficiency,
          this._getRetention(cycle),
        ]
      }),
      cycleCount: this.cycles.length,
    }
  }

  private _keptColumns() {
    return this.config.keptColumns.slice().sort() // order matters
  }

  private _getRetention(cycle: Cycle) {
    if (!cycle.discharge || !this.cycles[0].discharge) return null

    const ratio =
      cycle.discharge.maxSpecificCapacity /
      this.cycles[0].discharge.maxSpecificCapacity

    return Math.round(ratio * 10000) / 100
  }

  private _buildCycles() {
    let lastValuePos = false // Whether the last value was positive
    let currentValue: number
    let currentCycle: RawLine[] = []

    // let lastValue: number

    this.parser.lines.forEach((line) => {
      currentValue = parseFloat(line[this.config.splitBasis])

      // if (this.context.splitByRate) {
      //   lastValue ||= currentValue
      //   currentValue = currentValue - lastValue
      //   lastValue = parseFloat(line[this.splitBasis])
      // }

      // Skip over zeros
      if (Math.abs(currentValue) < 0.0000005) {
        if (currentCycle.length > 0) {
          // There was a cycle in progress; finish it and prep a new one.
          this._addHalfCycle(currentCycle)
          currentCycle = []
        }

        // We're starting a new cycle.
      } else if (currentCycle.length === 0) {
        lastValuePos = currentValue > 0
        currentCycle.push(line)

        // If the sign hasn't changed, keep going
      } else if (currentValue > 0 === lastValuePos) {
        currentCycle.push(line)

        // the sign has changed, and the cycle is complete.
      } else {
        this._addHalfCycle(currentCycle)

        // Set up the next cycle
        lastValuePos = currentValue > 0
        currentCycle = [line]
      }
    })

    // catch the last one:
    if (currentCycle.length > 0) {
      this._addHalfCycle(currentCycle)
    }
  }

  private _addHalfCycle(lines: RawLine[]) {
    if (this.halfCycle) {
      this.cycles.push(
        new Cycle(
          [this.halfCycle, lines],
          this.cycles.length + 1,
          this.config,
          this.parser
        )
      )

      this.halfCycle = null
    } else {
      this.halfCycle = lines
    }
  }
}

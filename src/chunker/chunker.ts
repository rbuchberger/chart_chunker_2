import Papa from "papaparse"
import Concatenator from "./concatenator"
import Cycle from "./cycle"
import Parser, { RawLine } from "./parser"

// Take in an array of arrays (papa-parsed CSV table). Split it up into cycles.
//
// A charge-discharge cycle is determined by the splitBasis (probably current
// supplied to the battery.) When changes sign, that line is the first in a new
// half-cycle. If it's ~zero, end any cycle that's in progress and discard that
// line.

export type ChunkerConfig = {
  splitBasis: number
  keptColumns: number[]
  spcColumn: number
  voltageColumn: number
}

export class Chunker {
  cycles: Cycle[] = []
  config: ChunkerConfig
  halfCycle: RawLine[] | null = null
  parser: Parser

  constructor(config: ChunkerConfig, parser: Parser) {
    this.config = config
    this.parser = parser

    this.buildCycles()
  }

  get overview() {
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
          this.getRetention(cycle),
        ]
      }),
    }
  }

  get chargeEffArray() {
    return this.cycles.map((cycle) => cycle.chargeEfficiency)
  }

  get retentionArray() {
    return this.cycles.map((cycle) => this.getRetention(cycle))
  }

  get keptColumns() {
    return this.config.keptColumns.slice().sort() // order matters
  }

  get unparsed() {
    return Papa.unparse(this.concatenated, {
      delimiter: "\t",
    })
  }

  get unparsedOverview() {
    return Papa.unparse(
      [this.overview.headers].concat(
        this.overview.lines.map((l) => l.map((v) => v?.toString() || ""))
      ),
      { delimiter: "\t" }
    )
  }

  get concatenated() {
    return new Concatenator(this.cycles).concatenated
  }

  get cycleCount() {
    return this.cycles.length
  }

  getRetention(cycle: Cycle) {
    if (!cycle.discharge || !this.cycles[0].discharge) return null

    const ratio =
      cycle.discharge.maxSpecificCapacity /
      this.cycles[0].discharge.maxSpecificCapacity

    return Math.round(ratio * 10000) / 100
  }

  buildCycles() {
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
          this.addHalfCycle(currentCycle)
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
        this.addHalfCycle(currentCycle)

        // Set up the next cycle
        lastValuePos = currentValue > 0
        currentCycle = [line]
      }
    })

    // catch the last one:
    if (currentCycle.length > 0) {
      this.addHalfCycle(currentCycle)
    }
  }

  addHalfCycle(lines: RawLine[]) {
    if (this.halfCycle) {
      this.cycles.push(
        new Cycle(
          [this.halfCycle, lines],
          this.cycleCount + 1,
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

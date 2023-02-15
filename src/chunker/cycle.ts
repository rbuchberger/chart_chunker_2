import Papa from "papaparse"
import { ChunkerConfig } from "./chunker"
import Concatenator from "./concatenator"
import CycleHalf from "./cycleHalf"
import Parser, { RawLine } from "./parser"

export default class Cycle {
  rawHalves: RawLine[][]
  cycleNumber: number
  context: ChunkerConfig
  parser: Parser
  _halves?: CycleHalf[]

  constructor(
    rawHalves: RawLine[][],
    cycleNumber: number,
    config: ChunkerConfig,
    parser: Parser
  ) {
    this.rawHalves = rawHalves
    this.cycleNumber = cycleNumber
    this.context = config
    this.parser = parser
  }

  get overview() {
    return {
      headers: ["", "Charge", "Discharge"],
      lines: [
        // split basis average
        [
          "Average Current",
          this.charge?.averageSplitBasis,
          this.discharge?.averageSplitBasis,
        ],
        // charge & discharge max voltage
        ["Max Voltage", this.charge?.maxVoltage, this.discharge?.maxVoltage],
        // charge & discharge min voltage
        ["Min Voltage", this.charge?.minVoltage, this.discharge?.minVoltage],
        // charge & discharge max spc
        [
          "Max Specific Capacity",
          this.charge?.maxSpecificCapacity,
          this.discharge?.maxSpecificCapacity,
        ],
        // charge & discharge min min spc
        [
          "Min Specific Capacity",
          this.charge?.minSpecificCapacity,
          this.discharge?.minSpecificCapacity,
        ],
        // overall spc
        [
          "Overall Specific Capacity",
          this.charge?.specificCapacity,
          this.discharge?.specificCapacity,
        ],
      ],
    }
  }

  get halves() {
    if (!this._halves) {
      this._halves = this.rawHalves.map((half) => {
        return new CycleHalf(half, this.cycleNumber, this.context, this.parser)
      })
    }

    return this._halves
  }

  get charge() {
    return this.halves.find((half) => half.isCharge)
  }

  get discharge() {
    return this.halves.find((half) => half.isDischarge)
  }

  get headers() {
    return this.halves.flatMap((half) => half.headers)
  }

  get unparsed() {
    return Papa.unparse(new Concatenator(this.halves).concatenatedWithHeaders, {
      delimiter: "\t",
    })
  }

  get length() {
    return this.halves.reduce((acc, half) => acc + half.lines.length, 0)
  }

  get chargeEfficiency() {
    if (!this.charge || !this.discharge) return null

    const ratio =
      this.discharge.maxSpecificCapacity / this.charge.maxSpecificCapacity
    return Math.round(ratio * 10000) / 100
  }
}

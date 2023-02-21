import { ChunkerConfig } from "./chunker"
import Concatenator from "./concatenator"
import CycleHalf from "./cycleHalf"
import Parser, { RawLine } from "./parser"

export type CyclePartial = Omit<
  Cycle,
  | "parser"
  | "context"
  | "rawHalves"
  | "halves"
  | "charge"
  | "discharge"
  | "condensed"
>

export default class Cycle {
  rawHalves: RawLine[][]
  cycleNumber: number
  context: ChunkerConfig
  parser: Parser
  halves: CycleHalf[]
  charge?: CycleHalf
  discharge?: CycleHalf
  headers: string[]
  chargeEfficiency: number | null
  length: number
  processedLines: (string | number)[][]
  overview: { headers: string[]; lines: (string | number | undefined)[][] }

  constructor(
    rawHalves: RawLine[][],
    cycleNumber: number,
    config: ChunkerConfig,
    parser: Parser
  ) {
    // Setup
    this.rawHalves = rawHalves
    this.cycleNumber = cycleNumber
    this.context = config
    this.parser = parser

    // Analyze
    // note that since this result is passed from a serviceworker,
    // only serializable data can be passed back to the main thread. Getter
    // functions won't work. Order matters; some results depend on others
    this.halves = this._halves()
    this.charge = this.halves.find((half) => half.isCharge)
    this.discharge = this.halves.find((half) => half.isDischarge)
    this.headers = this.halves.flatMap((half) => half.headers)
    this.processedLines = new Concatenator(this.halves).concatenatedWithHeaders
    this.chargeEfficiency = this._chargeEfficiency()
    this.length = this.halves.reduce((a, h) => a + h.lines.length, 0)
    this.overview = this._overview()
  }

  get condensed(): CyclePartial {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { rawHalves, parser, context, halves, charge, discharge, ...cycle } =
      this

    return cycle
  }

  private _overview() {
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

  private _halves() {
    return this.rawHalves.map((half) => {
      return new CycleHalf(half, this.cycleNumber, this.context, this.parser)
    })
  }

  private _chargeEfficiency() {
    if (!this.charge || !this.discharge) return null

    const ratio =
      this.discharge.maxSpecificCapacity / this.charge.maxSpecificCapacity
    return Math.round(ratio * 10000) / 100
  }
}

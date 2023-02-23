import { ChunkerConfig } from "./chunker"
import Concatenator from "./concatenator"
import CycleHalf, { PartialCycleHalf } from "./cycleHalf"
import Parser, { RawLine } from "./parser"

export type CyclePartial = Omit<
  Cycle,
  | "parser"
  | "context"
  | "rawHalves"
  | "halves"
  | "condensed"
  | "chargeComplete"
  | "dischargeComplete"
>

export default class Cycle {
  rawHalves: RawLine[][]
  cycleNumber: number
  context: ChunkerConfig
  parser: Parser
  halves: CycleHalf[]
  chargeComplete?: CycleHalf
  dischargeComplete?: CycleHalf
  charge?: PartialCycleHalf
  discharge?: PartialCycleHalf
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
    this.chargeComplete = this.halves.find((half) => half.isCharge)
    this.dischargeComplete = this.halves.find((half) => half.isDischarge)
    this.discharge = this.dischargeComplete?.condensed
    this.charge = this.chargeComplete?.condensed
    this.headers = this.halves.flatMap((half) => half.headers)
    this.processedLines = new Concatenator(this.halves).concatenatedWithHeaders
    this.chargeEfficiency = this._chargeEfficiency()
    this.length = this.halves.reduce((a, h) => a + h.lines.length, 0)
    this.overview = this._overview()
  }

  get condensed() {
    /* eslint-disable @typescript-eslint/no-unused-vars */
    const {
      rawHalves,
      parser,
      context,
      halves,
      chargeComplete,
      dischargeComplete,
      ...cycle
    } = this
    /* eslint-enable @typescript-eslint/no-unused-vars */

    return cycle
  }

  private _overview() {
    return {
      headers: ["", "Charge", "Discharge"],
      lines: [
        // split basis average
        [
          "Average Current",
          this.chargeComplete?.averageSplitBasis,
          this.dischargeComplete?.averageSplitBasis,
        ],
        // charge & discharge max voltage
        [
          "Max Voltage",
          this.chargeComplete?.maxVoltage,
          this.dischargeComplete?.maxVoltage,
        ],
        // charge & discharge min voltage
        [
          "Min Voltage",
          this.chargeComplete?.minVoltage,
          this.dischargeComplete?.minVoltage,
        ],
        // charge & discharge max spc
        [
          "Max Specific Capacity",
          this.chargeComplete?.maxSpecificCapacity,
          this.dischargeComplete?.maxSpecificCapacity,
        ],
        // charge & discharge min min spc
        [
          "Min Specific Capacity",
          this.chargeComplete?.minSpecificCapacity,
          this.dischargeComplete?.minSpecificCapacity,
        ],
        // overall spc
        [
          "Overall Specific Capacity",
          this.chargeComplete?.specificCapacity,
          this.dischargeComplete?.specificCapacity,
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
    if (!this.chargeComplete || !this.dischargeComplete) return null

    const ratio =
      this.dischargeComplete.maxSpecificCapacity /
      this.chargeComplete.maxSpecificCapacity
    return Math.round(ratio * 10000) / 100
  }
}

import compact from "lodash-es/compact"
import { Context } from "./chunk"
import { ChunkerConfig, HalfCycleLocation } from "./chunker"
import Concatenator from "./concatenator"
import CycleHalf, { PartialCycleHalf } from "./cycleHalf"
import Parser from "./parser"

export type CyclePartial = Omit<
  Cycle,
  | "parser"
  | "config"
  | "halves"
  | "condensed"
  | "chargeComplete"
  | "dischargeComplete"
>

export default class Cycle {
  cycleNumber: number
  config: ChunkerConfig
  parser: Parser
  chargeComplete?: CycleHalf
  dischargeComplete?: CycleHalf
  charge?: PartialCycleHalf
  discharge?: PartialCycleHalf
  headers: string[]
  private _halves: (CycleHalf | null)[]
  chargeEfficiency?: number
  length: number
  processedLines: (string | number)[][]
  overview: { headers: string[]; lines: (string | number | undefined)[][] }

  constructor(
    a: HalfCycleLocation | null,
    b: HalfCycleLocation | null,
    cycleNumber: number,
    context: Context
  ) {
    // Setup
    this.cycleNumber = cycleNumber
    this.config = context.config
    this.parser = context.parser
    this._halves = [
      a ? new CycleHalf(a, cycleNumber, context) : null,
      b ? new CycleHalf(b, cycleNumber, context) : null,
    ]

    this.chargeComplete = this._halves.find(
      (half) => half?.isCharge
    ) as CycleHalf
    this.dischargeComplete = this._halves.find(
      (half) => half?.isDischarge
    ) as CycleHalf

    // Analyze
    // note that since this result is passed from a serviceworker,
    // only serializable data can be passed back to the main thread. Getter
    // functions won't work. Order matters; some results depend on others
    this.discharge = this.dischargeComplete?.condensed
    this.charge = this.chargeComplete?.condensed
    this.headers = compact(this._halves.flatMap((half) => half?.headers))
    this.processedLines = new Concatenator(
      compact(this._halves)
    ).concatenatedWithHeaders
    this.chargeEfficiency = this._chargeEfficiency()
    this.length = this._halves.reduce((a, h) => a + (h?.lines?.length || 0), 0)
    this.overview = this._overview()
  }

  get condensed() {
    /* eslint-disable @typescript-eslint/no-unused-vars */
    const { parser, config, chargeComplete, dischargeComplete, ...cycle } = this
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

  private _chargeEfficiency() {
    if (!this.chargeComplete || !this.dischargeComplete) return

    const ratio =
      this.dischargeComplete.maxSpecificCapacity /
      this.chargeComplete.maxSpecificCapacity
    return Math.round(ratio * 10000) / 100
  }
}

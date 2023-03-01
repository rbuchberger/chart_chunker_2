import compact from "lodash-es/compact"
import { buildHalf, condenseCycleHalf, HalfCycleLocation } from "./buildHalf"
import { Context } from "./chunk"
import Concatenator from "./concatenator"

export type Cycle = ReturnType<typeof buildCycle>

export function buildCycle(
  a: HalfCycleLocation | null,
  b: HalfCycleLocation | null,
  // 1-indexed
  cycleNumber: number,
  context: Context
) {
  // Setup
  const halves = [
    buildHalf(a, cycleNumber, context),
    buildHalf(b, cycleNumber, context),
  ]

  const chargeComplete = halves.find((half) => half?.isCharge)
  const dischargeComplete = halves.find((half) => half?.isDischarge)

  const discharge = condenseCycleHalf(dischargeComplete)
  const charge = condenseCycleHalf(chargeComplete)

  // Analyze
  const headers = compact(halves.flatMap((half) => half?.headers))
  const processedLines = new Concatenator(compact(halves))
    .concatenatedWithHeaders

  const chargeCap = chargeComplete?.maxSpecificCapacity
  const dischargeCap = dischargeComplete?.maxSpecificCapacity
  const chargeRatio =
    chargeCap !== undefined && dischargeCap !== undefined
      ? dischargeCap / chargeCap
      : undefined

  const chargeEfficiency = chargeRatio
    ? Math.round(chargeRatio * 10000) / 100
    : undefined

  const length = halves.reduce((a, h) => a + (h?.length || 0), 0)

  const overview = {
    headers: ["", "Charge", "Discharge"],
    lines: [
      // split basis average
      [
        "Average Current",
        charge?.averageSplitBasis,
        discharge?.averageSplitBasis,
      ],
      // charge & discharge max voltage
      ["Max Voltage", charge?.maxVoltage, discharge?.maxVoltage],
      // charge & discharge min voltage
      ["Min Voltage", charge?.minVoltage, discharge?.minVoltage],
      // charge & discharge max spc
      [
        "Max Specific Capacity",
        charge?.maxSpecificCapacity,
        discharge?.maxSpecificCapacity,
      ],
      // charge & discharge min min spc
      [
        "Min Specific Capacity",
        charge?.minSpecificCapacity,
        discharge?.minSpecificCapacity,
      ],
      // overall spc
      [
        "Overall Specific Capacity",
        charge?.specificCapacity,
        discharge?.specificCapacity,
      ],
    ],
  }

  return {
    cycleNumber,
    chargeComplete,
    dischargeComplete,
    charge,
    discharge,
    headers,
    processedLines,
    chargeEfficiency,
    length,
    overview,
  }
}

export type PartialCycle = ReturnType<typeof condenseCycle>

export function condenseCycle(cycle: Cycle) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { chargeComplete, dischargeComplete, ...rest } = cycle

  return rest
}

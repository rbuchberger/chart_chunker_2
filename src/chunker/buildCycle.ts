import { round } from "lodash"
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
  const { config } = context
  // Setup
  const halves = [
    buildHalf(a, cycleNumber, context),
    buildHalf(b, cycleNumber, context),
  ]

  const cspHeader =
    config.keptCols.find((c) => c.index === config.spcCol)?.name ||
    "Specific Capacity"

  const vHeader =
    config.keptCols.find((c) => c.index === config.vCol)?.name || "Voltage"

  const chargeComplete = halves.find((half) => half?.isCharge)
  const dischargeComplete = halves.find((half) => half?.isDischarge)

  const discharge = condenseCycleHalf(dischargeComplete)
  const charge = condenseCycleHalf(chargeComplete)

  // Analyze
  const headers = compact(halves.flatMap((half) => half?.headers))
  const processedLines = new Concatenator(compact(halves))
    .concatenatedWithHeaders

  const chargeCap = chargeComplete?.maxCsp
  const dischargeCap = dischargeComplete?.maxCsp
  const chargeRatio =
    typeof chargeCap === "number" && typeof dischargeCap === "number"
      ? dischargeCap / chargeCap
      : undefined

  const chargeEfficiency = chargeRatio ? round(chargeRatio * 100, 2) : undefined

  const length = halves.reduce((a, h) => a + (h?.length || 0), 0)

  const overview = {
    headers: ["", "Charge", "Discharge"],
    lines: [
      // split basis average
      ["Average Current", charge?.avgSplitBasis, discharge?.avgSplitBasis],
      // charge & discharge max voltage
      [`Max ${vHeader}`, charge?.maxV, discharge?.maxV],
      // charge & discharge min voltage
      [`Min ${vHeader}`, charge?.minV, discharge?.minV],
      // charge & discharge max spc
      [`Max ${cspHeader}`, charge?.maxCsp, discharge?.maxCsp],
      // charge & discharge min min spc
      [`Min ${cspHeader}`, charge?.minCsp, discharge?.minCsp],
      // overall spc
      [`Overall ${cspHeader}`, charge?.csp, discharge?.csp],
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

import { round } from "lodash-es"

import { PartialCycle } from "./buildCycle"

export function calcRetention(cycles: PartialCycle[], cycle?: PartialCycle) {
  const startRetention = cycles.find((cycle) => cycle.discharge?.maxCsp)
    ?.discharge?.maxCsp

  if (!cycle?.discharge?.maxCsp || !startRetention) {
    return null
  }

  const ratio = cycle.discharge.maxCsp / startRetention

  return round(ratio * 100, 2)
}

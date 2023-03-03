import { PartialCycle } from "./buildCycle"

export function calcRetention(cycles: PartialCycle[], cycle?: PartialCycle) {
  const startRetention = cycles.find((cycle) => cycle.discharge?.maxCsp)
    ?.discharge?.maxCsp

  if (!cycle?.discharge?.maxCsp || !startRetention) {
    return null
  }

  const ratio = cycle.discharge.maxCsp / startRetention

  return Math.round(ratio * 10000) / 100
}

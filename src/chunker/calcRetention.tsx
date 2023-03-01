import { PartialCycle } from "./buildCycle"

export function calcRetention(cycles: PartialCycle[], cycle?: PartialCycle) {
  const startRetention = cycles.find(
    (cycle) => cycle.discharge?.maxSpecificCapacity
  )?.discharge?.maxSpecificCapacity

  if (!cycle?.discharge?.maxSpecificCapacity || !startRetention) {
    return null
  }

  const ratio = cycle.discharge.maxSpecificCapacity / startRetention

  return Math.round(ratio * 10000) / 100
}

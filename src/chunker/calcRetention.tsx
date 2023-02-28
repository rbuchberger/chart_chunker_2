import { PartialCycle } from "./buildCycle"

export function calcRetention(cycles: PartialCycle[], cycle?: PartialCycle) {
  if (
    !cycle?.discharge?.maxSpecificCapacity ||
    !cycles[0].discharge?.maxSpecificCapacity
  ) {
    return null
  }

  const ratio =
    cycle.discharge.maxSpecificCapacity /
    cycles[0].discharge.maxSpecificCapacity

  return Math.round(ratio * 10000) / 100
}

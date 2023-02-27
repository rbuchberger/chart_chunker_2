import Cycle from "./cycle"

export function calcRetention(cycles: Cycle[], cycle?: Cycle) {
  if (!cycle?.dischargeComplete || !cycles[0].dischargeComplete) {
    return null
  }

  const ratio =
    cycle.dischargeComplete.maxSpecificCapacity /
    cycles[0].dischargeComplete.maxSpecificCapacity

  return Math.round(ratio * 10000) / 100
}

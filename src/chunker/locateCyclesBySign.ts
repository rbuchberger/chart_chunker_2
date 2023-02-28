import { HalfCycleLocation } from "./buildHalf"
import { RawLine } from "./parser"

export const locateCyclesBySign = (lines: RawLine[], splitBasis: number) => {
  const cycles: HalfCycleLocation[] = []
  let lastSign: -1 | 0 | 1 | null = null

  // Last as in most recent, not as in the last in the data.
  function endLastCycle(index: number) {
    // Typescript doesn't mention that this could be undefined
    const lastCycle = cycles[cycles.length - 1]
    if (lastCycle) lastCycle.endExclusive ||= index
  }

  lines.forEach((line, index) => {
    const currentSign = getSign(line[splitBasis])

    if (currentSign === 0) {
      // We've reached a zero, finish the cycle in progress if it hasn't
      // already been.
      endLastCycle(index)
    } else if (currentSign !== lastSign) {
      // We're starting a new cycle.
      endLastCycle(index)
      cycles.push({ start: index, isCharge: currentSign === 1 })
    }

    lastSign = currentSign
  })

  return cycles
}

function getSign(value?: string | number) {
  if (value === undefined) return null
  const parsed = typeof value === "string" ? parseFloat(value) : value

  if (Math.abs(parsed) < 0.00000005) {
    return 0
  } else if (parsed > 0) {
    return 1
  } else {
    return -1
  }
}

import chunk from "lodash-es/chunk"
import compact from "lodash-es/compact"

import { buildCycle } from "./buildCycle"
import { HalfCycleLocation } from "./buildHalf"
import { Context } from "./chunk"

export function buildCycles(locs: HalfCycleLocation[], context: Context) {
  const chargeFirst = context.config.chargeFirst
  const { checkedLocs, errors } = checkLocs(locs, chargeFirst)

  const cycles = chunk(checkedLocs, 2).map((pair, index) => {
    return buildCycle(pair[0] || null, pair[1] || null, index + 1, context)
  })

  return { cycles, errors }
}

// Checks for double charges or discharges in a row, and adds nulls to account
// for differences between desired charge/discharge first and actual.
function checkLocs(locs: HalfCycleLocation[], chargeFirst: boolean) {
  const errors: string[] = []
  const checkedLocs: (HalfCycleLocation | null)[] = locs

  if (locs[0]?.isCharge !== chargeFirst) {
    checkedLocs.unshift(null)
  }

  if (locs[locs.length - 1]?.isCharge === chargeFirst) {
    checkedLocs.push(null)
  }

  const doubles = compact(
    locs.map((location, index) => {
      if (location?.isCharge === locs[index - 1]?.isCharge) {
        return index - 1
      } else {
        return null
      }
    })
  )

  doubles.forEach((index) => {
    errors.push(
      `Cycle ${index / 2} appears to have two charges or discharges in a row.`
    )
  })

  return { checkedLocs, errors }
}

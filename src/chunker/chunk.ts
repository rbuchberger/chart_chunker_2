import { buildCycles } from "./buildCycles"
import { calcRetention } from "./calcRetention"
import { ChunkerConfig } from "./chunker"
import Cycle from "./cycle"
import { locateCyclesBySign } from "./locateCyclesBySign"
import Parser from "./parser"

export type Context = {
  config: {
    chargeFirst: boolean
    splitBasis: number
    keptColumns: number[]
    spcColumn: number
    voltageColumn: number
  }
  parser: Parser
}

export function chunk(context: Context) {
  const { config, parser } = context

  // Split cycles
  const locations = locateCyclesBySign(parser.lines, config.splitBasis)
  const { cycles: cyclesFull, errors } = buildCycles(locations, context)

  // Decorate
  const chargeEffArray = cyclesFull.map((c) => c.chargeEfficiency)
  const retentionArray = cyclesFull.map((c) => calcRetention(cyclesFull, c))
  const keptColumns = config.keptColumns.slice().sort() // order matters
  const cycles = cyclesFull.map((c) => c.condensed)
  const overview = buildOverview(cyclesFull, config)

  return {
    cycles,
    errors,
    chargeEffArray,
    retentionArray,
    overview,
    keptColumns,
  } as const
}

function buildOverview(cycles: Cycle[], config: ChunkerConfig) {
  return {
    headers: [
      "Cycle #",
      `${config.chargeFirst ? "Charge" : "Discharge"} Specific Capacity`,
      `${config.chargeFirst ? "Discharge" : "Charge"} Specific Capacity`,
      "Charge Efficiency [%]",
      "Retention [%]",
    ],

    lines: cycles.map((cycle) => {
      return [
        cycle.cycleNumber,
        cycle.chargeComplete?.specificCapacity,
        cycle.dischargeComplete?.specificCapacity,
        cycle.chargeEfficiency,
        calcRetention(cycles, cycle),
      ]
    }),
    cycleCount: cycles.length,
  }
}

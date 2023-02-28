import { condenseCycle } from "./buildCycle"
import { buildCycles } from "./buildCycles"
import { calcRetention } from "./calcRetention"
import { locateCyclesBySign } from "./locateCyclesBySign"
import Parser from "./parser"

export type ChunkerConfig = {
  chargeFirst: boolean
  splitBasis: number
  keptColumns: number[]
  spcColumn: number
  voltageColumn: number
}

export type Context = { config: ChunkerConfig; parser: Parser }

export type ChunkerOverview = {
  headers: string[]
  lines: (number | null | undefined)[][]
  cycleCount: number
}

export type Chunker = ReturnType<typeof chunk>

export function chunk(context: Context) {
  const { config, parser } = context

  // Split cycles
  const locations = locateCyclesBySign(parser.lines, config.splitBasis)
  const { cycles: cyclesFull, errors } = buildCycles(locations, context)

  // Decorate
  const chargeEffArray = cyclesFull.map((c) => c.chargeEfficiency)
  const retentionArray = cyclesFull.map((c) => calcRetention(cyclesFull, c))
  const keptColumns = config.keptColumns.slice().sort() // order matters
  const cycles = cyclesFull.map((c) => condenseCycle(c))
  const overview = {
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
        cycle.charge?.specificCapacity,
        cycle.discharge?.specificCapacity,
        cycle.chargeEfficiency,
        calcRetention(cycles, cycle),
      ]
    }),
    cycleCount: cycles.length,
  }

  return {
    cycles,
    errors,
    chargeEffArray,
    retentionArray,
    overview,
    keptColumns,
  } as const
}

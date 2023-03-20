import { condenseCycle } from "./buildCycle"
import { buildCycles } from "./buildCycles"
import { ColumnConfig } from "./buildHalf"
import { calcRetention } from "./calcRetention"
import { locateCyclesBySign } from "./locateCyclesBySign"
import Parser from "./parser"

export type ChunkerConfig = {
  chargeFirst: boolean
  splitBasis?: number
  keptCols: ColumnConfig[]
  spcCol?: number
  vCol?: number
  commaDecimal?: boolean
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

  if (!config.splitBasis) return null

  const cspHeader =
    config.keptCols.find((c) => c.index === config.spcCol)?.name ||
    "Specific Capacity"

  // Split cycles
  const locations = locateCyclesBySign(parser.lines, config.splitBasis)
  const { cycles: cyclesFull, errors } = buildCycles(locations, context)

  // Decorate
  const chargeEffArray = cyclesFull.map((c) => c.chargeEfficiency)
  const retentionArray = cyclesFull.map((c) => calcRetention(cyclesFull, c))
  const cycles = cyclesFull.map((c) => condenseCycle(c))
  const overview = {
    headers: [
      "Cycle #",
      `${config.chargeFirst ? "Charge" : "Discharge"} ${cspHeader}`,
      `${config.chargeFirst ? "Discharge" : "Charge"} ${cspHeader}`,
      "Charge Efficiency (%)",
      "Retention (%)",
    ],

    lines: cycles.map((cycle) => {
      return [
        cycle.cycleNumber,
        cycle.charge?.csp,
        cycle.discharge?.csp,
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
  } as const
}

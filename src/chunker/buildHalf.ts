import { max, min } from "lodash-es"
import { Context } from "./chunk"

export type HalfCycleLocation = {
  start: number
  end?: number // exclusive
  isCharge: boolean
}

export type ColumnConfig = {
  index: number
  name?: string
  coefficient?: number
}

export type CycleHalf = ReturnType<typeof buildHalf>

export function buildHalf(
  location: HalfCycleLocation | null,
  cycleNumber: number,
  context: Context
) {
  if (!location) return null

  // Setup
  const { config, parser } = context
  const lines = parser.lines.slice(location.start, location.end)
  const length = lines.length

  // Filter & present
  const processedLines = lines.map((line) => {
    return config.keptCols.map(({ index, coefficient }) => {
      return Math.abs(parseFloat(line[index] || "0") * (coefficient || 1))
    })
  })

  const processedVCol = config.keptCols.findIndex(
    (c) => c.index === config.vCol
  )

  const processedCspCol = config.keptCols.findIndex(
    (c) => c.index === config.spcCol
  )

  // Basic analysis
  const splitBasisSum = lines.reduce(
    (a, l) => a + parseFloat(l[config.splitBasis] || "0"),
    0
  )
  const avgSplitBasis = splitBasisSum / lines.length
  const isCharge = avgSplitBasis > 0
  const isDischarge = avgSplitBasis < 0

  const voltages = processedLines.map((l) => l[processedVCol])
  const capacities = processedLines.map((l) => l[processedCspCol])

  // We're iterating twice each for voltage and spc; if perf becomes a problem
  // we can do it in one pass. Lodash doesn't offer a combo min/max function and
  // I don't want to pull in another dep or write one
  const maxV = max(voltages)
  const minV = min(voltages)
  const maxCsp = max(capacities)
  const minCsp = min(capacities)

  const csp =
    maxCsp !== undefined && minCsp !== undefined ? maxCsp - minCsp : null

  const prefix = isCharge ? "C" : "D"
  const headers = config.keptCols.map((config, index) => {
    const item = config.name || parser.columns[config.index] || ""

    if (index === 0) {
      return (
        prefix + cycleNumber + `_(${avgSplitBasis.toExponential(1)})_` + item
      )
    } else {
      return prefix + cycleNumber + "_" + item
    }
  })

  return {
    lines,
    length,
    cycleNumber,
    isCharge,
    isDischarge,
    avgSplitBasis,
    processedLines,
    maxV,
    minV,
    maxCsp,
    minCsp,
    csp,
    headers,
  } as const
}

export type PartialCycleHalf = ReturnType<typeof condenseCycleHalf>

export function condenseCycleHalf(half?: ReturnType<typeof buildHalf> | null) {
  if (!half) return null
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { lines, processedLines, ...rest } = half

  return rest
}

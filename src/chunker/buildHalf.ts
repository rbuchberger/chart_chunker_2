import { max, min, round } from "lodash-es"

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
  kind?: "integer" | "float" | "string"
  roundTo?: number
  abs?: boolean
}

export type CycleHalf = ReturnType<typeof buildHalf>

export function buildHalf(
  location: HalfCycleLocation | null,
  cycleNumber: number,
  context: Context
) {
  // Setup
  const { config, parser } = context

  if (!location || config.splitBasis === undefined) return null
  const lines = parser.lines.slice(location.start, location.end)
  const length = lines.length

  // Process
  const processedLines = lines.map((line) => {
    return config.keptCols.map(({ index, coefficient, kind, roundTo, abs }) => {
      const val = line[index]
      if (val === undefined) return

      // parse, multiply, round, abs, in that order.
      function processNumber(number: number) {
        let processed = number

        if (abs) processed = Math.abs(processed)
        if (coefficient) processed *= coefficient
        if (roundTo !== undefined) processed = round(processed, roundTo)

        return processed
      }

      switch (kind) {
        case "float": {
          const float = parseFloat(val)

          return processNumber(float)
        }

        case "integer": {
          const int = parseInt(val)
          return processNumber(int)
        }

        case "string":
        default:
          return val
      }
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
    // Typescript thinks splitbasis can be undefined, but we've already checked
    (a, l) => a + parseFloat(l[config.splitBasis || 0] || "0"),
    0
  )
  const avgSplitBasis = splitBasisSum / lines.length
  const isCharge = avgSplitBasis > 0
  const isDischarge = avgSplitBasis < 0

  // TODO: make sure these type assertions are in fact true
  const voltages = processedLines.map((l) => l[processedVCol]) as number[]
  const capacities = processedLines.map((l) => l[processedCspCol]) as number[]

  // We're iterating twice each for voltage and spc; if perf becomes a problem
  // we can do it in one pass. Lodash doesn't offer a combo min/max function and
  // I don't want to pull in another dep or write one
  const maxV = max(voltages)
  const minV = min(voltages)
  const maxCsp = max(capacities)
  const minCsp = min(capacities)

  const csp =
    typeof maxCsp === "number" && typeof minCsp === "number"
      ? maxCsp - minCsp
      : null

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

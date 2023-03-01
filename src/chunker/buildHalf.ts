import { max, min } from "lodash-es"
import { Context } from "./chunk"

export type HalfCycleLocation = {
  start: number
  endExclusive?: number
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
  const lines = parser.lines.slice(location.start, location.endExclusive)
  const length = lines.length

  // Basic analysis
  const splitBasisSum = lines.reduce(
    (a, l) => a + parseFloat(l[config.splitBasis] || "0"),
    0
  )
  const averageSplitBasis = splitBasisSum / lines.length
  const isCharge = averageSplitBasis > 0
  const isDischarge = averageSplitBasis < 0

  const voltages = lines.map((l) =>
    Math.abs(parseFloat(l[config.voltageColumn]))
  )
  const capacities = lines.map((l) => Math.abs(parseFloat(l[config.spcColumn])))

  // We're iterating twice each for voltage and spc; if perf becomes a problem
  // we can do it in one pass. Lodash doesn't offer a combo min/max function and
  // I don't want to pull in another dep or write one
  const maxVoltage = max(voltages)
  const minVoltage = min(voltages)
  const maxSpecificCapacity = max(capacities)
  const minSpecificCapacity = min(capacities)

  const specificCapacity =
    maxSpecificCapacity !== undefined && minSpecificCapacity !== undefined
      ? maxSpecificCapacity - minSpecificCapacity
      : null

  // Filter & present
  const processedLines = lines.map((line) => {
    return config.keptColumns.map(({ index, coefficient }) => {
      return Math.abs(parseFloat(line[index] || "0") * (coefficient || 1))
    })
  })

  const prefix = isCharge ? "C" : "D"
  const headers = config.keptColumns.map((config, index) => {
    const item = config.name || parser.columns[config.index] || ""

    if (index === 0) {
      return (
        prefix +
        cycleNumber +
        `_(${averageSplitBasis.toExponential(1)})_` +
        item
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
    averageSplitBasis,
    processedLines,
    maxVoltage,
    minVoltage,
    maxSpecificCapacity,
    minSpecificCapacity,
    specificCapacity,
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

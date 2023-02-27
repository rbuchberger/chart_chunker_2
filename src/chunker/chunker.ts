import Cycle, { CyclePartial } from "./cycle"

// Take in an array of arrays (papa-parsed CSV table). Split it up into cycles.
//
// A charge-discharge cycle is determined by the splitBasis (probably current
// supplied to the battery.) When changes sign, that line is the first in a new
// half-cycle. If it's ~zero, end any cycle that's in progress and discard that
// line.

// The result is passed from a service worker, which means that we can't send
// functions or classes. We can only send JSON-serializable objects. All results
// must be calculated during construction.
export type ChunkerConfig = {
  chargeFirst: boolean
  splitBasis: number
  keptColumns: number[]
  spcColumn: number
  voltageColumn: number
}

export type ChunkerOverview = {
  headers: string[]
  lines: (number | null | undefined)[][]
  cycleCount: number
}

export type ChunkerPartial = Omit<
  Chunker,
  "cycles" | "config" | "parser" | "condensed"
> & {
  cycles: CyclePartial[]
}

export type HalfCycleLocation = {
  start: number
  endExclusive?: number
  isCharge: boolean
}

export type Chunker = {
  cycles: Cycle[]
  errors: string[]
  chargeEffArray: (number | undefined)[]
  retentionArray: (number | null)[]
  overview: ChunkerOverview
  keptColumns: number[]
}

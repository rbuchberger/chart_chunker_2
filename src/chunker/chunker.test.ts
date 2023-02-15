import { Chunker } from "./chunker"
import { sample1 } from "../../test_data/sample1_trunc"
import { test, expect } from "vitest"
import Parser from "./parser"

const parser = new Parser(sample1)

test("chunker", () => {
  const chunker = new Chunker(
    {
      splitBasis: 8,
      keptColumns: [7, 8, 12, 14],
      spcColumn: 12,
      voltageColumn: 14,
    },
    parser
  )

  expect(
    chunker.cycles.reduce((acc, cycle) => {
      return cycle.length + acc
    }, 0)
  ).toBe(885)

  expect(chunker.overview.lines[0]).toEqual([
    1, 0.1301826, 0.1273819, 97.85, 100,
  ])

  expect(chunker.cycles.length).toBe(2)

  expect(chunker.cycles[0].overview.headers).toEqual([
    "",
    "Charge",
    "Discharge",
  ])

  expect(chunker.cycles[0].overview.lines[0]).toEqual([
    "Average Current",
    0.00006098175968750003,
    -0.000060983465545454524,
  ])

  expect(chunker.cycles[1]?.discharge?.headers).toEqual([
    "D2_(-6.1e-5)_U/E[V]",
    "D2_Curr[A]",
    "D2_Specific capactity[Ah/g]",
    "D2_Ucell1[V]",
  ])
})

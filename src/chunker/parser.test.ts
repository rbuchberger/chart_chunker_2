import { expect, test } from "vitest"

import { sample1 } from "../../test_data/sample1_trunc"
import Parser from "./parser"

test("parser", () => {
  const parser = new Parser(sample1)

  expect(parser.columns).toEqual([
    "Indeks",
    "Global time",
    "Sum Time[s]",
    "Repeat No",
    "Step No",
    "Cycles No",
    "Step time[s]",
    "U/E[V]",
    "Curr[A]",
    "Curr density[A/cm2]",
    "Step charge[Ah]",
    "Sum charge[Ah]",
    "Specific capactity[Ah/g]",
    "Active ions[ ]",
    "Ucell1[V]",
    "Ucell2[V]",
    "Ucell3[V]",
    "Ucell4[V]",
    "Ucell5[V]",
    "Ucell6[V]",
    "Ucell7[V]",
    "Ucell8[V]",
    "Temp[`C]",
    "Uext[V]",
    "Status",
    "",
  ])

  expect(parser.columnItems).toEqual([
    {
      text: "Indeks",
      value: 0,
      labelMod: "Indeks",
      multiply: 1,
      abs: true,
      round: 3,
    },
    {
      text: "Global time",
      value: 1,
      labelMod: "Global time",
      multiply: 1,
      abs: true,
      round: 3,
    },
    {
      text: "Sum Time[s]",
      value: 2,
      labelMod: "Sum Time[s]",
      multiply: 1,
      abs: true,
      round: 3,
    },
    {
      text: "Repeat No",
      value: 3,
      labelMod: "Repeat No",
      multiply: 1,
      abs: true,
      round: 3,
    },
    {
      text: "Step No",
      value: 4,
      labelMod: "Step No",
      multiply: 1,
      abs: true,
      round: 3,
    },
    {
      text: "Cycles No",
      value: 5,
      labelMod: "Cycles No",
      multiply: 1,
      abs: true,
      round: 3,
    },
    {
      text: "Step time[s]",
      value: 6,
      labelMod: "Step time[s]",
      multiply: 1,
      abs: true,
      round: 3,
    },
    {
      text: "U/E[V]",
      value: 7,
      labelMod: "U/E[V]",
      multiply: 1,
      abs: true,
      round: 3,
    },
    {
      text: "Curr[A]",
      value: 8,
      labelMod: "Curr[A]",
      multiply: 1,
      abs: true,
      round: 3,
    },
    {
      text: "Curr density[A/cm2]",
      value: 9,
      labelMod: "Curr density[A/cm2]",
      multiply: 1,
      abs: true,
      round: 3,
    },
    {
      text: "Step charge[Ah]",
      value: 10,
      labelMod: "Step charge[Ah]",
      multiply: 1,
      abs: true,
      round: 3,
    },
    {
      text: "Sum charge[Ah]",
      value: 11,
      labelMod: "Sum charge[Ah]",
      multiply: 1,
      abs: true,
      round: 3,
    },
    {
      text: "Specific capactity[Ah/g]",
      value: 12,
      labelMod: "Specific capactity[Ah/g]",
      multiply: 1,
      abs: true,
      round: 3,
    },
    {
      text: "Active ions[ ]",
      value: 13,
      labelMod: "Active ions[ ]",
      multiply: 1,
      abs: true,
      round: 3,
    },
    {
      text: "Ucell1[V]",
      value: 14,
      labelMod: "Ucell1[V]",
      multiply: 1,
      abs: true,
      round: 3,
    },
    {
      text: "Ucell2[V]",
      value: 15,
      labelMod: "Ucell2[V]",
      multiply: 1,
      abs: true,
      round: 3,
    },
    {
      text: "Ucell3[V]",
      value: 16,
      labelMod: "Ucell3[V]",
      multiply: 1,
      abs: true,
      round: 3,
    },
    {
      text: "Ucell4[V]",
      value: 17,
      labelMod: "Ucell4[V]",
      multiply: 1,
      abs: true,
      round: 3,
    },
    {
      text: "Ucell5[V]",
      value: 18,
      labelMod: "Ucell5[V]",
      multiply: 1,
      abs: true,
      round: 3,
    },
    {
      text: "Ucell6[V]",
      value: 19,
      labelMod: "Ucell6[V]",
      multiply: 1,
      abs: true,
      round: 3,
    },
    {
      text: "Ucell7[V]",
      value: 20,
      labelMod: "Ucell7[V]",
      multiply: 1,
      abs: true,
      round: 3,
    },
    {
      text: "Ucell8[V]",
      value: 21,
      labelMod: "Ucell8[V]",
      multiply: 1,
      abs: true,
      round: 3,
    },
    {
      text: "Temp[`C]",
      value: 22,
      labelMod: "Temp[`C]",
      multiply: 1,
      abs: true,
      round: 3,
    },
    {
      text: "Uext[V]",
      value: 23,
      labelMod: "Uext[V]",
      multiply: 1,
      abs: true,
      round: 3,
    },
    {
      text: "Status",
      value: 24,
      labelMod: "Status",
      multiply: 1,
      abs: true,
      round: 3,
    },
    {
      text: "",
      value: 25,
      labelMod: "",
      multiply: 1,
      abs: true,
      round: 3,
    },
  ])

  expect(parser.parsedChart.data.length).toBe(1000)
  expect(parser.parsedChart.errors.length).toBe(0)
})

test("empty parser", () => {
  const parser = new Parser("")

  expect(parser.columns).toEqual([])
  expect(parser.parsedChart.data.length).toBe(0)
  expect(parser.parsedChart.errors.length).toBe(0)
})

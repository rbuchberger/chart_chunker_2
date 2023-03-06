import { ColumnConfig } from "../chunker/buildHalf"

export const defaultColConfigs: Readonly<ColumnConfig[]> = [
  { index: 0, kind: "string" }, // 0 Indeks
  { index: 1, kind: "string" }, // 1 Global time
  { index: 2, kind: "float" }, // 2 Sum Time[s]
  { index: 3, kind: "integer" }, // 3 Repeat No
  { index: 4, kind: "integer" }, // 4 Step No
  { index: 5, kind: "integer" }, // 5 Cycles No
  { index: 6, kind: "float" }, // 6 Step time[s]
  { index: 7, kind: "float" }, // 7 U/E[V]
  { index: 8, kind: "float" }, // 8 Curr[A]
  { index: 9, kind: "float" }, // 9 Curr density[A/cm2]
  { index: 10, kind: "float" }, // 10 Step charge[Ah]
  { index: 11, kind: "float" }, // 11 Sum charge[Ah]
  {
    index: 12,
    kind: "float",
    roundTo: 3,
    coefficient: 100,
    name: "Specific Capacity (mAh/g)",
    abs: true,
  }, // 12 Specific capactity[Ah/g]
  { index: 13, kind: "float" }, // 13 Active ions[ ]
  {
    index: 14,
    kind: "float",
    roundTo: 3,
    name: "Electrode Potential (V)",
    abs: true,
  }, // 14 Ucell1[V]
  { index: 15, kind: "float" }, // 15 Ucell2[V]
  { index: 16, kind: "float" }, // 16 Ucell3[V]
  { index: 17, kind: "float" }, // 17 Ucell4[V]
  { index: 18, kind: "float" }, // 18 Ucell5[V]
  { index: 19, kind: "float" }, // 19 Ucell6[V]
  { index: 20, kind: "float" }, // 20 Ucell7[V]
  { index: 21, kind: "float" }, // 21 Ucell8[V]
  { index: 22, kind: "float" }, // 22 Temp[`C]
  { index: 23, kind: "float" }, // 23 Uext[V]
  { index: 24, kind: "string" }, // 24 Status
] as const

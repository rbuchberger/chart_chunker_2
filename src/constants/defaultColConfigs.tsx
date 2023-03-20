import { ColumnConfig } from "../chunker/buildHalf"
import { DataType } from "../hooks/useChunker"

export const defaultColConfigs: Record<
  NonNullable<DataType>,
  ColumnConfig[]
> = {
  atlas: [
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
      roundTo: 2,
      coefficient: 1000,
      name: "Specific Capacity (mAh/g)",
      abs: true,
    }, // 12 Specific capactity[Ah/g]
    { index: 13, kind: "float" }, // 13 Active ions[ ]
    {
      index: 14,
      kind: "float",
      roundTo: 4,
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
  ],

  // Voltage: Ecell/V
  // Detect by I/mA
  // Capacity: Capacity/mA.h - note we need to add a box to divide by mass. If not
  // filled, it's just Capacity
  // Current is already in milliamps, don't convert

  biologic: [
    { index: 0, kind: "string" }, // 0 mode
    { index: 1, kind: "string" }, // 1 ox/red
    { index: 2, kind: "string" }, // 2 error
    { index: 3, kind: "string" }, // 3 control changes
    { index: 4, kind: "string" }, // 4 Ns changes
    { index: 5, kind: "string" }, // 5 counter inc.
    { index: 6, kind: "integer" }, // 6 Ns
    { index: 7, kind: "float" }, // 7 time/s
    { index: 8, kind: "float" }, // 8 control/mA
    { index: 9, kind: "float", abs: true, roundTo: 4 }, // 9 Ecell/V
    { index: 10, kind: "float" }, // 10 I/mA
    { index: 11, kind: "float" }, // 11 dQ/C
    { index: 12, kind: "float" }, // 12 (Q-Qo)/C
    { index: 13, kind: "integer" }, // 13 I Range
    { index: 14, kind: "float" }, // 14 Energy charge/W.h
    { index: 15, kind: "float" }, // 15 Energy discharge/W.h
    { index: 16, kind: "float" }, // 16 Capacitance charge/µF
    { index: 17, kind: "float" }, // 17 Capacitance discharge/µF
    { index: 18, kind: "float" }, // 18 Q discharge/mA.h
    { index: 19, kind: "float" }, // 19 Q charge/mA.h
    { index: 20, kind: "float", abs: true }, // 20 Capacity/mA.h
    { index: 21, kind: "float" }, // 21 Efficiency/%
    { index: 22, kind: "integer" }, // 22 cycle number
    { index: 23, kind: "float" }, // 23 P/W
  ],
  other: [],
}

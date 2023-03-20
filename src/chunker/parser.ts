import Papa from "papaparse"

import { DataType } from "../hooks/useChunker"

// Atlas headers:
// 0   index
// 1   time
// 2   Sum Time[s],
// 3   Repeat No,
// 4   Step No,
// 5   Cycles No,
// 6   Step time[s],
// 7   U/E[V],
// 8   Curr[A],
// 9   Curr density[A/cm2],
// 10  Step charge[Ah],
// 11  Sum charge[Ah],
// 12  Specific capactity[Ah/g],
// 13  Active ions[ ],
// 14  Ucell1[V],
// 15  Ucell2[V],
// 16  Ucell3[V],
// 17  Ucell4[V],
// 18  Ucell5[V],
// 19  Ucell6[V],
// 20  Ucell7[V],
// 21  Ucell8[V],
// 22  Temp[`C],
// 23  Uext[V],
// 24  Status,

// Biologic headers
// 0 mode
// 1 ox/red
// 2 error
// 3 control changes
// 4 Ns changes
// 5 counter inc.
// 6 Ns
// 7 time/s
// 8 control/mA
// 9 Ecell/V
// 10 I/mA
// 11 dQ/C
// 12 (Q-Qo)/C
// 13 I Range
// 14 Energy charge/W.h
// 15 Energy discharge/W.h
// 16 Capacitance charge/µF
// 17 Capacitance discharge/µF
// 18 Q discharge/mA.h
// 19 Q charge/mA.h
// 20 Capacity/mA.h
// 21 Efficiency/%
// 22 cycle number
// 23 P/W

export type RawLine = string[]

export type ParserConfig = {
  text: string
  dataType: DataType
  // options: Papa.ParseConfig
}

export default class Parser {
  text
  header
  parsedChart
  columns: string[]
  columnItems
  lines: RawLine[]
  // parserConfig: Papa.ParseConfig

  constructor({ text, dataType }: ParserConfig) {
    this.text = text

    let rawText: string

    if (dataType === "atlas") {
      const splitText = this.text.split("RESULTS TABLE:")
      this.header = splitText.shift()
      rawText = splitText.shift() || ""
    } else {
      rawText = this.text
    }

    this.parsedChart = this.buildParsedChart(rawText.trim())

    if (
      this.parsedChart.errors.length > 0 ||
      this.parsedChart.data.length === 0
    ) {
      if (this.parsedChart.errors.length) console.error(this.parsedChart.errors)

      throw new Error("Unable to parse table from file.")
    }

    this.columns = this.parsedChart.data.shift() as string[]
    this.columnItems =
      this?.columns?.map((name, index) => ({
        name,
        index,
      })) || []

    this.lines = this.parsedChart.data as RawLine[]
  }

  buildParsedChart(rawChart?: string) {
    if (!rawChart || rawChart.length === 0) {
      return { data: [], errors: [], meta: {} }
    }

    const parsed = Papa.parse(rawChart, {
      delimitersToGuess: [Papa.RECORD_SEP, Papa.UNIT_SEP, ";", "\t", ",", "|"],
    })

    return parsed
  }
}

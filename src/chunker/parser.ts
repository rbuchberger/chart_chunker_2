import Papa from "papaparse"

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

export type RawLine = string[]

export default class Parser {
  rawText
  header
  parsedChart
  columns: string[]
  columnItems
  lines: RawLine[]

  constructor(rawText: string) {
    this.rawText = rawText

    const splitText = this.rawText.split("RESULTS TABLE:")
    this.header = splitText.shift()
    this.parsedChart = this.buildParsedChart(splitText.shift())

    if (
      this.parsedChart.errors.length > 0 ||
      this.parsedChart.data.length === 0
    ) {
      if (this.parsedChart.errors.length) console.error(this.parsedChart.errors)

      throw new Error("Unable to parse table from file.")
    }

    this.columns = this.parsedChart.data.shift() as string[]
    this.columnItems =
      this?.columns?.map((label, index) => ({
        text: label,
        value: index,
      })) || []

    this.lines = this.parsedChart.data as RawLine[]
  }

  buildParsedChart(rawChart?: string) {
    if (!rawChart || rawChart.length === 0) {
      return { data: [], errors: [], meta: {} }
    }

    const parsed = Papa.parse(rawChart.trim().replace(/\t/g, ""))

    return parsed
  }
}

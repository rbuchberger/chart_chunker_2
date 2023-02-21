import Papa from "papaparse"

export const useTableCopy = (table: React.ReactNode[][]) => {
  const unparsed = Papa.unparse(
    table.map((l) => l.map((v) => v?.toString() || "")),
    { delimiter: "\t" }
  )

  return navigator.clipboard.writeText(unparsed)
}

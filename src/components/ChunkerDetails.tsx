import { FunctionComponent } from "react"
import { useStore } from "../hooks/useStore"
import { DataTable } from "../primitives/DataTable"
import { CyclePicker } from "./CyclePicker"

export const ChunkerDetails: FunctionComponent<{
  selectedCycle: number
  setSelectedCycle: (cycle: number) => void
}> = ({ selectedCycle, setSelectedCycle }) => {
  const { chunker } = useStore()
  const cycles = chunker?.cycles

  if (!cycles) return <h2 className="py-12 text-center text-xl">working...</h2>

  return (
    <>
      <CyclePicker
        selectedCycle={selectedCycle}
        setSelectedCycle={setSelectedCycle}
        cycles={cycles}
      />

      <DataTable
        title="Analysis"
        headers={cycles[selectedCycle].overview.headers}
        lines={cycles[selectedCycle].overview.lines}
      />

      <DataTable
        title="Data"
        headers={cycles[selectedCycle].processedLines[0]}
        lines={cycles[selectedCycle].processedLines.slice(1)}
        startCollapsed={true}
      />
    </>
  )
}

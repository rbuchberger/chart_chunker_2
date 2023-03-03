import { FunctionComponent } from "react"
import { useStore } from "../hooks/useStore"
import { DataTable } from "../primitives/DataTable"
import { CyclePicker } from "./CyclePicker"
import { CycleProfile } from "./CycleProfile"
import { LoadingSpinner } from "./LoadingSpinner"

export const ChunkerDetails: FunctionComponent<{
  selectedCycle: number
  setSelectedCycle: (cycle: number) => void
}> = ({ selectedCycle, setSelectedCycle }) => {
  const chunker = useStore((state) => state.chunker)
  const cycles = chunker?.cycles

  if (!cycles) return <LoadingSpinner />

  return (
    <>
      <CyclePicker
        selectedCycle={selectedCycle}
        setSelectedCycle={setSelectedCycle}
        cycles={cycles}
      />

      <CycleProfile cycle={cycles[selectedCycle]} />

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

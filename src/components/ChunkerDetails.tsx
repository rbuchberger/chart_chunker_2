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
  const cycle = cycles?.[selectedCycle]

  if (!cycle) return <LoadingSpinner />

  return (
    <>
      <CyclePicker
        selectedCycle={selectedCycle}
        setSelectedCycle={setSelectedCycle}
        cycles={cycles}
      />

      <CycleProfile cycle={cycle} />

      <DataTable
        title="Analysis"
        headers={cycle.overview.headers}
        lines={cycle.overview.lines}
      />

      <DataTable
        title="Data"
        headers={cycle.processedLines[0] || []}
        lines={cycle.processedLines.slice(1)}
        startCollapsed={true}
      />
    </>
  )
}

import { FunctionComponent } from "react"
import { useStore } from "../hooks/useStore"
import { DataTable } from "../primitives/DataTable"
import { CyclePicker } from "./CyclePicker"

export const ChunkerDetails: FunctionComponent<{
  selectedCycle: number
  setSelectedCycle: (cycle: number) => void
}> = ({ selectedCycle, setSelectedCycle }) => {
  const { chunker } = useStore()

  if (!chunker) return <p>loading...</p>

  return (
    <>
      <CyclePicker
        selectedCycle={selectedCycle}
        setSelectedCycle={setSelectedCycle}
        chunker={chunker}
      />

      <div className="">
        <h3 className="text-xl">Analysis</h3>
        <DataTable
          headers={chunker.cycles[selectedCycle].overview.headers}
          lines={chunker.cycles[selectedCycle].overview.lines}
        />
      </div>

      <div className="">
        <h3 className="text-xl">Data</h3>
        <DataTable
          headers={chunker.cycles[selectedCycle].processedLines[0]}
          lines={chunker.cycles[selectedCycle].processedLines.slice(1)}
          startCollapsed={true}
        />
      </div>
    </>
  )
}

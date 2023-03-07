import {
  ChevronDoubleLeft,
  ChevronDoubleRight,
  ChevronLeft,
  ChevronRight,
  MinusSmall,
  PlusSmall,
} from "@styled-icons/heroicons-solid"
import { FunctionComponent, useCallback } from "react"

import { PartialCycle } from "../chunker/buildCycle"

export const CyclePicker: FunctionComponent<{
  cycles: PartialCycle[]
  selectedCycle: number
  setSelectedCycle: (cycle: number) => void
}> = ({ selectedCycle, setSelectedCycle, cycles }) => {
  const min = 0
  const max = cycles.length - 1

  // Limit between min and max
  const setCappedSelectedCycle = useCallback(
    (cycle: number) => {
      setSelectedCycle(Math.min(Math.max(cycle, min), max))
    },
    [setSelectedCycle, min, max]
  )

  return (
    <div className="flex flex-row justify-center gap-2">
      <div className="align-center flex flex-row items-center gap-2 text-2xl">
        <h2 className="whitespace-nowrap align-bottom">Cycle #</h2>
        <input
          className="w-20 rounded-md border border-gray-50 bg-gray-600 text-center"
          type="number"
          value={selectedCycle + 1}
          onChange={(e) => setCappedSelectedCycle(parseInt(e.target.value) - 1)}
        />
      </div>

      <div className="w-12" />

      <button onClick={() => setCappedSelectedCycle(min)}>
        <ChevronDoubleLeft size={24} />
      </button>
      <button onClick={() => setCappedSelectedCycle(selectedCycle - 10)}>
        <ChevronLeft size={24} />
      </button>
      <button onClick={() => setCappedSelectedCycle(selectedCycle - 1)}>
        <MinusSmall size={24} />
      </button>
      <input
        className="grow accent-yellow-400"
        type="range"
        min="1"
        max={max + 1}
        step="1"
        value={selectedCycle + 1}
        onChange={(e) => setCappedSelectedCycle(parseInt(e.target.value) - 1)}
      />
      <button onClick={() => setCappedSelectedCycle(selectedCycle + 1)}>
        <PlusSmall size={24} />
      </button>
      <button onClick={() => setCappedSelectedCycle(selectedCycle + 10)}>
        <ChevronRight size={24} />
      </button>
      <button onClick={() => setCappedSelectedCycle(max)}>
        <ChevronDoubleRight size={24} />
      </button>
    </div>
  )
}

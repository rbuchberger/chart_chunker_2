import { Plus } from "@styled-icons/heroicons-solid"
import Tippy from "@tippyjs/react"
import { FunctionComponent, useCallback } from "react"

import { useStore } from "../hooks/useStore"

export const ColumnToggle: FunctionComponent<{
  name?: string
  index: number
}> = ({ name, index }) => {
  const { addKeptColumn } = useStore((state) => ({
    addKeptColumn: state.addKeptColumn,
  }))

  const handleCheck = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault()

      addKeptColumn(index)
    },
    [addKeptColumn, index]
  )

  return (
    <li>
      <Tippy content={`Add ${name} column to output data`}>
        <button
          onClick={handleCheck}
          className="items-bottom flex h-full w-full cursor-pointer gap-1 whitespace-nowrap rounded-md bg-gray-700 py-2 px-1 font-mono text-sm hover:bg-gray-800"
          aria-label={`Add ${name} to output`}
        >
          <Plus size={12} className="text-yellow-400" />
          <div className="select-none overflow-hidden overflow-ellipsis">
            {name}
          </div>
        </button>
      </Tippy>
    </li>
  )
}

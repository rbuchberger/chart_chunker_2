import { FunctionComponent } from "react"
import { useStore } from "../hooks/useStore"

export const ChunkerPreview: FunctionComponent = () => {
  const chunker = useStore((state) => state.chunker)

  const lastChargeEff = chunker?.overview?.lines
    ?.slice()
    ?.reverse()
    ?.find((l) => l[3])?.[3]

  const lastRetention = chunker?.overview?.lines.at(-1)?.[4]
  const cycles = chunker?.overview?.cycleCount

  return (
    <ul className="text-md flex flex-col gap-1 rounded-md bg-gray-600 p-4">
      <li className="flex w-full justify-between gap-4 whitespace-nowrap">
        Cycles detected:
        <div className="overflow-ellipsis font-semibold text-yellow-400">
          {cycles !== undefined ? cycles : "?"}
        </div>
      </li>
      <li className="flex justify-between gap-4 whitespace-nowrap">
        End charge efficiency:
        <span className="overflow-ellipsis font-semibold text-yellow-400">
          {lastChargeEff ? `${lastChargeEff}%` : "?"}
        </span>
      </li>
      <li className="flex justify-between gap-4 whitespace-nowrap">
        End retention:
        <span className="overflow-ellipsis font-semibold text-yellow-400">
          {lastRetention ? `${lastRetention}%` : "?"}
        </span>
      </li>
    </ul>
  )
}

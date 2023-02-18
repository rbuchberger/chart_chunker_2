import { FunctionComponent } from "react"
import { useStore } from "../hooks/useStore"

export const ChunkerPreview: FunctionComponent = () => {
  const { chunkerOverview } = useStore()

  const lastChargeEff = chunkerOverview?.lines.at(-1)?.[3]
  const lastRetention = chunkerOverview?.lines.at(-1)?.[4]
  const cycles = chunkerOverview?.cycleCount

  return (
    <ul className="text-md flex flex-col gap-1 rounded-md bg-gray-600 p-4">
      <li className="flex w-full justify-between gap-4 whitespace-nowrap">
        Cycles detected:
        <div className="overflow-ellipsis font-semibold text-yellow-400">
          {cycles !== undefined ? cycles : "?"}
        </div>
      </li>
      <li className="flex justify-between gap-4 whitespace-nowrap">
        Last cycle charge efficiency:
        <span className="overflow-ellipsis font-semibold text-yellow-400">
          {lastChargeEff ? `${lastChargeEff}%` : "?"}
        </span>
      </li>
      <li className="flex justify-between gap-4 whitespace-nowrap">
        Last cycle retention:
        <span className="overflow-ellipsis font-semibold text-yellow-400">
          {lastRetention ? `${lastRetention}%` : "?"}
        </span>
      </li>
    </ul>
  )
}

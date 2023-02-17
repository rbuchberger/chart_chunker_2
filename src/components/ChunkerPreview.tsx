import { FunctionComponent } from "react"
import { useLoading } from "../hooks/useLoading"
import { useStore } from "../hooks/useStore"

export const ChunkerPreview: FunctionComponent = () => {
  const { chunker } = useStore()
  const done = useLoading() === "done"

  const lastChargeEff = chunker?.overview.lines.at(-1)?.[3] || "?"
  const lastRetention = chunker?.overview.lines.at(-1)?.[4] || "?"

  return (
    <ul className="text-md flex flex-col gap-1 rounded-md bg-gray-600 p-4">
      <li className="flex w-full justify-between gap-4 whitespace-nowrap">
        Cycles detected:
        <div className="overflow-ellipsis font-semibold text-yellow-400">
          {done ? chunker?.cycles.length : "..."}
        </div>
      </li>
      <li className="flex justify-between gap-4 whitespace-nowrap">
        Last cycle charge efficiency:
        <span className="overflow-ellipsis font-semibold text-yellow-400">
          {done ? `${lastChargeEff}%` : "..."}
        </span>
      </li>
      <li className="flex justify-between gap-4 whitespace-nowrap">
        Last cycle retention:
        <span className="overflow-ellipsis font-semibold text-yellow-400">
          {done ? `${lastRetention}%` : "..."}
        </span>
      </li>
    </ul>
  )
}

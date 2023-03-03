import { Battery100 } from "@styled-icons/heroicons-solid"
import { FunctionComponent } from "react"

export const LoadingSpinner: FunctionComponent = () => {
  return (
    <div className="flex h-96 max-h-screen flex-col items-center justify-center">
      <Battery100
        size={128}
        className="text-gray-200 motion-safe:animate-bounce motion-reduce:animate-pulse"
      />
      <h2 className="text-2xl">Working...</h2>
    </div>
  )
}

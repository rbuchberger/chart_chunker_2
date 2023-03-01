import { Battery100 } from "@styled-icons/heroicons-solid"
import { FunctionComponent } from "react"

export const LoadingSpinner: FunctionComponent = () => {
  return (
    <div className="flex h-96 max-h-screen flex-col items-center justify-center">
      <Battery100 className="animate-pulse duration-1000" size={128} />
      <h2 className="text-2xl">Working...</h2>
    </div>
  )
}

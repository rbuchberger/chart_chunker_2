import {
  Check,
  ExclamationCircle,
  InformationCircle,
  XMark,
} from "@styled-icons/heroicons-solid"
import { FunctionComponent, useMemo } from "react"
import { useStore } from "../hooks/useStore"

export type FlashMessage = {
  content: React.ReactNode
  kind: "error" | "success" | "info"
  id: number
}

export const FlashMessage: FunctionComponent<{
  message: FlashMessage
}> = ({ message }) => {
  const clearFlash = useStore((state) => state.clearFlash)
  const icon = useMemo(() => {
    switch (message.kind) {
      case "error":
        return <ExclamationCircle size={18} className="text-red-500" />
      case "success":
        return <Check size={18} className="text-green-500" />
      case "info":
        return <InformationCircle size={18} className="text-blue-500" />
    }
  }, [message.kind])

  return (
    <div className="flex flex-row items-center gap-3 rounded-md bg-gray-50 px-4 py-3 text-gray-700">
      {icon}
      {message.content}
      <div className="flex-grow" />
      <button role="Close message" onClick={() => clearFlash(message.id)}>
        <XMark size={18} />
      </button>
    </div>
  )
}

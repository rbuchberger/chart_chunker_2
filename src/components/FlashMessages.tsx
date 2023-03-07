import { FunctionComponent } from "react"

import { useStore } from "../hooks/useStore"
import { FlashMessage } from "./FlashMessage"

export const FlashMessages: FunctionComponent = () => {
  const flashMessages = useStore((state) => state.flashMessages)

  return (
    <div className="fixed top-8 z-10 flex w-3/4 translate-x-1/2 transform flex-col gap-4 md:w-1/2">
      {flashMessages.map((message) => (
        <FlashMessage key={message.id} message={message} />
      ))}
    </div>
  )
}

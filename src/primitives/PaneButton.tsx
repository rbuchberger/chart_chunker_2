import classNames from "classnames"
import { FunctionComponent } from "react"

export const PaneButton: FunctionComponent<{
  name: string
  onClick: React.MouseEventHandler<HTMLButtonElement>
  children: React.ReactNode
  currentPane: string
}> = ({ name, onClick, children, currentPane }) => {
  const active = name === currentPane

  return (
    <button
      data-name={name}
      onClick={onClick}
      className={classNames("px-6 py-1 transition-colors", {
        "border-b-2 border-b-yellow-400 text-yellow-400": active,
        "border-b-2 border-b-gray-600 text-gray-200 hover:border-b-gray-50 hover:text-gray-50":
          !active,
      })}
    >
      {children}
    </button>
  )
}

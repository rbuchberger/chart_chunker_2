import { FunctionComponent, useCallback, useState } from "react"
import { PaneButton } from "./PaneButton"

export const Panes: FunctionComponent<{
  buttons: { name: string; content?: React.ReactNode }[]
  panes: Record<string, React.ReactNode>
}> = ({ buttons, panes }) => {
  const [pane, setPane] = useState(buttons[0].name)
  const handlePaneClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      const newPane = event.currentTarget.getAttribute("data-name")
      if (newPane && Object.keys(panes).includes(newPane)) setPane(newPane)
    },
    [setPane]
  )

  // Can probably do this with typescript but I'm not smart enough.
  Object.keys(panes).forEach((key) => {
    if (!buttons.find((x) => x.name === key)) {
      console.error(`Pane ${key} has no button`)
    }
  })

  return (
    <>
      <div className="flex flex-row justify-center">
        <div className="flex-grow border-b-2 border-b-gray-600" />
        {buttons.map(({ name, content }) => (
          <PaneButton
            currentPane={pane}
            key={name}
            name={name}
            onClick={handlePaneClick}
          >
            {content || name}
          </PaneButton>
        ))}
        <div className="flex-grow border-b-2 border-b-gray-600" />
      </div>

      {panes[pane] || <p>Pane {pane} not found</p>}
    </>
  )
}

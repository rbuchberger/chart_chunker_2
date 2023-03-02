import { Battery100 } from "@styled-icons/heroicons-solid"
import Tippy from "@tippyjs/react"
import classNames from "classnames"
import { FunctionComponent, useCallback, useState } from "react"
import { useStore } from "../hooks/useStore"

export const ExampleButton: FunctionComponent = () => {
  const [loading, setLoading] = useState(false)
  const { setText, setFile, flash } = useStore((state) => ({
    setText: state.setText,
    setFile: state.setFile,
    flash: state.flash,
  }))

  const loadSample = useCallback(() => {
    setLoading(true)
    fetch("/sample1.txt")
      .then((res) => res.text())
      .then(setText)
      .catch((err) => {
        flash(err.message || "Could not load example data, sorry")
      })
      .finally(() => setLoading(false))

    setFile({ name: "example1.txt", fake: true })
  }, [])

  return (
    <Tippy
      content="Load sample data for testing & experimenting with the chunker"
      placement="bottom"
      disabled={loading}
    >
      <button
        onClick={loadSample}
        disabled={loading}
        className={classNames("btn btn--nav", {
          "btn--loading": loading,
          "btn--gray": !loading,
        })}
      >
        {loading ? (
          <Battery100 size={24} className="animate-pulse" />
        ) : (
          "Example"
        )}
      </button>
    </Tippy>
  )
}

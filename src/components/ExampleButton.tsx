import { Battery100, Check } from "@styled-icons/heroicons-solid"
import Tippy from "@tippyjs/react"
import classNames from "classnames"
import {
  FunctionComponent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react"
import { FakeFile } from "../hooks/useChunker"
import { useStore } from "../hooks/useStore"

export const ExampleButton: FunctionComponent = () => {
  const { file, setFile, setText, flash } = useStore((state) => ({
    file: state.file,
    setText: state.setText,
    setFile: state.setFile,
    flash: state.flash,
  }))

  const [loading, setLoading] = useState<"none" | "loading" | "done">("none")

  useEffect(() => {
    if (file && (file as FakeFile)?.fake) {
      setLoading("done")
    } else {
      setLoading("none")
    }
  }, [file])

  const loadSample = useCallback(() => {
    setLoading("loading")
    fetch("/sample1.txt")
      .then((res) => res.text())
      .then(setText)
      .then(() => setFile({ name: "example1.txt", fake: true }))
      .catch((err) => {
        flash(err.message || "Could not load example data, sorry")
        setLoading("none")
      })
  }, [])

  const content = useMemo(() => {
    switch (loading) {
      case "none":
        return "Example"
      case "loading":
        return (
          <Battery100
            size={24}
            className="motion-safe:animate-bounce motion-reduce:animate-pulse"
          />
        )
      case "done":
        return <Check size={24} />
    }
  }, [loading])

  return (
    <Tippy
      content="Load sample data for testing & experimenting with the chunker"
      placement="bottom"
      disabled={loading !== "none"}
    >
      <button
        onClick={loadSample}
        disabled={loading !== "none"}
        className={classNames("btn btn--nav", {
          "btn--loading": loading === "loading",
          "btn--disabled": loading === "done",
          "btn--gray": loading === "none",
        })}
      >
        {content}
      </button>
    </Tippy>
  )
}

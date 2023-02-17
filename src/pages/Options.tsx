import { FunctionComponent } from "react"
import { Link } from "react-router-dom"
import { OptionsHandler } from "../components/OptionsHandler"
import { useLoading } from "../hooks/useLoading"

export const Options: FunctionComponent = () => {
  switch (useLoading()) {
    case "none":
      return (
        <p>
          No file,{" "}
          <Link className="text-yellow-500" to="/">
            go back.
          </Link>
        </p>
      )
    case "reading":
    case "parsing":
      return <p>Loading...</p>
    case "chunking":
    case "done":
      return <OptionsHandler />
  }
}

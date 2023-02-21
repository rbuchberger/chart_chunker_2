import { FunctionComponent } from "react"
import { Link } from "react-router-dom"
import { NavBar } from "../components/NavBar"
import { useStore } from "../hooks/useStore"

export const Root: FunctionComponent = () => {
  const { file } = useStore()

  return (
    <>
      <NavBar
        right={
          file ? (
            <Link className="btn btn--nav btn--yellow" to="/options">
              Next
            </Link>
          ) : (
            <div className="btn btn--nav btn--disabled">Next</div>
          )
        }
      />

      <p className="col-span-5 col-start-2 pl-3 text-sm text-gray-50">
        I will look for a line that says RESULTS TABLE, and read everything
        below it.
      </p>
    </>
  )
}

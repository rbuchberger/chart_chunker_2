import { FaceFrown } from "@styled-icons/heroicons-solid/FaceFrown"
import { FunctionComponent, useEffect, useMemo } from "react"
import { isRouteErrorResponse, useRouteError } from "react-router-dom"

export const Error: FunctionComponent = () => {
  const error = useRouteError()

  useEffect(() => console.error(error), [error])

  const message = useMemo(() => {
    if (isRouteErrorResponse(error)) {
      switch (error.status) {
        case 404:
          return "404 - Page not found"
        case 500:
          return "500 - Internal server error"
        default:
          return "Sorry, something went wrong"
      }
    } else {
      return "Sorry, something went wrong."
    }
  }, [error])

  return (
    <div className="flex flex-col gap-12 py-12">
      <div className="text-center">
        <FaceFrown size={128} />
      </div>
      <h2 className="text-center text-2xl font-light">{message}</h2>
      <a href="/" className="text-center text-yellow-400">
        Start over
      </a>
    </div>
  )
}

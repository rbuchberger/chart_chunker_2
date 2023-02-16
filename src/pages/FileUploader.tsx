import { AdjustmentsVertical } from "@styled-icons/heroicons-solid"
import classNames from "classnames"
import { FunctionComponent } from "react"
import { Link } from "react-router-dom"
import { useStore } from "../hooks/useStore"

export const FileUploader: FunctionComponent = () => {
  const { file, setFile } = useStore((state) => state)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0])
      history.pushState({}, "", "/options")
    } else {
      setFile(null)
      history.pushState({}, "", "/")
    }
  }

  const enableNext = !!file

  return (
    <form className="flex flex-col gap-5">
      <label htmlFor="file" className="text-3xl text-gray-50">
        Can I see your data?
      </label>
      <div className="flex w-full gap-3">
        <input
          type="file"
          id="file"
          className="flex-grow rounded-md border border-gray-50 p-2"
          onChange={handleChange}
        />

        {enableNext && (
          <Link
            className={classNames(
              "flex w-48 items-center justify-center gap-3 rounded-md border border-gray-50 text-xl",
              { "bg-yellow-500 text-white": enableNext }
            )}
            to="/options"
          >
            Go
            <AdjustmentsVertical width={24} />
          </Link>
        )}
      </div>
      <p className="text-sm text-gray-50">
        I will look for a line that says RESULTS TABLE, and read everything
        below it.
      </p>
    </form>
  )
}

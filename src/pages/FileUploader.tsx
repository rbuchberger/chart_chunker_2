import classNames from "classnames"
import { FunctionComponent } from "react"
import { useNavigate } from "react-router-dom"
import { useStore } from "../hooks/useStore"

export const FileUploader: FunctionComponent = () => {
  const { file, setFile } = useStore((state) => state)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0])
    } else {
      setFile(null)
    }
  }

  const enableNext = !!file
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!enableNext) return

    navigate("/options")
  }

  return (
    <form className="grid grid-cols-6 gap-x-6 gap-y-2" onSubmit={handleSubmit}>
      <h2 className="col-span-6 text-3xl text-gray-50">Can I see your data?</h2>

      <label
        htmlFor="file"
        className="col-span-5 grid cursor-pointer grid-cols-5 flex-row"
      >
        <div
          className={classNames("rounded-l-md px-3 py-2", {
            "bg-yellow-600  hover:bg-yellow-500": !enableNext,
            "bg-gray-500 text-gray-50 hover:bg-gray-600": enableNext,
          })}
        >
          Choose File
        </div>

        <div
          className={classNames(
            "col-span-4 flex flex-row items-center rounded-r-md border border-l-0 px-3 font-mono",
            {
              "border-gray-500": enableNext,
              "border-yellow-600": !enableNext,
            }
          )}
        >
          <div className="self-center">{file ? file.name : "No file"}</div>
        </div>
      </label>

      <input type="file" id="file" className="hidden" onChange={handleChange} />

      <input
        type="submit"
        value="Go"
        className={classNames("rounded-md border border-gray-50 text-xl", {
          "cursor-pointer bg-yellow-600 text-white hover:bg-yellow-500":
            enableNext,
          "bg-gray-500 text-gray-200": !enableNext,
        })}
      />

      <p className="col-span-5 col-start-2 pl-3 text-sm text-gray-50">
        I will look for a line that says RESULTS TABLE, and read everything
        below it.
      </p>
    </form>
  )
}

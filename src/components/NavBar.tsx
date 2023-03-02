import Tippy from "@tippyjs/react"
import "tippy.js/dist/tippy.css"
import classNames from "classnames"
import { FunctionComponent } from "react"
import { useStore } from "../hooks/useStore"

export const NavBar: FunctionComponent<{
  right?: React.ReactNode
  left?: React.ReactNode
}> = ({
  right = <div className="w-32" />,
  left = <div className="w-32" />,
}) => {
  const { file, setFile } = useStore((state) => ({
    file: state.file,
    setFile: state.setFile,
  }))

  const enableNext = !!file

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0])
    } else {
      setFile(null)
    }
  }

  return (
    <div className="flex w-full flex-row justify-between gap-2 sm:gap-10">
      {left}

      <Tippy
        content="It will look for a line that says RESULTS TABLE, and read everything below it as CSV."
        disabled={!!file}
        placement="bottom"
      >
        <label
          htmlFor="file"
          className="flex flex-grow cursor-pointer flex-row"
        >
          <input
            type="file"
            id="file"
            className="hidden"
            onChange={handleChange}
          />
          <div
            className={classNames(
              "whitespace-nowrap rounded-l-md px-3 py-2 transition-colors",
              {
                "bg-yellow-600  hover:bg-yellow-500": !enableNext,
                "bg-gray-500 text-gray-50 hover:bg-gray-600": enableNext,
              }
            )}
          >
            Choose File
          </div>

          <div
            className={classNames(
              "col-span-4 flex flex-grow flex-row items-center rounded-r-md border border-l-0 px-3 font-mono",
              {
                "border-gray-500": enableNext,
                "border-yellow-600": !enableNext,
              }
            )}
          >
            <div>{file ? file.name : ""}</div>
          </div>
        </label>
      </Tippy>

      {right}
    </div>
  )
}

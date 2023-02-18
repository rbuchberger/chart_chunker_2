import { ChangeEvent, FunctionComponent, useCallback } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useStore } from "../hooks/useStore"
import { ColumnSelectBox } from "../primitives/ColumnSelectBox"
import { ChunkerPreview } from "./ChunkerPreview"

export const OptionsHandler: FunctionComponent = () => {
  const { config, setConfig, parser, file, chunkWorker } = useStore()
  const navigate = useNavigate()

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      setConfig({
        ...config,
        [event.target.name]: event.target.value,
      })
    },
    [config]
  )

  const handleColumnToggle = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const index = parseInt(
        event.currentTarget.getAttribute("data-index") || ""
      )

      if (event.target.checked && !config.keptColumns.includes(index)) {
        setConfig({
          ...config,
          keptColumns: config.keptColumns.concat(index),
        })
      } else {
        setConfig({
          ...config,
          keptColumns: config.keptColumns.filter((x) => x !== index),
        })
      }
    },
    [config]
  )

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    navigate("/presenter")

    // The chart on the next screen has a nice animation, but receiving
    // the full message gives it a noticeable stutter. The timeout lets it
    // finish, hiding the stutter.
    setTimeout(() => chunkWorker.postMessage({ returnFull: true }), 600)
  }

  // Loading state check on options page should prevent this, but let's keep
  // TS happy
  if (!file || !parser) return null

  return (
    <form className="flex flex-col items-center gap-10" onSubmit={handleSubmit}>
      <div className="flex w-full flex-row justify-between gap-10">
        <Link
          to="/"
          className="w-32 shrink-0 cursor-pointer rounded-md border border-gray-50 bg-gray-600 py-3 text-center text-xl hover:bg-gray-500"
        >
          Back
        </Link>
        <Link
          to="/"
          className="min-w-[8rem] overflow-hidden overflow-ellipsis rounded-md border border-gray-50 px-6 py-2 text-center font-mono text-3xl font-light"
        >
          {file.name}
        </Link>

        <input
          type="submit"
          value="Next"
          className="w-32 shrink-0 cursor-pointer rounded-md border border-gray-50 bg-yellow-600 text-center text-xl hover:bg-yellow-500"
        />
      </div>

      <div className="grid gap-10 sm:grid-cols-3">
        <ColumnSelectBox
          name="splitBasis"
          label="Detect cycles based on"
          columns={parser.columnItems}
          value={config.splitBasis}
          onChange={handleChange}
        />

        <ColumnSelectBox
          name="voltageColumn"
          label="Voltage"
          value={config.voltageColumn}
          columns={parser.columnItems}
          onChange={handleChange}
        />

        <ColumnSelectBox
          name="spcColumn"
          label="Specific Capacity"
          value={config.spcColumn}
          columns={parser.columnItems}
          onChange={handleChange}
        />
      </div>

      <ChunkerPreview />

      <section className="flex flex-col gap-6 rounded-md bg-gray-600 p-7">
        <h2 className="text-2xl">Which columns would you like to keep?</h2>

        <ul className="grid gap-x-6 gap-y-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {parser.columns.map((col, index) => (
            <li key={index} className="grow rounded-md bg-gray-600">
              <label className="flex h-full cursor-pointer items-center whitespace-nowrap px-2 py-1 font-mono text-sm leading-5">
                <input
                  type="checkbox"
                  className="rounded-full text-yellow-500 focus:ring-yellow-500"
                  name={col}
                  data-index={index}
                  onChange={handleColumnToggle}
                  checked={config.keptColumns.includes(index)}
                />
                <div className="select-none overflow-hidden overflow-ellipsis px-2 pt-1">
                  {col}
                </div>
              </label>
            </li>
          ))}
        </ul>
      </section>
    </form>
  )
}

import { ChangeEvent, FunctionComponent, useCallback } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useStore } from "../hooks/useStore"
import { ColumnSelectBox } from "../primitives/ColumnSelectBox"
import { ChunkerPreview } from "./ChunkerPreview"

export const OptionsHandler: FunctionComponent = () => {
  const { config, setConfig, parser, file } = useStore()
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

    navigate("/")
  }

  // Loading state check on options page should prevent this, but let's keep
  // TS happy
  if (!file || !parser) return null

  return (
    <form className="flex flex-col items-center gap-10" onSubmit={handleSubmit}>
      <div className="grid w-full grid-cols-6 gap-10">
        <Link
          to="/"
          className="col-span-1 cursor-pointer rounded-md border border-gray-50 bg-gray-600 py-3 text-center text-xl hover:bg-gray-500"
        >
          Back
        </Link>
        <Link
          to="/"
          className="col-span-2 col-start-3 rounded-md border border-gray-50 px-3 py-2 text-center font-mono text-3xl font-light"
        >
          {file.name}
        </Link>

        <input
          type="submit"
          value="Go"
          className="col-span-1 col-start-6 cursor-pointer rounded-md border border-gray-50 bg-yellow-600  text-center text-xl hover:bg-yellow-500"
        />
      </div>

      <div className="grid grid-cols-3 gap-10">
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

      <div className="grid w-full grid-cols-3 gap-2">
        <div />
        <ChunkerPreview />
        <div />
      </div>

      <section className="flex flex-col gap-6 rounded-md bg-gray-600 p-7">
        <h2 className="text-2xl">Which columns would you like to keep?</h2>

        <ul className="grid grid-cols-4 gap-x-4 gap-y-2">
          {parser.columns.map((col, index) => (
            <li key={index}>
              <input
                type="checkbox"
                name={col}
                data-index={index}
                onChange={handleColumnToggle}
                checked={config.keptColumns.includes(index)}
              />
              <label htmlFor={col} className="px-3 font-mono text-sm">
                {col}
              </label>
            </li>
          ))}
        </ul>
      </section>
    </form>
  )
}

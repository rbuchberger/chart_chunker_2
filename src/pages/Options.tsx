import { ChangeEvent, FunctionComponent, useCallback } from "react"
import { Link } from "react-router-dom"
import { useStore } from "../hooks/useStore"
import { ColumnSelectBox } from "../primitives/ColumnSelectBox"
import { ChunkerPreview } from "../components/ChunkerPreview"
import { NavBar } from "../components/NavBar"

export const Options: FunctionComponent = () => {
  const { config, setConfig, parser, file, chunkWorker } = useStore()

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

  const getFull = () => {
    setTimeout(() => chunkWorker.postMessage({ returnFull: true }), 600)
  }

  // Loading state check on options page should prevent this, but let's keep
  // TS happy
  if (!file || !parser) return null

  return (
    <form className="flex flex-col items-center gap-10">
      <NavBar
        left={
          <Link to="/" className="btn btn--nav btn--gray">
            Back
          </Link>
        }
        right={
          <Link
            to="/presenter"
            onClick={getFull}
            className="btn btn--nav btn--yellow"
          >
            Next
          </Link>
        }
      />

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

import { ChangeEvent, FunctionComponent, useCallback } from "react"
import { Link } from "react-router-dom"
import { useStore } from "../hooks/useStore"
import { ColumnSelectBox } from "../primitives/ColumnSelectBox"
import { ChunkerPreview } from "../components/ChunkerPreview"
import { NavBar } from "../components/NavBar"
import { useLoading } from "../hooks/useLoading"
import Tippy from "@tippyjs/react"
import "tippy.js/dist/tippy.css" // optional

export const Options: FunctionComponent = () => {
  const { config, setConfig, parser } = useStore()

  const loading = useLoading()

  const navBar = (
    <NavBar
      left={
        <Link to="/" className="btn btn--nav btn--gray">
          Back
        </Link>
      }
      right={
        parser ? (
          <Link to="/presenter" className="btn btn--nav btn--yellow">
            Next
          </Link>
        ) : (
          <div className="btn btn--nav btn--disabled">Next</div>
        )
      }
    />
  )

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

  if (!parser)
    return (
      <>
        {navBar}
        <h2 className="py-12 text-center text-2xl">
          {loading === "none" ? "Please Select a file." : "Working..."}
        </h2>
      </>
    )

  return (
    <form className="flex flex-col items-center gap-10">
      {navBar}

      <div className="grid gap-10 sm:grid-cols-3">
        <ColumnSelectBox
          name="splitBasis"
          label="Detect cycles based on"
          columns={parser.columnItems}
          value={config.splitBasis}
          onChange={handleChange}
          helpText="Cycles will be separated whenever this column switches between positive and negative. Lines where it's zero are discarded."
        />

        <ColumnSelectBox
          name="voltageColumn"
          label="Voltage"
          helpText="Used to show the max & min voltages"
          value={config.voltageColumn}
          columns={parser.columnItems}
          onChange={handleChange}
        />

        <ColumnSelectBox
          name="spcColumn"
          label="Specific Capacity"
          helpText="Used to calculate charge efficiency & retention"
          value={config.spcColumn}
          columns={parser.columnItems}
          onChange={handleChange}
        />
      </div>

      <ChunkerPreview />

      <section className="flex flex-col gap-6 rounded-md bg-gray-600 p-7">
        <Tippy content="Selected columns will be included in the final data.">
          <h2 className="text-2xl">Which columns would you like to keep?</h2>
        </Tippy>

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

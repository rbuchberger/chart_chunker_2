import { ChangeEvent, FunctionComponent, useCallback } from "react"
import { Link } from "react-router-dom"
import { useStore } from "../hooks/useStore"
import { ColumnSelectBox } from "../primitives/ColumnSelectBox"
import { ChunkerPreview } from "../components/ChunkerPreview"
import { NavBar } from "../components/NavBar"
import Tippy from "@tippyjs/react"
import "tippy.js/dist/tippy.css"
import { LoadingSpinner } from "../components/LoadingSpinner"
import { ColumnSettingsItem } from "../components/ColumnSettingsItem"
import { useLoading } from "../hooks/useLoading"
import { ArrowPath } from "@styled-icons/heroicons-solid"

export const Options: FunctionComponent = () => {
  const { config, updateConfig, resetConfig, parser } = useStore((state) => ({
    config: state.config,
    updateConfig: state.updateConfig,
    resetConfig: state.resetConfig,
    parser: state.parser,
  }))

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

  const handleChange = useCallback((event: ChangeEvent<HTMLSelectElement>) => {
    updateConfig({ [event.target.name]: event.target.value })
  }, [])

  switch (useLoading()) {
    case "none":
      return (
        <>
          {navBar}
          <h2 className="py-12 text-center text-2xl">Please Select a file.</h2>
        </>
      )
    case "reading":
    case "parsing":
      return (
        <>
          {navBar}
          <LoadingSpinner />
        </>
      )
  }

  // Switch case above will ensure this doesn't happen, but TS doesn't know that.
  if (!parser) return <></>

  return (
    <form className="flex flex-col items-center gap-10">
      {navBar}

      <div className="flex flex-wrap justify-center gap-6">
        <Tippy
          content="Does the first cycle begin with a charge or a discharge? If set to the opposite value from what is detected, the first will only be a half-cycle."
          placement="bottom"
        >
          <label className="text-sm flex cursor-pointer select-none flex-col items-center justify-between font-medium text-gray-300">
            Charge first?
            <input
              className="ml-2 mb-3 h-6 w-6 rounded-full text-yellow-500"
              type="checkbox"
              name="chargeFirst"
              checked={config.chargeFirst}
              onChange={(e) => updateConfig({ chargeFirst: e.target.checked })}
            />
          </label>
        </Tippy>

        <ColumnSelectBox
          name="splitBasis"
          label="Detect cycles based on"
          columns={parser.columnItems}
          value={config.splitBasis}
          onChange={handleChange}
          helpText="Which column should be used to find cycles? They will be separated whenever this column switches between positive and negative. Lines where it's zero are discarded."
        />

        <ColumnSelectBox
          name="voltageColumn"
          label="Voltage"
          helpText="Which column shows the voltage you are interested in? It's used to show min & max values."
          value={config.vCol}
          columns={parser.columnItems}
          onChange={handleChange}
        />

        <ColumnSelectBox
          name="spcColumn"
          label="Specific Capacity"
          helpText="Which column shows the specific capacity you are interested in? It's used to calculate capacity and retention."
          value={config.spcCol}
          columns={parser.columnItems}
          onChange={handleChange}
        />

        <Tippy
          placement="bottom"
          content="Reset all settings to their default values."
        >
          <label className="flex cursor-pointer select-none flex-col items-center justify-between font-medium text-gray-300 text-sm">
            Reset
            <button
              onClick={(e) => {
                e.preventDefault()
                resetConfig()
              }}
            >
              <ArrowPath size={24} />
            </button>
          </label>
        </Tippy>
      </div>

      <ChunkerPreview />

      <section className="flex flex-col gap-6 rounded-md bg-gray-600 p-7">
        <div className="flex">
          <Tippy content="These settings apply when you copy cycle data (not analysis)">
            <h2 className="text-2xl">How do you want your data?</h2>
          </Tippy>
        </div>

        <ul className="flex flex-col gap-y-3">
          <li className="grid grid-cols-5 gap-4">
            <div className="col-span-2 flex">
              <Tippy content="Columns not selected will be ignored.">
                <h3 className="">Included?</h3>
              </Tippy>
            </div>
            <div className="col-span-2 flex">
              <Tippy content="Set a new name for column headers.">
                <h3 className="">Renamed?</h3>
              </Tippy>
            </div>

            <div className="flex">
              <Tippy content="Multiply all values by some coefficient.">
                <h3 className="">Multiplied?</h3>
              </Tippy>
            </div>
          </li>
          {parser.columns.map((col, index) => (
            <ColumnSettingsItem key={index} index={index} col={col} />
          ))}
        </ul>
      </section>
    </form>
  )
}

import "tippy.js/dist/tippy.css"

import { ArrowPath } from "@styled-icons/heroicons-solid"
import Tippy from "@tippyjs/react"
import { Field, Form, Formik } from "formik"
import { FunctionComponent } from "react"
import { Link } from "react-router-dom"

import { ChunkerPreview } from "../components/ChunkerPreview"
import { ColumnSettingsItem } from "../components/ColumnSettingsItem"
import { ColumnToggle } from "../components/ColumnToggle"
import { LoadingSpinner } from "../components/LoadingSpinner"
import { NavBar } from "../components/NavBar"
import { useLoading } from "../hooks/useLoading"
import { useStore } from "../hooks/useStore"
import { ColumnSelectBox } from "../primitives/ColumnSelectBox"

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

  const unkeptCols = parser?.columns
    .map((col, i) => {
      return { rawName: col, index: i }
    })
    .filter((_c, i) => !config.keptCols.find((kc) => kc.index === i))

  // Switch case above will ensure this doesn't happen, but TS doesn't know that.
  if (!parser) return <></>

  return (
    <div className="flex flex-col items-center gap-10">
      {navBar}

      <Formik initialValues={config} onSubmit={updateConfig}>
        {(provided) => {
          return (
            <Form
              onChange={provided.submitForm}
              className="flex flex-col flex-wrap justify-center gap-6 md:flex-row"
            >
              <Tippy
                content="Does the first cycle begin with a charge or a discharge? If set to the opposite value from what is detected, the first will only be a half-cycle."
                placement="bottom"
              >
                <label className="flex cursor-pointer select-none flex-col items-center justify-between whitespace-nowrap text-sm font-medium text-gray-300">
                  Charge first?
                  <Field
                    className="ml-2 mb-3 h-6 w-6 rounded-full text-yellow-500"
                    type="checkbox"
                    name="chargeFirst"
                  />
                </label>
              </Tippy>

              <ColumnSelectBox
                name="splitBasis"
                label="Detect cycles based on"
                columns={parser.columnItems}
                helpText="Which column should be used to find cycles? They will be separated whenever this column switches between positive and negative. Lines where it's zero are discarded."
              />

              <ColumnSelectBox
                name="vCol"
                label="Voltage"
                helpText="Which column shows the voltage you are interested in? It's used to show min & max values."
                columns={config.keptCols}
              />

              <ColumnSelectBox
                name="spcCol"
                label="Specific Capacity"
                helpText="Which column shows the specific capacity you are interested in? It's used to calculate capacity and retention."
                columns={config.keptCols}
              />

              <Tippy
                placement="bottom"
                content="Reset all settings to their default values."
              >
                <label className="flex cursor-pointer select-none flex-col items-center justify-between whitespace-nowrap text-sm font-medium text-gray-300">
                  Reset to Defaults
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      provided.resetForm()
                      resetConfig()
                    }}
                  >
                    <ArrowPath size={24} />
                  </button>
                </label>
              </Tippy>
            </Form>
          )
        }}
      </Formik>

      <ChunkerPreview />

      <section className="flex flex-col gap-6 rounded-md bg-gray-600 p-7">
        <div className="flex">
          <Tippy content="These settings apply when you copy cycle data (not analysis)">
            <h2 className="text-2xl">How do you want your data?</h2>
          </Tippy>
        </div>
        <ul className="flex flex-col gap-8">
          {config.keptCols.map((_, index) => (
            <ColumnSettingsItem key={index} keptColIndex={index} />
          ))}
        </ul>

        <hr className="border-gray-500" />

        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {unkeptCols?.map((col) => (
            <ColumnToggle
              key={col.index}
              index={col.index}
              name={col.rawName}
            />
          ))}
        </ul>
      </section>
    </div>
  )
}

import "tippy.js/dist/tippy.css"

import {
  Clipboard,
  MagnifyingGlassMinus,
  MagnifyingGlassPlus,
} from "@styled-icons/heroicons-solid"
import Tippy from "@tippyjs/react"
import Papa from "papaparse"
import { FunctionComponent, useState } from "react"
import { Link } from "react-router-dom"

import Concatenator from "../chunker/concatenator"
import { ChunkerDetails } from "../components/ChunkerDetails"
import { LoadingSpinner } from "../components/LoadingSpinner"
import { NavBar } from "../components/NavBar"
import { OverviewChart } from "../components/OverviewChart"
import { useLoading } from "../hooks/useLoading"
import { useStore } from "../hooks/useStore"
import { DataTable } from "../primitives/DataTable"
import { Panes } from "../primitives/Panes"

export const Presenter: FunctionComponent = () => {
  const { chunker, flash } = useStore((state) => ({
    chunker: state.chunker,
    flash: state.flash,
  }))

  const [selectedCycle, setSelectedCycle] = useState(0)

  const loading = useLoading()

  if (!chunker?.overview)
    return (
      <>
        <NavBar
          left={
            <Link className="btn btn--nav btn--gray" to="/">
              Back
            </Link>
          }
        />

        {loading === "none" ? (
          <h2 className="py-12 text-center text-2xl">Please Select a file.</h2>
        ) : (
          <LoadingSpinner />
        )}
      </>
    )

  const copyAll = () => {
    if (!chunker) {
      flash({
        kind: "error",
        content: "No data to copy. This shouldn't happen, sorry about that.",
      })

      return
    }

    const concatenated = new Concatenator(chunker.cycles || []).concatenated

    const text = Papa.unparse(concatenated, {
      delimiter: "\t",
    })

    navigator.clipboard
      .writeText(text)
      .then(() =>
        flash({ kind: "success", content: "Copied all data to clipboard" })
      )
      .catch(() =>
        flash({ kind: "error", content: "Unable to copy data. Sorry :(" })
      )
  }

  const buttons = [
    {
      name: "overview",
      content: (
        <>
          <MagnifyingGlassMinus size={24} />
          <div>Overview</div>
        </>
      ),
    },
    {
      name: "details",
      content: (
        <>
          <MagnifyingGlassPlus size={24} />
          <div>Details</div>
        </>
      ),
    },
  ]

  const panes = {
    overview: (
      <DataTable
        headers={chunker.overview.headers}
        lines={chunker.overview.lines}
        title="Analysis"
      />
    ),
    details: (
      <ChunkerDetails
        selectedCycle={selectedCycle}
        setSelectedCycle={setSelectedCycle}
      />
    ),
  }

  return (
    <div className="flex flex-col gap-12">
      <NavBar
        left={
          <Link to="/options" className="btn btn--nav btn--gray">
            Back
          </Link>
        }
        right={
          <Tippy
            placement="bottom"
            content="Copy all cycles to the clipboard, side-by-side, in tab-separated CSV."
          >
            <button onClick={copyAll} className="btn btn--nav btn--gray">
              <Clipboard size={18} />
              Copy All
            </button>
          </Tippy>
        }
      />

      <div className="mx-auto flex flex-col gap-12">
        <OverviewChart chunkerOverview={chunker.overview} width={400} />

        <h2 className="text-center text-2xl">
          {chunker.overview.cycleCount} cycles
        </h2>
      </div>

      <Panes buttons={buttons} panes={panes} />
    </div>
  )
}

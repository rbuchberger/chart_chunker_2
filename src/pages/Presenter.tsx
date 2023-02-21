import { FunctionComponent, useState } from "react"
import { Link } from "react-router-dom"
import { useStore } from "../hooks/useStore"
import { OverviewChart } from "../components/OverviewChart"
import {
  MagnifyingGlassMinus,
  MagnifyingGlassPlus,
} from "@styled-icons/heroicons-solid"
import { Panes } from "../primitives/Panes"
import { ChunkerDetails } from "../components/ChunkerDetails"
import { NavBar } from "../components/NavBar"
import { Clipboard } from "@styled-icons/heroicons-solid"
import { DataTable } from "../primitives/DataTable"
import Concatenator from "../chunker/concatenator"
import Papa from "papaparse"
import { useLoading } from "../hooks/useLoading"

export const Presenter: FunctionComponent = () => {
  const { chunker } = useStore()
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

        <h2 className="py-12 text-center text-2xl">
          {loading === "none" ? "Please Select a file." : "Working..."}
        </h2>
      </>
    )

  const copyAll = () => {
    if (!chunker) return

    const concatenated = new Concatenator(chunker.cycles || []).concatenated

    const text = Papa.unparse(concatenated, {
      delimiter: "\t",
    })

    navigator.clipboard.writeText(text)
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
          <button onClick={copyAll} className="btn btn--nav btn--gray">
            <Clipboard size={18} />
            Copy All
          </button>
        }
      />

      <div className="mx-auto max-w-4xl">
        <OverviewChart chunkerOverview={chunker.overview} width={400} />

        <h2 className="text-center text-2xl">
          {chunker.overview.cycleCount} cycles
        </h2>
      </div>

      <Panes buttons={buttons} panes={panes} />
    </div>
  )
}

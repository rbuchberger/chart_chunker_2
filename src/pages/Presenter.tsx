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

export const Presenter: FunctionComponent = () => {
  const { chunkerOverview, chunker } = useStore()
  const [selectedCycle, setSelectedCycle] = useState(0)

  if (!chunkerOverview) return <p>loading...</p>

  const copyText = (text?: string) => {
    if (text) navigator.clipboard.writeText(text)
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
        headers={chunkerOverview.headers}
        lines={chunkerOverview.lines}
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
          <button
            onClick={() => copyText(chunker?.unparsed)}
            className="btn btn--nav btn--gray"
          >
            <Clipboard size={18} />
            Copy All
          </button>
        }
      />

      <div className="mx-auto max-w-4xl">
        <OverviewChart chunkerOverview={chunkerOverview} width={400} />

        <h2 className="text-center text-2xl">
          {chunkerOverview.cycleCount} cycles
        </h2>
      </div>

      <Panes buttons={buttons} panes={panes} />
    </div>
  )
}

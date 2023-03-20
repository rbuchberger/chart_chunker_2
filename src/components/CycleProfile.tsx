import Tippy from "@tippyjs/react"
import { ceil, floor, max, min, zip } from "lodash-es"
import { FunctionComponent, useMemo, useState } from "react"
import {
  Dot,
  Legend,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import { PartialCycle } from "../chunker/buildCycle"
import { useStore } from "../hooks/useStore"

export const CycleProfile: FunctionComponent<{
  cycle: PartialCycle
}> = ({ cycle }) => {
  const { config, chunker } = useStore((state) => {
    return {
      config: state.config,
      chunker: state.chunker,
    }
  })
  const { keptCols, spcCol, vCol, chargeFirst } = config || { keptCols: [] }

  const [flip, setFlip] = useState(false)

  const minMaxes = useMemo(() => {
    const vals = chunker?.cycles.map((cycle) => {
      return {
        maxV: max([cycle.charge?.maxV, cycle.discharge?.maxV]),
        minV: min([cycle.charge?.minV, cycle.discharge?.minV]),
        maxCsp: max([cycle.charge?.maxCsp, cycle.discharge?.maxCsp]),
        minCsp: min([cycle.charge?.minCsp, cycle.discharge?.minCsp]),
      }
    })

    if (!vals)
      return {
        maxV: undefined,
        minV: undefined,
        maxCsp: undefined,
        minCsp: undefined,
      }

    return {
      maxV: ceil(max(vals.map((val) => val.maxV)) || 0, 1),
      minV: floor(min(vals.map((val) => val.minV)) || 0, 1),
      maxCsp: ceil(max(vals.map((val) => val.maxCsp)) || 0, 1),
      minCsp: floor(min(vals.map((val) => val.minCsp)) || 0, 1),
    }
  }, [chunker?.cycles])

  const colNums = useMemo(() => {
    const offset = keptCols.length
    const chargeOffset = chargeFirst ? 0 : offset
    const dischargeOffset = chargeFirst ? offset : 0
    return {
      chargeCsp:
        chargeOffset + keptCols.findIndex(({ index }) => index == spcCol),
      dischargeCsp:
        dischargeOffset + keptCols.findIndex(({ index }) => index == spcCol),
      chargeV: chargeOffset + keptCols.findIndex(({ index }) => index == vCol),
      dischargeV:
        dischargeOffset + keptCols.findIndex(({ index }) => index == vCol),
    }
  }, [chargeFirst, keptCols, spcCol, vCol])

  const [chargeData, dischargeData] = useMemo(() => {
    type Point = { x: number; y: number }

    // It's easier to keep discharge data separated in case we need to flip it.
    const dischargeX: number[] = []
    const dischargeY: number[] = []

    const chargeData: Point[] = []
    const dischargeData: Point[] = []
    cycle.processedLines.slice(1).forEach((line) => {
      if (
        line[colNums.chargeCsp] !== undefined &&
        line[colNums.chargeV] !== undefined
      ) {
        chargeData.push({
          x: line[colNums.chargeCsp] as number,
          y: line[colNums.chargeV] as number,
        })
      }

      if (
        line[colNums.dischargeCsp] !== undefined &&
        line[colNums.dischargeV] !== undefined
      ) {
        dischargeX.push(line[colNums.dischargeCsp] as number)
        dischargeY.push(line[colNums.dischargeV] as number)
      }
    })
    let offset = 0
    if (flip) {
      offset =
        (chargeData[chargeData.length - 1]?.x || 0) -
        (dischargeX?.[dischargeX?.length - 1] || 0)

      dischargeY.reverse()
    }

    zip(dischargeX, dischargeY).forEach(([x, y]) => {
      dischargeData.push({ x: (x as number) + offset, y: y as number })
    })
    return [chargeData, dischargeData]
  }, [
    cycle.processedLines,
    flip,
    colNums.chargeCsp,
    colNums.chargeV,
    colNums.dischargeCsp,
    colNums.dischargeV,
  ])

  if (!chunker) return <></>

  return (
    <div className="flex flex-col items-center justify-center gap-5 md:flex-row">
      <Tippy content="Reverse discharge x values, and offset so the last point of charge & discharge match">
        <label className="flex cursor-pointer flex-row items-center gap-2">
          <div>Flip discharge?</div>
          <input
            className="rounded-full text-yellow-400 focus:ring-yellow-400"
            type="checkbox"
            checked={flip}
            onChange={(e) => setFlip(e.target.checked)}
          />
        </label>
      </Tippy>
      <ScatterChart width={500} height={300} className="">
        <XAxis
          dataKey="x"
          type="number"
          name="Csp"
          stroke="#DDD"
          unit="mAh/g"
          domain={[minMaxes.minCsp || "dataMin", minMaxes.maxCsp || "dataMax"]}
        />
        <YAxis
          dataKey="y"
          type="number"
          name="Potential"
          stroke="#DDD"
          unit="V"
          domain={[minMaxes.minV || "dataMin", minMaxes.maxV || "dataMax"]}
        />
        <Legend />
        <Tooltip
          cursor={{ strokeDasharray: "3 3" }}
          contentStyle={{
            borderRadius: "5px",
            backgroundColor: "#DDD",
            color: "#333",
          }}
        />
        <Scatter
          name="Charge"
          data={chargeData}
          fill="#eab308"
          line={{ stroke: "#eab308", strokeWidth: 1 }}
          isAnimationActive={false}
          shape={<Dot r={2} stroke="#eab308" strokeWidth={1} fill="#eab308" />}
        />
        <Scatter
          name="Discharge"
          data={dischargeData}
          fill="#f9fafb"
          isAnimationActive={false}
          line={{ stroke: "#f9fafb", strokeWidth: 1 }}
          shape={<Dot r={2} stroke="#f9fafb" strokeWidth={1} fill="#f9fafb" />}
        />
      </ScatterChart>
    </div>
  )
}

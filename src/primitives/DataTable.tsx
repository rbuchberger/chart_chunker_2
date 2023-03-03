import {
  ChevronDown,
  ChevronRight,
  Clipboard,
} from "@styled-icons/heroicons-solid"
import Tippy from "@tippyjs/react"
import "tippy.js/dist/tippy.css" // optional
import classNames from "classnames"
import { FunctionComponent, ReactNode, useState } from "react"
import { useTableCopy } from "../hooks/useTableCopy"
import { useStore } from "../hooks/useStore"

export const DataTable: FunctionComponent<{
  headers: ReactNode[]
  lines: ReactNode[][]
  startCollapsed?: boolean
  title?: string
}> = ({ headers, lines, startCollapsed = false, title }) => {
  const flash = useStore((state) => state.flash)
  const [collapsed, setCollapsed] = useState(startCollapsed)
  const copy = useTableCopy
  const toggle = () => setCollapsed(!collapsed)

  const handleCopy = () => {
    copy([headers].concat(lines))
      .then(() => {
        flash({ kind: "success", content: `Copied ${title || "table"}` })
      })
      .catch(() => {
        flash({ kind: "error", content: "Unable to copy table. Sorry :(" })
      })
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row justify-between">
        <h3 className="text-xl">{title}</h3>
        <Tippy
          content={`Copy this ${headers.length}x${lines.length} table to the clipboard in tab-separated CSV format`}
        >
          <button onClick={handleCopy} className="btn btn--gray">
            <Clipboard size={18} />
            Copy this table
          </button>
        </Tippy>
      </div>

      <div className="flex flex-row gap-4 align-top">
        <button
          onClick={toggle}
          className="flex rounded-md bg-gray-600 py-2 px-1 hover:bg-gray-500"
        >
          {collapsed ? <ChevronRight size={24} /> : <ChevronDown size={24} />}
        </button>

        <div className="w-full overflow-y-auto rounded-md bg-gray-600">
          <table className="w-full table-auto text-right">
            <thead onClick={toggle} className="cursor-pointer">
              <tr>
                {headers.map((header, index) => (
                  <th
                    className="max-w-full overflow-x-hidden overflow-ellipsis whitespace-nowrap border-r border-b border-r-gray-500 border-b-gray-200 bg-gray-600 pt-2 align-bottom text-sm"
                    key={index}
                  >
                    <div className="h-full px-2">{header}</div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody
              className={classNames("text-right font-mono text-sm", {
                hidden: collapsed,
                "h-48": !collapsed,
              })}
            >
              {collapsed ||
                lines.map((line, index) => (
                  <tr
                    key={index}
                    className="border-b border-b-gray-500 hover:border-b-white"
                  >
                    {line.map((cell, index) => (
                      <td
                        className="border-r border-r-gray-500 pr-2"
                        key={index}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

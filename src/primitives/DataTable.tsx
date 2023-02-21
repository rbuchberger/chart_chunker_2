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

export const DataTable: FunctionComponent<{
  headers: ReactNode[]
  lines: ReactNode[][]
  startCollapsed?: boolean
  title?: string
}> = ({ headers, lines, startCollapsed = false, title }) => {
  const [collapsed, setCollapsed] = useState(startCollapsed)
  const copy = useTableCopy

  const handleCopy = () => {
    copy([headers].concat(lines))
  }
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row justify-between">
        <h3 className="text-xl">{title}</h3>
        <Tippy
          content={`Copy this ${headers.length}x${lines.length} table to the clipboard`}
        >
          <button onClick={handleCopy} className="btn btn--gray">
            <Clipboard size={18} />
            Copy this table
          </button>
        </Tippy>
      </div>

      <div className="flex flex-row gap-2 align-top">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex rounded-md border border-gray-600"
        >
          {collapsed ? <ChevronRight size={24} /> : <ChevronDown size={24} />}
        </button>

        <div className="w-full overflow-y-auto rounded-md bg-gray-600">
          <table className="w-full table-auto text-right">
            <thead>
              <tr>
                {headers.map((header, index) => (
                  <th
                    className="sticky top-0 max-w-full overflow-x-hidden overflow-ellipsis whitespace-nowrap bg-gray-600 pt-2 align-bottom text-sm"
                    key={index}
                  >
                    <div className="h-full border-b border-r border-b-gray-200 border-r-gray-500 pr-2">
                      {header}
                    </div>
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
                  <tr key={index} className="hover:bg-gray-500">
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

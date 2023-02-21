import Tippy from "@tippyjs/react"
import { ChangeEventHandler, FunctionComponent } from "react"
import "tippy.js/dist/tippy.css" // optional

export const ColumnSelectBox: FunctionComponent<{
  label: string
  name: string
  value: string | number
  onChange: ChangeEventHandler<HTMLSelectElement>
  columns: {
    text: string
    value: string | number
  }[]
  helpText?: string
}> = ({ name, value, onChange, columns, label, helpText }) => {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor="splitBasis">{label}</label>
      <Tippy content={helpText} disabled={!helpText} placement="bottom">
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          className="rounded-md bg-gray-500 font-mono"
        >
          {columns.map((column) => (
            <option key={column.value} value={column.value}>
              {column.text}
            </option>
          ))}
        </select>
      </Tippy>
    </div>
  )
}

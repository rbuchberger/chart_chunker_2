import "tippy.js/dist/tippy.css" // optional

import Tippy from "@tippyjs/react"
import { useField } from "formik"
import { FunctionComponent } from "react"

export const ColumnSelectBox: FunctionComponent<{
  label: string
  name: string
  columns: {
    name?: string
    index: string | number
  }[]
  helpText?: string
}> = ({ columns, label, helpText, ...props }) => {
  const [field, meta, helpers] = useField(props)

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    helpers.setValue(e.target.value === "" ? "" : parseInt(e.target.value))
  }

  return (
    <div className="flex max-w-xs flex-col gap-1">
      <label htmlFor={props.name} className="text-sm">
        {label}
      </label>
      <Tippy content={helpText} disabled={!helpText} placement="bottom">
        <select
          {...field}
          {...props}
          onChange={handleChange}
          className="overflow-hidden rounded-md bg-gray-500 font-mono text-sm"
        >
          <option></option>
          {columns.map((column) => (
            <option key={column.index} value={column.index}>
              {column.name || `Column number ${column.index}`}
            </option>
          ))}
        </select>
      </Tippy>
      {meta.error && meta.touched && (
        <div className="rounded-md border border-red-500 p-2">{meta.error}</div>
      )}
    </div>
  )
}

import { Minus } from "@styled-icons/heroicons-solid"
import Tippy from "@tippyjs/react"
import classNames from "classnames"
import { round } from "lodash-es"
import { FunctionComponent, useCallback } from "react"

import { useStore } from "../hooks/useStore"

export const ColumnSettingsItem: FunctionComponent<{
  keptColIndex: number
}> = ({ keptColIndex: keptColIndex }) => {
  const { config, rawNames, removeKeptColumn, upsertKeptColumn } = useStore(
    (state) => ({
      config: state.config.keptCols?.[keptColIndex],
      rawNames: state?.parser?.columns,
      removeKeptColumn: state.removeKeptColumn,
      upsertKeptColumn: state.upsertKeptColumn,
    })
  )

  const handleRemove = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault()
      removeKeptColumn(keptColIndex)
    },
    [keptColIndex, removeKeptColumn]
  )

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      if (config?.index === undefined) return

      let newVal
      if (event.target.type === "checkbox") {
        newVal = (event as React.ChangeEvent<HTMLInputElement>).target.checked
      } else if (event.target.value === "") {
        newVal = undefined
      } else {
        newVal = event.target.value
      }

      upsertKeptColumn({
        ...config,
        [event.target.name]: newVal,
      })
    },
    [config, upsertKeptColumn]
  )

  if (!config || !rawNames) return null

  const rawName = rawNames[config.index]

  return (
    <li className="rounded-md bg-gray-700 font-mono">
      <div className="flex items-center gap-1 p-2">
        <Tippy content="Remove this column from output data">
          <button
            onClick={handleRemove}
            className="group whitespace-nowrap rounded-full bg-gray-600 p-1 font-mono text-sm hover:bg-yellow-500"
            aria-label={`Remove ${rawName} from output`}
          >
            <Minus
              size={14}
              className="rounded-full text-yellow-400 focus:ring-yellow-400 group-hover:text-white"
            />
          </button>
        </Tippy>
        <h3 className="select-none overflow-hidden overflow-ellipsis px-2 pt-1">
          {rawName}
        </h3>
      </div>

      <div className="grid grid-cols-1 gap-6 p-4 md:grid-cols-2">
        <Tippy content="Change the name used for this column when output is copied. If blank, will use original name.">
          <div className="grid grid-cols-5 items-center justify-between gap-2">
            <label className="col-span-2 text-right" htmlFor="name">
              Rename to:
            </label>
            <input
              type="text"
              name="name"
              value={config.name}
              onChange={(e) => e}
              className="col-span-3 rounded-md border border-gray-50 bg-gray-600 font-mono text-sm"
            />
          </div>
        </Tippy>

        <Tippy
          hideOnClick={false}
          content="Tells the chunker how to handle this data. Text will be copied unmodified, while numbers can have various operations performed depending on their type."
        >
          <div className="grid grid-cols-5 items-center justify-between gap-2">
            <label htmlFor="name" className="col-span-2 text-right">
              Data Type:
            </label>
            <select
              value={config.kind}
              onChange={handleChange}
              name="kind"
              className="col-span-3 rounded-md border border-gray-50 bg-gray-600 font-mono text-sm"
            >
              <option className="py-2 px-1" value="string">
                Text (Everything else)
              </option>
              <option value="integer">Integer (Number without decimal)</option>
              <option value="float">Float (Number with decimal)</option>
            </select>
          </div>
        </Tippy>

        <Tippy
          disabled={config.kind === "string"}
          hideOnClick={false}
          content={`123 -> ${(config?.coefficient || 1) * 123}`}
        >
          <div className="grid grid-cols-5 items-center justify-between gap-2">
            <label htmlFor="name" className="col-span-2 text-right">
              Multiply by:
            </label>
            <input
              disabled={config.kind === "string"}
              type="number"
              name="coefficient"
              value={config?.kind !== "string" ? config?.coefficient || "" : ""}
              onChange={handleChange}
              className={classNames(
                "col-span-3 rounded-md border border-gray-50 bg-gray-600 font-mono text-sm",
                "disabled:opacity-50"
              )}
            />
          </div>
        </Tippy>

        <Tippy
          disabled={config.kind !== "float"}
          hideOnClick={false}
          content={`1.23456789 -> ${round(1.23456789, config?.roundTo || 0)}`}
        >
          <div className="grid grid-cols-5 items-center justify-between gap-2">
            <label htmlFor="name" className="col-span-2 text-right">
              Round To:
            </label>
            <input
              disabled={config?.kind !== "float"}
              type="number"
              name="roundTo"
              value={config?.kind === "float" ? config?.roundTo || "" : ""}
              onChange={handleChange}
              className="rounded-md border border-gray-50 bg-gray-600 font-mono text-sm disabled:opacity-50"
            />
            <div className="col-span-2">decimal places</div>
          </div>
        </Tippy>

        <Tippy
          hideOnClick={false}
          content={`-123 -> ${config?.abs ? 123 : -123}`}
        >
          <div>
            <label className="grid grid-cols-5 items-center gap-2 whitespace-nowrap rounded-md">
              <div className="col-span-3 cursor-pointer text-right sm:col-span-2">
                Absolute Value?
              </div>
              <input
                type="checkbox"
                className="col-span-2 cursor-pointer rounded-full focus:ring-yellow-500 enabled:text-yellow-500 disabled:text-gray-400 sm:col-span-3"
                name="abs"
                onChange={handleChange}
                checked={!!config?.abs}
                disabled={config?.kind === "string"}
              />
            </label>
          </div>
        </Tippy>
      </div>
    </li>
  )
}

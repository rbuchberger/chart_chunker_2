import classNames from "classnames"
import { ChangeEvent, FunctionComponent, useCallback, useState } from "react"
import { defaultColConfigs } from "../constants/defaultColConfigs"
import { useStore } from "../hooks/useStore"

export const ColumnSettingsItem: FunctionComponent<{
  col: string
  index: number
}> = ({ col, index }) => {
  const { config, removeKeptColumn, upsertKeptColumn } = useStore((state) => ({
    config: state.config.keptCols.find((c) => c.index === index),
    removeKeptColumn: state.removeKeptColumn,
    upsertKeptColumn: state.upsertKeptColumn,
  }))

  const [stashedConfig, stash] = useState(config || defaultColConfigs[index])
  const checked = !!config

  const handleCheck = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      if (event.target.checked && stashedConfig) {
        upsertKeptColumn(stashedConfig)
      } else {
        if (config) stash(config)

        removeKeptColumn(index)
      }
    },
    [config, stashedConfig]
  )

  const handleChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    upsertKeptColumn({
      index,
      [event.target.name]: event.target.value,
    })
  }, [])

  return (
    <li
      className={classNames(
        "grid grid-cols-5 items-center gap-4 rounded-md bg-gray-600 py-1 px-2 font-mono",
        {
          "bg-gray-700": checked,
        }
      )}
    >
      <label className="col-span-2 flex h-full cursor-pointer items-center whitespace-nowrap rounded-md p-1 font-mono text-sm leading-5 hover:bg-gray-500">
        <input
          type="checkbox"
          className="rounded-full text-yellow-500 focus:ring-yellow-500"
          name={col}
          onChange={handleCheck}
          checked={!!config}
        />
        <div className="select-none overflow-hidden overflow-ellipsis px-2 pt-1">
          {col}
        </div>
      </label>
      <input
        disabled={!checked}
        type="text"
        name="name"
        value={config?.name || ""}
        onChange={handleChange}
        className={classNames("col-span-2 h-6 rounded-md text-sm", {
          "border border-gray-50 bg-gray-500": checked,
          "border-none bg-gray-600": !checked,
        })}
      />
      <input
        disabled={!checked}
        type="number"
        name="coefficient"
        value={config?.coefficient || ""}
        onChange={handleChange}
        className={classNames("h-6 rounded-md", {
          "border border-gray-50 bg-gray-500": checked,
          "border-none bg-gray-600": !checked,
        })}
      />
    </li>
  )
}

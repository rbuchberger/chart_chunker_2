import { ColumnConfig } from "../chunker/buildHalf"
import { ChunkerConfig } from "../chunker/chunk"
import { State } from "../hooks/useStore"
import { defaultColConfigs } from "./defaultColConfigs"

export const initialConfig: ChunkerConfig = {
  chargeFirst: true,
  splitBasis: 8,
  keptCols: [
    defaultColConfigs[12] as ColumnConfig,
    defaultColConfigs[14] as ColumnConfig,
  ],
  spcCol: 12,
  vCol: 14,
}

export const initialState: State = {
  file: null,
  text: null,
  config: initialConfig,
  parser: null,
  chunker: null,
  flashMessages: [],
}

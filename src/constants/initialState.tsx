import { ColumnConfig } from "../chunker/buildHalf"
import { ChunkerConfig } from "../chunker/chunk"
import { DataType } from "../hooks/useChunker"
import { State } from "../hooks/useStore"
import { defaultColConfigs } from "./defaultColConfigs"

export const defaultConfigs: Record<NonNullable<DataType>, ChunkerConfig> = {
  atlas: {
    chargeFirst: true,
    splitBasis: 8,
    keptCols: [
      defaultColConfigs.atlas[12] as ColumnConfig,
      defaultColConfigs.atlas[14] as ColumnConfig,
    ],
    spcCol: 12,
    vCol: 14,
  },
  biologic: {
    chargeFirst: true,
    splitBasis: 10,
    keptCols: [
      defaultColConfigs.biologic[9] as ColumnConfig,
      defaultColConfigs.biologic[20] as ColumnConfig,
    ],
    spcCol: 20,
    vCol: 9,
    commaDecimal: true,
  },
  other: {
    chargeFirst: true,
    splitBasis: 0,
    keptCols: [],
    spcCol: 0,
    vCol: 0,
  },
}

export const initialState: State = {
  file: null,
  text: null,
  dataType: null,
  config: null,
  parser: null,
  chunker: null,
  flashMessages: [],
}

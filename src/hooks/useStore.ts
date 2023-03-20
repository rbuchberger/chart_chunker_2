import { create } from "zustand"
import { immer } from "zustand/middleware/immer"

import { ColumnConfig } from "../chunker/buildHalf"
import { Chunker, ChunkerConfig } from "../chunker/chunk"
import Parser from "../chunker/parser"
import { FlashMessage } from "../components/FlashMessage"
import { defaultColConfigs } from "../constants/defaultColConfigs"
import { defaultConfigs, initialState } from "../constants/initialState"
import { DataType, FakeFile } from "./useChunker"

export type State = Readonly<{
  file: File | FakeFile | null
  text: string | null
  parser: Parser | null
  dataType: DataType | null
  config: ChunkerConfig | null
  chunker: Chunker | null
  flashMessages: FlashMessage[]
}>

export type Actions = Readonly<{
  setFile: (file: State["file"]) => void
  setText: (text: State["text"]) => void
  setParser: (parser: State["parser"]) => void
  setDataType: (dataType: DataType | null) => void

  setChunker: (chunker: State["chunker"]) => void

  setConfig: (parser: State["config"]) => void
  updateConfig: (config: Partial<ChunkerConfig>) => void

  removeKeptColumn: (columnNumber: number) => void
  upsertKeptColumn: (config: Partial<ColumnConfig> & { index: number }) => void
  addKeptColumn: (columnNumber: number) => void

  flash: (message: Omit<FlashMessage, "id">) => void
  clearFlash: (id: FlashMessage["id"]) => void
  reset: () => void
  resetConfig: () => void
}>

export const useStore = create(
  immer<State & Actions>((set, get) => ({
    ...initialState,

    setFile: (file) => set({ file }),
    setText: (text) => set({ text }),
    setParser: (parser) => set({ parser }),
    setConfig: (config) => set({ config }),
    setDataType: (dataType) => {
      const config = dataType ? defaultConfigs[dataType] : null
      set({ dataType, config })
    },
    setChunker: (chunker) => set({ chunker }),

    updateConfig: (config: Partial<ChunkerConfig>) => {
      set((state) => {
        if (!state.config)
          throw new Error("Config must already exist to update it")

        state.config = { ...state.config, ...config }
      })
    },

    flash: (message) => {
      const id = Math.random()
      set((state) => {
        state.flashMessages.push({ id, ...message })
      })
      setTimeout(() => get().clearFlash(id), 4000)
    },

    clearFlash: (id) => {
      set((state) => {
        const index = state.flashMessages.findIndex((m) => m.id === id)
        if (index !== -1) state.flashMessages.splice(index, 1)
        else console.error("Tried to remove non-existent flash message")
      })
    },

    addKeptColumn: (columnNumber: number) => {
      if (!get().dataType)
        throw new Error("Data type must be set before adding a column")
      const config = {
        index: columnNumber,
        name: get().parser?.columns[columnNumber],
        ...defaultColConfigs[(get().dataType as DataType) || "other"][
          columnNumber
        ],
      }

      get().upsertKeptColumn(config)
    },

    // Index is the index of the kept column in the keptCols array, not of the
    // raw columns
    removeKeptColumn: (keptColumnIndex: number) => {
      set((state) => {
        if (!state.config)
          throw new Error("Config must exist to remove a kept column")

        state.config.keptCols.splice(keptColumnIndex, 1)
      })
    },

    upsertKeptColumn: (config: ColumnConfig) => {
      set((state) => {
        if (!state.config)
          throw new Error("Config must exist to upsert a kept column")

        const location = state.config.keptCols.findIndex(
          (c) => c.index === config.index
        )

        const original = state.config.keptCols[location]

        if (original) {
          state.config.keptCols[location] = { ...config }
        } else {
          state.config.keptCols.push(config)
          state.config.keptCols.sort((a, b) => a.index - b.index)
        }
      })
    },

    reset: () => {
      set({
        file: null,
        text: null,
        config: null,
        dataType: null,
        parser: null,
        chunker: null,
      })
    },

    resetConfig: () => {
      const config = get().dataType
        ? defaultConfigs[(get().dataType as DataType) || "other"]
        : null
      set({ config })
    },
  }))
)

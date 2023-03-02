import { create } from "zustand"
import Parser from "../chunker/parser"
import { FlashMessage } from "../components/FlashMessage"
import { Chunker, ChunkerConfig } from "../chunker/chunk"
import { immer } from "zustand/middleware/immer"
import { FakeFile } from "./useChunker"
import { ColumnConfig } from "../chunker/buildHalf"

type State = Readonly<{
  file: File | FakeFile | null
  text: string | null
  parser: Parser | null
  config: ChunkerConfig
  chunker: Chunker | null
  flashMessages: FlashMessage[]
}>

type Actions = Readonly<{
  setFile: (file: State["file"]) => void
  setText: (text: State["text"]) => void
  setParser: (parser: State["parser"]) => void

  setChunker: (chunker: State["chunker"]) => void

  setConfig: (parser: State["config"]) => void
  updateConfig: (config: Partial<ChunkerConfig>) => void

  removeKeptColumn: (columnNumber: number) => void
  upsertKeptColumn: (config: Partial<ColumnConfig> & { index: number }) => void

  flash: (message: Omit<FlashMessage, "id">) => void
  clearFlash: (id: FlashMessage["id"]) => void
  reset: () => void
}>

export type ColumnConfigUpdate = Partial<ColumnConfig> & { index: number }

const initialConfig: ChunkerConfig = {
  chargeFirst: true,
  splitBasis: 8,
  keptColumns: [
    { index: 12, name: "Specific Capacity (mAh/g)", coefficient: 1000 },
    { index: 14, name: "Electrode Potential (V)" },
  ],
  spcColumn: 12,
  voltageColumn: 14,
}

const initialState: State = {
  file: null,
  text: null,
  config: initialConfig,
  parser: null,
  chunker: null,
  flashMessages: [],
}

export const useStore = create(
  immer<State & Actions>((set, get) => ({
    ...initialState,

    setFile: (file) => set({ file }),
    setText: (text) => set({ text }),
    setParser: (parser) => set({ parser }),
    setConfig: (config) => set({ config }),
    setChunker: (chunker) => set({ chunker }),

    updateConfig: (config: Partial<ChunkerConfig>) => {
      set((state) => {
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

    removeKeptColumn: (columnNumber: number) => {
      set((state) => {
        const index = state.config.keptColumns.findIndex(
          (c) => c.index === columnNumber
        )

        if (index !== -1) state.config.keptColumns.splice(index, 1)
        else console.error("Tried to remove non-existent kept column")
      })
    },

    upsertKeptColumn: (config: ColumnConfigUpdate) => {
      set((state) => {
        const location = state.config.keptColumns.findIndex(
          (c) => c.index === config.index
        )

        const original = state.config.keptColumns[location]

        if (original) {
          state.config.keptColumns[location] = { ...original, ...config }
        } else {
          state.config.keptColumns.push(config)
          state.config.keptColumns.sort((a, b) => a.index - b.index)
        }
      })
    },

    reset: () => {
      set({
        file: null,
        text: null,
        parser: null,
        chunker: null,
      })
    },
  }))
)

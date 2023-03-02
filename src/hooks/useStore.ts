import { create } from "zustand"
import Parser from "../chunker/parser"
import { FlashMessage } from "../components/FlashMessage"
import { Chunker, ChunkerConfig } from "../chunker/chunk"
import { immer } from "zustand/middleware/immer"
import { FakeFile } from "./useChunker"

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
  setConfig: (parser: State["config"]) => void
  setChunker: (chunker: State["chunker"]) => void
  flash: (message: Omit<FlashMessage, "id">) => void
  clearFlash: (id: FlashMessage["id"]) => void
  reset: () => void
}>

const initialConfig: ChunkerConfig = {
  chargeFirst: true,
  splitBasis: 8,
  keptColumns: [{ index: 8 }, { index: 12 }, { index: 14 }],
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

    flash: (message) => {
      const id = Math.random().toString()

      set((state) => {
        state.flashMessages.push({ id, ...message })
      })

      setTimeout(() => get().clearFlash(id), 5000)
    },

    clearFlash: (id) => {
      set((state) => {
        const index = state.flashMessages.findIndex((m) => m.id === id)
        if (index !== -1) state.flashMessages.splice(index, 1)
        else console.error("Tried to remove non-existent flash message")
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

import { create } from "zustand"
import Parser from "../chunker/parser"
import { FlashMessage } from "../components/FlashMessage"
import { Chunker, ChunkerConfig } from "../chunker/chunk"
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
  clearFlash: (id: string) => void
  reset: () => void
}>

export const useStore = create<State & Actions>((set, get) => ({
  file: null,
  setFile: (file) => set({ file }),

  text: null,
  setText: (text) => set({ text }),

  parser: null,
  setParser: (parser) => set({ parser }),

  config: {
    chargeFirst: true,
    splitBasis: 8,
    keptColumns: [{ index: 8 }, { index: 12 }, { index: 14 }],
    spcColumn: 12,
    voltageColumn: 14,
  },
  setConfig: (config) => set({ config }),

  chunker: null,
  setChunker: (chunker) => set({ chunker }),

  flashMessages: [],
  flash: (message) => {
    const id = Math.random().toString()
    set((state) => ({
      flashMessages: [...state.flashMessages, { id, ...message }],
    }))

    setTimeout(() => {
      get().clearFlash(id)
    }, 5000)
  },

  clearFlash: (id) => {
    set((state) => ({
      flashMessages: state.flashMessages.filter((m) => m.id !== id),
    }))
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

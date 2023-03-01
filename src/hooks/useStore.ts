import { create } from "zustand"
import Parser from "../chunker/parser"
import ParseWorker from "../workers/parser?worker"
import ReadWorker from "../workers/filereader?worker"
import ChunkWorker from "../workers/chunker?worker"
import { FlashMessage } from "../components/FlashMessage"
import { Chunker, ChunkerConfig } from "../chunker/chunk"

export type FakeFile = { name: string; fake: true }

export const useStore = create<{
  file: File | FakeFile | null
  setFile: (file: File | FakeFile | null) => void

  text: string | null
  setText: (text: string | null) => void

  parser: Parser | null
  setParser: (parser: Parser | null) => void

  config: ChunkerConfig
  setConfig: (parser: ChunkerConfig) => void

  chunker: Chunker | null
  setChunker: (chunker: Chunker | null) => void

  parseWorker: Worker
  chunkWorker: Worker
  readWorker: Worker

  flashMessages: FlashMessage[]
  flash: (message: Omit<FlashMessage, "id">) => void
  clearFlash: (id: string) => void

  reset: () => void
}>((set, get) => ({
  file: null,
  setFile: (file) => set({ file }),

  text: null,
  setText: (text) => set({ text }),

  parser: null,
  setParser: (parser) => set({ parser }),

  config: {
    chargeFirst: true,
    splitBasis: 8,
    keptColumns: [8, 12, 14],
    spcColumn: 12,
    voltageColumn: 14,
  },
  setConfig: (config) => set({ config }),

  chunker: null,
  setChunker: (chunker) => set({ chunker }),

  parseWorker: new ParseWorker(),
  readWorker: new ReadWorker(),
  chunkWorker: new ChunkWorker(),

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

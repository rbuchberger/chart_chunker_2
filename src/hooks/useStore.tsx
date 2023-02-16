import { create } from "zustand"
import { Chunker, ChunkerConfig } from "../chunker/chunker"
import Parser from "../chunker/parser"

export const useStore = create<{
  file: File | null
  setFile: (file: File | null) => void

  text: string | null
  setText: (text: string | null) => void

  parser: Parser | null
  setParser: (parser: Parser | null) => void

  config: ChunkerConfig
  setConfig: (parser: ChunkerConfig) => void

  chunker: Chunker | null
  setChunker: (chunker: Chunker | null) => void
}>((set) => ({
  file: null,
  setFile: (file) => set({ file }),

  text: null,
  setText: (text) => set({ text }),

  parser: null,
  setParser: (parser) => set({ parser }),

  config: {
    splitBasis: 8,
    keptColumns: [7, 8, 12, 14],
    spcColumn: 12,
    voltageColumn: 14,
  },
  setConfig: (config) => set({ config }),

  chunker: null,
  setChunker: (chunker) => set({ chunker }),
}))

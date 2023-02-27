import { chunk } from "../chunker/chunk"
import { ChunkerConfig, ChunkerPartial } from "../chunker/chunker"
import Parser from "../chunker/parser"

const data: {
  config: ChunkerConfig | null
  parser: Parser | null
  chunker: ChunkerPartial | null
} = {
  config: null,
  parser: null,
  chunker: null,
}

export type ChunkWorkerRequest = {
  config?: ChunkerConfig
  parser?: Parser
}

export type ChunkWorkerResponse = {
  chunker: ReturnType<typeof chunk> | null
  result: "success" | "error"
  error?: unknown
}

self.onmessage = function (event: MessageEvent<ChunkWorkerRequest>) {
  if (event.data.config) data.config = event.data.config
  if (event.data.parser) data.parser = event.data.parser

  if (!data.config || !data.parser) {
    self.postMessage({ preview: null, chunker: null })

    return
  }

  try {
    data.chunker = chunk({ config: data.config, parser: data.parser })

    self.postMessage({
      chunker: data.chunker,
      result: "success",
    } as ChunkWorkerResponse)
  } catch (e) {
    console.error(e)

    self.postMessage({
      chunker: null,
      result: "error",
      error: e,
    } as ChunkWorkerResponse)
  }
}

import { Chunker, ChunkerConfig, ChunkerOverview } from "../chunker/chunker"
import Parser from "../chunker/parser"

const data: {
  config: ChunkerConfig | null
  parser: Parser | null
  chunker: Chunker | null
} = {
  config: null,
  parser: null,
  chunker: null,
}

export type ChunkWorkerRequest = {
  config?: ChunkerConfig
  parser?: Parser
  returnFull?: boolean
}

export type ChunkWorkerResponse = {
  chunker: Chunker | null
  overview: ChunkerOverview
}

self.onmessage = function (event: MessageEvent<ChunkWorkerRequest>) {
  if (event.data.config) data.config = event.data.config
  if (event.data.parser) data.parser = event.data.parser

  if (!data.config || !data.parser) {
    self.postMessage({
      preview: null,
      chunker: null,
    })

    return
  }

  data.chunker = new Chunker(data.config, data.parser)

  self.postMessage({
    chunker: event.data.returnFull ? data.chunker : null,
    overview: data.chunker.overview,
  } as ChunkWorkerResponse)
}

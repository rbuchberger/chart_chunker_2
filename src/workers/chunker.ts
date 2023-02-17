import { Chunker, ChunkerConfig } from "../chunker/chunker"
import Parser from "../chunker/parser"

self.onmessage = function (
  event: MessageEvent<{
    config: ChunkerConfig
    parser: Parser
  }>
) {
  const start = performance.now()
  const chunker = new Chunker(event.data.config, event.data.parser)

  console.log(`Chunker chunked - ${performance.now() - start}ms`)
  self.postMessage(chunker)
}

import { useEffect } from "react"
import { ChunkWorkerResponse } from "../workers/chunker"
import { useStore } from "./useStore"

// There's a pipeline from file upload to chunker output, many steps of which
// are asynchronous. There are also multiple inputs which require different
// behavior at different stages. We handle these with a series of useEffect
// hooks, each of which has the previous steps as part of its dependency array.
//
// file upload -> FileReader read as text -> get config -> run chunker
export const useChunker = () => {
  const {
    file,
    text,
    setText,
    parser,
    setParser,
    config,
    setChunker,
    parseWorker,
    readWorker,
    chunkWorker,
    setChunkerOverview,
  } = useStore()

  readWorker.onmessage = (e) => setText(e.data)

  parseWorker.onmessage = (e) => setParser(e.data)

  chunkWorker.onmessage = (e: MessageEvent<ChunkWorkerResponse>) => {
    if (e.data.chunker) setChunker(e.data.chunker)

    setChunkerOverview(e.data.overview)
  }

  // Parse file into text when uploaded
  useEffect(() => {
    setText(null)

    if (file) readWorker.postMessage(file)
  }, [file])

  // Hand text to parser when text finishes
  useEffect(() => {
    setParser(null)

    if (text) parseWorker.postMessage(text)
  }, [text])

  // Pass config to chunker
  useEffect(() => {
    // We don't null the overview because it causes UI flickering. Stale data is
    // fine for a few hundred ms.
    setChunker(null)

    chunkWorker.postMessage({ config })
  }, [config])

  // Pass parser to chunker
  useEffect(() => {
    setChunker(null)

    if (parser) chunkWorker.postMessage({ parser })
  }, [parser])
}

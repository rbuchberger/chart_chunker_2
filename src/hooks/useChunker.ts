import { useEffect } from "react"
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
  } = useStore()

  readWorker.onmessage = (e) => setText(e.data)
  parseWorker.onmessage = (e) => setParser(e.data)
  chunkWorker.onmessage = (e) => setChunker(e.data)

  // Parse file into text when uploaded
  useEffect(() => {
    setText(null)

    // The setTimout prevents the FileReader from blocking the UI for long
    // enough to update it to reflect user actions. Wish there
    // was a better way, but worker.postMessage is slow for big messages. Same
    // applies to parseWorker and chunkWorker.
    if (file) setTimeout(() => readWorker.postMessage(file), 50)
  }, [file])

  // Hand text to parser when text finishes
  useEffect(() => {
    setParser(null)

    if (text) setTimeout(() => parseWorker.postMessage(text), 50)
  }, [text])

  // Run Chunker when parsed text & config are present
  useEffect(() => {
    setChunker(null)

    if (parser) {
      setTimeout(() => chunkWorker.postMessage({ config, parser }), 50)
    }
  }, [config, parser])
}

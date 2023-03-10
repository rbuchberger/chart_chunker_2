import { useEffect } from "react"

import { ChunkWorkerResponse } from "../workers/chunker"
import ChunkWorker from "../workers/chunker?worker"
import ReadWorker from "../workers/filereader?worker"
import ParseWorker from "../workers/parser?worker"
import { useStore } from "./useStore"

export type FakeFile = { name: string; fake: true }

// There's a pipeline from file upload to chunker output, many steps of which
// are asynchronous. There are also multiple inputs which require different
// behavior at different stages. We handle these with a series of useEffect
// hooks, each of which has the previous steps as part of its dependency array.
//
// file upload -> FileReader read as text -> get config -> run chunker
const readWorker = new ReadWorker()
const parseWorker = new ParseWorker()
const chunkWorker = new ChunkWorker()

export const useChunker = () => {
  const {
    file,
    text,
    setText,
    parser,
    setParser,
    config,
    setChunker,
    flash,
    reset,
  } = useStore((state) => ({
    file: state.file,
    text: state.text,
    setText: state.setText,
    parser: state.parser,
    setParser: state.setParser,
    config: state.config,
    setChunker: state.setChunker,
    flash: state.flash,
    reset: state.reset,
  }))

  readWorker.onmessage = (e) => {
    if (e.data.result === "error") {
      flash({
        content: "Unable to read file. Are you sure it's the right one?",
        kind: "error",
      })

      console.error(e.data.error)
      reset()

      return
    }

    setText(e.data.text)
  }
  parseWorker.onmessage = (e) => {
    if (e.data.result === "error") {
      flash({
        content:
          "Unable to find parsable table in file. Are you sure it's the right one?",
        kind: "error",
      })

      reset()
    }

    return setParser(e.data.parser)
  }

  chunkWorker.onmessage = (e: MessageEvent<ChunkWorkerResponse>) => {
    if (e.data.result === "error") {
      reset()

      flash({
        content:
          "Read and parsed file, but something went wrong chunking it. Sorry :(",
        kind: "error",
      })
    }

    setChunker(e.data.chunker)
  }

  // Parse file into text when uploaded
  useEffect(() => {
    if (file && !(file as FakeFile).fake) readWorker.postMessage(file)
  }, [file])

  // Hand text to parser when text finishes
  useEffect(() => {
    if (text) parseWorker.postMessage(text)
  }, [text])

  // Pass config to chunker
  useEffect(() => {
    chunkWorker.postMessage({ config })
  }, [config])

  // Pass parser to chunker
  useEffect(() => {
    if (parser) chunkWorker.postMessage({ parser })
  }, [parser])
}

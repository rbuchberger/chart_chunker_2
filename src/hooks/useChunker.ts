import { yieldOrContinue } from "main-thread-scheduling"
import { useEffect } from "react"

import { ChunkWorkerResponse } from "../workers/chunker"
import ChunkWorker from "../workers/chunker?worker"
import ReadWorker from "../workers/filereader?worker"
import ParseWorker from "../workers/parser?worker"
import { useStore } from "./useStore"

export type FakeFile = {
  name: string
  fake: true
  dataType: "atlas" | "biologic" | "other"
}

// There's a pipeline from file upload to chunker output, many steps of which
// are asynchronous. There are also multiple inputs which require different
// behavior at different stages. We handle these with a series of useEffect
// hooks, each of which has the previous steps as part of its dependency array.
//
// file upload -> FileReader read as text -> get config -> run chunker
const readWorker = new ReadWorker()
const parseWorker = new ParseWorker()
const chunkWorker = new ChunkWorker()

export type DataType = Awaited<ReturnType<typeof identifyFile>>

export const identifyFile = async (file?: File | FakeFile | null) => {
  if (!file) return null
  if ((file as FakeFile).fake) return (file as FakeFile).dataType

  const text = await (file as File).slice(0, 512).text()
  const lines = text.split(/\r?\n/)

  if (lines[0]?.match(/AMPG&T/) && lines[1]?.match(/ATLAS/)) {
    return "atlas"
  } else if (lines[0]?.match(/^mode\tox\/red\terror/)) {
    return "biologic"
  } else {
    return "other"
  }
}

export const useChunker = () => {
  const {
    file,
    text,
    setText,
    parser,
    setParser,
    dataType,
    setDataType,
    config,
    setConfig,
    setChunker,
    flash,
    reset,
  } = useStore((state) => ({
    file: state.file,
    text: state.text,
    setText: state.setText,
    dataType: state.dataType,
    setDataType: state.setDataType,
    parser: state.parser,
    setParser: state.setParser,
    config: state.config,
    setConfig: state.setConfig,
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

    setParser(e.data.parser)
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
    async function postFile() {
      const dataType = await identifyFile(file as File)
      setDataType(dataType)

      if (!file || (file as FakeFile).fake) return
      await yieldOrContinue("background")

      readWorker.postMessage(file)
    }

    postFile()
  }, [file, setConfig, setDataType])

  // Hand text to parser when text finishes
  useEffect(() => {
    async function postText() {
      if (!dataType) return

      await yieldOrContinue("background")
      parseWorker.postMessage({ text, dataType })
    }

    if (text) postText()
  }, [dataType, text])

  // Pass config to chunker
  useEffect(() => {
    async function postConfig() {
      await yieldOrContinue("background")

      chunkWorker.postMessage({ config })
    }

    postConfig()
  }, [config])

  // Pass parser to chunker
  useEffect(() => {
    async function postParser() {
      await yieldOrContinue("background")
      chunkWorker.postMessage({ parser })
    }
    if (parser) postParser()
  }, [parser])
}

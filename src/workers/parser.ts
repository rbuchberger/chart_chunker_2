import { yieldOrContinue } from "main-thread-scheduling"

import Parser from "../chunker/parser"

self.onmessage = async function (event: MessageEvent<string>) {
  try {
    const parser = new Parser(event.data)

    await yieldOrContinue("background")
    self.postMessage({ result: "success", parser })
  } catch (e) {
    console.error(e)

    self.postMessage({ result: "error", error: e })
  }
}

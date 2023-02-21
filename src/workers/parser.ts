import Parser from "../chunker/parser"

self.onmessage = function (event: MessageEvent<string>) {
  try {
    const parser = new Parser(event.data)

    self.postMessage({ result: "success", parser })
  } catch (e) {
    console.error(e)

    self.postMessage({ result: "error", error: e })
  }
}

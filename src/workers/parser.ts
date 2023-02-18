import Parser from "../chunker/parser"

self.onmessage = function (event: MessageEvent<string>) {
  const parser = new Parser(event.data)

  self.postMessage(parser)
}

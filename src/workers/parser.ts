import Parser from "../chunker/parser"

self.onmessage = function (event: MessageEvent<string>) {
  const start = performance.now()
  const parser = new Parser(event.data)

  console.log(`Parser parsed - ${performance.now() - start}ms`)
  self.postMessage(parser)
}

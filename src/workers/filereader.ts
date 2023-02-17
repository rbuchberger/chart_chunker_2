export {}

self.onmessage = function (event: MessageEvent<File>) {
  const start = performance.now()
  const file = event.data
  const reader = new FileReader()

  reader.onload = function (event: ProgressEvent<FileReader>) {
    const text = event.target?.result

    console.log(`FileReader read - ${performance.now() - start}ms`)
    self.postMessage(text)
  }

  reader.readAsText(file)
}

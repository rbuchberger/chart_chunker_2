export {}

self.onmessage = function (event: MessageEvent<File>) {
  const file = event.data
  const reader = new FileReader()

  reader.onload = function (event: ProgressEvent<FileReader>) {
    const text = event.target?.result

    self.postMessage(text)
  }

  reader.readAsText(file)
}

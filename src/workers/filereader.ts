import { yieldOrContinue } from "main-thread-scheduling"

export {}

self.onmessage = function (event: MessageEvent<File>) {
  const file = event.data
  const reader = new FileReader()

  reader.onload = async function (event: ProgressEvent<FileReader>) {
    const text = event.target?.result

    await yieldOrContinue("background")

    self.postMessage({ result: "success", text })
  }

  reader.onerror = function (event: ProgressEvent<FileReader>) {
    console.error(event)

    self.postMessage({ result: "error", error: event })
  }

  if (file.type.match(/text/)) {
    reader.readAsText(file)
  } else {
    self.postMessage({ result: "error", error: "File is not text." })

    return
  }
}

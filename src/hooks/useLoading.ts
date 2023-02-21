import { useStore } from "./useStore"

export type LoadingState = "none" | "reading" | "parsing" | "chunking" | "done"

export const useLoading = () => {
  const { file, text, parser, chunker } = useStore()

  if (!file) {
    return "none"
  } else if (!text) {
    return "reading"
  } else if (!parser) {
    return "parsing"
  } else if (!chunker) {
    return "chunking"
  } else {
    return "done"
  }
}

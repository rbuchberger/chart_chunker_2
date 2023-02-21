import { Header } from "./components/Header"
import { router } from "./router"
import { RouterProvider } from "react-router-dom"
import { Card } from "./primitives/Card"
import { useChunker } from "./hooks/useChunker"
import { XMark } from "@styled-icons/heroicons-solid"
import { FlashMessages } from "./components/FlashMessages"

function App() {
  useChunker()

  return (
    <main className="max-h-screen overflow-y-scroll bg-gray-800 font-sans text-lg text-gray-50">
      <FlashMessages />

      <div className="mx-auto flex h-screen max-w-6xl flex-col items-center gap-5 px-4 py-10">
        <Header />

        <Card>
          <RouterProvider router={router} />
        </Card>
      </div>
    </main>
  )
}

export default App

import { CaptureConsole } from "@sentry/integrations"
import * as Sentry from "@sentry/react"
import { BrowserTracing } from "@sentry/tracing"
import { RouterProvider } from "react-router-dom"

import { FlashMessages } from "./components/FlashMessages"
import { Header } from "./components/Header"
import { useChunker } from "./hooks/useChunker"
import { Card } from "./primitives/Card"
import { router } from "./router"

if (import.meta.env.PROD) {
  Sentry.init({
    dsn: "https://32d706941cf04fee8bba0d3c38b07839@o4504719318450176.ingest.sentry.io/4504719320285184",
    // This sets the sample rate to be 10%. You may want this to be 100% while
    // in development and sample at a lower rate in production
    replaysSessionSampleRate: 0.1,
    // If the entire session is not sampled, use the below sample rate to sample
    // sessions when an error occurs.
    replaysOnErrorSampleRate: 1.0,

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,

    beforeSend(event) {
      // Check if it is an exception, and if so, show the report dialog
      if (event.exception) {
        Sentry.showReportDialog({
          title:
            "Something broke, sorry! You can help me fix it by sending a report.",
          eventId: event.event_id,
        })
      }
      return event
    },

    integrations: [
      new BrowserTracing(),
      new CaptureConsole(),
      new Sentry.Replay(),
    ],
  })
}

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

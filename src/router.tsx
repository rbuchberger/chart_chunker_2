import { createBrowserRouter } from "react-router-dom"
import { FileUploader } from "./pages/FileUploader"
import { Options } from "./pages/Options"

export const router = createBrowserRouter([
  {
    path: "/",
    element: <FileUploader />,
  },
  {
    path: "/options",
    element: <Options />,
  },
])

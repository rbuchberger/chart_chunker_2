import { createBrowserRouter } from "react-router-dom"
import { Root } from "./pages/Root"
import { Options } from "./pages/Options"
import { Presenter } from "./pages/Presenter"

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
  },
  {
    path: "/options",
    element: <Options />,
  },
  {
    path: "/presenter",
    element: <Presenter />,
  },
])

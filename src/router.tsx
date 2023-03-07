import { createBrowserRouter } from "react-router-dom"

import { Error } from "./pages/Error"
import { Options } from "./pages/Options"
import { Presenter } from "./pages/Presenter"
import { Root } from "./pages/Root"

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <Error />,
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

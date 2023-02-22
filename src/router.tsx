import { createBrowserRouter } from "react-router-dom"
import { Root } from "./pages/Root"
import { Options } from "./pages/Options"
import { Presenter } from "./pages/Presenter"
import { Error } from "./pages/Error"

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

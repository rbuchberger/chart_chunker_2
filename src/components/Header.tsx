import { FunctionComponent } from "react"
import { Card } from "../primitives/Card"

export const Header: FunctionComponent = () => {
  return (
    <Card>
      <header>
        <h1 className="text-4xl font-light">Chart Chunker - v2!</h1>
        <span>
          Made by{" "}
          <a className="text-yellow-400" href="https://robert-buchberger.com">
            Robert Buchberger
          </a>
        </span>
      </header>
    </Card>
  )
}

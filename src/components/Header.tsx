import { FunctionComponent } from "react"

import { Card } from "../primitives/Card"

export const Header: FunctionComponent = () => {
  return (
    <Card>
      <header>
        <h1 className="text-4xl font-light">The Chart Chunker</h1>
        <div className="text-right text-sm font-light">it chunks charts</div>
      </header>
    </Card>
  )
}

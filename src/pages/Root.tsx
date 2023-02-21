import { FunctionComponent } from "react"
import { Link } from "react-router-dom"
import { NavBar } from "../components/NavBar"
import { useStore } from "../hooks/useStore"

export const Root: FunctionComponent = () => {
  const { file } = useStore()

  return (
    <>
      <NavBar
        right={
          file ? (
            <Link className="btn btn--nav btn--yellow" to="/options">
              Next
            </Link>
          ) : (
            <div className="btn btn--nav btn--disabled">Next</div>
          )
        }
      />

      <h2 className="mb-16 text-center text-2xl">
        {file ? "Thanks!" : "Can I see your data?"}
      </h2>

      <div className="mx-auto flex max-w-prose flex-col gap-6">
        <p className="max-w-prose">
          This is the new and improved chart chunker; if you prefer the old
          version it can be found{" "}
          <a
            href="https://chart-chunker.netlify.app/"
            className="text-yellow-500"
          >
            here
          </a>
          .
        </p>

        <p>
          Version 2 is almost a complete rewrite. It should be faster, easier to
          use, and generally better-behaved. It will definitely be easier to
          maintain!
        </p>

        <p>
          Feedback is appreciated! Tell me about your troubles:
          <a
            className="ml-2 text-yellow-500"
            href="mailto:robert@buchberger.cc"
          >
            robert@buchberger.cc
          </a>
        </p>
        <p className="mt-16 text-center">
          Created by{" "}
          <a className="text-yellow-500" href="https://robert-buchberger.com">
            Robert Buchberger
          </a>
        </p>
      </div>
    </>
  )
}

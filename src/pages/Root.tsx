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

      <h2 className="mb-16 mt-6 text-center text-2xl">
        {file ? "Thanks!" : "Can I see your data?"}
      </h2>

      <div className="mx-auto flex max-w-prose flex-col gap-6">
        <p className="max-w-prose">
          This is the new and improved chart chunker; it is almost a complete
          rewrite. It should be faster, easier to use, and generally
          better-behaved. It will definitely be easier to maintain!
        </p>

        <p>
          This project is open source and can be found on{" "}
          <a
            href="https://github.com/rbuchberger/chart_chunker_2"
            className="text-yellow-400"
          >
            Github
          </a>
          . You are encouraged to submit issues, discussions, and pull requests
          as you like. If you prefer, you can contact me directly:{" "}
          <a className="text-yellow-400" href="mailto:robert@buchberger.cc">
            robert@buchberger.cc
          </a>
        </p>

        <p>
          The old version can be found{" "}
          <a
            href="https://chart-chunker.netlify.app/"
            className="text-yellow-400"
          >
            here
          </a>
          .
        </p>

        <p className="mt-16 text-center">
          Created and maintained by{" "}
          <a className="text-yellow-400" href="https://robert-buchberger.com">
            Robert Buchberger
          </a>
        </p>
      </div>
    </>
  )
}

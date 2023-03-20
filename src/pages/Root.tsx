import { FunctionComponent } from "react"
import { Link } from "react-router-dom"

import { ExampleButton } from "../components/ExampleButton"
import { NavBar } from "../components/NavBar"
import { useStore } from "../hooks/useStore"

export const Root: FunctionComponent = () => {
  const file = useStore((state) => state.file)

  return (
    <>
      <NavBar
        left={<ExampleButton />}
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
        <p>
          This project is open source and can be found on{" "}
          <a
            href="https://github.com/rbuchberger/chart_chunker_2"
            className="text-yellow-400 hover:underline"
          >
            Github
          </a>
          . You are encouraged to submit issues, discussions, and pull requests.
          If you prefer, you can contact me directly:{" "}
          <a
            className="text-yellow-400 hover:underline"
            href="mailto:robert@buchberger.cc"
          >
            robert@buchberger.cc
          </a>
        </p>

        <p>
          The old version can be found{" "}
          <a
            href="https://chart-chunker.netlify.app/"
            className="text-yellow-400 hover:underline"
          >
            here
          </a>
          . Bookmark it if you want because I&apos;m not leaving this link here
          forever!
        </p>

        <div className="mt-6">
          <h2 className="text-2xl">What&apos;s new?</h2>

          <p className="italic">
            For a detailed list, see the{" "}
            <a
              href="https://github.com/rbuchberger/chart_chunker_2/commits/main"
              className="text-yellow-400 hover:underline"
            >
              commit history
            </a>
            .
          </p>

          <ul className="list-disc pl-6">
            <li>
              <span className="font-bold">20 March</span> - Did you notice the
              options page was broken? It&apos;s fixed now, and faster.
            </li>
          </ul>
        </div>

        <div className="mt-16 flex flex-row justify-center gap-3">
          <p>GPLv3</p>
          <div>·</div>
          <p className="text-center">
            Created and maintained by{" "}
            <a
              className="text-yellow-400 hover:underline"
              href="https://robert-buchberger.com"
            >
              Robert Buchberger
            </a>
          </p>
        </div>
      </div>
    </>
  )
}

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
        <p className="max-w-prose">
          This is the new and improved chart chunker; it is almost a complete
          rewrite. It should be faster, easier to use, and generally
          better-behaved. It will definitely be easier to maintain!
        </p>

        <p>
          This project is open source and can be found on{" "}
          <a
            href="https://github.com/rbuchberger/chart_chunker_2"
            className="text-yellow-400 hover:underline"
          >
            Github
          </a>
          . You are encouraged to submit issues, discussions, and pull requests
          as you like. If you prefer, you can contact me directly:{" "}
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
          .
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
            <li>Column Modifications! Check out the options page.</li>
            <li>
              <a
                className="text-yellow-400 hover:underline"
                href="https://github.com/rbuchberger/chart_chunker_2/issues/7"
              >
                UI Tweaks & improvements
              </a>{" "}
              - loading animation, easy example data, and more.
            </li>
            <li>
              Add support for half-cycles, and fix the bug where some cycles
              weren&apos;t detected.
            </li>
            <li>Add option to set whether charge or discharge is first</li>
            <li>
              Rewrite chunker logic - it&apos;s smaller, faster, and easier to
              modify. More changes to come!
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

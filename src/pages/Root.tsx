import Tippy from "@tippyjs/react"
import { FunctionComponent } from "react"
import { Link } from "react-router-dom"

import { ExampleButton } from "../components/ExampleButton"
import { NavBar } from "../components/NavBar"
import { DataType } from "../hooks/useChunker"
import { useStore } from "../hooks/useStore"

export const Root: FunctionComponent = () => {
  const { file, dataType } = useStore((state) => {
    return {
      file: state.file,
      dataType: state.dataType,
    }
  })

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
        <TypeMessage dataType={dataType} />
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

          <ul className="list-disc pl-6">
            <li>
              <span className="font-bold">20 March</span> - Add support for
              biologic and generic CSV files. You can now chunk any CSV file,
              probably. If it doesn&apos;t work try a different delimeter.
            </li>
            <li>
              <span className="font-bold">20 March</span> - Did you notice the
              options page was broken? It&apos;s fixed now, and faster.
            </li>
          </ul>
          <p className="mt-4 italic">
            For a detailed list, see the{" "}
            <a
              href="https://github.com/rbuchberger/chart_chunker_2/commits/main"
              className="text-yellow-400 hover:underline"
            >
              commit history
            </a>
            .
          </p>
        </div>

        <div className="mt-6">
          <h2 className="text-2xl">Known Bugs</h2>

          <ul className="list-disc pl-6">
            <li>
              If you upload a file of one type, and then upload a file of
              another type, the parser doesn&apos;t work.{" "}
              <span className="font-bold">
                To fix, refresh the page and try again.
              </span>
            </li>
          </ul>
          <p className="mt-4 italic">
            For a full list of known issues and planned improvements, and to
            file new ones, see the{" "}
            <a
              href="https://github.com/rbuchberger/chart_chunker_2/issues"
              className="text-yellow-400 hover:underline"
            >
              issues page on github.
            </a>
            .
          </p>
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

export const TypeMessage: FunctionComponent<{ dataType: DataType }> = ({
  dataType,
}) => {
  switch (dataType) {
    case "atlas":
      return <>Thanks! Atlas file detected.</>
    case "biologic":
      return <>Thanks! Biologic file detected.</>
    case "other":
      return (
        <Tippy content="You're on your own - you'll have to set up everything on the next page. If you'd like to add support for a particular file, feel free to ask!">
          <span>Thanks! Unknown File type detected.</span>
        </Tippy>
      )
    case null:
      return <>Can I see your data?</>
  }
}

import { FunctionComponent } from "react"

export const Card: FunctionComponent<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <div className="flex w-full flex-col gap-5 rounded-lg bg-gray-700 px-8 py-5 text-gray-100 drop-shadow-md">
      {children}
    </div>
  )
}

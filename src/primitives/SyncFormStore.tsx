import { useFormikContext } from "formik"
import { FunctionComponent, useEffect } from "react"

// Used to keep form state in sync with the store state. Necessary because
// data which the form handles can be changed from outside of it.
// Without this component, changing form values will undo these changes.
export const SyncFormStore: FunctionComponent<{
  storeState: unknown
}> = ({ storeState }) => {
  const { initialValues, resetForm } = useFormikContext()
  useEffect(() => {
    // provided changes a lot; without this check the form is reset
    // continuously.
    if (initialValues === storeState) return

    resetForm({ values: storeState })
  }, [initialValues, resetForm, storeState])

  return null
}

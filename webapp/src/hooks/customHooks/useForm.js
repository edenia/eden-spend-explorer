import { useState } from 'react'

const useForm = (initialState = {}) => {
  const [values, setValues] = useState(initialState)
  const [errors, setErrors] = useState({})
  const reset = () => {
    setValues(initialState)
  }

  const handleInputChange = ({ target }) => {
    setValues({
      ...values,
      [target.name]: target.value
    })

    if (target.value.length > 0) {
      const newErrors = { ...errors }

      delete newErrors[target.name]

      setErrors({ ...newErrors })
    } else {
      setErrors({ ...errors, [target.name]: true })
    }
  }

  const validateForm = form => {
    let formErrors = {}

    Object.keys(form).forEach(key => {
      if (form[key].length < 1) {
        formErrors = { ...formErrors, [key]: true }
      } else {
        const newErrors = { ...formErrors }

        delete newErrors[key]

        formErrors = { ...newErrors }
      }
    })
    setErrors(formErrors)

    return formErrors
  }

  return [values, handleInputChange, reset, errors, validateForm]
}

export default useForm

export const checkValidSignInFrom = (email, password) => {
  // valid email and return different different values depending----------
  const isEmailValid = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(
    email
  )
  const isPasswordValid =
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^((0-9)|(a-z)|(A-Z)|\s)]).{8,}$/.test(
      password
    )
  if (!isEmailValid) return 'Invalid email format'
  if (!isPasswordValid) return 'Invalid password'
  return null
}

export const checkValidSignUpFrom = (firstName, lastName, email, password) => {
  const nameRegex = /^[A-Z][a-zA-Z\s'.-]*$/
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

  if (!nameRegex.test(firstName)) return 'Invalid First Name'
  if (!nameRegex.test(lastName)) return 'Invalid Last Name'
  if (!emailRegex.test(email)) return 'Invalid Email Format'

  if (password.length < 8) return 'Password must be at least 8 characters'
  if (!/[a-z]/.test(password)) return 'Must include a lowercase letter'
  if (!/[A-Z]/.test(password)) return 'Must include an uppercase letter'
  if (!/[0-9]/.test(password)) return 'Must include a number'
  if (!/[^a-zA-Z0-9\s]/.test(password))
    return 'Must include a special character'

  return null
}

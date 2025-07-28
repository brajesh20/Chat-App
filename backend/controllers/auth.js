const User = require('../models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET

const registerUser = async (req, res, next) => {
  const { firstName, lastName, email, password } = req.body

  const existingUser = await User.findOne({ email })
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' })
  }

  const hashedPassword = await bcrypt.hash(password, 8)

  const user = new User({
    firstName,
    lastName,
    email,
    password: hashedPassword
  })

  const savedUser = await user.save()

  const token = jwt.sign({ userId: savedUser._id }, JWT_SECRET, {
    expiresIn: '48h'
  })

  res.status(201).json({
    message: 'Registration successful',
    token
  })
}

const loginUser = async (req, res) => {
  let { email, password } = req.body
  let user = await User.findOne({ email })
  if (!user) {
    return res.status(404).json({ message: `User Not Found` })
  }
  const isPasswordValid = await bcrypt.compare(password, user.password)
  if (!isPasswordValid) {
    return res.status(401).json({ message: 'Invalid Password' })
  }
  const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
    expiresIn: '48h'
  })
  user.password = null
  res.status(200).json({
    message: 'Login Successfully',
    data: user,
    token
  })
}

module.exports = { registerUser, loginUser }

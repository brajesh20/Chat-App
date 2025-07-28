const User = require('../models/user')

const getAuthUser = async (req, res) => {
  if (!req.user) {
    return res
      .status(401)
      .json({ message: 'Unauthorized - User not authenticated' })
  }

  res.status(200).json({
    message: 'Authenticated user retrieved successfully',
    data: req.user
  })
}

const getAllUsers = async (req, res) => {
  if (!req.user) {
    return res
      .status(401)
      .json({ message: 'Unauthorized - User not authenticated' })
  }

  const allUsers = await User.find({ _id: { $ne: req.user._id } })
    .select('-password')
    .sort({ _id: -1 })

  res.status(200).json({
    message: 'All users retrieved successfully',
    data: allUsers
  })
}

module.exports = { getAuthUser, getAllUsers }

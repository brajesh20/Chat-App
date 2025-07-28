const Chat = require('../models/chat')
const Message = require('../models/message')

const postChat = async (req, res) => {
  const { userId } = req.body

  if (!userId) {
    return res.status(400).json({ message: 'userId not provided' })
  }

  const existingChat = await Chat.find({
    isGroupChat: false,
    users: { $all: [req.user._id, userId] },
    'users.2': { $exists: false }
  })
    .populate('users', '-password')
    .populate({
      path: 'latestMessage',
      populate: {
        path: 'sender',
        select: '-password'
      }
    })

  if (existingChat.length === 0) {
    const newChat = await Chat.create({
      chatName: 'Messenger',
      isGroupChat: false,
      users: [req.user._id, userId]
    })

    const fullChat = await Chat.findById(newChat._id).populate(
      'users',
      '-password'
    )
    return res.status(201).json({ data: fullChat })
  } else {
    return res.status(200).json({ data: existingChat[0] })
  }
}

const getChat = async (req, res) => {
  const chat = await Chat.find({
    users: { $elemMatch: { $eq: req.user._id } }
  })
    .sort({ updatedAt: -1 })
    .populate('users', '-password')
    .populate({
      path: 'latestMessage',
      populate: {
        path: 'sender',
        select: '-password'
      }
    })
    .populate('groupAdmin', '-password')
  return res.status(200).json({ data: chat })
}

const createGroup = async (req, res) => {
  if (!req.body.users || !req.body.name) {
    return res.status(400).json({ message: 'Users and Name not provided' })
  }
  const users = req.body.users
  if (users.length < 2) {
    return res.status(200).json({ message: 'Min 2 Users required for group' })
  }
  users.push(req.user._id)
  const groupChat = await Chat.create({
    chatName: req.body.name,
    isGroupChat: true,
    users: users,
    groupAdmin: req.user._id
  })
  const groups = await Chat.findOne({ _id: groupChat._id })
    .populate('users', '-password')
    .populate('groupAdmin', '-password')
  res.status(200).json({ data: groups })
}

const deleteGroup = async (req, res) => {
  const chatId = req.params.chatId
  await Message.deleteMany({ chat: chatId })
  await Chat.deleteOne({ _id: chatId })
  return res.status(200).json({ message: 'success' })
}

const renameGroup = async (req, res) => {
  const { name, chatId } = req.body
  if (!name || !chatId) {
    return res.status(200).json({ message: 'name and chatId not provided' })
  }
  const chat = await Chat.findByIdAndUpdate(
    chatId,
    { chatName: name },
    { new: true }
  )
    .populate('users', '-password')
    .populate('groupAdmin', '-password')
  if (!chat) {
    return res.status(400).json({ message: 'Chat not found' })
  } else {
    return res.status(200).json({ data: chat })
  }
}

const removeFromGroup = async (req, res) => {
  const { chatId, userId } = req.body
  if (!chatId || !userId) {
    return res.status(400).json({ message: 'chatId and userId not provide' })
  }
  const chat = await Chat.findByIdAndUpdate(
    chatId,
    { $pull: { users: userId } },
    { new: true }
  )
    .populate('users', '-password')
    .populate('groupAdmin', '-password')
  if (!chat) {
    return res.status(400).json({ message: 'Chat not found' })
  } else {
    return res.status(200).json({ data: chat })
  }
}

const addToGroup = async (req, res) => {
  const { chatId, userId } = req.body
  if (!chatId || !userId) {
    return res.status(400).json({ message: 'chatId and userId not provide' })
  }
  const chat = await Chat.findByIdAndUpdate(
    chatId,
    { $push: { users: userId } },
    { new: true }
  )
    .populate('users', '-password')
    .populate('groupAdmin', '-password')
  if (!chat) {
    return res.status(400).json({ message: 'chat not found' })
  } else {
    return res.status(200).json({ data: chat })
  }
}

module.exports = {
  postChat,
  getChat,
  createGroup,
  deleteGroup,
  renameGroup,
  removeFromGroup,
  addToGroup
}

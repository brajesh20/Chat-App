import { createSlice } from '@reduxjs/toolkit'

const myChatSlice = createSlice({
  name: 'myChat',
  initialState: {
    chat: [], // all chats
    selectedChat: null, // selectedChat: null, // chat that is currently selected
    newMessageRecieved: [] // newMessageRecieved: [], // new message received in the chat
    // 	this will be used to show notification in the header
  },
  reducers: {
    addMyChat: (state, action) => {
      state.chat = action.payload
    },
    addSelectedChat: (state, action) => {
      state.selectedChat = action.payload
      const newMessageRecieved = state.newMessageRecieved.filter(
        message => message.chat._id !== action.payload._id
      )
      state.newMessageRecieved = newMessageRecieved
    },
    addNewChat: (state, action) => {
      const isExistChat = state.chat.find(
        chat => chat._id === action.payload._id
      )
      if (!isExistChat) {
        state.chat = [action.payload, ...state.chat]
      }
    },
    deleteSelectedChat: (state, action) => {
      if (state.selectedChat && state.selectedChat._id === action.payload) {
        state.selectedChat = null
      }
      const allChat = state.chat.filter(chat => chat._id !== action.payload)
      state.chat = allChat
    },
    addNewMessageRecieved: (state, action) => {
      if (!state.newMessageRecieved.includes(action.payload)) {
        state.newMessageRecieved = [action.payload, ...state.newMessageRecieved]
      }
    },
    removeNewMessageRecieved: (state, action) => {
      const newMessageRecieved = state.newMessageRecieved.filter(
        message => message.chat._id !== action.payload.chat._id
      )
      state.newMessageRecieved = newMessageRecieved
    }
  }
})

export const {
  addMyChat,
  addSelectedChat,
  addNewChat,
  deleteSelectedChat,
  addNewMessageRecieved,
  removeNewMessageRecieved
} = myChatSlice.actions
export default myChatSlice.reducer

import { deepClone } from '../utils';

/*** ACTION TYPES ***/
const SET_SID = 'SET_SID';
const SET_USERNAME = 'SET_USERNAME';
const NEW_USER = 'NEW_USER';
const USER_DETAILS = 'USER_DETAILS';
const REMOVE_USER = 'REMOVE_USER';
const OPEN_CHAT = 'OPEN_CHAT';
const ADD_MESSAGE = 'ADD_MESSAGE';
const STORED_CHATS = 'STORED_CHATS';
const CLOSE_CHAT = 'CLOSE_CHAT';
const FREEZE_CHAT = 'FREEZE_CHAT';

/*** INITIAL STATE ***/
const defaultState = {
  users: {}, // populated object looks like { Louie: 'thisIsSidString' }
  username: '',
  sid: '',
  chats: {}
  /* How a populated chats object would look
    chats: {
      Louie: {
        roomId: 'asldkfjals',
        open: true,
        messages: [
          {sender: 'Azula', text: 'Hi'}
        ],
        frozen: false
      }
    }
  */
};

export class ChatMessage {
  constructor(sender, text) {
    this.sender = sender;
    this.text = text;
  }
}

export class ChatLog {
  constructor(chatRoomId, isOpen=true, isFrozen=false) {
    this.roomId = chatRoomId;
    this.open = isOpen;
    this.messages = [];
    this.frozen = isFrozen;
  }
}



/*** ACTION CREATORS ***/
export const setSid = sid => ({type: SET_SID, sid});
export const setUsername = username => ({type: SET_USERNAME, username});
export const newUser = user => ({type: NEW_USER, user});
export const addUserDetails = user => ({type: USER_DETAILS, user});
export const removeUser = sid => ({type: REMOVE_USER, sid});
export const openChat = buddy => ({type: OPEN_CHAT, buddy});
export const addMessage = (buddy, message) => ({type: ADD_MESSAGE, buddy, message});
export const retrieveChats = chats => ({type: STORED_CHATS, chats});
export const closeChat = buddy => ({type: CLOSE_CHAT, buddy});
export const freezeChat = buddy => ({type: FREEZE_CHAT, buddy});

/*** REDUCER ***/
export default function (state = defaultState, action) {
  const newState = deepClone(state);
  switch (action.type) {
    case SET_SID:
      newState.sid = action.sid;
      break;
    case SET_USERNAME:
      newState.username = action.username;
      break;
    case STORED_CHATS:
      newState.chats = action.chats;
      break;
    case NEW_USER: {
      if (action.user.sid !== state.sid) {
        newState.users[action.user.username] = action.user.sid;
      }
      break;
    }
    case USER_DETAILS: {
      newState.users[action.user.username] = action.user.sid;
      break;
    }
    case REMOVE_USER: {
      const userList = Object.keys(newState.users);
      const updatedUsers = userList.reduce((acc, user) => {
        if (newState.users[user] !== action.sid) {
          acc[user] = newState.users[user];
        }
        return acc;
      }, {});
      newState.users = updatedUsers;
      break;
    }
    case OPEN_CHAT: {
      const { username, chatroom } = action.buddy;
      if (!state.chats[username]) {
        newState.chats[username] = new ChatLog(chatroom);
      } else {
        newState.chats[username].open = true;
        newState.chats[username].roomId = chatroom;
        newState.chats[username].frozen = false;
      }
      break;
    }
    case ADD_MESSAGE: {
      newState.chats[action.buddy].messages.push(action.message);
      break;
    }
    case CLOSE_CHAT: {
      newState.chats[action.buddy].open = false;
      break;
    }
    case FREEZE_CHAT: {
      newState.chats[action.buddy].frozen = true;
      break;
    }
    default:
      return state;
  }
  return newState;
}

import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import './App.css';
import ChatBar from './ChatBar';
import socket from './mySocket';
import Chats from './Chats';
import Header from './Header';
import { doesNotMatch } from '../utils';
import {
  setSid,
  newUser,
  addUserDetails,
  removeUser,
  openChat,
  addMessage,
  freezeChat
} from '../store';

export class App extends Component {
  constructor(props) {
    super(props);
    this.receiveMessage = this.receiveMessage.bind(this);
    this.disableChatWindow = this.disableChatWindow.bind(this);
  }

  componentDidMount() {
    // Attaching event listeners to the socket
    socket.on('connect', () => {
      socket.emit('my event', {data: 'I\'m connected!'})
    });
    socket.on('sid', message => {
      this.props.setSidToStore(message.data);
    });
    socket.on('new user', message => {
      this.props.setNewUserToStore(message.data);
    });
    socket.on('user details', message => {
      this.props.setActiveUserToStore(message.data);
    });
    socket.on('send user details', message => {
      const sid = message.data
      if (this.props.username) {
        socket.emit('user details', {
          room: sid,
          data: {
            username: this.props.username,
            sid: this.props.sid
          }
        });
      }
    });
    socket.on('remove user', message => {
      this.props.removeUserFromStore(message.data);
    });
    socket.on('invitation', message => {
      const {chatroom, inviter} = message.data;
      socket.emit('accept invitation', {'room': chatroom, 'username': this.props.username, 'buddyName': inviter});
      this.props.activateChatRoom({username: inviter, chatroom});
    });
    socket.on('chat message', message => {
      this.receiveMessage(message);
    });
    socket.on('buddy left room', message => {
      this.disableChatWindow(message.data);

    })
  }

  disableChatWindow(data) {
    const { sender, recipient } = data;
    if (sender !== this.props.username) {
      this.props.disableChat(sender);
    }
  }

  receiveMessage(message) {
    const { sender, recipient, text } = message.data;
    const buddy = doesNotMatch(this.props.username, sender, recipient);
    this.props.addMessageToStore(buddy, {sender, text});
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.chats !== this.props.chats) {
      this.saveChatsToLocalStorage(this.props.username, JSON.stringify(nextProps.chats));
    }
  }

  // To maintain chat history without using database, using localStorage
  saveChatsToLocalStorage(username, chats) {
    if (localStorage) {
      localStorage.setItem(username, chats);
    }
  }

  componentWillUnmount() {
    socket.disconnect();
  }

  render() {
    return (
      <div className="App">
        <Header />
        <ChatBar />
        <Chats chats={this.props.chats}/>
      </div>
    );
  }
}

/*** CONTAINER ***/
const mapState = (state) => {
  return {
    users: state.users,
    username: state.username,
    sid: state.sid,
    chats: state.chats
  };
};

const mapDispatch = (dispatch) => {
  return ({
    setSidToStore(sid) {
      dispatch(setSid(sid));
    },
    setNewUserToStore(user) {
      dispatch(newUser(user));
    },
    setActiveUserToStore(user) {
      dispatch(addUserDetails(user));
    },
    removeUserFromStore(sid) {
      dispatch(removeUser(sid));
    },
    activateChatRoom(chatInfo) {
      dispatch(openChat(chatInfo));
    },
    addMessageToStore(buddy, message) {
      dispatch(addMessage(buddy, message));
    },
    disableChat(buddy) {
      dispatch(freezeChat(buddy));
    }
  });
};

export default connect(mapState, mapDispatch)(App);

/*** PROP TYPES ***/
App.propTypes = {
  users: PropTypes.object.isRequired,
  username: PropTypes.string.isRequired,
  sid: PropTypes.string.isRequired,
  chats: PropTypes.object.isRequired,
  setSidToStore: PropTypes.func.isRequired,
  setNewUserToStore: PropTypes.func.isRequired,
  setActiveUserToStore: PropTypes.func.isRequired,
  removeUserFromStore: PropTypes.func.isRequired,
  activateChatRoom: PropTypes.func.isRequired,
  addMessageToStore: PropTypes.func.isRequired
};

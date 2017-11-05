import React, { Component } from 'react';
import './App.css';
import ChatBar from './ChatBar';
import socket from './mySocket';
import Chats from './Chats';
import { connect } from 'react-redux';

import { setSid, newUser, addUserDetails, removeUser, openChat, addMessage } from './store';

class App extends Component {
  constructor(props) {
    super(props);
    this.receiveMessage = this.receiveMessage.bind(this);
  }

  componentDidMount() {
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
        socket.emit('user details', {room: sid, data: {username: this.props.username, sid: this.props.sid}});
      }
    });
    socket.on('remove user', message => {
      this.props.removeUserFromStore(message.data);
    });
    socket.on('invitation', message => {
      const {chatroom, inviter} = message.data;
      socket.emit('join', {'room': chatroom, 'username': this.props.username});
      this.props.activateChatRoom({username: inviter, chatroom});
    });
    socket.on('chat message', message => {
      this.receiveMessage(message);
    });
  }

  receiveMessage(message) {
    const { sender, recipient, text } = message.data;
    let buddy;
    if (sender === this.props.username) {
      buddy = recipient;
    } else {
      buddy = sender;
    }
    this.props.addMessageToStore(buddy, {sender, text});
    if (localStorage) {
      localStorage.setItem(this.props.username, JSON.stringify(this.props.chats));
    }
  }

  componentWillUnmount() {
    socket.disconnect();
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Chat Server</h1>
        </header>
        <ChatBar />
        <button onClick={() => socket.disconnect()}>DISCONNECT</button>
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
    }
  });
};

export default connect(mapState, mapDispatch)(App);

/*** PROP TYPES ***/

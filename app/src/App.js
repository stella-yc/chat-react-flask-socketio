import React, { Component } from 'react';
import './App.css';
import ChatBar from './ChatBar';
import socket from './mySocket';
import Chat from './Chat';
import { deepClone } from './utils';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: {},
      username: '',
      sid: '',
      chats: {}
    };
    this.setUserName = this.setUserName.bind(this);
    this.openChat = this.openChat.bind(this);
  }

  componentDidMount() {
    socket.on('connect', () => {
      socket.emit('my event', {data: 'I\'m connected!'})
    });
    socket.on('sid', message => {
      this.setState({sid: message['data']});
    });
    socket.on('new user', message => {
      const { username, sid } = message.data;
      if (sid !== this.state.sid) {
        const userList = this.state.users;
        const updatedUserList = Object.assign({}, userList, {[username]: sid});
        this.setState({users: updatedUserList});
        console.log('new user!!', sid)
      }
    });
    socket.on('user details', message => {
      const { username, sid } = message.data;
      const userList = this.state.users;
      const updatedUserList = Object.assign({}, userList, {[username]: sid});
      this.setState({users: updatedUserList});
    });
    socket.on('send user details', message => {
      const sid = message.data
      if (this.state.username) {
        socket.emit('user details', {room: sid, data: {username: this.state.username, sid: this.state.sid}});
      }
    });
    socket.on('remove user', message => {
      console.log('remove user', message);
      const removedUserSid = message.data;
      const users = this.state.users;
      const userList = Object.keys(users);
      const updatedUsers = userList.reduce((acc, user) => {
        if (users[user] !== removedUserSid) {
          acc[user] = this.state.users[user];
        }
        return acc;
      }, {});
      this.setState({users: updatedUsers});
    });
    socket.on('invitation', message => {
      console.log('invitation', message);
      const {chatroom, inviter} = message.data;
      socket.emit('join', {'room': chatroom, 'username': this.state.username});
      if (!this.state.chats[inviter]) {
        const chats = this.state.chats;
        const updatedChats = deepClone(chats);
        updatedChats[inviter] = {
          roomId: chatroom,
          messages: []
        };
        this.setState({chats: updatedChats});
      }
    });
    socket.on('chat notification', message => {
      console.log('Chat Notification: ', message.data.text);
    })
    socket.on('chat message', message => {
      console.log('Chat Message: ', message);
      const { sender, recipient, text } = message.data;
      const chatroom = message.room;
      let buddy;
      if (sender === this.state.username) {
        buddy = recipient;
      } else {
        buddy = sender;
      }
      const chats = this.state.chats;
      const updatedChats = deepClone(chats);
      const chatHistory = chats[buddy].messages;
      const updatedHistory = [...chatHistory, {sender, text}];
      updatedChats[buddy].messages = updatedHistory;
      this.setState({chats: updatedChats});
    });
  }

  componentWillUnmount() {
    socket.disconnect();
  }

  setUserName(username) {
    this.setState({username: username})
  }

  openChat(event) {
    const buddy = JSON.parse(event.target.value);
    const chats = this.state.chats;


    console.log('openChat!!', buddy);
    // Create unique roomID based on each sid
    const roomId = `${buddy.sid}${this.state.sid}`;
    socket.emit('join', {'room': roomId, 'buddySid': buddy.sid, 'username': this.state.username});
    // open a chat window
    if (!chats[buddy.username]) {
      const updatedChats = deepClone(chats);
      updatedChats[buddy.username] = {
        'roomId': roomId,
        messages: []
      };
      this.setState({chats: updatedChats});
    }
  }

  render() {
    const chats = this.state.chats;
    const buddies = Object.keys(chats);
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Chat Server</h1>
        </header>
        <ChatBar
          loggedIn={this.state.username.length > 0}
          username={this.state.username}
          setUserName={this.setUserName}
          sid={this.state.sid}
          users={this.state.users}
          openChat={this.openChat}
        />
        <button onClick={() => socket.disconnect()}>DISCONNECT</button>
        {
          buddies.map(buddy =>
            <Chat
              key={buddy}
              username={this.state.username}
              buddyName={buddy}
              roomId={chats[buddy].roomId}
              messages={chats[buddy].messages}
            />
          )
        }
      </div>
    );
  }
}

export default App;

import React, { Component } from 'react';
import './App.css';
import ChatBar from './ChatBar';
import socket from './mySocket';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: {},
      username: '',
      sid: '',
      chats: []
    };
    this.setUserName = this.setUserName.bind(this);
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
    })
    socket.on('send user details', message => {
      const sid = message.data
      if (this.state.username) {
        socket.emit('user details', {room: sid, data: {username: this.state.username, sid: this.state.sid}});
      }
    })
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
    })

  }

  componentWillUnmount() {
    socket.disconnect();
  }

  setUserName(username) {
    this.setState({username: username})
  }

  render() {
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
        />
        <button onClick={() => socket.disconnect()}>DISCONNECT</button>
      </div>
    );
  }
}

export default App;

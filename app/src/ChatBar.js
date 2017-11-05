import React, { Component } from 'react';
import { connect } from 'react-redux';
import './ChatBar.css';
import Username from './Username';
import Conversation from './Conversation';
import socket from './mySocket';

import { openChat } from './store';

class ChatBar extends Component {

  openChat(event) {
    const buddy = JSON.parse(event.target.value);
    const roomId = `${buddy.sid}${this.props.sid}`; // Create unique roomID based on each sid
    socket.emit('join', {
      'room': roomId,
      'buddySid': buddy.sid,
      'username': this.props.username
    });
    this.props.activateChatRoom({username: buddy.username, chatroom: roomId});
  }

  render() {
    return (
      <div className="ChatBar">
        {
          this.props.loggedIn
          ? <h3>{`Welcome, ${this.props.username}!`}</h3>
          : <Username />
        }
        <Conversation
          openChat={this.props.openChat}
        />
      </div>
    );
  }
}

/*** CONTAINER ***/
const mapState = (state) => {
  return {
    loggedIn: state.username.length > 0,
    users: state.users,
    username: state.username,
    sid: state.sid,
    chats: state.chats

  };
};

const mapDispatch = (dispatch) => {
  return ({
    activateChatRoom(chatInfo) {
      dispatch(openChat(chatInfo));
    }
  });
};

export default connect(mapState, mapDispatch)(ChatBar);

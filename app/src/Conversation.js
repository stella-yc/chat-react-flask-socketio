import React from 'react';
import { connect } from 'react-redux';
import socket from './mySocket';
import { openChat } from './store';
// import './ChatBar.css';

const Conversation = (props) => {
  const { users } = props;

  const startChat = (event) => {
    const buddy = JSON.parse(event.target.value);
    const roomId = `${buddy.sid}${props.sid}`; // Create unique roomID based on each sid
    socket.emit('join', {
      'room': roomId,
      'buddySid': buddy.sid,
      'username': props.username
    });
    props.activateChatRoom({username: buddy.username, chatroom: roomId});
  }

  return (
    <div>
      <h5>Start a conversation</h5>
      <select
        name="users"
        onChange={startChat}
      >
        <option value="">Select a User</option>
        {
          Object.keys(users).map(username => {
            let userData = JSON.stringify({'username': username, 'sid': users[username] });
            return <option key={users[username]} value={userData} >{username}</option>
          })
        }
      </select>
    </div>
  );
};

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
    activateChatRoom(chatInfo) {
      dispatch(openChat(chatInfo));
    },
  });
};

export default connect(mapState, mapDispatch)(Conversation);

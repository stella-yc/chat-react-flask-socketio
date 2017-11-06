import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import socket from './mySocket';
import { openChat } from '../store';
import './UsersList.css';

const UsersList = (props) => {
  const { users } = props;

  const startChat = (event) => {
    if (!props.username.length) {
      return alert('You must first enter your Name');
    }
    if (event.target.value !== "") {
      const buddy = JSON.parse(event.target.value);
      const roomId = `${buddy.sid}${props.sid}`; // Create unique roomID based on each sid
      socket.emit('join', {
        'room': roomId,
        'buddyName': buddy.username,
        'buddySid': buddy.sid,
        'username': props.username
      });
      props.activateChatRoom({username: buddy.username, chatroom: roomId});
    }
  }

  return (
    <div className="UsersList">
      <p className="UsersList-title">Start Chat</p>
      <select
        name="users"
        onChange={startChat}
        className="UsersList-select"
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
  };
};

const mapDispatch = (dispatch) => {
  return ({
    activateChatRoom(chatInfo) {
      dispatch(openChat(chatInfo));
    },
  });
};

export default connect(mapState, mapDispatch)(UsersList);

/*** PROP TYPES ***/
UsersList.propTypes = {
  users: PropTypes.object.isRequired,
  username: PropTypes.string.isRequired,
  sid: PropTypes.string.isRequired,
  activateChatRoom: PropTypes.func.isRequired
};

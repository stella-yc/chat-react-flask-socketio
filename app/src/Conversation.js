import React, { Component } from 'react';
// import './ChatBar.css';

const Conversation = (props) => {
  const { users } = props;
  return (
    <div>
      <h5>Start a conversation</h5>
      <select
        name="users"
        onChange={(event) =>
          props.openChat(event)}
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



export default Conversation;

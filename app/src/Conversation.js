import React, { Component } from 'react';
// import './ChatBar.css';

const Conversation = (props) => {
  const { users } = props;
  return (
    <div>
      <h5>Start a conversation</h5>
      <select
        name="users"
        onChange={(event) => console.log(event.target.value)}
      >
        <option value="">Select a User</option>
        {
          Object.keys(users).map(username =>
            <option key={users[username]} value={users[username]} >{username}</option>
          )
        }
      </select>
    </div>
  );
};



export default Conversation;

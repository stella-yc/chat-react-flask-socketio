import React, { Component } from 'react';

import './ChatBar.css';
import Username from './Username';
import Conversation from './Conversation';

class ChatBar extends Component {

  render() {
    return (
      <div className="ChatBar">
        {
          this.props.loggedIn
          ? <h3>{`Welcome, ${this.props.username}!`}</h3>
          : <Username
              setUserName={this.props.setUserName}
              sid={this.props.sid}
            />
        }
        <Conversation
          users={this.props.users}
        />
      </div>
    );
  }
}

export default ChatBar;

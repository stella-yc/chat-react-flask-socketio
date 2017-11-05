import React, { Component } from 'react';
import { connect } from 'react-redux';

import socket from './mySocket';

import './Chat.css';

class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputMessage: ''
    };
    this.sendMessage = this.sendMessage.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  sendMessage(event) {
    event.preventDefault();
    const text = this.state.inputMessage;
    const sender = this.props.username;
    const recipient = this.props.buddyName;
    const data = { sender, text, recipient };
    socket.emit('send chat', {room: this.props.roomId, data});
    this.setState({inputMessage: ''});
  }

  handleChange(event) {
    this.setState({inputMessage: event.target.value});
  }

  render() {
    const { buddyName, messages } = this.props;
    return (
      <div className="Chat">
        <div>
          <h4>{buddyName}</h4>
        </div>
        <div className="Chat-area">
          <ul className="Chat-messages">
            {messages.map(msg =>
              <li>
                <span className="Chat-sender">{`${msg.sender}: `}</span>
                <span className="Chat-text">{msg.text}</span>
              </li>
            )}
          </ul>
        </div>
        <form onSubmit={this.sendMessage}>
          <input
            className="Chat-inputmessage"
            type="text"
            name="inputMessage"
            placeholder="Type here..."
            onChange={this.handleChange}
            value={this.state.inputMessage}
          />
          <input type="submit" value="Send"/>
        </form>
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

export default connect(mapState)(Chat);

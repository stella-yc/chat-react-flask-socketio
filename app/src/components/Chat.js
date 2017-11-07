import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import socket from './mySocket';
import { closeChat } from '../store';
import './Chat.css';

class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputMessage: ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.closeChatWindow = this.closeChatWindow.bind(this);
    this.placeholderText = this.placeholderText.bind(this);
    this.scrollToBottom = this.scrollToBottom.bind(this);
  }

  handleChange(event) {
    if (!this.props.frozen) {
      this.setState({inputMessage: event.target.value});
    }
  }

  sendMessage(event) {
    event.preventDefault();
    // if chat buddy has left, don't want to allow user to keep sending messages
    // to an empty chatroom!
    if (!this.props.frozen) {
      const text = this.state.inputMessage;
      const sender = this.props.username;
      const recipient = this.props.buddyName;
      const data = { sender, text, recipient };
      socket.emit('send chat', {room: this.props.roomId, data});
      this.setState({inputMessage: ''});
    }
  }

  placeholderText(frozen) {
    // if chat buddy has left, don't want to allow user to keep sending messages
    // to an empty chatroom!
    if (!frozen) {
      return 'Type here...';
    } else {
      return `${this.props.buddyName} has left!`;
    }
  }

  scrollToBottom() {
    const scrollHeight = this.chatArea.scrollHeight;
    const height = this.chatArea.clientHeight;
    const maxScrollTop = scrollHeight - height;
    this.chatArea.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
  }

  componentDidMount() {
   this.scrollToBottom();
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  closeChatWindow() {
    const { roomId, buddyName, setClosedChatToStore, username } = this.props;
    setClosedChatToStore(buddyName);
    socket.emit('leaving chatroom', {
      'room': roomId,
      'data': {
        'sender': username,
        'recipient': buddyName
      }});
  }

  render() {
    const { buddyName, messages } = this.props;
    return (
      <div className="Chat">
        <div className="Chat-header">
          <h4 className="Chat-name">{buddyName}</h4>
          <button className="Chat-close-button"onClick={this.closeChatWindow}>X</button>
        </div>
        <div
          className="Chat-area"
          ref={(el) => this.chatArea = el}
        >
          <ul className="Chat-messages">
            {
              messages.map((msg, idx) => {
                return (
                  <li key={idx} className="Chat-message">
                    <span className="Chat-sender">{`${msg.sender}: `}</span>
                    <span className="Chat-text">{msg.text}</span>
                  </li>
                );
              })
            }
          </ul>
        </div>
        <form onSubmit={this.sendMessage} className="Chat-footer">
          <input
            className="Chat-inputmessage"
            type="text"
            name="inputMessage"
            placeholder={this.placeholderText(this.props.frozen)}
            onChange={this.handleChange}
            value={this.state.inputMessage}
          />
          <input type="submit" value="Send" className="Chat-submit"/>
        </form>
      </div>
    );
  }
}

/*** CONTAINER ***/
const mapState = (state) => {
  return {
    username: state.username,
  };
};

const mapDispatch = (dispatch) => {
  return ({
    setClosedChatToStore(buddy) {
      dispatch(closeChat(buddy));
    }
  });
};
export default connect(mapState, mapDispatch)(Chat);

/*** PROP TYPES ***/
Chat.propTypes = {
  username: PropTypes.string.isRequired,
  buddyName: PropTypes.string.isRequired,
  roomId: PropTypes.string.isRequired,
  messages: PropTypes.array.isRequired,
  frozen: PropTypes.bool,
  setClosedChatToStore: PropTypes.func.isRequired
};

import React, { Component } from 'react';
import { connect } from 'react-redux';
// import './ChatBar.css';
import socket from './mySocket';
import { setUsername, retrieveChats } from './store';

class Username extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit (evt) {
    evt.preventDefault();
    console.log(this.state.username);
    socket.emit('register user', {data: {username: this.state.username, sid: this.props.sid}});
    console.log('this.props', this.props);
    this.props.setUsernameToStore(this.state.username);
    this.props.retrieveChatHistory(this.state.username);
  }

  handleChange(field) {
    const updateState = (evt) => {
      const change = {};
      change[field] = evt.target.value;
      this.setState(change);
    };
    return updateState;
  }

  render() {
    return (
      <div className="Username">
        <form onSubmit={this.handleSubmit}>
          <div className="Username-form-element">
            <label htmlFor="username">Username</label>
            <input
              id="input-username"
              name="username"
              type="text"
              onChange={this.handleChange('username')}
            />
          </div>
          <input
            type="submit"
          />
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

const mapDispatch = (dispatch) => {
  return ({
    setUsernameToStore(username) {
      dispatch(setUsername(username));
    },
    retrieveChatHistory(username) {
      if (localStorage) {
        let previousChats = localStorage.getItem(username);
        if (previousChats) {
          previousChats = JSON.parse(previousChats);
          console.log('previousChats', previousChats);
          Object.keys(previousChats).forEach(chat => {
            previousChats[chat].open = false;
          })
          dispatch(retrieveChats(previousChats));
        }
      }
    }
  });
};

export default connect(mapState, mapDispatch)(Username);

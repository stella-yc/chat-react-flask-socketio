import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import './Username.css';
import socket from './mySocket';
import { setUsername, retrieveChats } from '../store';


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
    socket.emit('register user', {data: {username: this.state.username, sid: this.props.sid}});
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
            <label htmlFor="username">Name</label>
            <input
              id="input-username"
              name="username"
              type="text"
              className="Username-input"
              onChange={this.handleChange('username')}
            />
          </div>
          <input
            className="Username-submit"
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
    username: state.username,
    sid: state.sid
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

/*** PROP TYPES ***/
Username.propTypes = {
  username: PropTypes.string.isRequired,
  sid: PropTypes.string.isRequired,
  setUsernameToStore: PropTypes.func.isRequired,
  retrieveChatHistory: PropTypes.func.isRequired
};

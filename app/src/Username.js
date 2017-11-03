import React, { Component } from 'react';
// import './ChatBar.css';
import socket from './mySocket';

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
    this.props.setUserName(this.state.username);
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

export default Username;

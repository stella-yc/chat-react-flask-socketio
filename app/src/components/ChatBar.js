import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import './ChatBar.css';
import Username from './Username';
import UsersList from './UsersList';

const ChatBar = (props) => {
  return (
    <div className="ChatBar">
      <div className="ChatBar-element">
        {
          props.loggedIn
          ? <h3>{`Welcome, ${props.username}!`}</h3>
          : <Username />
        }
      </div>
      <div className="ChatBar-element">
        <UsersList />
      </div>
    </div>
  );
}

/*** CONTAINER ***/
const mapState = (state) => {
  return {
    loggedIn: state.username.length > 0,
    username: state.username
  };
};

export default connect(mapState)(ChatBar);

/*** PROP TYPES ***/
ChatBar.propTypes = {
  loggedIn: PropTypes.bool.isRequired,
  username: PropTypes.string.isRequired,
};

import React from 'react';
import PropTypes from 'prop-types';
import './Chats.css';

import Chat from './Chat';

const Chats = (props) => {
  const chats = props.chats;
  const buddies = Object.keys(chats);
  return (
    <div className="Chats">
      {
        buddies.map(buddy => {
          if (chats[buddy].open) {
            return (
              <Chat
                key={buddy}
                buddyName={buddy}
                roomId={chats[buddy].roomId}
                messages={chats[buddy].messages}
                frozen={chats[buddy].frozen}
              />
            );
          } else {
            return null;
          }
        })
      }
    </div>
  );
};

export default Chats;

/*** PROP TYPES ***/
Chats.propTypes = {
  chats: PropTypes.object.isRequired,
};

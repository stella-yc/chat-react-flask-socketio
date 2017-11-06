import io from 'socket.io-client';

let socket;
if (process.env.NODE_ENV === 'development') {
  socket = io.connect(window.location.protocol + '//' + document.domain + ':5000');
} else {
  socket = io.connect(window.location.protocol + '//' + document.domain + ':' + window.location.port);
}

export default socket;

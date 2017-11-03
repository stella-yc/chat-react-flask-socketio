import io from 'socket.io-client';

const socket = io.connect(window.location.protocol + '//' + document.domain + ':5000');
// const socket = io.connect(window.location.protocol + '//' + document.domain + ':' + window.location.port);

export default socket;

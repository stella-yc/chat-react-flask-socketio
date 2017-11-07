import os
from flask import Flask, send_from_directory, request
from flask_socketio import SocketIO, emit, join_room, leave_room

app = Flask(__name__, static_folder='app/build')
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)

# Serve React App

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if(path == ""):
        return send_from_directory('app/build', 'index.html')
    else:
        if(os.path.exists("app/build/" + path)):
            return send_from_directory('app/build', path)
        else:
            return send_from_directory('app/build', 'index.html')

# Socketio event handlers

@socketio.on('connect')
def connect():
    # Send the user their unique sid
    emit('sid', {'data': request.sid})
    # Tell all active users to send their user information to newly logged in user
    emit('send user details', {'data': request.sid}, broadcast=True)

@socketio.on('user details')
def send_room_message(message):
    # send user details to the newly logged-in user
    emit('user details',
         {'data': message['data']},
         room=message['room'])

@socketio.on('register user')
def broadcast_user(message):
    # sends newly logged-in user details to all active users
    emit('new user', {'data': message['data']}, broadcast=True)

@socketio.on('join')
def join(message):
    # join chatroom
    chatroom = message['room']
    user = message['username']
    recipient = message['buddyName']
    join_room(chatroom)
    # invite chat buddy
    if 'buddySid' in message:
        buddySid = message['buddySid']
        emit('invitation', {'data': {'chatroom': chatroom, 'inviter': message['username']}}, room=buddySid);

@socketio.on('accept invitation')
def acceptInvite(message):
    chatroom = message['room']
    user = message['username']
    buddy = message['buddyName']
    join_room(chatroom)

@socketio.on('send chat')
def chatMessage(message):
    chatroom = message['room']
    emit('chat message',
         { 'room': chatroom,
         'data': message['data']
         }, room=chatroom)

@socketio.on('leaving chatroom')
def chatMessage(message):
    chatroom = message['room']
    emit('buddy left room', {'data': message['data']}, room=chatroom)
    leave_room(chatroom)

@socketio.on('disconnect')
def on_disconnect():
    print('Client disconnected', request.sid)
    emit('remove user', {'data': request.sid }, broadcast=True)

# Start the Server

if __name__ == '__main__':
    app.run(use_reloader=True, port=5000, threaded=True)

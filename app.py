# from flask import Flask, render_template, send_from_directory
#
# app = Flask(__name__)
#
# @app.route("/")
# def index(path):
#     return send_from_directory('app/public', 'index.html')
#
# if __name__ == "__main__":
#     app.run()

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
    print('Connected to client: ' + request.sid)
    emit('sid', {'data': request.sid})
    emit('send user details', {'data': request.sid}, broadcast=True)

@socketio.on('user details')
def send_room_message(message):
    emit('user details',
         {'data': message['data']},
         room=message['room'])

@socketio.on('register user')
def broadcast_user(message):
    print(message['data'])
    emit('new user', {'data': message['data']}, broadcast=True)

@socketio.on('join')
def join(message):
    chatroom = message['room']
    join_room(chatroom)
    print(message['username'] + ' has entered chatroom ' + chatroom)
    emit('chat notification',
         {'data': {'buddy': 'notification', 'text': message['username'] + ' has entered.'}}, room=chatroom)
    if 'buddySid' in message:
        buddySid = message['buddySid']
        print('buddySid in message')
        emit('invitation', {'data': {'chatroom': chatroom, 'inviter': message['username']}}, room=buddySid);

@socketio.on('send chat')
def chatMessage(message):
    chatroom = message['room']
    emit('chat message',
         { 'room': chatroom,
         'data': message['data']
         }, room=chatroom)

@socketio.on('disconnect_request')
def disconnect_request(message):
    print('disconnect request')
    emit('remove user', message['data'], broadcast=True)
    emit('my_response',
         {'data': 'Disconnected!'})
    disconnect()

@socketio.on('disconnect')
def on_disconnect():
    print('Client disconnected', request.sid)
    emit('remove user', {'data': request.sid }, broadcast=True)

# Start the Server

if __name__ == '__main__':
    app.run(use_reloader=True, port=5000, threaded=True)

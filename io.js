var app = require('express');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var moment = require('moment');
var clients = 0;
var usernames = {};
var room = 'room1';
io.on('connection', function(socket) {
	clients++;
	io.sockets.emit('broadcast', { // to broadcast
		description: clients + ' clients connected!'
	});
	socket.emit('newclientconnect', 'SERVER: ', ' Welcome to chat!');
	// when the client emits 'adduser', this listens and executes
	socket.on('adduser', function(username) {
		// store the username in the socket session for this client
		socket.username = username;
		// store the room name in the socket session for this client
		socket.room = room;
		// add the client's username to the global list
		usernames[username] = username;
		// send client to room
		socket.join(room);
		// echo to client they've connected
		socket.emit('newclientconnect', 'SERVER: ', 'you have connected to ' + room);
		// echo to room  that a person has connected to their room
		socket.broadcast.to(room).emit('newclientconnect', 'SERVER: ', username + ' has connected to this room');
		//socket.emit('updaterooms', rooms, room);

	});
	socket.on('chat message', function(msg) {
		io.emit('chat message', {
			message: msg,
			user: socket.username,
			date: moment(new Date()).format('YYYY-MM-DD, hh:mm a')
		});
	});
	socket.on('disconnect', function() {
		console.log('user disconnected');
		// remove the username from global usernames list
		delete usernames[socket.username];

		clients--;
		io.sockets.emit('broadcast', {
			description: clients + ' clients connected!'
		});
		socket.leave(socket.room);
	});
});

module.exports = io;
var app = require('express');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var moment = require('moment');
var clients = 0; // for counting number of user connected
var usernames = {};
var room = "room1";
/*demo for usernames */
// var usernames={
// 	'sdsdasdas':{
// 		name:'Hari',
// 		room:'hari4343235'
// 	}
// };
io.on('connection', function(socket) {
	clients++;
	io.sockets.emit('broadcast', { // to broadcast
		description: clients + ' clients connected!'
	});
	socket.emit('newclientconnect', 'SERVER: ', ' Welcome to chat!');
	// when the client emits 'adduser', this listens and executes
	socket.on('adduser', function(user) {
		// send client to room
		socket.join(room);
		// store the username in the socket session for this client
		// add the client's username to the global list
		usernames[socket.id] = user;
		socket.username = user;
		// store the room name in the socket session for this client
		socket.room = room;
		// echo to client they've connected
		socket.emit('newclientconnect', 'SERVER: ', 'you have connected to ' + room);
		// echo to room  that a person has connected to their room
		socket.broadcast.to(room).emit('newclientconnect', 'SERVER: ', user + ' has connected to this room');
		//socket.emit('updaterooms', rooms, room);


	});
	socket.on('chat message', function(msg) {
		io.to(room).emit('chat message', {
			message: msg,
			user: socket.username,
			date: moment().valueOf() //date: moment(new Date()).format('YYYY-MM-DD, hh:mm a')
		});
	});
	socket.on('disconnect', function() {

		if (typeof usernames[socket.id] !== 'undefined') {
			socket.leave(usernames[socket.id].room);
			console.log('user disconnected');
			// remove the username from global usernames list
			delete usernames[socket.username];

			clients--;
			io.to(room).emit('disconnectMessage', {
				description: socket.username + ' has left!'
			});
		}

	});
			console.log(Object.keys(usernames).length);
		console.log('session usernames: '+socket.username);
});

/*
 * SOcket.broadcast.emit  ----emits to everyone except to the person who emits
 * io.emit ----- emits to everyone including to person who emits
 */

module.exports = io;
$(document).ready(function() {
	window.onbeforeunload = function () {
  window.scrollTo(0, 0);
}
	$('#chat-content').on('mousewheel DOMMouseScroll', function(e) {
		var e0 = e.originalEvent,
			delta = e0.wheelDelta || -e0.detail;

		this.scrollTop += (delta < 0 ? 1 : -1) * 25;
		e.preventDefault();
	});

	/* scroll to top when page changed */
	$('#pager-bottom button').click(function() {
		window.scrollTop(0);
	});
	
	/*jQuery Ui accordion */
	$("#accordion").accordion({
		collapsible: true,
		heightStyle: "content"
	});
	$(".nav-tabs a").click(function() {
		$(this).tab('show');
	});

	$("#chat").click(function() {
		if (window.localStorage['user-token']) {
			$('#chat-box').show();
			$('#nouser-box').show();
		} else {
			window.location.href = "/#/login";
		}
	});
	$("#chat-close").click(function() {
		$('#chat-box').hide();
	});



	// check if user log in and only perform chat
	if (window.localStorage['user-token']) {

		/* Socket starts here */
		var socket = io();

		var user = JSON.parse(window.atob(window.localStorage['user-token'].split('.')[1])).name;
		// var room=user+Date.now(); // make unique room using date

		$('#chat-form').submit(function() {
			if ($('#text').val() != '' || null) {
				socket.emit('chat message', escapeHtml($('#text').val()));
				$('#text').val('');
				return false;
			}

			return false;
		});

		// /* handle add user  or join event */
		socket.emit('adduser', user);

		/* Handle when chat starts*/
		socket.on('chat message', function(msg) {
			var timestamp = moment.utc(msg.date); //
			$('#chat-content').prepend("<div style='border-bottom:1px solid black;margin:0'><span style='font-weight:bold;font-size:22px'>" + msg.user + "</span>" + " : " + msg.message + "<br>" + timestamp.local().format('YYYY-MM-DD, hh:mm a') + "</div>");
		});
		/*To broadcast*/
		socket.on('disconnectMessage', function(data) {
			// console.log(data.description);
		});
		/* When new client connects*/
		socket.on('newclientconnect', function(server, data) {
			// console.log(server, data);
		});

		/* escape html entities for preventing XXS */
		function escapeHtml(text) {
			var map = {
				'&': '&amp;',
				'<': '&lt;',
				'>': '&gt;',
				'"': '&quot;',
				"'": '&#039;'
			};

			return text.replace(/[&<>"']/g, function(m) {
				return map[m];
			});
		}


	} else {

	}

});
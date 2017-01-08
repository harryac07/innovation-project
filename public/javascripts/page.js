$(document).ready(function() {

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

	// $('#accordion ul li').hover(function() {
	// 	$(this).css('background-color', '#632927');
	// 	$('.list-unstyled li a').css('color', '#fff');
	// }, function() {
	// 	$('.list-unstyled li a').css('background-color', '');
	// 	$('.list-unstyled li a').css('color', 'black');
	// });

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



	/* Socket starts here */
	var socket = io('https://profinder1.herokuapp.com');

	// check if user log in and only perform chat
	if (window.localStorage['user-token']) {
		var user = JSON.parse(window.atob(window.localStorage['user-token'].split('.')[1])).name;

		$('#chat-form').submit(function() {
			if ($('#text').val() != '' || null) {
				socket.emit('chat message', $('#text').val());
				$('#text').val('');
				return false;
			}

			return false;
		});

		// /* handle add user */
		socket.emit('adduser', user);

		/* Handle when chat starts*/
		socket.on('chat message', function(msg) {
			$('#chat-content').prepend("<div style='border-bottom:1px solid black;margin:0'><span style='font-weight:bold;font-size:22px'>" + msg.user + "</span>" + " : " + msg.message + "<br>" + msg.date + "</div>");
		});
		/*To broadcast*/
		socket.on('broadcast', function(data) {
			console.log(data.description);
		});
		/* When new client connects*/
		socket.on('newclientconnect', function(server, data) {
			console.log(server, data);
		});
	} else {

	}

});
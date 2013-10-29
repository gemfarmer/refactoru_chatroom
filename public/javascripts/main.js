var thisId = {}
var domId = ""
$secretMessage = $('#secret-message')
$users = $('#users')
$messageInput = $('#message-input')
$exitChat = $('#exit-chat')
$enterChat = $('#enter-chat')

var updateSecret = function(id, enter){
	if(enter){
		if($secretMessage.hasClass('hidden')){
			$secretMessage.removeClass('hidden')
		}
		$secretMessage.text(id + " has entered the chat room!")
		$secretMessage.removeClass('alert-info')
		$secretMessage.addClass('alert-success')
	}
	if(!enter){
		if($secretMessage.hasClass('hidden')){
			$secretMessage.removeClass('hidden')
		}
		$secretMessage.text(id + " has left the chat room!")
		$secretMessage.removeClass('alert-success')
		$secretMessage.addClass('alert-info')
	}
}

var addUsers = function(socket){
	
	socket.on('adduser', function(user){
		console.log("user object:",user)
		
		$users.empty()
		console.log(thisId)
		if(user.length>0){
			thisId.id = user[user.length-1]['id']
			

			console.log(thisId)
			for(var i in user){
				domId = user[i]['id']
				$users.append('<div>'+domId+'<div>')
			} 
			updateSecret(thisId.id, true)
		}
	})	
}
var attachEvents = function(socket){
	socket.on('connect', function(message){
		
		console.log("connnected")
		addUsers(socket)

		$messageInput.on('keyup',function(e){
			$el = $(this)
			if(e.which === 13){
	            socket.emit('message', $el.val())
	            $el.val('')
	        }
		})
		socket.on('message', function(message){
			var outputtedMessage = message + '<br>'
			console.log("message:",outputtedMessage)
			$('#room').append(outputtedMessage)
		})
		$exitChat.on('click',function(e){
			console.log("exit chat")
			e.preventDefault();
			console.log(thisId)

			updateSecret(thisId.id, false)

			exit = {remove: thisId.id}
			console.log("clicked")
			socket.emit('exitchat', exit)
			$users.empty()

			

		})	
	})
}
$(function(){
	$enterChat.on('click',function(e){
		e.preventDefault();

		console.log("add user")

		var socket = io.connect()

		attachEvents(socket)
		
	})
	
	
});

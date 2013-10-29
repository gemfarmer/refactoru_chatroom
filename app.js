
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var socketio = require('socket.io')
var app = express();
var mongoose = require('mongoose');

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//index route
app.get('/', routes.index);
 
//Create the server
var server = http.createServer(app)

//Start the web socket server
var io = socketio.listen(server);


// set up mongoDB
mongoose.connect('mongodb://localhost/chatroom');

var User = mongoose.model('User',{
	id: String
});  	


var users = []

io.sockets.on('connection', function(socket) {
	console.log('socket:', socket.id)

	// add id to DB
	var user = new User(socket);
	user.save(function(err,data){
        console.log(data)
    })
	console.log("USERS",User)

	newId = {
		id: socket.id
	}
	users.push(newId)
	console.log('new person connected')

	io.sockets.emit('adduser', users)

	console.log("users:", users)
    socket.on('message', function(message){
    	console.log("message:",message)
    	socket.broadcast.emit('message', message)
    });
    socket.on('exitchat',function(socket){
	// socket.disconnect
		console.log("exit chat", socket.remove)
		
		console.log("useres/", users)
		for(i in users){
			if(users[i]['id'] === socket.remove){
				users.splice(i,1)
				console.log("removed",socket.remove)
				console.log(users)
			}
		}
		io.sockets.emit('adduser', users)
		User.findOneAndRemove({id: socket.remove})
		
	});
	socket.on('disconnect',function(socket){
		for(i in users){
			if(users[i]['id'] === socket.remove){
				users.splice(i,1)
				console.log("removed", socket.remove)
				console.log(users)

			}
		}
		io.sockets.emit('adduser', users)
		User.findOneAndRemove({id: socket.remove})
	})	
	
});





server.listen(3000, function(){
  console.log('Express server listening on port ' + app.get('port'));
});



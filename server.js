const express = require('express'); 
const path = require('path');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

// when accessing the server address render the view called index.html
app.use('/', (req, res) => {
    res.render('index.html');
});

let messages = [];

io.on('connection', socket => {
    // when connecting shows the id of the connected socket.
    console.log(`Socket connected: ${socket.id}`);
 
    // when a socket connects it will see all previous messages.

    socket.emit('previousMessages', messages);
    
    //forwards the message to all sockets joined in the application.
    socket.on('sendMessage', data => {
        messages.push(data);
        socket.broadcast.emit('receivedMessage', data);
    });    
});

// set to listen to port 3000
server.listen(3000);
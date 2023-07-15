const http = require('http');
const express = require('express');
const socketId = require('socket.io');
const port = 5000
const app = express();
const server = http.createServer(app);
const passport = require('passport');
require('dotenv').config();
const bodyparser = require('body-parser');
const cors = require('cors')
const mongoose = require('mongoose');
const Routes = require('./Routes')
app.use(bodyparser.json());
const path = require('path');


app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));
const session = require('express-session');
const Message = require('./messageModel');
const User = require('./myModel');
require('./GoogleAuth');



app.use(session({
    secret: 'aashdfkashdfkajhdj',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());



const users = [{}]
const io = socketId(server);


mongoose.connect(process.env.MONGODB, {
    dbName: 'FacebookUser',
})

app.get('/Failed', (req, res) => {
    res.send('Facebook Authtication Failed!');
})

app.use('/', Routes);


app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/Failed', successRedirect: 'http://localhost:3000/Chat' }),

);
// facebook auth system 

// facebook auth system 
app.get('/auth/facebook', passport.authenticate('facebook'));


app.get('/Login/Success', async (req, res) => {
    const data = req.user;
    if (req.user) {
        let user;
        try {
            user = await User.findOne({ accountId: data?.id })
        } catch (err) {
            console.log(err.message);
        }

        if (!user) return res.status(404).json({ success: false, message: 'user not found!' });

        res.status(200).json({ success: true, message: 'Login Successfully', user })
    } else {
        res.status(403).json({ success: false, message: 'Not Authrozied' })
    }
})

app.get('/Signout', (req, res) => {
    try {
        req.session.destroy(function (err) {
            console.log('Logout successfully!');
            res.status(200).json({success:true, message:'Logout successfully'});
        })
    } catch (err) {
        res.status(400).send({ message: 'Failled to signout' })
    }
})




// message app connection code start here 
io.on('connection', (socket) => {
    console.log('new connection');

    socket.on('joined', ({ user }) => {
        console.log(user, ' has joined');
        users[socket.id] = user;
        socket.emit('welcome', { user: 'Admin', message: `welcome to the chat ${users[socket.id]}` })
        socket.broadcast.emit('userJoined', { user: 'Admin', message: `${users[socket.id]} has joined` });
    })

    socket.on('message', async ({ message, FormatDate, userId }) => {

        const user = await User.findById(userId);
        if(user) {
            io.emit('sendmessage', {userName: user.name, message, date: FormatDate })
        }
    })

    socket.on('disconnected', () => {
        socket.broadcast.emit('leave', { user: 'Admin', message: `${users[socket.id]} has left` })
        console.log('User left');
    })

})



server.listen(port, () => {
    console.log(`server is working on port http://localhost:${port}`);
})
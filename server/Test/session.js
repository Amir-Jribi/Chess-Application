const express = require('express');
const session = require('express-session')
const SQLiteStore = require('connect-sqlite3')(session);
const cookieParser = require('cookie-parser');
const path=require('path');
const WebSocket = require('ws');
const http = require('http');
const app=express();
app.use(express.urlencoded({extended:true}));

const sessionMiddleware = session({
    secret : 'secret-key',
    resave:false,
    saveUninitialized:true,
    cookie : {secure:false}
})
app.use(sessionMiddleware);



const wrap = (middleware)=>(ws,req,next)=>{
    middleware(req,{},next);
};
const server = http.createServer(app);
const wss = new WebSocket.Server({noServer:true});
server.on('upgrade',(request,socket,head)=>{
    sessionMiddleware(request,{},()=>{
        if (request.session.userId){
            wss.handleUpgrade(request,socket,head,(ws)=>{
                wss.emit('connection',ws,request);
            })
        }
        else {
            socket.destroy();
        }
    });
});

wss.on('connection',(ws,req)=>{
    const userId = req.session.userId;
    console.log(`Connected websocket for user:${userId}`);
    ws.on('message',(message)=>{
        const data=JSON.parse(message);
        console.log(data);
        // ws.send(`Data stored for user: ${userId}`)
    })
})

app.get('/login',(req,res)=>{
    // search for the database about the userId
    // and assign it to the req.session object
    res.sendFile(path.join(__dirname,'/login.html'));
    // res.send('hello world');
})
app.post('/login',(req,res)=>{
    // search for the database about the userId
    // and assign it to the req.session object
    const {username,password} = req.body;
    if (username=="amir" && password=="password"){
        req.session.userId=1;
        res.sendFile(path.join(__dirname,'/index.html'));
    }
    else {
        res.redirect('/login');
    }
})

server.listen(3000,()=>{
    console.log('server is listening on port 3000');
});

// when the server sets a cookie to the client side
// it will persistent in the browser , even if the server will not 
// send it again , and the browser in each req will send the cookie 
// to the server.
// the cookie once it sets , it will be persistent as i said in the browser
// unless you delete it , or it expires (maxAge property) 


// when the user demands a ressource 
// once a session is created by the server
// there is a session store where the server stores the sessions created
// at each req of the user , it will send a session cookie
//  to the server which contains session id ?

/*
app.use(cookieParser());
app.use(express.urlencoded({extended:false}));

// session globally for all the routes!
app.use(
session({
    store : new SQLiteStore({db:'sessions.db'}),
    secret:'secret-key',
    resave:false,
    saveUninitialized:true,
    cookie:{secure:false}
}))

app.get('/login',(req,res)=>{
    // res.cookie('hello','world',{httpOnly:true,maxAge:20000}); // key-value
    // httpOnly : browser keep sending the cookie but it's not accessible  
    // in the client side (when you run document.cookie in the firefox or google chrome , cookie will not appear) 
    // secure:true : in production , for https
    // csrf : cross site request forgery
    // if (!req.session.views){
    //     req.session.views = 1;
    // }
    // else {
    //     req.session.views++;
    // }
    // res.send(`Number of views ${req.session.views}`);
    res.send(`<form action="/login" method="POST">
            <input type="text" name="username" >
            <input type="hidden" value="samir">
            <button> Submit</button>
            </form>
        `);
})
app.post('/login',(req,res)=>{
    // verification of the user in the database
    // assign him a cookie to access his account
    console.log(req.body);
    const name=req.body.username;
    if (name==="amir"){
        req.session.userId=1;
        return res.redirect('/home');
    }
    else {
        return res.redirect('/login');
    }
    // res.cookie('good','man');
})

app.get('/',(req,res)=>{
    // res.cookie('good','man',{maxAge:12000});
    // res.send('sorry cannot assign cookies!')
    res.send('hello , please go to the login page to identify yourself')
})
app.get('/home',(req,res)=>{
    if (req.session.userId){
        return res.sendFile(path.join(__dirname,'/index.html'));
    }
    else {
        return res.redirect('/login');
    }
    // if (req.cookies['good']==='man'){
    //     // console.log(req.session.views);
    //     return res.send('hello world');
    // }
    // return res.redirect('/');
})
*/
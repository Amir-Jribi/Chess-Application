const express = require('express');
const session = require('express-session')
const SQLiteStore = require('connect-sqlite3')(session);
const cookieParser = require('cookie-parser');
const path=require('path');
const WebSocket = require('ws');
const http = require('http');
const authRoutes=require('./routes/authRoutes');
const gameRoutes=require('./routes/gameRoutes');
let waitingPlayerWs=null;
let waitingPlayerId = null;
let matchWs = new Map();
let matchId = new Map();
const app=express();
// app.use((req,res,next)=>{
//     console.log(`${req.method} - ${req.url}`);
//     next();
// })
app.use(express.urlencoded({extended:true}));
app.use(express.json()); // tell express that data is coming from json format!!!
app.use('/',express.static(__dirname+'/public'));

const sessionMiddleware = session({
    secret : 'secret-key',
    resave:false,
    saveUninitialized:false,
    cookie : {secure:false}
})
app.use(sessionMiddleware);

const wrap = (middleware)=>(ws,req,next)=>{
    middleware(req,{},next);
};
app.get('/login',(req,res)=>{
    // search for the database about the userId
    // and assign it to the req.session object
    res.sendFile(path.join(__dirname,'/login.html'));
    // res.send('hello world');
})
app.get('/',(req,res)=>{
    console.log(req.session.playerId);
    if (!req.session.playerId){
        return res.sendFile(path.join(__dirname,'/login.html'));
    }
    return res.sendFile(path.join(__dirname,'/index.html'));
})


app.use('/api/auth/',authRoutes);
app.use('/api/games/',gameRoutes);

const server = http.createServer(app);

const wss = new WebSocket.Server({noServer:true});

server.on('upgrade',(request,socket,head)=>{
    sessionMiddleware(request,{},()=>{
        if (request.session.playerId){
            console.log(request.session.playerId);
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
    const playerId = req.session.playerId;
    console.log(`Connected websocket for user:${playerId}`);
    ws.on('message',(message)=>{
        const data=JSON.parse(message);
        let sequence=[];
        // console.log(data.type);
        if (data.type=='find-game'){
            if (waitingPlayerWs!=null && waitingPlayerWs!==ws){
                matchWs.set(ws,waitingPlayerWs);
                matchWs.set(waitingPlayerWs,ws);
                matchId.set(playerId,waitingPlayerId);
                matchId.set(waitingPlayerId,playerId);
                ws.send(JSON.stringify({type:'start-game',color:'white',allow:'true'}));
                waitingPlayerWs.send(JSON.stringify({type:'start-game',color:'black',allow:'false'}));
                waitingPlayerWs=null;
                waitingPlayerId=null;
            }
            else {
                waitingPlayerWs=ws;
                waitingPlayerId=playerId;
                ws.send(JSON.stringify({type:'waiting'}));
            }
              
        }
        else if (data.type=='move'){
            sequence.push(data.move);
            // console.log(playerId);
            ws.send(JSON.stringify({type:'move',allow:'false'}));
            broadcast(JSON.stringify({type:'move',move:data.move,allow:'true'}),ws);
        }
        else if (data.type=='end'){
            // save in the database new game ,with playerIds
            console.log(`The game is finished between ${playerId} and ${matchId.get(playerId)}`);
            console.log(data.moveHistory);
            // post req to send the moves !
            fetch('http://localhost:3000/api/games',{
                method:'POST',
                headers : {'Content-Type':'application/json'},
                body : JSON.stringify({"playerId":playerId, "movesHistory":data.moveHistory})
            })
            .then(response => response.json())
            .then(data=>console.log(data.message))
            .catch(error=>console.error('Error saving game:',error));

            fetch('http://localhost:3000/api/games',{
                method:'POST',
                headers : {'Content-Type':'application/json'},
                body : JSON.stringify({"playerId":matchId.get(playerId), "movesHistory":data.moveHistory})
            })
            .then(response => response.json())
            .catch(error=>console.error('Error saving game:',error));
        }
        function broadcast (message,sender){
            wss.clients.forEach((client)=>{
                if (client.readyState ===WebSocket.OPEN && client!==sender && matchWs.get(sender)===client){
                    client.send(message);
                }
            });
        }
    })
})



// app.get('/check',(req,res)=>{
//     return res.json({palyerId:req.session.palyerId});
// })

server.listen(3000,()=>{
    console.log('server is listening on port 3000');
});




// origin : http://localhost:3000"

// origin is definded by:
// protocol : http , https
// domain : localhost , example.com , google.com , supcom.tn
// port : 3000 ; 5000
// cors error happen , when a ressource wants to fetch another ressouce that differs in 
// their origin 

// tomorrow:
// complete the server(database + structure)
// test it
// adding the fetch functionnality in the frontend

// after tomorrow
// fixing some bugs in the websocketserver

// sessions live on the server
// cookies lives on the client side 
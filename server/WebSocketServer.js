const WebSocket=require('ws');
// const { v4: uuidv4 } = require('uuid');
const wss=new WebSocket.Server({port : 5000});
let waitingPlayer = null;
const match= new Map();
// const color = new Map();
// const c=0;

// table 1: game
// id of the game ,
// move history
// id of the player who is black
// id of the player who is white (so that the board be at the side)

// table 2: player
// id of the player

// clicking on gamesPlayed button
// displaying all the games that the player has played (game 1,game 2,)
// clicking on game i => message to the server to request the moveHistory of that game

let game=0;
let gamesPlayed=[];
const black= new Map(); 
const white= new Map(); 
let move=[];
let c=0;



// json.parse : json string to javascript object
// json.stringfy : javascript object to json string 
wss.on('connection',(ws)=>{
    ws.on('message',(message)=>{
        const data=JSON.parse(message);
        let sequence=[];
        // console.log(data.type);
        if (data.type=='find-game'){
            if (waitingPlayer!=null && waitingPlayer!==ws){
                match.set(ws,waitingPlayer);
                match.set(waitingPlayer,ws);
                black.set(c,ws);
                white.set(c,waitingPlayer);
                // color.set(ws,'w');
                // color.set(waitingPlayer,'b');
                ws.send(JSON.stringify({type:'start-game',color:'white',allow:'true',gameID:c}));
                waitingPlayer.send(JSON.stringify({type:'start-game',color:'black',allow:'false',gameID:c}));
                waitingPlayer=null;
                c++;
            }
            else {
                waitingPlayer=ws;
                ws.send(JSON.stringify({type:'waiting'}));
            }
              
        }
        else if (data.type=='move'){
            // console.log(data.move);
            if (!gamesPlayed[data.gameID]){
                gamesPlayed[data.gameID]=[];
            }
            gamesPlayed[data.gameID].push(data.move);
            ws.send(JSON.stringify({type:'move',allow:'false'}));
            broadcast(JSON.stringify({type:'move',move:data.move,allow:'true'}),ws);
        }
        else if (data.type=='games'){
            let idGames=[];
            for(let [id,player] of black){
                if (player===ws){
                    idGames.push(id);
                }
            }
            for(let [id,player] of white){
                if (player===ws){
                    idGames.push(id);
                }
            }
            ws.send(JSON.stringify({type:'idGames',value:idGames}));
        }
        else if (data.type=='game'){
            ws.send(JSON.stringify({type:'movesHistory',value:gamesPlayed[data.value]}));
        }
    });

    function broadcast (message,sender){
        wss.clients.forEach((client)=>{
            if (client.readyState ===WebSocket.OPEN && client!==sender && match.get(sender)===client){
                client.send(message);
            }
        });
    }
    ws.on('error',(error)=>{
        console.log(error);
    });

    ws.on('close',()=>{
        console.log('client disconnected');
    });
});

console.log('web socket server is running on ws://localhost:5000');

/*
chess-application/
│
├── client/
│   ├── css/
│   │   └── chessboard-1.0.0.min.css
│   ├── js/
│   │   ├── chessboard-1.0.0.min.js
│   │   └── app.js
│   ├── index.html
│   └── login.html
│
├── server/
│   ├── models/
│   │   ├── Player.js
│   │   └── Game.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── game.js
│   ├── config/
│   │   └── db.js
│   ├── middleware/
│   │   └── auth.js
│   ├── server.js
│   └── WebSocketServer.js
│
├── package.json
└── README.md
*/
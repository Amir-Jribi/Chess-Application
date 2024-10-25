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
//ws.send(JSON.stringify({type:'idGames',value:idGames})); from server to client



// json.parse : json string to javascript object
// json.stringfy : javascript object to json string 
wss.on('connection',(ws)=>{
    ws.on('message',(message)=>{
        console.log(message);
        // const data=JSON.parse(message);
    });

    ws.on('error',(error)=>{
        console.log(error);
    });

    ws.on('close',()=>{
        console.log('client disconnected');
    });
});

console.log('web socket server is running on ws://localhost:5000');
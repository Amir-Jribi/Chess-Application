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
c=0;
allow=[];



// json.parse : json string to javascript object
// json.stringfy : javascript object to json string 
wss.on('connection',(ws)=>{
    ws.on('message',(message)=>{
        const data=JSON.parse(message);
        console.log(data.type);
        if (data.type=='find-game'){
            if (waitingPlayer!=null){
                allow[c]='true';
                match.set(ws,waitingPlayer);
                match.set(waitingPlayer,ws);
                // color.set(ws,'w');
                // color.set(waitingPlayer,'b');
                ws.send(JSON.stringify({type:'start-game',color:'white',allow:'true'}));
                waitingPlayer.send(JSON.stringify({type:'start-game',color:'black',allow:'false'}));
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
            ws.send(JSON.stringify({type:'move',allow:'false'}));
            broadcast(JSON.stringify({type:'move',move:data.move,allow:'true'}),ws);
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
const WebSocket=require('ws');
const { v4: uuidv4 } = require('uuid');
const wss=new WebSocket.Server({port : 5000});
let waitingPlayer = null;

// json.parse : json string to javascript object
// json.stringfy : javascript object to json string 
wss.on('connection',(ws)=>{
    const id = uuidv4(); // Generate a unique ID
    clients[id] = ws;
    // console.log('A new client connected');
    
    // message to be sent to the client
    // ws.send('welcome to the websocket server');

    // message received from the client
    let opponent=null;
    let color ='white';
    ws.on('message',(message)=>{
        const data=JSON.parse(message);
        console.log(data.type);
        if (data.type=='find-game'){
            if (waitingPlayer!=null){
                console.log('matching 2 players!')
                // ws.send(JSON.stringify({type:'start-game',color:'black',opponent:'player 1'}));
                // waitingPlayer.send(JSON.stringify({type:'start-game',color:'white',opponent:'player 2'}));
                // set opponent for both players
                opponent=waitingPlayer;
                waitingPlayer.opponent=ws;
                waitingPlayer=null;
                // send start-game message for both palayers
                ws.send(JSON.stringify({type:'start-game',color:'black',turn:'false'}));
                opponent.send(JSON.stringify({type:'start-game',color:'white',turn:'true'}));

            }
            else {
                waitingPlayer=ws;
                ws.send(JSON.stringify({type:'waiting'}));

            }
        }else if (data.type =='move'){
            // if a player makes a move , send it to his opponent
            if (opponent){
                opponent.send(JSON.stringify({type:'move',move:data.move}));
            }
        }
    })
    ws.on('error',(error)=>{
        console.log(error);
    })

    // the client has closed the connection
    ws.on('close',()=>{
        console.log('client disconnected');
    });
});

console.log('web socket server is running on ws://localhost:5000');
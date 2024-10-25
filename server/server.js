const express=require('express');
const bodyParser=require('body-parser');
const path=require('path');
const authRoutes=require('./routes/authRoutes');
const gameRoutes=require('./routes/gameRoutes');
const cors=require('cors');
const session=require('express-session');

const app=express();
const port=3000;

// Middleware
app.use((req,res,next)=>{
    console.log(`${req.method} - ${req.url}`);
    next();
})
// parse application/json
app.use(bodyParser.json());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended:true}));

// app.use(express.static(path.join(__dirname,'../client')));
// app.use(cors());
// app.use(session({
//     secret:'secret-key',//sign the session id cookie
//     cookie:{maxAge:60000},
//     saveUninitialized:false
// }))


const Users=['username','username1','username2','username3'];
const Passwords=['password','password1','password2','password3'];
const Games=[0,1,2,3,4,5,6];
const moves=[];

app.use('/api/auth',authRoutes);
app.use('/api/games',gameRoutes);

// app.post('/api/auth/login',(req,res)=>{
//     const {username,password} = req.body;
//     console.log(`${username} , ${password}`);
//     res.json({success:"success"});
// })

app.post('/api/login', (req, res) => {
    const {username,password} = req.body;
    // console.log(req.sessionID);
    // fetching via database to check if the user exists in the database
    for(let i=0;i<Users.length;i++){
        if (Users[i]===username && Passwords[i]===password){
            console.log(`The username is ${username} and the password is ${password}`);
            res.json({success:"success"});
            return;
        }
    }
    res.json({fail:"Error in the information that you have provided!"})
})

app.get('/api/games/:idx',(req,res)=>{
    const gameId=req.params.idx;

    // fetching from the database the game with specific idx 
    for(let i=0;i<Games.length;i++){
        if (Games[i]==gameId){
            res.json({success:"success"});
            return;
        }
    }
    // console.log(req.params); { idx: '1' } 
    // console.log(gameId);  1
    res.json({fail:"Couldnt find this game !"})

})

app.post('/api/games',(req,res)=>{
    const {gameId,playerId,movesHistory} = req.body;
    // searching for the table game , if that playerId matches with the gameId 
})

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
})



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
const Player = require('../models/Player');

exports.login = (req,res)=>{
    const {username,password} = req.body;
    console.log(`${username} , ${password}`);
    // res.json({success:"success"});
    // console.log("serve the request");
    Player.findByUsernameAndPassword(username,password,(err,player)=>{
        if (err){
            return res.status(500).json({error:'Internal server error'});
        }
        if (player){
            req.session.palyerId=player.id;
            // req.session.username = palyer.username;
            return res.json({success:'ok',playerId:req.session.playerId});
            // return res.json({success:'ok',username:username,password:password});
        }
        else {
            Player.createUser(username,password,(err,userId)=>{
                if (err) return res.status(500).json({error:'Error creating user'})
                return res.json({success:'success',userId:userId});
            });
        }
        // else {
        //     return res.status(401).json({fail:'invalid credentials'});
        // }
    })

};

exports.getUsers = (req,res)=>{
    Player.getUsers((err,users)=>{
        if (err){
            return res.json({fail:'fail in fetching in the database'})
        }
        return res.json({success:'success',users:users});
    });
    // res.
}
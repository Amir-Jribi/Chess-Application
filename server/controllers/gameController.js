const Game = require('../models/Game');

exports.createGame = (req,res)=>{
    const {playerId,movesHistory} = req.body;
    Game.createGame(playerId,movesHistory,(err,gameId)=>{
        if (err){
            return res.json({fail:'fail'});
        }
        return res.json({succuess:'success',gameId:gameId});
    })
}

exports.getGames = (req,res)=>{
    // const [games] = req.body;
    Game.getGames((err,games)=>{
        if (err){
            return res.json({fail:'failed to load the games'});
        }
        return res.json({games:games});
    })
}

exports.getGame = (req,res)=>{
    let {id}=req.params
    console.log(req.params);
    id=parseInt(id);
    Game.getGame(id,(err,game)=>{
        if (err){
            return res.json({fail:'failed to load the game'});
        }
        game.movesHistory = JSON.parse(game.movesHistory); // ["e4","e5"]
        return res.json({game:game});
    })
}
exports.getNumberOfGames = (req,res)=>{
    console.log(req.params);
    let {id}=req.params; // playerId is string here
    // playerId=parseInt(playerId);
    console.log(id);
    Game.getNumberOfGames(id,(err,numberOfGames)=>{
        if (err){
            return res.json({fail:'failed to fetch number of games'});
        }
        return res.json({numberOfGames:numberOfGames});
    })
}
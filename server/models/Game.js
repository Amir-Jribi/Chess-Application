const db=require('../config/db');
db.serialize(()=>{
    db.run(`CREATE TABLE IF NOT EXISTS games (
        gameId INTEGER PRIMARY KEY AUTOINCREMENT,
        playerId INTEGER,
        movesHistory TEXT
        )`
    );
});
// 
const Game ={
    createGame:(playerId,movesHistory,callback)=>{
        const moves=JSON.stringify(movesHistory); // "["e4","e4"]"
        console.log(moves);
        // pass an arry and how to parse it ?!
        db.run(`INSERT INTO games (playerId,movesHistory) VALUES (?,?)`,[playerId,moves],function(err){
            callback(err,this.lastID);
        }
        );
    },
    // get all the games
    getGames:(callback)=>{
        db.all(`SELECT * FROM games`,(err,rows)=>{
            if (err){
                return callback(err);
            }
            return callback(null,rows);
        });
    },
    // get a game with specific id
    getGame:(gameId,callback)=>{
        db.get(`SELECT * FROM games WHERE gameId = ?`,[gameId],(err,row)=>{
            if (err){
                return callback(err);
            }
            return callback(null,row);
        })
    },
    // get number of games played by a player
    getNumberOfGames:(playerId,callback)=>{
        console.log(playerId);
        db.get(`SELECT COUNT(*) AS gameCount FROM games WHERE playerId = ?`,[playerId],(err,row)=>{
            if (err){
                return callback(err);
            }
            return callback(null,row);
        })
    }
}

module.exports = Game;
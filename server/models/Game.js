const db=require('../config/db');
db.serialize(()=>{
    db.run(`CREATE TABLE IF NOT EXISTS games (
        gameId INTEGER PRIMARY KEY AUTOINCREMENT,
        playerId INTEGER,
        movesHistory TEXT
        )`
    );
});
// JSON.stringify() takes a JavaScript object and transforms it into a JSON string.
// JSON.parse() takes a JSON string and transforms it into a JavaScript object.
const Game ={
    createGame:(playerId,movesHistory,callback)=>{
        const moves=JSON.stringify(movesHistory); // "["e4","e4"]"
        console.log(`${playerId} have played a game that has this moves ${moves}`);
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
    // get number of games played by a player
    getGamesPerUser:(playerId,callback)=>{
        console.log(`${playerId} inside the models , getGamesPerUser helllllllllo`);
        db.all(`SELECT * FROM games WHERE playerId = ?`,[playerId],(err,rows)=>{
            if (err){
                return callback(err);
            }
            console.log(rows);
            // p=JSON.stringify(rows);
            return callback(null,rows);
        })
    },
    deleteGame:(gameId,callback)=>{
        db.run(`DELETE FROM games WHERE gameId = ?`,[gameId],function(err){
            if (err){
                return callback(err);
            }
            return callback(null);
            // console.log("Removing the game is successufuly done!");
        })
    }
      // get a game with specific id
    //   getGame:(gameId,callback)=>{
    //     db.get(`SELECT * FROM games WHERE gameId = ?`,[gameId],(err,row)=>{
    //         if (err){
    //             return callback(err);
    //         }
    //         return callback(null,row);
    //     })
    // },
}

module.exports = Game;
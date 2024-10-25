const db=require('../config/db');

db.serialize(()=>{
    db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT,username TEXT,password TEXT)");
})

const Player = {
    findByUsernameAndPassword : (username,password,callback)=>{
        db.get("SELECT * FROM users WHERE username = ? AND password = ? ",[username,password],callback);
    },
    createUser:(username,password,callback)=>{
        db.run("INSERT INTO users (username,password) VALUES (?,?)",[username,password],function(err){
            callback(err,this.lastID);
        });
    },
    getUsers:(callback)=>{
        db.all('SELECT * FROM users', [], (err, rows) => {
            if (err) {
                callback(err,null);
                // console.error('Error fetching users:', err.message);
            } else {
                // console.log('Users:', rows);
                callback(null,rows);
            }
        });
    }
};

module.exports =Player;
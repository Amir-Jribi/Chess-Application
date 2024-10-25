const sqlite3=require('sqlite3').verbose();

// const db=new sqlite3.Database(':memory:',(err)=>{
//     if (err){
//         console.error('Failed to connect to SQLite :',err.message);
//     }
//     else {
//         console.log('Connected to the SQLite database.');
//     }
// })
const db = new sqlite3.Database('../chess.db');

module.exports=db;
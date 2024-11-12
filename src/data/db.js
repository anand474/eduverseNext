import mysql from 'mysql2';

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'eduverse',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

db.connect(err =>{
    if (err){
        console.log("Error connecting to db", err);
    }
    else{
        console.log("Connected to db");
    }
});

module.exports = db;
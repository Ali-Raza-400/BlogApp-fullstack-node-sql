// database connection
import mysql from "mysql";
export const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "12345678",
    database: "blogapp",
  });
  
  db.connect((err) => {
    if (err) throw err;
    console.log("Connected to database");
  });
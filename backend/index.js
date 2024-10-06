import express from "express";
const app = express();
const port = 8080;
import mysql from "mysql";

// database connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "12345678",
  database: "crud",
});

db.connect((err) => {
  if (err) throw err;
  console.log("Connected to database");
});

// middleware to parse json

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

//get all records
app.get("/books", (req, res) => {
  db.query("SELECT * FROM book", (err, data) => {
    if (err) throw err;
    res.send(data);
  });
});

//get single record by id

app.get("/books/:id", (req, res) => {
  db.query("SELECT * FROM book WHERE id =?", [req.params.id], (err, data) => {
    if (err) throw err;
    res.send(data);
  });
});

//save record

app.post("/save", (req, res) => {
  let q = "INSERT INTO book (`name`,`desc`,`cover`) VALUES (?, ?, ?)";
  const values = [req.body.name, req.body.desc, req.body.cover];
  db.query(q, values, (err, result) => {
    if (err) throw err;
    res.send("New record inserted");
  });
});

//update record
app.post("/update/:id", (req, res) => {
 let id=req.params.id;
  let q = "UPDATE book SET `name`=?, `desc`=?, `cover`=? WHERE id=?";
  const values = [req.body.name, req.body.desc, req.body.cover,id];
  db.query(q, values, (err, result) => {
    if (err) throw err;
    res.send("Record updated");
  });
});

//delete record

app.delete("/delete/:id", (req, res) => {
  let id = req.params.id;
  let q = "DELETE FROM book WHERE id=?";
  db.query(q, [id], (err, result) => {
    if (err) throw err;
    res.send("Record deleted");
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

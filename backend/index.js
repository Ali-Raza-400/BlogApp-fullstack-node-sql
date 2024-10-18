import express from "express";
const app = express();
import authRoutes from "./routes/user.routes.js";
import cookieParser from "cookie-parser";

const port = 8080;

import { db } from "./config/db.js";

// middleware to parse json

app.use(express.json());
app.use(cookieParser())

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// CRUD operations
app.use("/api/users", authRoutes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

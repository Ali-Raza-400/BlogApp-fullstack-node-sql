import express from "express";
const app = express();
import authRoutes from "./routes/user.routes.js";
import postRoutes from "./routes/post.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import multer from "multer";

const port = 8080;

import { db } from "./config/db.js";

// middleware to parse json
app.use(express.json());
app.use(cookieParser());
app.use(cors());

// Multer middleware for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../client/public/upload");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const upload = multer({ storage });
app.post("/api/upload", upload.single("file"), function (req, res) {
  const file = req.file;
  res.status(200).json(file.filename);
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// CRUD operations
app.use("/api/users", authRoutes);
app.use("/api/posts", postRoutes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

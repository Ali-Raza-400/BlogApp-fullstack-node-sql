import { db } from "../config/db.js";
import jwt from "jsonwebtoken";

export const getAllPosts = async (req, res) => {
  let query = req.query.cat
    ? "SELECT * FROM posts WHERE cat=?"
    : "SELECT * FROM posts";

  db.query(query, (err, data) => {
    if (err) throw err;
    res.status(200).json(data);
  });
};

export const getPostById = async (req, res) => {
  let post_id = req.params.post_id;
  console.log("post_id:::::", post_id);
  let query = "SELECT * FROM posts WHERE id=?";

  db.query(query, [post_id], (err, data) => {
    if (err) throw err;
    if (!data[0]) return res.status(404).json({ msg: "Post not found" });
    res.status(200).json(data[0]);
  });
};

export const createPost = async (req, res) => {
  let token = req.cookies.access_token;
  console.log("token::", token);
  if (!token) return res.status(401).json({ msg: "Unauthorized" });
  // verify token

  const { title, img, desc, date, category } = req.body;
  try {
    jwt.verify(token, "JWT_SECRETE_KEY", (err, userInfo) => {
      if (err) return res.status(403).json({ msg: "Access denied" });
      // token is valid
      console.log("User info:", userInfo);
      // Add user id to the request body
      req.body.uid = userInfo.id;
      const formattedDate = new Date(date)
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");
      //   next();

      // Convert ISO date to MySQL DATETIME format

      const query = `INSERT INTO posts (title,img,\`desc\`,date,uid,category) VALUES (?,?,?,?,?,?)`;
      const values = [title, img, desc, formattedDate, req.body.uid, category];

      db.query(query, values, (err, result) => {
        if (err) return res.status(500).json(err);
        return res.status(201).json("Post created successfully");
      });
    });
  } catch (err) {
    res.status(500).json(err);
  }
};

export const deletePost = (req, res) => {
  const { post_id } = req.params;
  const token = req.cookies.access_token;

  // Check if token is present
  if (!token) return res.status(401).json({ msg: "Unauthorized" });

  // Verify the token
  jwt.verify(token, "JWT_SECRETE_KEY", (err, userInfo) => {
    if (err) return res.status(403).json({ msg: "Access denied" });

    const query = "DELETE FROM posts WHERE id = ? AND uid = ?";

    // Execute the query
    db.query(query, [post_id, userInfo.id], (err, result) => {
      if (err) return res.status(500).json({ msg: "Database error", err });

      if (result.affectedRows === 0) {
        return res
          .status(404)
          .json({ msg: "Post not found or not authorized" });
      }

      return res.status(200).json({ msg: "Post deleted successfully" });
    });
  });
};


export const updatePost=async(req,res)=>{
    let post_id=req.params.post_id 
    let token = req.cookies.access_token;
    if (!token) return res.status(401).json({ msg: "Unauthorized" });
    jwt.verify(token,"JWT_SECRETE_KEY",(error,data)=>{
        if(error) return res.status(403).json({msg:"Access denied"})
        const {title,img,desc,date,category}=req.body
        const formattedDate = new Date(date).toISOString().slice(0,19).replace('T',' ')
        const query = "UPDATE posts SET title = ?, img = ?, `desc` = ?, date = ?, category = ? WHERE id = ? AND uid = ?";
        console.log(title,img,desc,formattedDate,category,post_id,data.id)
        const values=[title,img,desc,formattedDate,category,post_id,data.id]
        db.query(query,values,(err,result)=>{
            if(err) return res.status(500).json(err)
            res.status(200).json("Post updated successfully")
        })
    })
}

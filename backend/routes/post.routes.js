import express from "express";
import { createPost, deletePost, getAllPosts, getPostById, updatePost } from "../controllers/post.controller.js";

const router = express.Router();

router.get("/getAll", getAllPosts);
router.post("/create", createPost);
router.get("/getSinglePost/:post_id", getPostById);
router.delete("/deletePost/:post_id", deletePost);
router.put("/updatePost/:post_id", updatePost);
 
export default router;

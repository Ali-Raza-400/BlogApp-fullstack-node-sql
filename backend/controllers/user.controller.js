import { db } from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  let q = "SELECT * FROM users WHERE email=? OR username=?";
  const { email, username, password } = req.body;

  console.log("body ::::", email, username, password);

  // check if email or username already exists
  db.query(q, [email, username], (error, data) => {
    console.log("error, data", error, data);
    if (error) console.log("error::", error);

    if (data.length > 0)
      return res.status(400).json({ msg: "Email or username already exists" });

    //hash password
    let salt = bcrypt.genSaltSync(10);
    var hashPassword = bcrypt.hashSync(password, salt);

    // now if user not exist then create

    let insertQuery =
      "INSERT INTO users (email,username,password) VALUES (?,?,?)";

    const values = [email, username, hashPassword];

    db.query(insertQuery, values, (err, result) => {
      if (err) console.error(err);
      res.status(200).json({ msg: "User registered successfully" });
    });
  });
};

export const login = async (req, res) => {
  let { email, password } = req.body;

  let selectQuery = "SELECT * FROM users WHERE email=?";

  db.query(selectQuery, [email], (err, result) => {
    if (err) console.error(err);
    if (result.length === 0)
      return res.status(404).json({ msg: "User not found" });

    

    let user = result[0];
    let isMatch = bcrypt.compareSync(req.body.password, user.password);

    if (!isMatch) return res.status(400).json({ msg: "Invalid password" });

    const token = jwt.sign({ id: user.id, email }, "JWT_SECRETE_KEY", {
      expiresIn: "30d",
    });
    console.log("token::::",token)
    const { password, ...other } = result[0];
    res
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .status(200)
      .json(other);
  });
};

export const logout = (req, res) => {
  res.clearCookie("access_token",{
    sameSite:"none",
    secure:true
  }).status(200).json("User has been logged out.")
};

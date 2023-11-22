const bcrypt = require("bcrypt");
const UserModel = require("../models/userModel");
const jwt = require("jsonwebtoken");

const signUp = (req, res) => {
  bcrypt.hash(req.body.password, 10).then((hash) => {
    UserModel.create({
      email: req.body.email,
      username: req.body.username,
      password: hash,
    })
      .then((data) => res.status(201).json(data))
      .catch((err) => {
        console.error("Error during user creation:", err);
        res.status(500).json({
          error: err,
        });
      });
  });
};

const login = (req, res) => {
  let userFound;

  UserModel.findOne({ username: req.body.username })
    .then((user) => {
      if (!user) {
        return res.status(401).json({
          message: "User not found",
        });
      }
      userFound = user;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then((result) => {
      if (!result) {
        return res.status(401).json({
          message: "Password is incorrect",
        });
      }

      const token = jwt.sign(
        { username: userFound.username, userId: userFound._id },
        "secret_string",
        { expiresIn: "1h" }
      );
      return res.status(200).json({
        token: token,
        expiresIn: 3600,
      });
    })
    .catch((err) => {
      return res.status(401).json({
        message: "Error with authentication",
      });
    });
};

module.exports = {
  signUp,
  login,
};

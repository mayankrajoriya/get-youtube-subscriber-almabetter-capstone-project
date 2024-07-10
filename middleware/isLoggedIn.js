const userModel = require("../models/user-model");
const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  if (!req.cookies.token) {
    res.send("you need to login or register first");
  }

  try {
    const decoded = jwt.verify(req.cookies.token, "uniqueKey");
    const user = await userModel
      .findOne({
        email: decoded.email,
      })
      .select("-password");

    req.user = user;
    next();
  } catch (error) {
   res.send("error");
  }
};

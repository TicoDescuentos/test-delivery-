// middlewares/authjwt.js

const JWT = require("jsonwebtoken");
const User = require("../models/user");

module.exports = async (req, res, next) => {
  const { authorization } = req.headers;
  
  if (!authorization) {
    return res.status(401).json({ message: "Please Login!" });
  }
  
  const Token = authorization.replace("Bearer ", "");
  
  JWT.verify(Token, process.env.SECRET_KEY, async (err, payload) => {
    if (err) {
      return res.status(401).json({ message: err.message, success: false });
    }
    
    const { userId } = payload;
    
    req.user = await User.findById(userId);
    
    if (req.user && req.user.isAdmin) {
      next();
    } else {
      return res.status(403).json({ message: "Acceso restringido" });
    }
  });
};

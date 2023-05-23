const jwt = require("jwt-simple"); // jwt-simple --  encode && decode // jsonwebtoken -- sign & verify

const JWT_SECRET = process.env.JWT_SECRET;

const authMiddleware = (req, res, next) => {
  const token = req.header("x-auth-token") || req.cookies["x-auth-token"];

  if (!token) {
    throw new Error("No token, authorization denied");
  }

  try {
    console.log("token in try blcok", token);
    const decoded = jwt.decode(token, JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    return res.send("Token expired!");
    // throw new Error("Invalid token");
  }
};

module.exports = authMiddleware;

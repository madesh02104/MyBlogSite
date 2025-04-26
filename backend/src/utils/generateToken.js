import jwt from "jsonwebtoken";

const generateToken = (id, username, email, isAdmin) => {
  return jwt.sign({ id, username, email, isAdmin }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

export default generateToken;

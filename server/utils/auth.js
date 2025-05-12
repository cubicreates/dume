import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';

const comparePasswords = async (plainPassword, hashedPassword) => {
  return await compare(plainPassword, hashedPassword);
};

const generateToken = (user) => {
  return sign(
    { 
      id: user._id,
      username: user.username,
      email: user.email
    },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
};

export default {
  comparePasswords,
  generateToken
};
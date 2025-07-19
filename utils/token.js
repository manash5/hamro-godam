import jwt from 'jsonwebtoken';

const generateToken = (payload) => {
  const options = {
    expiresIn: process.env.NEXT_PUBLIC_TOKEN_EXPIRES_IN || '1h', 
  };
  return jwt.sign(payload, process.env.secretKey, options);
};

export { generateToken };
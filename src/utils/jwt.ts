import jwt from 'jsonwebtoken';
import { config } from '@/config/config';

interface TokenPayload {
  id: number;
  username: string;
}

// 签发 Token
export const signToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, config.jwtSecret, { expiresIn: config.jwtExpiresIn as ` ` });
};

// 验证 Token
export const verifyToken = (token: string): TokenPayload => {
  return jwt.verify(token, config.jwtSecret) as TokenPayload;
};
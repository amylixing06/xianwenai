import jwt from 'jsonwebtoken';

// 使用环境变量中的密钥，如果没有则使用默认值
const JWT_SECRET = process.env.JWT_SECRET || 'xianwenai-secret-key-2024';

export function generateToken(payload: any): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
}

export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid token');
  }
} 
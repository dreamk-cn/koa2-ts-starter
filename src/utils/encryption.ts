import bcrypt from 'bcryptjs';

// 加密密码
export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

// 比对密码
export const comparePassword = async (inputPassword: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(inputPassword, hash);
};
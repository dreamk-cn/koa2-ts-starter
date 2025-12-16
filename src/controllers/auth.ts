import { Context } from 'koa';
import { AppDataSource } from '@/config/db';
import { User } from '@/entities/User';
import { hashPassword, comparePassword } from '@/utils/encryption';
import { signToken } from '@/utils/jwt';

export default class AuthController {
  // --- 用户注册 ---
  public static async register(ctx: Context) {
    const { username, password, nickname } = ctx.request.body as any;

    if (!username || !password) {
      throw new Error('用户名和密码不能为空');
    }

    const userRepository = AppDataSource.getRepository(User);

    // 检查用户名是否存在
    const existUser = await userRepository.findOneBy({ username });
    if (existUser) {
      throw new Error('用户名已存在');
    }

    // 密码加密
    const hashedPassword = await hashPassword(password);

    // 创建用户
    const user = new User();
    user.username = username;
    user.password = hashedPassword; // 存入密文
    user.nickname = nickname;
    
    await userRepository.save(user);

    ctx.success(null, '注册成功');
  }

  // --- 用户登录 ---
  public static async login(ctx: Context) {
    const { username, password } = ctx.request.body as any;

    const userRepository = AppDataSource.getRepository(User);

    // 查询用户
    const user = await userRepository
      .createQueryBuilder('user')
      .addSelect('user.password') 
      .where('user.username = :username', { username })
      .getOne();

    if (!user) {
      throw new Error('用户不存在');
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      throw new Error('密码错误');
    }

    const token = signToken({ id: user.id, username: user.username });

    ctx.success({ token }, '登录成功');
  }
}
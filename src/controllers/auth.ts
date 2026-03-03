import { Context } from 'koa';
import { AppDataSource } from '@/config/db';
import { User } from '@/entities/User';
import { hashPassword, comparePassword } from '@/utils/encryption';
import { signToken } from '@/utils/jwt';
import { Menu } from '@/entities/Menu';
import { listToTree } from '@/utils/tree';
import { LoginBody, RegisterBody } from '@/schemas/auth';

export default class AuthController {
  // --- 用户注册 ---
  public static async register(ctx: Context) {
    const { username, password, nickname } = ctx.request.body as RegisterBody;

    const userRepository = AppDataSource.getRepository(User);

    // 检查用户名是否存在
    const existUser = await userRepository.findOneBy({ username });
    if (existUser) {
      return ctx.error(400, '用户名已存在')
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
    const { username, password } = ctx.request.body as LoginBody;

    const userRepository = AppDataSource.getRepository(User);

    // 查询用户
    const user = await userRepository
      .createQueryBuilder('user')
      .addSelect('user.password') 
      .where('user.username = :username', { username })
      .getOne();

    if (!user) {
      return ctx.error(400, '用户不存在')
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return ctx.error(400, '密码错误')
    }

    const token = signToken({ id: user.id, username: user.username });

    ctx.success({ token }, '登录成功');
  }

  // --- 获取权限信息 ---
  public static async getPermissionInfo(ctx: Context) {
    try {
      if (!ctx.state.user) {
        return ctx.error(401, '未授权')
      }
      const { user } = ctx.state
      const menuRepo = AppDataSource.getRepository(Menu);
      const menus = await menuRepo
      .createQueryBuilder('menu')
      .innerJoin('sys_role_menu', 'rm', 'rm.menu_id = menu.id')
      .innerJoin('sys_user_role', 'ur', 'ur.role_id = rm.role_id')
      .where('ur.user_id = :userId', { userId: user.id })
      .andWhere('menu.visible = 1')
      .andWhere('menu.type in (:...types)', { types: ['M', 'C'] })// 过滤掉按钮和接口
      .orderBy('menu.sort_order', 'ASC')
      .getMany();


      const safeUser = {
        id: user.id,
        username: user.username,
        nickname: user.nickname,
        avatar: user.avatar,
        email: user.email,
      }
      const roles = user.roles.map((r) => r.roleCode) || [];
      const permissions = ctx.state.permissions || [];
      
      return ctx.success({
        user: safeUser,
        permissions,
        menus: listToTree(menus),
        roles
      })
    } catch (e) {
      console.warn('e', e)
      return ctx.error(400, '获取权限信息失败')
    }
  }
}
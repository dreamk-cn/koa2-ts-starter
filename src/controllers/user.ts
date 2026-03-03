import { Context } from 'koa';
import { AppDataSource } from '@/config/db';
import { Role } from '@/entities/Role';
import { User } from '@/entities/User';
import { RegisterBody } from '@/schemas/auth';
import { AssignRolesBody, AssignRolesParams, UserDeleteParams, UserDetailParams, UserListQuery, UserUpdateBody, UserUpdateParams } from '@/schemas/user';
import { hashPassword } from '@/utils/encryption';

export default class UserController {  
  // 管理员创建用户
  public static async create(ctx: Context) {
    const { username, password, nickname } = ctx.request.body as RegisterBody;

    const userRepository = AppDataSource.getRepository(User);

    // 检查用户名是否存在
    const existUser = await userRepository.findOneBy({ username });
    if (existUser) {
      return ctx.error(400, '用户名已存在');
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

  // 更新用户信息
  public static async update(ctx: Context) {
    const { id: userId } = ctx.params as UserUpdateParams;
    const { nickname, password } = ctx.request.body as UserUpdateBody;
    
    const userRepo = AppDataSource.getRepository(User);
    
    const user = await userRepo.findOne({ where: { id: userId } });
    if (!user) {
      return ctx.error(404, '用户不存在');
    }
    
    if (password) {
      const hashedPassword = await hashPassword(password);
      user.password = hashedPassword;
    }
    user.nickname = nickname;
    await userRepo.save(user);
    ctx.success(null, '更新成功');
  }

  // 分配角色
  public static async assignRoles(ctx: Context) {
    const { id: userId } = ctx.params as AssignRolesParams;
    const { roleIds } = ctx.request.body as AssignRolesBody;

    const userRepo = AppDataSource.getRepository(User);
    
    const user = await userRepo.findOne({ where: { id: userId }, relations: ['roles'] });
    if (!user) {
      return ctx.error(404, '用户不存在');
    }

    // 更新关联
    const roles = roleIds.map(id => ({ id } as Role));
    user.roles = roles;

    await userRepo.save(user);
    ctx.success(null, '角色分配成功');
  }

  // 分页查询用户列表（带角色信息）
  public static async getList(ctx: Context) {
    const { pageNo, pageSize, username } = ctx.query as unknown as UserListQuery;

    const userRepo = AppDataSource.getRepository(User);
    
    const query = userRepo.createQueryBuilder('user')
      .leftJoinAndSelect('user.roles', 'role') // 连表查询角色
      .skip((pageNo - 1) * pageSize)
      .take(pageSize)
      .orderBy('user.createTime', 'DESC');

    if (username) {
      query.where('user.username like :name', { name: `%${username}%` });
    }

    const [list, total] = await query.getManyAndCount();

    ctx.success({
      list,
      total,
      pageNo,
      pageSize
    });
  }

  // 获取用户详情
  public static async getDetail(ctx: Context) {
    const { id } = ctx.params as UserDetailParams;
    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOne({
      where: { id },
      relations: ['roles']
    });

    if (!user) {
      return ctx.error(404, '用户不存在');
    }

    ctx.success(user);
  }

  // 删除用户
  public static async delete(ctx: Context) {
    const { id: userId } = ctx.params as UserDeleteParams;
    
    const userRepo = AppDataSource.getRepository(User);
    
    const user = await userRepo.findOne({ where: { id: userId } });
    if (!user) {
      return ctx.error(404, '用户不存在');
    }

    await userRepo.delete(userId);
    ctx.success(null, '删除成功');
  }
}

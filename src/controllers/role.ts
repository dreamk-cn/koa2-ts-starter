import { Context } from 'koa';
import { AppDataSource } from '@/config/db';
import { Role } from '@/entities/Role';
import { Menu } from '@/entities/Menu';
import { AssignMenusBody, AssignMenusParams, RoleCreateBody, RoleDeleteParams, RoleDetailParams, RoleListQuery, RoleUpdateBody, RoleUpdateParams } from '@/schemas/role';

export default class RoleController {
  
  // 获取角色列表
  public static async getList(ctx: Context) {
    const { pageNo, pageSize, roleName } = ctx.query as unknown as RoleListQuery;
    const roleRepo = AppDataSource.getRepository(Role);
    const query = roleRepo.createQueryBuilder('role')
      .skip((pageNo - 1) * pageSize)
      .take(pageSize)
      .orderBy('role.createTime', 'DESC');
    
    if (roleName) {
      query.where('role.roleName like :name', { name: `%${roleName}%` });
    }
    
    const [list, total] = await query.getManyAndCount();

    ctx.success({
      list,
      total,
      pageNo,
      pageSize
    });
  }

  // 获取单个角色详情（包含它的菜单ID列表，用于前端回显勾选）
  public static async getDetail(ctx: Context) {
    const { id } = ctx.params as RoleDetailParams;
    const roleRepo = AppDataSource.getRepository(Role);
    const role = await roleRepo.findOne({
      where: { id },
      relations: ['menus'] // 查出关联的菜单
    });
    if (!role) {
      return ctx.error(404, '角色不存在');
    }
    ctx.success(role);
  }

  // 创建角色
  public static async create(ctx: Context) {
    const roleRepo = AppDataSource.getRepository(Role);
    const { roleCode, roleName, remark, menuIds } = ctx.request.body as RoleCreateBody;

    const exist = await roleRepo.findOneBy({ roleCode });
    if (exist) return ctx.error(400, '角色编码已存在');

    const role = new Role();
    role.roleCode = roleCode;
    role.roleName = roleName;
    if (remark) role.remark = remark;

    // 如果创建时就分配了权限
    if (menuIds && menuIds.length > 0) {
      // TypeORM 保存关联关系需要先把对象查出来，或者构建只有 ID 的对象
      const menus = menuIds.map((id: number) => ({ id } as Menu));
      role.menus = menus;
    }

    await roleRepo.save(role);
    ctx.success(role);
  }

  // 更新角色 (包含更新权限)
  public static async update(ctx: Context) {
    const { id: roleId } = ctx.params as RoleUpdateParams;
    const { roleName, remark, menuIds } = ctx.request.body as RoleUpdateBody;

    const roleRepo = AppDataSource.getRepository(Role);
    const role = await roleRepo.findOne({ where: { id: roleId }, relations: ['menus'] });
    if (!role) return ctx.error(404, '角色不存在');

    role.roleName = roleName;
    if (remark) role.remark = remark;

    // 更新权限关联
    if (menuIds) {
      // TypeORM 会自动处理中间表的增删（Diff操作）
      const menus = menuIds.map((mid: number) => ({ id: mid } as Menu));
      role.menus = menus;
    }

    await roleRepo.save(role);
    ctx.success(role);
  }

  // 删除角色
  public static async delete(ctx: Context) {
    const { id } = ctx.params as RoleDeleteParams;
    const roleRepo = AppDataSource.getRepository(Role);
    
    const role = await roleRepo.findOne({ where: { id } });
    if (!role) {
      return ctx.error(404, '角色不存在');
    }

    await roleRepo.delete(id); // TypeORM 会自动删除中间表记录（如果有级联配置），或者需要手动处理
    ctx.success(null, '删除成功');
  }

  // 分配菜单
  public static async assignMenus(ctx: Context) {
    const { id: roleId } = ctx.params as AssignMenusParams;
    const { menuIds } = ctx.request.body as AssignMenusBody;

    const roleRepo = AppDataSource.getRepository(Role);
    const role = await roleRepo.findOne({ where: { id: roleId }, relations: ['menus'] });

    if (!role) {
      return ctx.error(404, '角色不存在');
    }

    role.menus = menuIds.map(id => ({ id } as Menu));
    await roleRepo.save(role);
    ctx.success(null, '权限分配成功');
  }
}

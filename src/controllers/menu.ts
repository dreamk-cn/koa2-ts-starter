import { Context } from 'koa';
import { AppDataSource } from '@/config/db';
import { Menu } from '@/entities/Menu';
import { listToTree } from '@/utils/tree';
import { MenuCreateBody, MenuDeleteParams, MenuListQuery, MenuUpdateBody, MenuUpdateParams } from '@/schemas/menu';

export default class MenuController {
  
  // 获取菜单列表（支持返回树形）
  public static async getList(ctx: Context) {
    const { type } = ctx.query as unknown as MenuListQuery;
    const menuRepo = AppDataSource.getRepository(Menu);
    // 按 sortOrder 排序
    const menus = await menuRepo.find({ order: { sortOrder: 'ASC' } });

    // 如果前端传了 ?type=tree，则返回树结构
    if (type === 'tree') {
      ctx.success(listToTree(menus));
    } else {
      ctx.success(menus);
    }
  }

  // 获取单个菜单详情
  public static async getDetail(ctx: Context) {
    const id = parseInt(ctx.params.id);
    const menuRepo = AppDataSource.getRepository(Menu);
    const menu = await menuRepo.findOneBy({ id });
    if (!menu) {
      return ctx.error(404, '菜单不存在');
    }
    ctx.success(menu);
  }

  // 创建菜单/权限
  public static async create(ctx: Context) {
    const body = ctx.request.body as MenuCreateBody;
    const menuRepo = AppDataSource.getRepository(Menu);
    
    const menu = new Menu();
    Object.assign(menu, body);
    
    await menuRepo.save(menu);
    ctx.success(menu);
  }

  // 更新菜单
  public static async update(ctx: Context) {
    const { id } = ctx.params as MenuUpdateParams;
    const body = ctx.request.body as MenuUpdateBody;
    const menuRepo = AppDataSource.getRepository(Menu);
    
    const menu = await menuRepo.findOneBy({ id });
    if (!menu) {
      return ctx.error(404, '菜单不存在');
    }

    menuRepo.merge(menu, body);
    await menuRepo.save(menu);
    ctx.success(menu);
  }

  // 删除菜单
  public static async delete(ctx: Context) {
    const { id } = ctx.params as MenuDeleteParams;
    const menuRepo = AppDataSource.getRepository(Menu);

    // 检查是否有子菜单，如果有子菜单通常不允许直接删除
    const count = await menuRepo.countBy({ parentId: id });
    if (count > 0) {
      return ctx.error(400, '请先删除子菜单');
    }

    await menuRepo.delete(id);
    ctx.success(null, '删除成功');
  }
}

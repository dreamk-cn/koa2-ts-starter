import z from "zod";

// 查询菜单列表
export const MenuListSchema = z.object({
  query: z.object({
    type: z.enum(['tree', 'list']).optional()
  })
})
export type MenuListQuery = z.infer<typeof MenuListSchema>['query'];

// 创建菜单
export const MenuCreateSchema = z.object({
  body: z.object({
    parentId: z.number().optional(),
    menuName: z.string().min(2, "菜单名称至少两位"),
    type: z.enum(['M', 'C', 'F']),
    perms: z.string().optional(),
    path: z.string().optional(),
    component: z.string().optional(),
    icon: z.string().optional(),
    sortOrder: z.number().optional(),
    visible: z.number().min(0).max(1).optional()
  })
})
export type MenuCreateBody = z.infer<typeof MenuCreateSchema>['body'];

// 更新菜单
export const MenuUpdateSchema = z.object({
  body: z.object({
    parentId: z.number().optional(),
    menuName: z.string().min(2, "菜单名称至少两位"),
    type: z.enum(['M', 'C', 'F']),
    perms: z.string().optional(),
    path: z.string().optional(),
    component: z.string().optional(),
    icon: z.string().optional(),
    sortOrder: z.number().optional(),
    visible: z.number().min(0).max(1).optional()
  }),
  params: z.object({
    id: z.string().transform((id) => Number(id))
  })
})
export type MenuUpdateBody = z.infer<typeof MenuUpdateSchema>['body'];
export type MenuUpdateParams = z.infer<typeof MenuUpdateSchema>['params'];

// 删除菜单
export const MenuDeleteSchema = z.object({
  params: z.object({
    id: z.string().transform((id) => Number(id))
  })
})
export type MenuDeleteParams = z.infer<typeof MenuDeleteSchema>['params'];
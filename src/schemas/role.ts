import z from "zod";
import { PageSchema } from "./base";

// 分页查询角色列表
export const RoleListSchema = z.object({
  query: PageSchema.extend({
    roleName: z.string().optional()
  })
})
export type RoleListQuery = z.infer<typeof RoleListSchema>['query'];

// 创建角色
export const RoleCreateSchema = z.object({
  body: z.object({
    roleCode: z.string().min(2, "角色编码至少两位"),
    roleName: z.string().min(2, "角色名称至少两位"),
    remark: z.string().optional(),
    menuIds: z.array(z.number().min(1)).optional()
  })
})
export type RoleCreateBody = z.infer<typeof RoleCreateSchema>['body'];

// 角色更新
export const RoleUpdateSchema = z.object({
  body: z.object({
    roleCode: z.string().min(2, "角色编码至少两位"),
    roleName: z.string().min(2, "角色名称至少两位"),
    remark: z.string().optional(),
    menuIds: z.array(z.number().min(1)).optional()
  }),
  params: z.object({
    id: z.string().transform((id) => Number(id))
  })
})
export type RoleUpdateBody = z.infer<typeof RoleUpdateSchema>['body'];
export type RoleUpdateParams = z.infer<typeof RoleUpdateSchema>['params'];


// 角色分配菜单
export const AssignMenusSchema = z.object({
  body: z.object({
    menuIds: z.array(z.number().min(1))
  }),
  params: z.object({
    id: z.string().transform((id) => Number(id))
  })
})
export type AssignMenusBody = z.infer<typeof AssignMenusSchema>['body'];
export type AssignMenusParams = z.infer<typeof AssignMenusSchema>['params'];

// 删除角色
export const RoleDeleteSchema = z.object({
  params: z.object({
    id: z.string().transform((id) => Number(id))
  })
})
export type RoleDeleteParams = z.infer<typeof RoleDeleteSchema>['params'];

// 角色详情
export const RoleDetailSchema = z.object({
  params: z.object({
    id: z.string().transform((id) => Number(id))
  })
})
export type RoleDetailParams = z.infer<typeof RoleDetailSchema>['params'];
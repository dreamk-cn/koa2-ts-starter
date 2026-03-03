import z from "zod";
import { PageSchema } from "./base";

// 分配角色
export const AssignRolesSchema = z.object({
  body: z.object({
    roleIds: z.array(z.number().min(1))
  }),
  params: z.object({
    id: z.string().transform((id) => Number(id))
  })
})
export type AssignRolesBody = z.infer<typeof AssignRolesSchema>['body'];
export type AssignRolesParams = z.infer<typeof AssignRolesSchema>['params'];

// 分页查询用户列表（带角色信息）
export const UserListSchema = z.object({
  query: PageSchema.extend({
    username: z.string().optional()
  })
})
export type UserListQuery = z.infer<typeof UserListSchema>['query'];

// 删除用户
export const UserDeleteSchema = z.object({
  params: z.object({
    id: z.string().transform((id) => Number(id))
  })
})
export type UserDeleteParams = z.infer<typeof UserDeleteSchema>['params'];

// 更新用户信息
export const UserUpdateSchema = z.object({
  body: z.object({
    nickname: z.string().min(2, "昵称至少两位"),
    password: z.string().min(6, "密码至少六位").optional(),
  }),
  params: z.object({
    id: z.string().transform((id) => Number(id))
  })
})
export type UserUpdateBody = z.infer<typeof UserUpdateSchema>['body'];
export type UserUpdateParams = z.infer<typeof UserUpdateSchema>['params'];

// 用户详情
export const UserDetailSchema = z.object({
  params: z.object({
    id: z.string().transform((id) => Number(id))
  })
})
export type UserDetailParams = z.infer<typeof UserDetailSchema>['params'];
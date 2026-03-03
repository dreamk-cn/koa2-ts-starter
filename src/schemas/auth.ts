import { z } from 'zod';

export const RegisterSchema = z.object({
  body: z.object({
    username: z.string("用户名必须是字符串").min(3, "用户名至少两位"),
    password: z.string("密码必须是字符串").min(6, "密码至少六位"),
    nickname: z.string("昵称必须是字符串").min(2, "昵称至少两位")
  })
})

export type RegisterBody = z.infer<typeof RegisterSchema>['body'];

export const LoginSchema = z.object({
  body: z.object({
    username: z.string(),
    password: z.string(),
  })
})

export type LoginBody = z.infer<typeof LoginSchema>['body'];

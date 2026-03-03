import z from "zod";

// 通过coerce将字符串转换为数字
export const PageSchema = z.object({
  pageNo: z.coerce.number().min(1).default(1),
  pageSize: z.coerce.number().min(1).max(100).default(10)
})

/** 可预期的业务错误，由全局中间件映射为 body.code，不改动 HTTP status */
export class AppError extends Error {
  constructor(
    public readonly code: number,
    message: string,
    public readonly expose = true,
  ) {
    super(message);
    this.name = 'AppError';
  }
}

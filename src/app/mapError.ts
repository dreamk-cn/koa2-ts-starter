import { ZodError } from 'zod';

import { AppError } from '@/errors/AppError';
import { envelope, type ApiBody } from '@/types/api';

export function mapError(err: unknown): ApiBody<null> {
  if (err instanceof AppError) {
    return envelope.fail(err.code, err.expose ? err.message : 'error');
  }

  if (err instanceof ZodError) {
    return envelope.fail(400, err.issues[0]?.message ?? '参数校验失败');
  }

  if (typeof err === 'object' && err !== null && 'status' in err) {
    const status = (err as { status?: number }).status;
    const message = err instanceof Error ? err.message : 'error';
    if (typeof status === 'number' && status >= 400) {
      return envelope.fail(status, message || 'error');
    }
  }

  console.error('未处理错误:', err);
  return envelope.fail(500, 'Internal Server Error');
}

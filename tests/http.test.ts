import request from 'supertest';
import { describe, expect, it } from 'vitest';

import { app } from '../src/app/index';


describe('HTTP API', () => {
  it('returns health status', async () => {
    const res = await request(app.callback()).get('/health');

    expect(res.status).toBe(200);
    expect(res.body.code).toBe(0);
    expect(res.body.msg).toBe('success');
    expect(res.body.data.status).toBe('ok');
    expect(typeof res.body.data.timestamp).toBe('string');
  });

  it('rejects invalid body on /validate', async () => {
    const res = await request(app.callback()).post('/validate').send({
      username: 'ab',
      age: 2,
      ids: '1,2',
    });

    expect(res.status).toBe(200);
    expect(res.body.code).toBe(400);
    expect(res.body.data).toBeNull();
  });

  it('accepts valid body on /validate', async () => {
    const res = await request(app.callback()).post('/validate').send({
      username: 'abcd',
      age: 2,
      ids: '1,2,3',
    });

    expect(res.status).toBe(200);
    expect(res.body.code).toBe(0);
    expect(res.body.data.body.ids).toEqual([1, 2, 3]);
  });
});

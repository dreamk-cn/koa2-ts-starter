import { DataSource } from 'typeorm';
import { config } from './config';
import path from 'path';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  synchronize: false, // 生产环境必须关掉，防止自动改表结构
  logging: config.env === 'development',
  entities: [path.join(__dirname, '../entities/**/*.{ts,js}')], // 自动加载实体
  subscribers: [],
  migrations: [],
});
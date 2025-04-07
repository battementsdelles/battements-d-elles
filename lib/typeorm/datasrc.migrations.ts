import 'dotenv/config';
import { DataSource } from 'typeorm';

const dataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  ssl: true,
  entities: ['./lib/typeorm/entities/*.entity.ts'],
  migrations: ['./lib/typeorm/migrations/*.ts'],
  migrationsRun: true,
  synchronize: false,
  logging: true,
});

export default dataSource;

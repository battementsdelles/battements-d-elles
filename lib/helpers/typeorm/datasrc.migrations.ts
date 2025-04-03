import 'dotenv/config';
import { DataSource } from 'typeorm';

const dataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  ssl: true,
  entities: ['./lib/helpers/typeorm/entities/*.entity.ts'],
  migrations: ['./lib/helpers/typeorm/migrations/*.ts'],
  migrationsRun: true,
  synchronize: false,
  logging: true,
});

export default dataSource;

import 'dotenv/config';
import { DataSource } from 'typeorm';

const dataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  ssl: true,
  entities: ['./app/api/**/*.entity.{ts,js}'],
  migrations: ['./app/helpers/typeorm/migrations/*.{ts,js}'],
  migrationsRun: false,
  synchronize: false,
  logging: true,
});

export default dataSource;

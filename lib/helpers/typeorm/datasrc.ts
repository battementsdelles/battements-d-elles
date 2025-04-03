import { UserEntity } from '@/lib/helpers/typeorm/entities/user.entity';
import {
  DataSource,
  EntityTarget,
  ObjectLiteral,
  QueryRunner,
  Repository,
} from 'typeorm';
import { Update1743200700914 } from './migrations/1743200700914-update';

const _DataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  ssl: true,
  entities: [UserEntity],
  migrations: [Update1743200700914],
  migrationsRun: true,
  synchronize: false,
  logging: true,
});

const initializeDataSource = async () => {
  if (_DataSource.isInitialized) return _DataSource;

  // Your initialization code here
  await _DataSource
    .initialize()
    .then(() => {
      console.log('Data Source has been initialized!');
    })
    .catch((err) => {
      console.error('Error during Data Source initialization', err);
    });
  return _DataSource;
};

export const getRepository = async <T extends ObjectLiteral>(
  entity: EntityTarget<T>,
  queryRunner = false,
): Promise<[Repository<T>, QueryRunner] | [Repository<T>]> => {
  await initializeDataSource();
  return queryRunner
    ? [_DataSource.getRepository(entity), _DataSource.createQueryRunner()]
    : [_DataSource.getRepository(entity)];
};

export const getUserRepository = async (queryRunner = false) =>
  await getRepository(UserEntity, queryRunner);

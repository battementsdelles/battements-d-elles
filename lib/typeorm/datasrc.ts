import { UserEntity } from '@/lib/typeorm/entities/user.entity';
import {
  DataSource,
  EntityTarget,
  ObjectLiteral,
  QueryRunner,
  Repository,
} from 'typeorm';
import { Update1743200700914 } from './migrations/1743200700914-update';
import { Update1744018873521 } from './migrations/1744018873521-update';

const _DataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  ssl: true,
  entities: [UserEntity],
  migrations: [Update1743200700914, Update1744018873521],
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

export async function getRepository<T extends ObjectLiteral>(
  entity: EntityTarget<T>,
  useQueryRunner: true,
): Promise<[Repository<T>, QueryRunner]>;

export async function getRepository<T extends ObjectLiteral>(
  entity: EntityTarget<T>,
  useQueryRunner?: false,
): Promise<[Repository<T>]>;

// implementation
export async function getRepository<T extends ObjectLiteral>(
  entity: EntityTarget<T>,
  useQueryRunner = false,
) {
  await initializeDataSource();
  return useQueryRunner
    ? [_DataSource.getRepository(entity), _DataSource.createQueryRunner()]
    : [_DataSource.getRepository(entity)];
}

export async function getUserRepository(
  useQueryRunner: true,
): Promise<[Repository<UserEntity>, QueryRunner]>;

export async function getUserRepository(
  useQueryRunner?: false,
): Promise<[Repository<UserEntity>]>;

export async function getUserRepository(useQueryRunner = false) {
  return useQueryRunner
    ? await getRepository(UserEntity, true)
    : await getRepository(UserEntity, false);
}

// export const getRepository = async <T extends ObjectLiteral>(
//   entity: EntityTarget<T>,
//   useQueryRunner = false,
// ): Promise<[Repository<T>, QueryRunner] | [Repository<T>]> => {
//   await initializeDataSource();
//   return useQueryRunner
//     ? [_DataSource.getRepository(entity), _DataSource.createQueryRunner()]
//     : [_DataSource.getRepository(entity)];
// };

// export const getUserRepository = async (useQueryRunner = false) =>
//   await getRepository(UserEntity, useQueryRunner);

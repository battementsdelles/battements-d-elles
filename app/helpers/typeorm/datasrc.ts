import { UserEntity } from '@/app/api/user/user.entity';
import { DataSource, EntityTarget, ObjectLiteral } from 'typeorm';

const _DataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  ssl: true,
  entities: [UserEntity],
  migrations: [],
  migrationsRun: false,
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

export const getRepository = async (entity: EntityTarget<ObjectLiteral>) => {
  await initializeDataSource();
  return _DataSource.getRepository(entity);
};

export const getUserRepository = async () => await getRepository(UserEntity);

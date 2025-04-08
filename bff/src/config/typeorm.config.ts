import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: 'study-flow-mysql',
  port: 3307,
  username: 'root',
  password: 'root',
  database: 'study_flow',
  entities: ['./../**/*.entity.js'],
  migrations: ['./../migrations/*.js'],
  synchronize: false,
  migrationsTableName: 'migrations',
});

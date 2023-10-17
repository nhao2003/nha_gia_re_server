import { DataSource } from "typeorm";
const AppDataSource = new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: '7554',
    database: 'postgres',
    synchronize: true,
    logging: false,
    entities: ['src/domain/databases/entity/*.ts'],
    migrations: [],
    subscribers: [],
  });

export { AppDataSource };
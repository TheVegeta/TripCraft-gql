import { DataSource } from "typeorm";
import { ENTITY_PATH } from "./constant";
import { DB_NAME, DB_PASSWORD, DB_USERNAME } from "./env";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: DB_USERNAME,
  password: DB_PASSWORD,
  database: DB_NAME,
  synchronize: true,
  logging: false,
  entities: [ENTITY_PATH],
  subscribers: [],
  migrations: [],
});

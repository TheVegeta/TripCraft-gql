import { DataSource } from "typeorm";
import { entityPath } from "./utils/constant";
import { DB_NAME, DB_PASS, DB_USER } from "./utils/env";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: DB_USER,
  password: DB_PASS,
  database: DB_NAME,
  synchronize: true,
  logging: false,
  entities: [entityPath],
  subscribers: [],
  migrations: [],
});

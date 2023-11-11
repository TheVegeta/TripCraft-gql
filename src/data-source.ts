import { DataSource } from "typeorm";
import { entityPath } from "./constant";
import { PG_DB_NAME, PG_DB_PASS, PG_DB_USER } from "./env";
import { toMilliseconds } from "./utils";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: PG_DB_USER,
  password: PG_DB_PASS,
  database: PG_DB_NAME,
  synchronize: true,
  logging: false,
  entities: [entityPath],
  subscribers: [],
  migrations: [],
  cache: {
    duration: toMilliseconds(0, 1, 0),
  },
});

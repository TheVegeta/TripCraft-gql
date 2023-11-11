import "dotenv/config";
import "reflect-metadata";

import "./utils";

import cors from "cors";
import HyperExpress from "hyper-express";
import { __developement, logger, max_body_length } from "./constant";
import { AppDataSource } from "./data-source";
import { PORT } from "./env";
import { assetsHandler } from "./handler/assetsHandler";
import { authHandler } from "./handler/authHandler";
import { fileHandler } from "./handler/fileHandler";
import { gqlHandler } from "./handler/gqlHandler";
import { reqHandler } from "./handler/reqHandler";

(async () => {
  const app = new HyperExpress.Server({ max_body_length });

  const [{ gqlReqHandler }] = await Promise.all([
    gqlHandler(),
    AppDataSource.initialize(),
  ]);

  if (__developement === true) {
    app.use(cors());
  }

  app.use(reqHandler);
  app.use(authHandler);
  app.use(fileHandler);
  app.use(gqlReqHandler);
  app.use(assetsHandler);

  app.set_not_found_handler((req, res) => {});
  app.set_error_handler((req, res, error) => {
    logger.error(error);
  });

  app
    .listen(PORT)
    .then(() => console.info(`> started @${PORT}`))
    .catch(() => console.info("Failed to start webserver on port 80"));
})();

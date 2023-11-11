import "dotenv/config";
import "reflect-metadata";

import "./utils";

import cors from "cors";
import { StatusCodes } from "http-status-codes";
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

  app.set_not_found_handler((req, res) => {
    res
      .status(StatusCodes.NOT_FOUND)
      .send(
        "Oops! It seems like the page or resource you're looking for could not be found."
      );
  });
  app.set_error_handler((req, res, error) => {
    logger.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send("Internal Server Error.");
  });

  app
    .listen(PORT)
    .then(() => console.info(`> started @${PORT}`))
    .catch(() => console.info(`Failed to start webserver on port ${PORT}`));
})();

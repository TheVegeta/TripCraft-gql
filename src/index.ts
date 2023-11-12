import "dotenv/config";
import "reflect-metadata";

import "./utils";

import { json } from "body-parser";
import cors from "cors";
import http from "http";
import { StatusCodes } from "http-status-codes";
import polka, { Request, Response } from "polka";
import { __developement } from "./constant";
import { PORT } from "./env";
import { bootstrapAuthHandler } from "./handler/authHandler";
import { bootstrapFileHandler } from "./handler/fileHandler";
import { bootstrapGqlHandler } from "./handler/gqlHandler";
import { onError } from "./utils";

(async () => {
  try {
    const server = http.createServer();

    const app = polka({ onError, server });

    if (__developement === true) {
      app.use(cors());
    }

    app.use(cors());
    app.use(json());

    /** auth handler */
    bootstrapAuthHandler(app);

    /** file handler */
    bootstrapFileHandler(app);

    /** graphql handler */
    await bootstrapGqlHandler(app);

    /** globle not found handler */
    app.use("*", (req: Request, res: Response) => {
      res.statusCode = StatusCodes.NOT_FOUND;
      res.end(
        "Oops! It seems like the page or resource you're looking for could not be found."
      );
    });

    app.listen(PORT, () => {
      console.info(`> started @${PORT}`);
    });
  } catch (err) {
    console.info(`Failed to start webserver on port ${PORT}`);
  }
})();

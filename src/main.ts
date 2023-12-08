import "./bootstrap";

import cors from "cors";
import { StatusCodes } from "http-status-codes";
import HyperExpress from "hyper-express";
import { buildSchema } from "type-graphql";
import { AppDataSource } from "./data-source";
import { assetsAuthHandler } from "./handler/assets";
import { googleAuthHandler } from "./handler/auth/google";
import { gqlHandler } from "./handler/gql";
import { resolvers } from "./resolver";
import { __dev, gqlPath, max_body_length } from "./utils/constant";
import { PORT } from "./utils/env";

(async () => {
  const app = new HyperExpress.Server({ max_body_length });

  const [, schema] = await Promise.all([
    AppDataSource.initialize(),
    buildSchema({
      resolvers,
      validate: false,
      emitSchemaFile: {
        path: gqlPath,
        sortedSchema: true,
      },
    }),
  ]);

  if (__dev) {
    app.use(cors());
  }

  gqlHandler(app, schema);
  googleAuthHandler(app);
  assetsAuthHandler(app);

  app.set_error_handler((req, res, err) => {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).end("INTERNAL ERROR");
  });

  app.set_not_found_handler((req, res) => {
    res.status(StatusCodes.NOT_FOUND).end("NOT FOUND");
  });

  await app.listen(PORT);

  console.log(`>started ${PORT}`);
})();

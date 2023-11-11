import { Benzene, makeHandler } from "@benzene/http";
import { makeCompileQuery } from "@benzene/jit";
import HyperExpress, { Request, Response } from "hyper-express";
import { buildSchema } from "type-graphql";
import { gqlPath } from "../constant";
import { HelloResolver } from "../resolver/HelloResolver";

const gqlHandler = async () => {
  const gqlReqHandler = new HyperExpress.Router();

  const schema = await buildSchema({
    resolvers: [HelloResolver],
    validate: false,
    emitSchemaFile: {
      path: gqlPath,
      sortedSchema: false,
    },
  });

  const GQL = new Benzene({ schema, compileQuery: makeCompileQuery() });

  const graphqlHTTP = makeHandler(GQL);

  const gqlRequestHandler = async (request: Request, response: Response) => {
    const body = await request.json();
    graphqlHTTP({
      method: request.method,
      headers: request.headers,
      body,
    }).then((result) => {
      response.status(result.status).json(result.payload);
    });
  };

  gqlReqHandler.post("/graphql", gqlRequestHandler);

  return { gqlReqHandler };
};

export { gqlHandler };

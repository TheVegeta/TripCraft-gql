import { useGraphQlJit } from "@envelop/graphql-jit";
import { blockFieldSuggestionsPlugin } from "@escape.tech/graphql-armor-block-field-suggestions";
import { useAPQ } from "@graphql-yoga/plugin-apq";
import { useDisableIntrospection } from "@graphql-yoga/plugin-disable-introspection";
import {
  createInMemoryCache,
  useResponseCache,
} from "@graphql-yoga/plugin-response-cache";
import { GraphQLSchema } from "graphql";
import { createYoga } from "graphql-yoga";
import { Server } from "hyper-express";
import { toMilliseconds } from "../helpers";
import { IGqlContext } from "../types";
import { __dev } from "../utils/constant";

const cache = createInMemoryCache();

export const gqlHandler = (server: Server, schema: GraphQLSchema) => {
  const yoga = createYoga<IGqlContext>({
    schema,
    graphiql: false,
    plugins: [
      !__dev && useDisableIntrospection(),
      blockFieldSuggestionsPlugin(),
      useAPQ(),
      useGraphQlJit({ customJSONSerializer: true }),
      useResponseCache({
        session: () => null,
        ttl: toMilliseconds(0, 0, 30),
        cache,
        ttlPerSchemaCoordinate: {
          "Query.getSearch": toMilliseconds(0, 30, 0),
        },
      }),
    ],
  });

  server.any("/graphql", async (req, res) => {
    const response = await yoga.fetch(
      req.url,
      {
        method: req.method,
        headers: req.headers,
        body: JSON.stringify(await req.json()),
      },
      { req, res }
    );

    res.statusCode = response.status;
    return res.end(await response.text());
  });
};

import { useGraphQlJit } from "@envelop/graphql-jit";
import { blockFieldSuggestionsPlugin } from "@escape.tech/graphql-armor-block-field-suggestions";
import { useAPQ } from "@graphql-yoga/plugin-apq";
import { useDisableIntrospection } from "@graphql-yoga/plugin-disable-introspection";
import {
  createInMemoryCache,
  useResponseCache,
} from "@graphql-yoga/plugin-response-cache";
import { Request, Response, Router } from "express";
import { createYoga } from "graphql-yoga";
import { buildSchemaSync } from "type-graphql";
import { __dev } from "../constant";
import { HelloResolver } from "../resolver/HelloResolver";
import { toMilliseconds } from "../utils";

const gqlRoute = Router();
const cache = createInMemoryCache();

const yoga = createYoga<{ req: Request; res: Response }>({
  schema: buildSchemaSync({
    resolvers: [HelloResolver],
    validate: false,
    emitSchemaFile: "schema.gql",
  }),
  graphiql: false,
  plugins: [
    useGraphQlJit({ customJSONSerializer: false }),
    !__dev &&
      useResponseCache({
        session: () => null,
        ttl: toMilliseconds(0, 1, 0),
        cache,
      }),
    blockFieldSuggestionsPlugin(),
    useAPQ(),
    !__dev && useDisableIntrospection(),
  ],
});

gqlRoute.all(yoga.graphqlEndpoint, async (req, res) => await yoga(req, res));

export { gqlRoute };

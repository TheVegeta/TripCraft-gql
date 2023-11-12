import { envelop, useEngine, useSchema } from "@envelop/core";
import { useDisableIntrospection } from "@envelop/disable-introspection";
import { useGraphQlJit } from "@envelop/graphql-jit";
import { useImmediateIntrospection } from "@envelop/immediate-introspection";
import { useParserCache } from "@envelop/parser-cache";
import { createInMemoryCache, useResponseCache } from "@envelop/response-cache";
import { useValidationCache } from "@envelop/validation-cache";
import * as GraphQLJS from "graphql";
import {
  getGraphQLParameters,
  processRequest,
  renderGraphiQL,
  sendResult,
  shouldRenderGraphiQL,
} from "graphql-helix";
import { Polka, Request, Response } from "polka";
import { lru } from "tiny-lru";
import { buildSchema } from "type-graphql";
import { __developement, gqlPath } from "../constant";
import { HelloResolver } from "../resolver/HelloResolver";
import { IGraphqlContext } from "../types";
import { toMilliseconds } from "../utils";

export const bootstrapGqlHandler = async (app: Polka<Request>) => {
  const schema = await buildSchema({
    resolvers: [HelloResolver],
    emitSchemaFile: {
      path: gqlPath,
      sortedSchema: false,
    },
    validate: false,
  });

  const cache = createInMemoryCache();

  const getEnveloped = envelop({
    plugins: [
      useEngine(GraphQLJS),
      useSchema(schema),
      useImmediateIntrospection(),
      useValidationCache(),
      useParserCache(),
      useResponseCache({
        cache,
        session: () => null,
        ttl: toMilliseconds(0, 2, 0),
      }),
      useGraphQlJit({}, { cache: lru() }),
      !__developement && useDisableIntrospection(),
    ],
  });

  app.use("/graphql", async (req: Request, res: Response) => {
    const { parse, validate, contextFactory, execute, schema } =
      getEnveloped<IGraphqlContext>({
        req,
        res,
      });

    const request = {
      body: req.body,
      headers: req.headers,
      method: req.method,
      query: req.query,
    };

    if (shouldRenderGraphiQL(request)) {
      res.end(renderGraphiQL());
    } else {
      const { operationName, query, variables } = getGraphQLParameters(request);

      const result = await processRequest({
        operationName,
        query,
        variables,
        request,
        schema,
        parse,
        validate,
        execute,
        contextFactory,
      });

      sendResult(result, res);
    }
  });
};

import { NonEmptyArray } from "type-graphql";
import { AuthResolver } from "./AuthResolver";
import { HelloResolver } from "./HelloResolver";
import { ScraperResolver } from "./ScraperResolver";

export const resolvers: NonEmptyArray<Function> = [
  HelloResolver,
  AuthResolver,
  ScraperResolver,
];

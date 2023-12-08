import { NonEmptyArray } from "type-graphql";
import { AuthResolver } from "./AuthResolver";
import { HelloResolver } from "./HelloResolver";

export const resolvers: NonEmptyArray<Function> = [HelloResolver, AuthResolver];

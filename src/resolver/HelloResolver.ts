import { Query, Resolver, UseMiddleware } from "type-graphql";
import { isUserAuthenticated } from "../middleware";

@Resolver()
export class HelloResolver {
  @UseMiddleware([isUserAuthenticated])
  @Query(() => String)
  async hello() {
    return "world";
  }
}

import { Query, Resolver } from "type-graphql";

@Resolver()
export class HelloResolver {
  @Query(() => String)
  async hello() {
    await new Promise((r) => setTimeout(r, 5000));
    return "bye";
  }
}

import axios from "axios";
import { load } from "cheerio";
import _ from "lodash";
import {
  Arg,
  Field,
  InputType,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import { toMilliseconds } from "../helpers";
import { ScraperHeper } from "../helpers/scraperHelper";
import { DDG_URL } from "../utils/constant";

@ObjectType({ simpleResolvers: true })
export class ILinkResponse {
  @Field()
  href!: string;

  @Field()
  tile!: string;
}

@InputType()
export class SearchQuery {
  @Field()
  query!: string;
}

@InputType()
export class FromTripadvisorQuery {
  @Field()
  link!: string;
}

@Resolver()
export class ScraperResolver {
  heler = new ScraperHeper();

  @Query(() => [ILinkResponse])
  async getSearch(
    @Arg("options") options: SearchQuery
  ): Promise<ILinkResponse[]> {
    try {
      const { data } = await axios.get(DDG_URL + `?q=${options.query}`, {
        proxy: this.heler.getProxy(),
        timeout: toMilliseconds(0, 0, 10),
        headers: {
          "User-Agent": this.heler.userAgent.data.userAgent,
        },
      });

      const $ = load(data);

      const resultArray: Array<{
        href: string;
        tile: string;
      }> = [];

      _.map($(".links_main.links_deep.result__body"), (item) => {
        const dataObj = {
          href: _.trim($(item).find(".result__url").text()),
          tile: _.trim($(item).find(".result__snippet").text()),
        };
        resultArray.push(dataObj);
      });

      return resultArray;
    } catch (err) {
      return [];
    }
  }

  @Query(() => String)
  async getFromTripadvisor(
    @Arg("options") options: FromTripadvisorQuery
  ): Promise<string> {
    try {
      const { link } = options;
      const { data } = await axios.get(link, {
        proxy: this.heler.getProxy(),
        timeout: toMilliseconds(0, 0, 10),
        headers: {
          "User-Agent": this.heler.userAgent.data.userAgent,
        },
      });

      const $ = load(data);

      _.map($(".jemSU"), (item, index) => {
        console.log(index, $(".XfVdV.o.AIbhI").length);
        // console.log($(".biGQs._P.pZUbB.hmDzD").find("span").text());
      });

      return "";
    } catch (err) {
      return "";
    }
  }
}

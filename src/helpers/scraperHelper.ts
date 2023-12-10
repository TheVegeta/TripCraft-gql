import axios, { AxiosProxyConfig } from "axios";
import ProxyList, { IFreeProxy } from "free-proxy";
import _ from "lodash";
import { map } from "modern-async";
import UserAgent from "user-agents";
import { toMilliseconds } from ".";
import { DDG_URL } from "../utils/constant";

const proxyList = new ProxyList();

export class ScraperHeper {
  proxy: IFreeProxy[] = [];
  userAgent = new UserAgent();

  constructor() {
    const setProxy = async () => {
      let workingProxy: IFreeProxy[] = [];

      const proxys = await proxyList.get();

      map(proxys, async (item) => {
        try {
          await axios.get(DDG_URL, {
            proxy: {
              host: item.ip,
              port: _.toNumber(item.port),
              protocol: item.protocol,
            },
            timeout: toMilliseconds(0, 0, 5),
          });
          workingProxy.push(item);
        } catch (err) {}
      });

      this.proxy = workingProxy;
    };

    const setHeader = () => {
      this.userAgent = new UserAgent();
    };

    setProxy();
    setHeader();

    setInterval(function () {
      setProxy();
      setHeader();
    }, toMilliseconds(0, 10, 0));
  }

  getProxy(): AxiosProxyConfig | undefined {
    const proxy = _.sample(this.proxy);
    if (proxy) {
      return {
        host: proxy.ip,
        port: _.toNumber(proxy.port),
        protocol: proxy.protocol,
      };
    } else {
      return undefined;
    }
  }
}

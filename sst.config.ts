import type { SSTConfig } from "sst";
import { RDS, SvelteKitSite } from "sst/constructs";

export default {
  config() {
    return {
      name: "app",
      region: "ap-southeast-1",
    };
  },
  stacks(app) {
    if (app.stage !== "prod") {
      app.setDefaultRemovalPolicy("destroy");
    }

    
    app.stack(function Site({ stack }) {
      const rds = new RDS(stack, "db", {
        engine: 'postgresql13.9',
        defaultDatabaseName: 'bzzz',
        scaling: {
          autoPause: true,
          minCapacity: "ACU_2",
          maxCapacity: "ACU_2",
        }
      })


      const site = new SvelteKitSite(stack, "site", {
        bind: [rds],
      });
      stack.addOutputs({
        url: site.url,
      });
    });
    
  },
} satisfies SSTConfig;

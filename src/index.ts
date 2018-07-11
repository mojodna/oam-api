import "reflect-metadata";
import { createConnection } from "typeorm";
import * as Koa from "koa";
import * as bodyParser from "koa-bodyparser";
import * as jwt from "koa-jwt";

import { router } from "./routes";

createConnection()
  .then(async connection => {
    const app = new Koa();

    app.use(bodyParser());
    app.use(async (ctx, next) => {
      // the parsed body will appear in ctx.request.body
      // if nothing was parsed, it will be an empty object ({})
      ctx.body = ctx.request.body;

      await next();
    });

    // TODO enable JWT
    // app.use(
    //   jwt({
    //     secret: "TODO"
    //   })
    // );

    // TODO wrap certain responses by default (standard OAM boilerplate)
    // app.use(async (ctx, next) => {
    //   await next();
    //
    //   console.log(ctx.body);
    //
    //   ctx.body = {
    //     wrapped: true,
    //     body: ctx.body
    //   };
    // });

    app.use(router.routes()).use(router.allowedMethods());

    const port = process.env.PORT || 3000;
    app.listen(port, function () {
      console.log(`Listening at http://${this.address().address}:${this.address().port}`);
    });
  })
  .catch(error => console.error(error));

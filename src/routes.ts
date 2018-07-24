import * as Router from "koa-router";

import ItemController from "./controller/ItemController";
import MetaController from "./controller/MetaController";
import UserController from "./controller/UserController";

const router = new Router();

router.get("/items", ItemController.all);
router.get("/items/:id", ItemController.one);
router.post("/items", ItemController.save);
router.put("/items/:id", ItemController.update);
router.delete("/items/:id", ItemController.remove);

router.use("/meta", async (ctx: any, next) => {
  await next();

  ctx.body = {
    meta: {
      ...ctx.meta,
      provided_by: "OpenAerialMap",
      license: "CC-BY 4.0",
      website: "http://openaerialmap.org",
    },
    results: ctx.body
  }
});

router.get("/meta", MetaController.all);

router.get("/users", UserController.all);

export { router };

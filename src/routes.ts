import * as Router from "koa-router";

import ItemController from "./controller/ItemController";
import UserController from "./controller/UserController";

const router = new Router();

router.get("/items", ItemController.all);
router.get("/items/:id", ItemController.one);
router.post("/items", ItemController.save);
router.put("/items/:id", ItemController.update);
router.delete("/items/:id", ItemController.remove);

router.get("/users", UserController.all);

export { router };

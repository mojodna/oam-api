import { Context } from "koa";
import { validate } from "class-validator";

import { Item } from "../entity/Item";

export default class ItemController {
  static async all(ctx: Context) {
    // bbox - minX,minY,maxX,maxY
    // title
    // provider
    // gsd_from
    // gsd_to
    // acquisition_from
    // acquisition_to
    // has_tiled
    // sort (desc/asc)
    // order_by (gsd/date)
    // limit
    // page
    // skip
    console.log("page:", ctx.query.page);
    console.log("limit:", ctx.query.limit);

    ctx.body = await Item.find();
  }

  static async one(ctx: Context) {
    return Item.findOne(ctx.params.id);
  }

  static async save(ctx: Context) {
    const item = Item.create(ctx.body);

    const errors = await validate(item, { validationError: { target: false } });

    if (errors.length > 0) {
      ctx.status = 400;
      ctx.body = {
        errors
      };
      return;
    }

    // TODO return a 201 (right?)
    return item.save();
  }

  static async update(ctx: Context) {
    const item = await Item.preload({
      ...ctx.body,
      id: ctx.params.id
    });

    const errors = await validate(item, { validationError: { target: false } });

    console.log("errors:", errors.map(x => x.toString()));

    if (errors.length > 0) {
      ctx.status = 400;
      ctx.body = {
        errors
      };
      return;
    }

    // TODO return a 204
    return item.save();
  }

  static async remove(ctx: Context) {
    // TODO return a 204
    await Item.delete(ctx.params.id);
  }
}

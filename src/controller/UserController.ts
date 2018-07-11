import { Context } from "koa";
import { User } from "../entity/User";

export default class UserController {
  static async all(ctx: Context) {
    ctx.body = User.find();
  }

  static async one(ctx: Context) {
    return User.findOne(ctx.params.id);
  }

  static async save(ctx: Context) {
    return User.save(ctx.body);
  }

  static async remove(ctx: Context) {
    await User.delete(ctx.params.id);
  }
}

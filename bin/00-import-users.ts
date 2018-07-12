import { Writable } from "stream";

import { validate } from "class-validator";
import { createConnection } from "typeorm";

import { BinarySplitter } from "../src/lib/binary-splitter";
import { User } from "../src/entity/User";

class UserImporter extends Writable {
  constructor() {
    super({
      objectMode: true
    });
  }

  async _write(line, _, callback) {
    try {
      const u = JSON.parse(line.toString());

      const user = User.create({
        _id: u._id.$oid,
        googleId: u.google_id,
        facebookId: u.facebook_id,
        name: u.name,
        contactEmail: u.contact_email,
        facebookToken: u.facebook_token,
        profilePicURI: u.profile_pic_uri,
        sessionExpiration: u.session_expiration && new Date(u.session_expiration.$date),
        sessionId: u.session_id,
        bio: u.bio || "",
        website: u.website
      });

      const errors = await validate(user);

      if (errors.length > 0) {
        console.log(u);
        console.log(errors);
        process.exit();
      }

      await user.save();
    } catch (err) {
      if (err.code !== "23505") {
        // not a duplicate key error
        console.log(err);
        console.log(line.toString());
        process.exit();
      }
    }

    return callback();
  }
}

createConnection().then(() =>
  process.stdin.pipe(new BinarySplitter()).pipe(new UserImporter())
);
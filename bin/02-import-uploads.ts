import { Writable } from "stream";

import { validate } from "class-validator";
import { createConnection, In } from "typeorm";

import { BinarySplitter } from "../src/lib/binary-splitter";
import { UploadedScene } from "../src/entity/UploadedScene";
import { User } from "../src/entity/User";
import { UploadedImage } from "../src/entity/UploadedImage";

class UploadImporter extends Writable {
  constructor() {
    super({
      objectMode: true
    });
  }

  parseDate(date) {
    if (date != null && date.$date != null) {
      return new Date(date.$date);
    } else if (date != null) {
      return new Date(date);
    } else {
      return null;
    }
  }

  async _write(line, _, callback) {
    try {
      const upload = JSON.parse(line.toString());

      const user = await User.findOne({
        where: {
          _id: upload.user.$oid
        }
      });

      for (const scene of upload.scenes) {
        const images = await UploadedImage.find({
          where: {
            _id: In(scene.images.map(i => i.$oid))
          }
        });

        const uploadedScene = UploadedScene.create({
          _id: upload._id.$oid,
          user,
          createdAt: new Date(upload.createdAt.$date),
          contactName: scene.contact && scene.contact.name,
          contactEmail: scene.contact && scene.contact.email,
          title: scene.title,
          provider: scene.provider,
          platform: scene.platform,
          sensor: scene.sensor,
          acquisitionStart: this.parseDate(scene.acquisition_start),
          acquisitionEnd: this.parseDate(scene.acquisition_end),
          license: scene.license,
          tags: scene.tags,
          images
        });

        const errors = await validate(uploadedScene);

        if (errors.length > 0) {
          console.log(upload);
          console.log(errors);
          process.exit();
        }

        await uploadedScene.save();
      }
    } catch (err) {
      console.log(err);
      console.log(line.toString());
      process.exit();
    }

    return callback();
  }
}

createConnection().then(() =>
  process.stdin.pipe(new BinarySplitter()).pipe(new UploadImporter())
);
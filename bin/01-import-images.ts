import { Writable } from "stream";

import { validate } from "class-validator";
import { createConnection } from "typeorm";

import { BinarySplitter } from "../src/lib/binary-splitter";
import { UploadedImage } from "../src/entity/UploadedImage";

class ImageImporter extends Writable {
  constructor() {
    super({
      objectMode: true
    });
  }

  async _write(line, _, callback) {
    try {
      const image = JSON.parse(line.toString());

      const uploadedImage = UploadedImage.create({
        _id: image._id.$oid,
        url: image.url,
        status: image.status,
        messages: image.messages,
        startedAt: image.startedAt && new Date(image.startedAt.$date),
        stoppedAt: image.stoppedAt && new Date(image.stoppedAt.$date)
      });

      const errors = await validate(uploadedImage);

      if (errors.length > 0) {
        console.log(image);
        console.log(errors);
        process.exit();
      }

      await uploadedImage.save();
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
  process.stdin.pipe(new BinarySplitter()).pipe(new ImageImporter())
);
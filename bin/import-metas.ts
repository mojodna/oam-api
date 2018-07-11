import { Writable } from "stream";

import { validate } from "class-validator";
import { createConnection } from "typeorm";

import { BinarySplitter } from "../src/lib/binary-splitter";
import { Item } from "../src/entity/Item";

class MetaImporter extends Writable {
  constructor() {
    super({
      objectMode: true
    });
  }

  async _write(line, _, callback) {
    try {
      const meta = JSON.parse(line.toString());
      const { wmts, tms, thumbnail, sensor, license, tags, crs, url, ...properties } = meta.properties;

      const item = Item.create({
        _id: meta._id.$oid,
        geom: meta.geojson,
        uuid: meta.uuid,
        metaURI: meta.meta_uri,
        thumbURI: thumbnail,
        title: meta.title,
        projection: crs || meta.projection,
        gsd: meta.gsd,
        fileSize: meta.file_size,
        license,
        acquisitionStart: meta.acquisition_start && new Date(meta.acquisition_start.$date),
        acquisitionEnd: meta.acquisition_end && new Date(meta.acquisition_end.$date),
        platform: meta.platform.toLowerCase(),
        sensor,
        tags,
        provider: meta.provider,
        contact: meta.contact,
        properties: properties,
        uploadedAt: meta.uploaded_at && new Date(meta.uploaded_at.$date),
        url
      });

      const errors = await validate(item);

      if (errors.length > 0) {
        console.log(meta);
        console.log(errors);
        process.exit();
      }

      await item.save();
    } catch (err) {
      console.log(err);
      console.log(line.toString());
      process.exit();
    }

    return callback();
  }

  _flush(callback) {
    return callback();
  }
}

createConnection().then(() =>
  process.stdin.pipe(new BinarySplitter()).pipe(new MetaImporter())
);
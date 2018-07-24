import bbox from "@turf/bbox";
import bboxPolygon from "@turf/bbox-polygon";
import { getConnection } from "typeorm";

import { Item } from "../entity/Item";

export default class MetaController {
  static DEFAULT_LIMIT = 1;
  static BBOX_PATTERN = /(-?\d+(?:\.\d*)?,-?\d+(?:\.\d*)?,-?\d+(?:\.\d*)?),-?\d+(?:\.\d*)?/;

  static async all(ctx: any) {
    const { query } = ctx;

    let qb = getConnection()
      .getRepository(Item)
      .createQueryBuilder("item");

    // bbox - minX,minY,maxX,maxY
    if (query.bbox != null && MetaController.BBOX_PATTERN.test(query.bbox)) {
      const coords = query.bbox.split(",").map(Number);
      const geom = bboxPolygon(coords).geometry;

      qb = qb
        .andWhere("geom @ ST_SetSRID(ST_GeomFromGeoJSON(:bbox), 4326)")
        .setParameters({
          bbox: geom
        });
    }

    if (query.gsd_from != null || query.gsd_to != null) {
      qb = qb
        .andWhere("gsd BETWEEN :gsd_from AND :gsd_to")
        .setParameters({
          gsd_from: Number(query.gsd_from || 0),
          gsd_to: Number(query.gsd_to || 1000000)
        });
    }

    if (query.acquisition_from != null || query.acquisition_to != null) {
      qb = qb
        .andWhere("acquisition_start >= :acquisition_from AND acquisition_end <= :acquisition_to")
        .setParameters({
          acquisition_from: new Date(Date.parse(query.acquisition_from) || 0), // this means we can't track imagery earlier than 1970
          acquisition_to: new Date(Date.parse(query.acquisition_to) || Date.now())
        });
    }

    if (query.order_by != null) {
      // TODO cache this
      const columns = getConnection().getMetadata(Item).columns.map(x => x.databaseName);

      if (columns.includes(query.order_by)) {
        qb = qb
          .orderBy({
            [query.order_by]: (query.sort || "").toLowerCase() === "asc" ? "ASC" : "DESC"
          })
      }
    }

    const page = Number(query.page) || 1;
    const take = Math.max(
      query.limit || MetaController.DEFAULT_LIMIT,
      MetaController.DEFAULT_LIMIT
    );
    const skip = (page - 1) * take;

    ctx.meta = {
      page,
      limit: take,
      found: await qb.getCount()
    };

    const items = await qb
      .skip(skip)
      .take(take)
      .getMany();

    ctx.body = items.map(item => {
      const {
        acquisitionStart: acquisition_start,
        acquisitionEnd: acquisition_end,
        geom: geojson,
        sensor,
        thumbURI: thumbnail,
        properties,
        metaURI: meta_uri,
        uploadedAt: uploaded_at,
        fileSize,
        id,
        createdAt,
        updatedAt,
        url,
        ...props
      } = item;

      const box = bbox(geojson);

      return {
        ...props,
        acquisition_start,
        acquisition_end,
        geojson: {
          ...geojson,
          bbox: box
        },
        bbox: box,
        meta_uri,
        uploaded_at,
        file_size: Number(fileSize),
        properties: {
          ...properties,
          sensor,
          thumbnail
        }
      };
    });
  }
}

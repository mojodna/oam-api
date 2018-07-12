import {
  IsDate,
  IsUrl,
  IsOptional,
  IsDefined,
  validate
} from "class-validator";
import { Geometry } from "geojson";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  UpdateDateColumn,
  JoinColumn,
  BeforeInsert,
  BeforeUpdate
} from "typeorm";

import { Metadata } from "./Metadata";
import { UploadedImage } from "./UploadedImage";
import { User } from "./User";

@Entity("items")
export class Item extends Metadata {
  @BeforeInsert()
  @BeforeUpdate()
  async validate() {
    const errors = await validate(this);

    if (errors.length > 0) {
      throw errors;
    }
  }

  @PrimaryGeneratedColumn("uuid") id: string;

  @Column({
    unique: true
  })
  _id: string;

  @ManyToOne(type => UploadedImage, image => image.items)
  @JoinColumn({
    name: "uploaded_image_id"
  })
  uploadedImage: UploadedImage;

  @ManyToOne(type => User, user => user.items)
  @JoinColumn({
    name: "user_id"
  })
  user: User;

  @Column({
    nullable: true
  })
  contact: string;

  @Column("geometry", {
    nullable: true,
    spatialFeatureType: "Geometry",
    srid: 4326
  })
  geom: Geometry;

  @Column({
    name: "meta_uri",
    nullable: true
  })
  metaURI: string;

  @Column({
    name: "thumb_uri",
    nullable: true
  })
  thumbURI: string;

  @Column({
    nullable: true
  })
  projection: string;

  @Column("double precision", {
    nullable: true
  })
  gsd: number;

  @Column("bigint", {
    name: "file_size",
    nullable: true
  })
  fileSize: number;

  @Column("jsonb", {
    nullable: true
  })
  properties: any;

  @Column("text")
  @IsUrl({
    protocols: ["http", "https", "s3"],
    require_tld: false,
    require_protocol: true
  })
  url: string;

  @Column({
    name: "uploaded_at",
    nullable: true
  })
  @IsOptional()
  @IsDate()
  uploadedAt: Date;

  @CreateDateColumn({
    name: "created_at"
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: "updated_at"
  })
  updatedAt: Date;
}

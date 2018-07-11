import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Generated,
  ManyToOne,
  UpdateDateColumn
} from "typeorm";
import {
  ArrayNotEmpty,
  IsDateString,
  IsDefined,
  IsIn,
  IsNotEmpty,
  IsUrl
} from "class-validator";

import { User } from "./User";

import { Geometry } from "geojson";

// TODO internal + external representations differ (???)
@Entity("items")
export class Item extends BaseEntity {
  @PrimaryGeneratedColumn("uuid") _id: string;

  @ManyToOne(type => User, user => user.items)
  user: User;

  @Column("geometry", {
    nullable: true,
    spatialFeatureType: "Geometry",
    srid: 4326
  })
  geom: Geometry;

  // Image source
  @Column({
    nullable: true
  })
  uuid: string;

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
  @IsNotEmpty()
  title: string;

  @Column({
    nullable: true
  })
  projection: string;

  @Column("double precision", {
    array: true,
    nullable: true
  })
  bbox: number[];

  @Column({
    nullable: true
  })
  footprint: string;

  @Column("double precision", {
    nullable: true
  })
  gsd: number;

  @Column({
    name: "file_size",
    nullable: true
  })
  fileSize: number;

  @Column({
    nullable: true
  })
  @IsDefined()
  license: string;

  @Column({
    name: "acquisition_start",
    nullable: true
  })
  @IsDefined()
  @IsDateString()
  acquisitionStart: Date;

  @Column({
    name: "acquisition_end",
    nullable: true
  })
  @IsDefined()
  @IsDateString()
  acquisitionEnd: Date;

  @Column({
    nullable: true
  })
  @IsIn(["satellite", "aircraft", "uav", "balloon", "kite"])
  platform: string;

  @Column({
    nullable: true
  })
  tags: string;

  @Column({
    nullable: true
  })
  @IsNotEmpty()
  provider: string;

  // TODO check to see how this is represented; it might be { name, email } or a
  // comma-delimited string
  @Column({
    nullable: true
  })
  contact: string;

  // TODO how does typeorm handle PostGIS?
  @Column("jsonb", {
    nullable: true
  })
  geojson: any;

  @Column("jsonb", {
    nullable: true
  })
  properties: any;

  @Column("text", {
    array: true,
    nullable: true
  })
  @ArrayNotEmpty()
  @IsUrl(
    {},
    {
      each: true
    }
  )
  urls: string[];

  @Column({
    name: "uploaded_at",
    nullable: true
  })
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

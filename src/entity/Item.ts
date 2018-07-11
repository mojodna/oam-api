import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  UpdateDateColumn
} from "typeorm";
import {
  IsDate,
  IsIn,
  IsNotEmpty,
  IsUrl,
  IsOptional
} from "class-validator";

import { User } from "./User";

import { Geometry } from "geojson";

@Entity("items")
export class Item extends BaseEntity {
  @PrimaryGeneratedColumn("uuid") id: string;

  @Column()
  _id: string;

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
  // @IsDefined()
  license: string;

  @Column({
    name: "acquisition_start",
    nullable: true
  })
  @IsOptional()
  @IsDate()
  acquisitionStart: Date;

  @Column({
    name: "acquisition_end",
    nullable: true
  })
  @IsOptional()
  @IsDate()
  acquisitionEnd: Date;

  @Column({
    nullable: true
  })
  @IsIn(["satellite", "aircraft", "uav", "balloon", "kite"])
  platform: string;

  @Column({
    nullable: true
  })
  sensor: string;

  @Column({
    nullable: true
  })
  tags: string;

  @Column({
    nullable: true
  })
  @IsNotEmpty()
  provider: string;

  @Column({
    nullable: true
  })
  contact: string;

  @Column("jsonb", {
    nullable: true
  })
  properties: any;

  @Column("text", {
    nullable: true
  })
  @IsOptional()
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

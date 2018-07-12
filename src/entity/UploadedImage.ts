import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, OneToMany, JoinColumn, BaseEntity } from "typeorm";
import { IsOptional, IsDate, IsDefined } from "class-validator";

import { Item } from "./Item";
import { UploadedScene } from "./UploadedScene";

@Entity("uploaded_images")
export class UploadedImage extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    unique: true
  })
  _id: string;

  @OneToMany(type => Item, item => item.upload)
  items: Item[];

  @ManyToOne(type => UploadedScene, scene => scene.images)
  @JoinColumn({
    name: "uploaded_scene_id"
  })
  scene: UploadedScene;

  @Column()
  @IsDefined()
  // GDrive URLs, e.g. gdrive://1DqlPLrRC8LtU7WbV_HViE4gFmyH9fXQ-, aren't validated properly
  // @IsUrl({
  //   protocols: ["gdrive", "http", "https", "s3"],
  //   require_tld: false,
  //   require_protocol: true,
  //   allow_underscores: true
  // })
  url: string;

  @Column({
    nullable: true
  })
  status: string;

  @Column("text", {
    array: true,
    nullable: true
  })
  messages: string[];

  @Column({
    name: "started_at",
    nullable: true
  })
  @IsOptional()
  @IsDate()
  startedAt: Date;

  @Column({
    name: "stopped_at",
    nullable: true
  })
  @IsOptional()
  @IsDate()
  stoppedAt: Date;

  @CreateDateColumn({
    name: "created_at"
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: "updated_at"
  })
  updatedAt: Date;
}
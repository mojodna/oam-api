import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, OneToMany, JoinColumn } from "typeorm";
import { IsUrl, IsOptional, IsDate } from "class-validator";

import { Item } from "./Item";
import { Metadata } from "./Metadata";
import { UploadedImage } from "./UploadedImage";
import { User } from "./User";

@Entity("uploaded_scenes")
export class UploadedScene extends Metadata {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  _id: string;

  @OneToMany(type => UploadedImage, image => image.scene)
  images: UploadedImage[];

  @ManyToOne(type => User, user => user.uploadedScenes)
  @JoinColumn({
    name: "user_id"
  })
  user: User;

  @Column({
    name: "contact_name",
    nullable: true
  })
  contactName: string;

  @Column({
    name: "contact_email",
    nullable: true
  })
  contactEmail: string;

  @CreateDateColumn({
    name: "created_at"
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: "updated_at"
  })
  updatedAt: Date;
}
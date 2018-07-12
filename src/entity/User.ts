import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  BeforeInsert,
  BeforeUpdate,
  Index
} from "typeorm";
import {
  IsEmail,
  IsUrl,
  MinLength,
  MaxLength,
  IsDate,
  IsOptional,
  validate
} from "class-validator";

import { Item } from "./Item";
import { UploadedScene } from "./UploadedScene";

@Entity("users")
export class User extends BaseEntity {
  @BeforeInsert()
  @BeforeUpdate()
  async validate() {
    const errors = await validate(this);

    if (errors.length > 0) {
      throw errors;
    }
  }

  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    unique: true
  })
  @Index({
    unique: true
  })
  _id: string;

  @Column()
  @MinLength(2)
  @MaxLength(50)
  name: string;

  @Column({
    nullable: true
  })
  // @IsUrl()
  website: string;

  @Column()
  @MaxLength(1500)
  bio: string;

  @Column({
    name: "facebook_id",
    nullable: true
  })
  facebookId: string;

  @Column({
    name: "facebook_token",
    nullable: true
  })
  facebookToken: string;

  @Column({
    name: "google_id",
    nullable: true
  })
  googleId: string;

  @Column({
    name: "contact_email",
    nullable: true
  })
  @IsOptional()
  @IsEmail()
  contactEmail: string;

  @Column({
    name: "profile_pic_uri"
  })
  @IsUrl()
  profilePicURI: string;

  @Column({
    name: "session_id"
  })
  sessionId: string;

  @Column({
    name: "session_expiration"
  })
  @IsDate()
  sessionExpiration: Date;

  @OneToMany(type => Item, item => item.user)
  items: Item[];

  @OneToMany(type => UploadedScene, scene => scene.user)
  uploadedScenes: UploadedScene[];

  @CreateDateColumn({
    name: "created_at"
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: "updated_at"
  })
  updatedAt: Date;
}

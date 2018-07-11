import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany
} from "typeorm";
import {
  ArrayNotEmpty,
  IsDate,
  IsDefined,
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsUrl,
  MinLength,
  MaxLength
} from "class-validator";

import { Item } from "./Item";

@Entity("users")
export class User extends BaseEntity {
  @PrimaryGeneratedColumn() id: number;

  @Column()
  @MinLength(3)
  @MaxLength(30)
  name: string;

  @Column()
  @IsUrl()
  website: string;

  @Column()
  @IsNotEmpty()
  @MaxLength(300)
  bio: string;

  @Column({
    name: "facebook_id"
  })
  facebookId: number;

  @Column({
    name: "facebook_token"
  })
  facebookToken: string;

  @Column({
    name: "google_id"
  })
  googleId: number;

  @Column({
    name: "contact_email"
  })
  @IsEmail()
  contactEmail: string;

  @Column({
    name: "profile_pic_uri"
  })
  @IsUrl()
  profilePicURI: string;

  // TODO what is this?
  @Column({
    name: "bucket_url"
  })
  @IsUrl()
  bucketUrl: string;

  @Column({
    name: "session_id"
  })
  sessionId: string;
  @Column({
    name: "session_expiration"
  })
  sessionExpiration: Date;

  @OneToMany(type => Item, item => item.user)
  items: Item[];

  @CreateDateColumn({
    name: "created_at"
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: "updated_at"
  })
  updatedAt: Date;
}

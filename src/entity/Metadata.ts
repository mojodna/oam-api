import { IsNotEmpty, IsOptional, IsDate, IsIn } from "class-validator";
import { Column, BaseEntity, Index } from "typeorm";

export abstract class Metadata extends BaseEntity {
  // Image source
  @Column({
    nullable: true
  })
  uuid: string;

  @Column({
    nullable: true
  })
  @IsNotEmpty()
  title: string;

  @Column({
    nullable: true
  })
  license: string;

  @Column({
    name: "acquisition_start",
    nullable: true
  })
  @Index()
  @IsOptional()
  @IsDate()
  acquisitionStart: Date;

  @Column({
    name: "acquisition_end",
    nullable: true
  })
  @Index()
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
}
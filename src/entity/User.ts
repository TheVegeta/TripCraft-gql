import { nanoid } from "nanoid";
import { Field, ObjectType } from "type-graphql";
import {
  BaseEntity,
  BeforeInsert,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";

export enum AuthType {
  GOOGLE = "GOOGLE",
  ADMIN = "ADMIN",
}

@Entity()
@ObjectType({ simpleResolvers: true })
export class User extends BaseEntity {
  @Field()
  @PrimaryColumn()
  _id!: string;

  @Column()
  @Field()
  name!: string;

  @Column()
  @Field()
  email!: string;

  @Column()
  @Field()
  picture!: string;

  @Column({
    type: "enum",
    enum: AuthType,
  })
  authType!: AuthType;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt!: Date;

  @BeforeInsert()
  setId() {
    this._id = nanoid(8);
  }
}

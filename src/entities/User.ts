import { nanoid } from "nanoid";
import { Field, InputType } from "type-graphql";
import {
  BaseEntity,
  BeforeInsert,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";

@InputType()
export class ICreateUser {
  @Field({ nullable: true })
  _id?: string;

  @Field()
  name!: string;

  @Field()
  email!: string;

  @Field()
  picture!: string;
}

@Entity()
export class User extends BaseEntity {
  @Field()
  @PrimaryColumn()
  _id!: string;

  @Field()
  @Column()
  name!: string;

  @Field()
  @Column()
  email!: string;

  @Field()
  @Column()
  picture!: string;

  @ManyToOne(() => User)
  createdBy!: User;

  @ManyToOne(() => User, { nullable: true })
  updatedBy?: User;

  @Field()
  @CreateDateColumn()
  createdAt!: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt!: Date;

  @Field({ nullable: true })
  @DeleteDateColumn()
  deletedAt?: Date;

  @BeforeInsert()
  setId() {
    this._id = nanoid(8);
  }
}

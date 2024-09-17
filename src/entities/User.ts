import { nanoid } from "nanoid";
import { Field } from "type-graphql";
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

@Entity()
export class User extends BaseEntity {
  @Field()
  @PrimaryColumn()
  _id!: string;

  @Field()
  @Column()
  googleId!: string;

  @Field()
  @Column()
  name!: string;

  @Field()
  @Column()
  email!: string;

  @Field()
  @Column()
  picture!: string;

  @ManyToOne(() => User, { nullable: true })
  createdBy?: User;

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

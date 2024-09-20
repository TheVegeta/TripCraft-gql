import { Field, InputType, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Itinerary } from "./Itinerary";
import { User } from "./User";

@InputType()
export class ICreateTripmate {
  @Field({ nullable: true })
  _id!: string;

  @Field()
  itinerary!: string;
}

@Entity()
@ObjectType()
export class Tripmate extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn("uuid")
  _id!: string;

  @Field(() => Itinerary, { nullable: true })
  @ManyToOne(() => Itinerary, { nullable: true })
  itinerary!: Itinerary;

  @Column()
  code!: string;

  @Column({ default: false })
  isVerified!: boolean;

  @ManyToOne(() => User, { nullable: true })
  user?: User;

  @ManyToOne(() => User)
  createdBy!: User;

  @ManyToOne(() => User, { nullable: true })
  updatedBy?: User;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt!: Date;
}

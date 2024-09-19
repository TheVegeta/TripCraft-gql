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
export class ICreateActivity {
  @Field({ nullable: true })
  _id!: string;

  @Field()
  name!: string;

  @Field()
  placeName!: string;

  @Field()
  latitude!: string;

  @Field()
  longitude!: string;

  @Field()
  startDate!: string;

  @Field()
  endDate!: string;

  @Field()
  startTime!: string;

  @Field()
  endTime!: string;

  @Field()
  remark!: string;
}

@Entity()
@ObjectType()
export class Activity extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn("uuid")
  _id!: string;

  @Field()
  @Column()
  name!: string;

  @Field()
  @Column()
  placeName!: string;

  @Field()
  @Column({ default: "" })
  latitude!: string;

  @Field()
  @Column({ default: "" })
  longitude!: string;

  @Field()
  @Column()
  startDate!: Date;

  @Field()
  @Column()
  endDate!: Date;

  @Field()
  @Column()
  startTime!: Date;

  @Field()
  @Column()
  endTime!: Date;

  @Field()
  @Column()
  remark!: string;

  @ManyToOne(() => Itinerary)
  itinerary!: Itinerary;

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

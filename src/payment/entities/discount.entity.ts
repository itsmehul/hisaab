import {
  Field,
  Float,
  InputType,
  Int,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { IsEnum } from 'class-validator';
import { Client } from 'src/client/entities/client.entity';
import { CoreEntity } from 'src/common/entities/core.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  RelationId,
} from 'typeorm';
import { Payment } from './payment.entity';

export enum DiscountType {
  Percent = 'Percent',
  Fixed = 'Fixed',
}

registerEnumType(DiscountType, { name: 'DiscountType' });

@InputType('DiscountInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Discount extends CoreEntity {
  @Field()
  @Column()
  code: string;

  @Column({ type: 'enum', enum: DiscountType, default: DiscountType.Percent })
  @Field(() => DiscountType)
  @IsEnum(DiscountType)
  type: DiscountType;

  @Field(() => Float)
  @Column({
    type: 'decimal',
    precision: 5,
    scale: 2,
  })
  value: number;

  @Field(() => Float, { nullable: true })
  @Column({
    type: 'decimal',
    precision: 5,
    scale: 2,
    nullable: true,
  })
  lowerLimit?: number;

  @Field(() => String, { nullable: true })
  @Column({
    type: 'date',
    nullable: true,
  })
  startAt: Date;

  @Field(() => String, { nullable: true })
  @Column({
    type: 'date',
    nullable: true,
  })
  endAt: Date;

  @Field(() => Int, { nullable: true })
  @Column({ nullable: true, type: 'int' })
  usesLeft: number;

  @Field(() => [User], { nullable: true })
  @ManyToMany(() => User, (user) => user.discounts)
  @JoinTable()
  customers?: User[];

  @RelationId((discount: Discount) => discount.customers)
  customerIds?: string[];

  @Field(() => Client, { nullable: true })
  @ManyToOne(() => Client, (client) => client.discounts, {
    onDelete: 'SET NULL',
  })
  client?: Client;

  @Field(() => Payment, { nullable: true })
  @ManyToOne(() => Payment, (payment) => payment.discounts)
  payment?: Payment;
}

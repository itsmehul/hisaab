import { InternalServerErrorException } from '@nestjs/common';
import {
  Field,
  Float,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import * as bcrypt from 'bcrypt';
import { IsEmail, IsEnum, IsString } from 'class-validator';
import { GraphQLJSONObject } from 'graphql-type-json';
import { Client } from 'src/client/entities/client.entity';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Discount } from 'src/payment/entities/discount.entity';
import { Payment } from 'src/payment/entities/payment.entity';

import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  RelationId,
} from 'typeorm';

export enum UserRole {
  Staff = 'Staff',
  Admin = 'Admin',
}

registerEnumType(UserRole, { name: 'UserRole' });

@InputType('OTPInput', { isAbstract: true })
@ObjectType()
export class OTP {
  @Field(() => String)
  code: number;
  @Field(() => Date)
  expires: Date;
}

@InputType('CartItemInputType', { isAbstract: true })
@ObjectType()
export class CartItem {
  @Field(() => String)
  productId: string;
  @Field(() => String)
  variantId: string;
  @Field(() => Float)
  qty: number;
  @Field(() => GraphQLJSONObject)
  selectedVariants: any;
}

@InputType('WishlistItemInputType', { isAbstract: true })
@ObjectType()
export class WishlistItem {
  @Field(() => String)
  productId: string;
  @Field(() => String)
  variantId: string;
  @Field(() => GraphQLJSONObject)
  selectedVariants: any;
}

@InputType('UserInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class User extends CoreEntity {
  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  name: string;

  @Field(() => Number, { nullable: true })
  @Column({ unique: true, type: 'bigint', nullable: true })
  phone: number;

  @Field(() => Number, { nullable: true })
  @Column({ nullable: true })
  countrycode: number;

  @Field(() => String, { nullable: true })
  @Column({ unique: true, nullable: true })
  @IsEmail()
  email: string;

  @Field(() => String, { nullable: true })
  @Column({ select: false, nullable: true })
  @IsString()
  password: string;

  @Field(() => OTP, { nullable: true })
  @Column({ type: 'json', nullable: true, select: false })
  otp?: OTP;

  @Column({ type: 'enum', enum: UserRole })
  @Field(() => UserRole)
  @IsEnum(UserRole)
  role: UserRole;

  @Field(() => Client, { nullable: true })
  @ManyToOne(() => Client, (client) => client.staff)
  client: Client;

  @Field(() => String, { nullable: true })
  @RelationId((user: User) => user.client)
  clientId: string;

  // @Column({ default: false })
  // @Field(() => Boolean)
  // @IsBoolean()
  // verified: boolean;

  @Field(() => [Payment])
  @OneToMany(() => Payment, (payment) => payment.customer)
  payments: Payment[];

  @Field(() => [Discount], { nullable: true })
  @ManyToMany(() => Discount, (discount) => discount.customers)
  discounts?: Discount[];

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    if (this.password) {
      try {
        this.password = await bcrypt.hash(this.password, 10);
      } catch (e) {
        console.log(e);
        throw new InternalServerErrorException();
      }
    }
  }

  async checkPassword(aPassword: string): Promise<boolean> {
    try {
      const ok = await bcrypt.compare(aPassword, this.password);
      return ok;
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException();
    }
  }
}

import {
  Field,
  Float,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';
import { CoreEntity } from 'src/common/entities/core.entity';
// import { Discount } from 'src/discounts/entities/discount.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { Discount } from './discount.entity';
// import { Transfer } from './transfer.entity';

export enum ProviderType {
  PayPal = 'PayPal',
  Stripe = 'Stripe',
  RazorPay = 'RazorPay',
}

registerEnumType(ProviderType, { name: 'ProviderType' });

@InputType('CustomerDetailsInputType', { isAbstract: true })
@ObjectType()
export class CustomerDetails {
  @Field(() => String)
  external_customer_id: string;
  @Field(() => String, { nullable: true })
  name: string;
  @Field(() => String)
  email: string;
  @Field(() => String, { nullable: true })
  phone: string;
  @Field(() => String, { nullable: true })
  address: string;
  @Field(() => String, { nullable: true })
  city: string;
  @Field(() => String, { nullable: true })
  state: string;
  @Field(() => String, { nullable: true })
  country: string;
  @Field(() => String, { nullable: true })
  zip: string;
}

@InputType('PaymentInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Payment extends CoreEntity {
  @Field(() => ProviderType, { nullable: true })
  @Column({ type: 'enum', enum: ProviderType })
  provider: ProviderType;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  providerPaymentId: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  providerOrderId: string;

  @Field(() => Float)
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Field(() => String)
  @Column()
  currency: string;

  @Field(() => String)
  @Column()
  status: string;

  @Field(() => GraphQLJSON, { nullable: true })
  @Column({ type: 'json', nullable: true })
  paymentDetails: any;

  // @Field(() => [Transfer])
  // @OneToMany(() => Transfer, (transfer) => transfer.payment, {
  //   onUpdate: 'CASCADE',
  // })
  // transfers: Transfer[];

  @Field(() => CustomerDetails)
  @Column({ type: 'json', nullable: true })
  customer: CustomerDetails;

  @Field(() => [Discount], { nullable: true })
  @OneToMany(() => Discount, (discount) => discount.payment, {
    cascade: true,
  })
  discounts: Discount[];
}

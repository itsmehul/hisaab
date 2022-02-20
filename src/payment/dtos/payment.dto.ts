import {
  Field,
  Float,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Discount } from '../entities/discount.entity';
import {
  CustomerDetails,
  Payment,
  ProviderType,
} from '../entities/payment.entity';

export enum CurrencyType {
  INR = 'INR',
  USD = 'USD',
}

registerEnumType(CurrencyType, { name: 'CurrencyType' });

@InputType()
export class CreatePaymentInput {
  @Field(() => String)
  external_id: string;

  @Field(() => CurrencyType)
  currency: CurrencyType;

  @Field(() => Float)
  amount: number;

  @Field(() => Boolean, { defaultValue: true })
  capture: boolean;

  @Field(() => CustomerDetails)
  customerDetails: CustomerDetails;

  @Field(() => ProviderType)
  provider: ProviderType;

  @Field(() => [Discount], { nullable: true })
  discounts?: Discount[];
}

@ObjectType()
export class CreatePaymentOuput extends CoreOutput {
  @Field(() => Payment, { nullable: true })
  payment?: Payment;
}

@ObjectType()
export class GetPaymentsOutput extends CoreOutput {
  @Field(() => [Payment], { nullable: true })
  payments?: Payment[];
}

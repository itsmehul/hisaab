import { CreateStripeInput } from './create-stripe.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateStripeInput extends PartialType(CreateStripeInput) {
  @Field(() => Int)
  id: number;
}

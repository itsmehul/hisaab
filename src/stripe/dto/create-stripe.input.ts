import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateStripeInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}

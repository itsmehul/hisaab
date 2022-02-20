import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { StripeService } from './stripe.service';
import { Stripe } from './entities/stripe.entity';
import { CreateStripeInput } from './dto/create-stripe.input';
import { UpdateStripeInput } from './dto/update-stripe.input';

@Resolver(() => Stripe)
export class StripeResolver {
  constructor(private readonly stripeService: StripeService) {}

  @Mutation(() => Stripe)
  createStripe(@Args('createStripeInput') createStripeInput: CreateStripeInput) {
    return this.stripeService.create(createStripeInput);
  }

  @Query(() => [Stripe], { name: 'stripe' })
  findAll() {
    return this.stripeService.findAll();
  }

  @Query(() => Stripe, { name: 'stripe' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.stripeService.findOne(id);
  }

  @Mutation(() => Stripe)
  updateStripe(@Args('updateStripeInput') updateStripeInput: UpdateStripeInput) {
    return this.stripeService.update(updateStripeInput.id, updateStripeInput);
  }

  @Mutation(() => Stripe)
  removeStripe(@Args('id', { type: () => Int }) id: number) {
    return this.stripeService.remove(id);
  }
}

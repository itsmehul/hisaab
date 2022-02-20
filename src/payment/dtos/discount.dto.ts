import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Discount } from '../entities/discount.entity';

@InputType()
export class CreateDiscountInput extends Discount {}

@InputType()
export class DeleteDiscountInput {
  @Field()
  id: string;
}

@InputType()
export class FindDiscountByShopIdsInput {
  @Field(() => [String])
  shopIds: string[];
}

@InputType()
export class CanUseDiscountInput {
  @Field(() => String)
  id: string;
}

@ObjectType()
export class DiscountOutput extends CoreOutput {
  @Field(() => Discount, { nullable: true })
  discount?: Discount;
}

@ObjectType()
export class DiscountsOutput extends CoreOutput {
  @Field(() => [Discount], { nullable: true })
  discounts?: Discount[];
}

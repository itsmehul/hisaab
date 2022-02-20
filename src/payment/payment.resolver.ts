import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthClient } from 'src/auth/auth-client.decorator';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { Role } from 'src/auth/role.decorator';
import { Client } from 'src/client/entities/client.entity';
import { MediaService } from 'src/media/media.service';
import { User } from 'src/users/entities/user.entity';
import { handleErrorResponse } from 'src/utils/misc';
import {
  CreatePaymentInput,
  CreatePaymentOuput,
  GetPaymentsOutput,
} from './dtos/payment.dto';
import { Payment } from './entities/payment.entity';
import { PaymentService } from './payment.service';

@Resolver(() => Payment)
export class PaymentResolver {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly mediaService: MediaService,
  ) {}

  @Mutation(() => CreatePaymentOuput)
  @Role(['Client'])
  async createPayment(
    @AuthClient() client: Client,
    @Args('input') input: CreatePaymentInput,
  ): Promise<CreatePaymentOuput> {
    try {
      this.paymentService.createOrder(input, client);
      return { ok: true };
    } catch (error) {
      return handleErrorResponse(error, 'Cannot create order');
    }
  }

  // @Mutation(() => CoreOutput)
  // requestTransfer(
  //   @Args('input') input: RequestTransferInput,
  // ): Promise<CoreOutput> {
  //   return this.paymentService.requestTransfer(input.orderId);
  // }

  // @Query(() => GetPaymentsOutput)
  // getPayments(@AuthUser() user: User): Promise<GetPaymentsOutput> {
  //   return this.paymentService.getPayments(user);
  // }

  // @Query(() => GraphQLJSON)
  // getPaymentsd(): Promise<any> {
  //   return this.paymentService.getOrdersDetailsFromPaymentId(
  //     'order_IFZPJrJvdBvfIf',
  //   );
  // }
}

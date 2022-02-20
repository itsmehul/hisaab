import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Client } from 'src/client/entities/client.entity';
import { CREATE_ORDER_EVENTS } from 'src/common/common.constants';
import { DiscountService } from './discount.service';
import { CreatePaymentInput } from './dtos/payment.dto';
import { Discount } from './entities/discount.entity';
import { Payment } from './entities/payment.entity';
import { PaymentEvent, PaymentResultEvent } from './payment.interface';
import { PaymentRepository } from './repositories/payment.repository';

@Injectable()
export class PaymentService {
  constructor(
    private readonly payments: PaymentRepository,
    private readonly discountService: DiscountService,
    private eventEmitter: EventEmitter2,
  ) {}

  // async verifyPayment(order_id, id, status) {
  //   try {
  //     const payment = await this.payments.findOne(
  //       {
  //         providerOrderId: order_id,
  //       },
  //       {
  //         relations: [
  //           // 'transfers',
  //           // 'transfers.order',
  //           // 'transfers.order.details',
  //           // 'transfers.order.variant',
  //           // 'transfers.order.deliveries',
  //           'discounts',
  //         ],
  //       },
  //     );

  //     if (payment.status === 'captured') {
  //       return;
  //     }

  //     await this.updateStatus(order_id, id, status);

  //     // for (const transfer of payment.transfers) {
  //     //   const { recommendedCourierId, shipment_id } =
  //     //     transfer.order.deliveries[0];

  //     //   // Update delivery
  //     //   await this.deliveryService.generateAWBCode({
  //     //     courier_id: recommendedCourierId,
  //     //     shipment_id: shipment_id,
  //     //   });

  //     //   // Update stock
  //     //   await this.productService.decrementVariantStock(
  //     //     transfer.order.variant,
  //     //     transfer.order.details.qty,
  //     //   );
  //     // }
  //     // Update discount
  //     if (!!payment.discounts?.length) {
  //       await this.discountService.applyDiscountsOnUser(
  //         payment.customerId,
  //         payment.discounts,
  //       );
  //     }
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  createOrder(input: CreatePaymentInput, client: Client) {
    this.eventEmitter.emit(CREATE_ORDER_EVENTS[input.provider], {
      paymentInfo: input,
      credentials: client.credentials.find(
        (cred) => cred.provider === input.provider,
      ),
    } as PaymentEvent);
  }

  async savePaymentResult(result: PaymentResultEvent): Promise<any> {
    const payment: Payment = this.payments.createOrder(result);

    await this.payments.save(payment);
  }

  async updateStatus(
    providerOrderId: string,
    providerPaymentId: string,
    status: string,
  ) {
    try {
      await this.payments.update(
        {
          providerOrderId,
        },
        { status, providerPaymentId },
      );
    } catch (e) {
      throw 'Could not create payment.';
    }
  }

  // async getPayments(customer: User): Promise<GetPaymentsOutput> {
  //   try {
  //     const payments = await this.payments.find({ customer });
  //     return {
  //       ok: true,
  //       payments,
  //     };
  //   } catch {
  //     return {
  //       ok: false,
  //       error: 'Could not load payments.',
  //     };
  //   }
  // }

  // async requestTransfer(orderId: string): Promise<CoreOutput> {
  //   try {
  //     const transfer = await this.transfer.findOne({
  //       where: {
  //         order: {
  //           id: orderId,
  //         },
  //       },
  //       relations: ['payment'],
  //     });

  //     if (!transfer) throw 'Transfer not found.';

  //     const { data } = await this.axios.post(
  //       `${RAZORPAY_PAYMENTS_API}/${transfer.payment.razorpayPaymentId}/transfers`,
  //       {
  //         transfers: [
  //           {
  //             account: transfer.account,
  //             amount: Number(transfer.amount),
  //             currency: 'INR',
  //             // on_hold: false,
  //             // on_hold_until: 1671222870,
  //           },
  //         ],
  //       },
  //     );

  //     return {
  //       ok: true,
  //     };
  //   } catch {
  //     return {
  //       ok: false,
  //       error: 'Could not transfer payments.',
  //     };
  //   }
  // }
}

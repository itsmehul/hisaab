import { EntityRepository, Repository } from 'typeorm';
import { Payment } from '../entities/payment.entity';
import { PaymentResultEvent } from '../payment.interface';

@EntityRepository(Payment)
export class PaymentRepository extends Repository<Payment> {
  createOrder({ details, paymentInfo }: PaymentResultEvent): Payment {
    return this.create({
      amount: Number(paymentInfo.amount) / 100,
      currency: paymentInfo.currency,
      providerOrderId: details.id,
      status: details.status,
      paymentDetails: details,
      provider: paymentInfo.provider,
      // ...(amount && { originalPrice: amount }),
      ...(paymentInfo.discounts && { discounts: paymentInfo.discounts }),
    });
  }
}

// paypal - currency, paymentDeet, amount

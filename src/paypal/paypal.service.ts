import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { Credentials } from 'src/client/entities/client.entity';
import { CreatePaymentInput } from 'src/payment/dtos/payment.dto';
import { UniversalPaymentsApiService } from 'src/payment/payment.interface';
import { PAYPAL_ORDERS_API } from './paypal.constant';
import { PaypalPaymentObject } from './paypal.interface';

@Injectable()
export class PaypalService implements UniversalPaymentsApiService {
  async createOrder(
    paymentInfo: CreatePaymentInput,
    credentials: Credentials,
  ): Promise<any> {
    const paymentFormat: PaypalPaymentObject = {
      intent: paymentInfo.capture ? 'CAPTURE' : 'AUTHORIZE',
      purchase_units: [
        {
          amount: {
            value: paymentInfo.amount,
            currency_code: paymentInfo.currency,
          },
        },
      ],
    };

    return axios.post(PAYPAL_ORDERS_API, paymentFormat, {
      auth: {
        username: credentials.clientId,
        password: credentials.clientSecret,
      },
    });
  }
}

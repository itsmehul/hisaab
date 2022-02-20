import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { Credentials } from 'src/client/entities/client.entity';
import { CreatePaymentInput } from 'src/payment/dtos/payment.dto';
import { UniversalPaymentsApiService } from 'src/payment/payment.interface';
import { RAZORPAY_ORDERS_API } from './razorpay.constants';
import { RazorpayPaymentObject } from './razorpay.interface';

@Injectable()
export class RazorpayService implements UniversalPaymentsApiService {
  async createOrder(
    paymentObject: CreatePaymentInput,
    credentials: Credentials,
  ): Promise<any> {
    const paymentFormat: RazorpayPaymentObject = {
      amount: Number(paymentObject.amount) * 100,
      currency: paymentObject.currency,
      payment_capture: paymentObject.capture ? 1 : 0,
    };

    return axios.post(RAZORPAY_ORDERS_API, paymentFormat, {
      auth: {
        username: credentials.clientId,
        password: credentials.clientSecret,
      },
    });
  }
}

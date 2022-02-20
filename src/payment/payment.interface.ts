import { Credentials } from 'src/client/entities/client.entity';
import { CreatePaymentInput } from './dtos/payment.dto';

export interface PaymentAPIKeys {
  username: string;
  password: string;
  webHookSecret: string;
}

export interface UniversalPaymentsApiService {
  createOrder(paymentObj: any, credentials: Credentials): any;
}

export interface UniversalPaymentsApiListener {
  createOrder(paymentObj: any, credentials: Credentials): any;
}

export class PaymentEvent {
  paymentInfo: CreatePaymentInput;
  credentials: Credentials;
}

export class PaymentResultEvent {
  paymentInfo: CreatePaymentInput;
  details: any;
}

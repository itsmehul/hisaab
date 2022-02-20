import { CurrencyType } from 'src/payment/dtos/payment.dto';

export interface RazorpayPaymentObject {
  amount: number;
  currency: CurrencyType;
  payment_capture: number;
}

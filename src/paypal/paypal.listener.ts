import { Injectable } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { Credentials } from 'src/client/entities/client.entity';
import { CREATE_ORDER_EVENTS } from 'src/common/common.constants';
import { MailService } from 'src/mail/mail.service';
import {
  PaymentEvent,
  PaymentResultEvent,
  UniversalPaymentsApiListener,
} from 'src/payment/payment.interface';
import { PaypalService } from './paypal.service';

@Injectable()
export class PaypalListener implements UniversalPaymentsApiListener {
  constructor(
    private readonly paypalService: PaypalService,
    private eventEmitter: EventEmitter2,
    private readonly mailService: MailService,
  ) {}

  @OnEvent(CREATE_ORDER_EVENTS.PayPal)
  async createOrder({ paymentInfo, credentials }: PaymentEvent) {
    const { data } = await this.paypalService.createOrder(
      paymentInfo,
      credentials,
    );

    this.eventEmitter.emit(CREATE_ORDER_EVENTS.Result, {
      paymentInfo,
      details: data,
    } as PaymentResultEvent);
  }
}

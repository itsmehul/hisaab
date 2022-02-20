import { Injectable } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { CREATE_ORDER_EVENTS } from 'src/common/common.constants';
import { MailService } from 'src/mail/mail.service';
import {
  PaymentEvent,
  PaymentResultEvent,
  UniversalPaymentsApiListener,
} from 'src/payment/payment.interface';
import { RazorpayService } from './razorpay.service';

@Injectable()
export class RazorpayListener implements UniversalPaymentsApiListener {
  constructor(
    private readonly razorpayService: RazorpayService,
    private eventEmitter: EventEmitter2,
    private readonly mailService: MailService,
  ) {}

  @OnEvent(CREATE_ORDER_EVENTS.RazorPay)
  async createOrder({ paymentInfo, credentials }: PaymentEvent) {
    const { data } = await this.razorpayService.createOrder(
      paymentInfo,
      credentials,
    );

    this.eventEmitter.emit(CREATE_ORDER_EVENTS.Result, {
      paymentInfo,
      details: data,
    } as PaymentResultEvent);
  }
}

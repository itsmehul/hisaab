import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { CREATE_ORDER_EVENTS } from 'src/common/common.constants';
import { MailService } from 'src/mail/mail.service';
import { PaymentResultEvent } from './payment.interface';
import { PaymentService } from './payment.service';

@Injectable()
export class PaymentListener {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly mailService: MailService,
  ) {}

  @OnEvent(CREATE_ORDER_EVENTS.Result)
  savePaymentResult(result: PaymentResultEvent) {
    this.paymentService.savePaymentResult(result);
  }
}

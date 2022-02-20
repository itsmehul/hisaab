import { Body, Controller, Headers, Inject, Post } from '@nestjs/common';
import * as crypto from 'crypto';
import { WEBHOOK_SECRET } from 'src/common/common.constants';
import { PaymentService } from './payment.service';

@Controller('api/payment')
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService, // @Inject(WEBHOOK_SECRET) private readonly secret: string,
  ) {}

  @Post('/verification')
  async findAll(@Body() body: any, @Headers() headers): Promise<any> {
    // try {
    //   const shasum = crypto.createHmac('sha256', this.secret);
    //   shasum.update(JSON.stringify(body));
    //   const digest = shasum.digest('hex');
    //   if (digest === headers['x-razorpay-signature']) {
    //     const { id, status, order_id } = body.payload.payment.entity;
    //     await this.paymentService.verifyPayment(order_id, id, status);
    //   } else {
    //     throw 'Wrong signature';
    //   }
    // } catch (err) {
    //   console.log(err);
    // } finally {
    //   return { status: 'ok' };
    // }
  }

  @Post('/transfer')
  async transfer(@Body() body: any, @Headers() headers): Promise<any> {
    // try {
    //   const shasum = crypto.createHmac('sha256', this.secret);
    //   shasum.update(JSON.stringify(body));
    //   const digest = shasum.digest('hex');
    //   if (digest === headers['x-razorpay-signature']) {
    //     console.log(body.payload);
    //     // const { id, status, order_id } = body.payload.payment.entity;
    //     // await this.paymentService.verifyPayment(order_id, id, status);
    //   } else {
    //     throw 'Wrong signature';
    //   }
    // } catch (err) {
    //   console.log(err);
    // } finally {
    //   return { status: 'ok' };
    // }
  }
}

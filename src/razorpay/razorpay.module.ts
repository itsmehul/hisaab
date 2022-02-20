import { Module } from '@nestjs/common';
import { RazorpayListener } from './razorpay.listener';
import { RazorpayService } from './razorpay.service';

@Module({
  providers: [RazorpayService, RazorpayListener],
  exports: [RazorpayService],
})
export class RazorpaysModule {}

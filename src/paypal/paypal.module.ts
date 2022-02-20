import { Module } from '@nestjs/common';
import { PaypalListener } from './paypal.listener';
import { PaypalService } from './paypal.service';

@Module({
  providers: [PaypalService, PaypalListener],
  exports: [PaypalService],
})
export class PaypalModule {}

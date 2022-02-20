import { DynamicModule, Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RazorpaysModule } from 'src/razorpay/razorpay.module';
import { DiscountService } from './discount.service';
import { Discount } from './entities/discount.entity';
import { PaymentController } from './payment.controller';
import { PaymentListener } from './payment.listener';
import { PaymentResolver } from './payment.resolver';
import { PaymentService } from './payment.service';
import { PaymentRepository } from './repositories/payment.repository';

@Module({})
@Global()
export class PaymentsModule {
  static forRoot(): DynamicModule {
    return {
      imports: [
        TypeOrmModule.forFeature([Discount, PaymentRepository]),
        RazorpaysModule,
      ],
      module: PaymentsModule,
      providers: [
        PaymentService,
        PaymentResolver,
        DiscountService,
        PaymentListener,
      ],
      controllers: [PaymentController],
      exports: [PaymentService],
    };
  }
}

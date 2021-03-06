import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as Joi from 'joi';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { JwtMiddleware } from './jwt/jwt.middleware';
import { JwtModule } from './jwt/jwt.module';
import { MailModule } from './mail/mail.module';
import { MediaModule } from './media/media.module';
import { SmsModule } from './sms/sms.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { PaymentsModule } from './payment/payment.module';
import { StripeModule } from './stripe/stripe.module';
import { PaypalModule } from './paypal/paypal.module';
import { ClientModule } from './client/client.module';
import { UsersModule } from 'src/users/users.module';
import { User } from 'src/users/entities/user.entity';
import { Verification } from 'src/users/entities/verification.entity';
import { Payment } from './payment/entities/payment.entity';
import { Client } from './client/entities/client.entity';
import { Discount } from './payment/entities/discount.entity';
import { RazorpaysModule } from './razorpay/razorpay.module';

@Module({
  // We add the module and call forRoot to pass configuration setting to root module of GQL
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'dev' ? '.env.dev' : '.env.test',
      ignoreEnvFile: process.env.NODE_ENV === 'prod',
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('dev', 'prod', 'test').required(),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.string().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_NAME: Joi.string().required(),
        PRIVATE_KEY: Joi.string().required(),
        AWS_ACCESS_KEY: Joi.string().required(),
        AWS_SECRET_KEY: Joi.string().required(),
      }),
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      synchronize: process.env.NODE_ENV !== 'prod',
      logging:
        process.env.NODE_ENV !== 'prod' && process.env.NODE_ENV !== 'test',
      entities: [User, Verification, Client, Payment, Discount],
    }),
    GraphQLModule.forRoot({
      installSubscriptionHandlers: true,
      autoSchemaFile: true,
      cors: {
        origin: '*',
        credentials: true,
      },
      context: ({ req, connection }) => {
        const TOKEN_KEY = 'authorization';
        const CLIENT_KEY = 'clientkey';
        const token = (
          req ? req.headers[TOKEN_KEY] : connection.context[TOKEN_KEY]
        )?.split(' ')?.[1];

        const clientkey = req
          ? req.headers[CLIENT_KEY]
          : connection.context[CLIENT_KEY];
        return {
          token,
          clientkey,
        };
      },
    }),
    JwtModule.forRoot({
      privateKey: process.env.PRIVATE_KEY,
    }),
    MailModule,
    UsersModule,
    AuthModule,
    CommonModule.forRoot({
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_KEY,
    }),
    MediaModule,
    ScheduleModule.forRoot(),
    EventEmitterModule.forRoot(),
    SmsModule,
    PaymentsModule.forRoot(),
    StripeModule,
    PaypalModule,
    ClientModule,
    RazorpaysModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtMiddleware)
      .forRoutes({ path: '/api', method: RequestMethod.GET });
  }
}

import { InternalServerErrorException } from '@nestjs/common';
import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Discount } from 'src/payment/entities/discount.entity';
import { ProviderType } from 'src/payment/entities/payment.entity';
import { BeforeInsert, Column, Entity, OneToMany } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@InputType('CredentialsInputType', { isAbstract: true })
@ObjectType()
export class Credentials {
  @Field(() => String)
  clientId: string;
  @Field(() => String)
  clientSecret: string;
  @Field(() => ProviderType)
  provider: ProviderType;
}

@InputType('ClientInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Client extends CoreEntity {
  @Field(() => String)
  @Column()
  name: string;

  @Field(() => String)
  @Column()
  apiKey: string;

  @Field(() => Date)
  @Column({ type: 'date' })
  expiry: Date;

  @Field(() => [Discount], { nullable: true })
  @OneToMany(() => Discount, (discount) => discount.client, { nullable: true })
  discounts: Discount[];

  @Field(() => [Credentials], { nullable: true })
  @Column({ type: 'json', nullable: true })
  credentials: Credentials[];

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  webhookUrl: string;

  @Field(() => [User], { nullable: true })
  @OneToMany(() => User, (user) => user.client)
  staff: User[];

  @BeforeInsert()
  async createApiKey(): Promise<void> {
    try {
      this.apiKey = Math.random().toString(36).substring(2, 22);
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException();
    }
  }
}

import { Injectable } from '@nestjs/common';
import { CreateStripeInput } from './dto/create-stripe.input';
import { UpdateStripeInput } from './dto/update-stripe.input';

@Injectable()
export class StripeService {
  create(createStripeInput: CreateStripeInput) {
    return 'This action adds a new stripe';
  }

  findAll() {
    return `This action returns all stripe`;
  }

  findOne(id: number) {
    return `This action returns a #${id} stripe`;
  }

  update(id: number, updateStripeInput: UpdateStripeInput) {
    return `This action updates a #${id} stripe`;
  }

  remove(id: number) {
    return `This action removes a #${id} stripe`;
  }
}

import { Test, TestingModule } from '@nestjs/testing';
import { StripeResolver } from './stripe.resolver';
import { StripeService } from './stripe.service';

describe('StripeResolver', () => {
  let resolver: StripeResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StripeResolver, StripeService],
    }).compile();

    resolver = module.get<StripeResolver>(StripeResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { handleErrorResponse, toFixedNumberFormat } from 'src/utils/misc';
import { In, Repository } from 'typeorm';
import {
  CreateDiscountInput,
  DeleteDiscountInput,
  DiscountsOutput,
} from './dtos/discount.dto';
import { Discount, DiscountType } from './entities/discount.entity';

@Injectable()
export class DiscountService {
  constructor(
    @InjectRepository(Discount)
    private readonly discount: Repository<Discount>,
  ) {}

  async findAllDiscounts() {
    try {
    } catch (error) {
      console.log('Unable to get access key');
    }
  }

  async findAllDiscountsFromIds(ids: string[]): Promise<Discount[]> {
    try {
      return this.discount.find({
        where: {
          id: In(ids),
        },
      });
    } catch (error) {
      console.log('Unable to get access key');
    }
  }

  async canUseDiscount(id: string, userId: string): Promise<CoreOutput> {
    try {
      const discount = await this.discount.findOne(id);
      if (!discount) {
        throw 'Discount not found';
      }
      if (discount.customerIds.includes(userId)) {
        throw 'Already used';
      }
      return {
        ok: true,
      };
    } catch (error) {
      throw error;
    }
  }

  async applyDiscountsOnUser(userId: string, discounts: Discount[]) {
    try {
      for (const discount of discounts) {
        discount.customerIds.push(userId);
        discount.usesLeft -= 1;
        await this.discount.save(discount);
      }
      return {
        ok: true,
      };
    } catch (error) {
      console.log(error);
      throw 'Unable to apply discount';
    }
  }

  async applyDiscountOnUserByClient(
    ids: string[],
    userId: string,
    price: number,
    // orders: Order[],
    // aggregatePriceByclientId: any,
  ): Promise<{
    discounts: Discount[];
    total: number;
    thaCut: number;
    // discountedOrdersToProcess: any;
  }> {
    try {
      const discounts = await this.discount.findByIds(ids, {
        relations: ['client'],
      });

      const vendorCut = price * 0.8;
      const thaCutBase = price * 0.2;
      let thaCut = thaCutBase;
      // const discountedOrdersToProcess = orders;

      const thaDiscount = discounts.find((discount) => !discount.client);
      if (thaDiscount) {
        if (thaDiscount.type === DiscountType.Percent) {
          thaCut -= price * thaDiscount.value;
        } else {
          thaCut -= thaDiscount.value;
        }
      }

      const uniqueDiscount = [];

      for (const discount of discounts) {
        if (discount.customerIds.includes(userId)) {
          continue;
        }

        // FIXME: Date
        if (discount.startAt && discount.startAt > new Date()) {
          continue;
          // throw 'Discount not available yet';
        }
        if (discount.endAt && discount.endAt < new Date()) {
          continue;
          // throw 'Discount expired';
        }
        if (discount.usesLeft === 0) {
          continue;
        }

        // if (discount.client) {
        //   if (uniqueDiscount.includes(discount.client.id)) {
        //     continue;
        //   } else {
        //     uniqueDiscount.push(discount.client.id);
        //   }
        //   const paymentOfclient = discountedOrdersToProcess.filter(
        //     (order: Order) => order.client.id === discount.client.id,
        //   );
        //   const total = paymentOfclient.reduce(
        //     (a, b) => a + b.transfer.amount,
        //     0,
        //   );
        //   for (const order of discountedOrdersToProcess) {
        //     if (order.client.id === discount.client.id) {
        //       // order.transfer.payment.discounts.push(discount);

        //       let amountToCut = 0;
        //       if (discount.type === DiscountType.Percent) {
        //         amountToCut = order.transfer.beforeDiscount * discount.value;
        //         order.transfer.amount = toFixedNumberFormat(
        //           order.transfer.amount - amountToCut,
        //         );
        //       } else {
        //         amountToCut = discount.value / paymentOfclient.length;
        //         const discountedAmount = total - amountToCut;
        //         order.transfer.amount = toFixedNumberFormat(discountedAmount);
        //       }
        //       vendorCut -= amountToCut;
        //     }
        //   }
        // }
      }

      // for (const order of discountedOrdersToProcess) {
      //   order.transfer.refundableAmount = toFixedNumberFormat(
      //     thaCut * (order.transfer.beforeDiscount / price) +
      //       order.transfer.amount,
      //   );
      // }

      const total = toFixedNumberFormat(vendorCut + thaCut);

      return {
        discounts,
        total,
        thaCut,
        // discountedOrdersToProcess,
      };
    } catch (error) {
      throw error;
    }
  }

  async findDiscountsByCode(
    code: string,
    clientId: string,
  ): Promise<CoreOutput> {
    try {
      const discount = await this.discount.findOne({
        where: {
          code,
          client: {
            id: clientId,
          },
        },
      });
      if (!discount) {
        throw 'Discount not found';
      }
      return {
        ok: true,
      };
    } catch (error) {
      return handleErrorResponse(error);
    }
  }

  async findDiscountsByclientIds(
    clientIds: string[],
    userId: string,
  ): Promise<DiscountsOutput> {
    try {
      const discounts = await this.discount.find({
        where: [
          {
            client: {
              id: In(clientIds),
            },
          },
          {
            client: null,
          },
        ],
        relations: ['client'],
      });

      const discountsNotUsedByUser = discounts.filter(
        (discount) => !discount.customerIds.includes(userId),
      );

      if (!discounts) {
        throw 'Discount not found';
      }
      return {
        ok: true,
        discounts: discountsNotUsedByUser,
      };
    } catch (error) {
      return handleErrorResponse(error);
    }
  }

  async createDiscount(
    input: CreateDiscountInput,
    client,
  ): Promise<CoreOutput> {
    try {
      await this.discount.save(this.discount.create({ ...input, client }));
      return {
        ok: true,
      };
    } catch (error) {
      console.log(error);
      throw 'Unable to create discount';
    }
  }

  async deleteDiscount(
    input: DeleteDiscountInput,
    clientId: string,
  ): Promise<CoreOutput> {
    try {
      await this.discount.delete({
        id: input.id,
        // client: {
        //   id: clientId,
        // },
      });
      return {
        ok: true,
      };
    } catch (error) {
      console.log(error);
      throw 'Unable to delete discount';
    }
  }
}

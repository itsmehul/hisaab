import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { handleErrorResponse } from 'src/utils/misc';
import { ClientService } from './client.service';
import {
  ClientOutput,
  CreateClientInput,
  UpdateCredentialsInput,
} from './dtos/client.dto';

@Resolver()
export class ClientResolver {
  constructor(private readonly clientService: ClientService) {}

  @Mutation(() => ClientOutput)
  async createClient(
    @Args('input') input: CreateClientInput,
  ): Promise<ClientOutput> {
    const client = await this.clientService.createClient(input);
    return { ok: true, client };
  }

  @Mutation(() => ClientOutput)
  async updateCredentials(
    @Args('input') input: UpdateCredentialsInput,
  ): Promise<ClientOutput> {
    try {
      const client = await this.clientService.updateCredentials(
        input.clientId,
        input.credentials,
      );
      return { ok: true, client };
    } catch (error) {
      return handleErrorResponse(error, 'Cannot update credentials');
    }
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateClientInput } from './dtos/client.dto';
import { Client, Credentials } from './entities/client.entity';

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(Client)
    private readonly client: Repository<Client>,
  ) {}

  createClient(input: CreateClientInput): Promise<Client> {
    const client = this.client.create(input);

    return this.client.save(client);
  }

  async updateCredentials(
    clientId: string,
    credentials: Credentials,
  ): Promise<Client> {
    const client = await this.client.findOne(clientId);
    if (
      client.credentials.find((cred) => cred.provider === credentials.provider)
    ) {
      client[
        client.credentials.findIndex(
          (cred) => cred.provider === credentials.provider,
        )
      ] = credentials;
    } else {
      client.credentials.push(credentials);
    }
    return this.client.save(client);
  }

  // TODO: Generate a new key via authorized account
  async generateNewKey(clientId: string): Promise<any> {
    return 'key';
  }

  getClientFromKey(key: string): Promise<Client> {
    return this.client.findOne({ apiKey: key });
  }
}

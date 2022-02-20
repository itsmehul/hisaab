import { Field, InputType, ObjectType, OmitType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Client, Credentials } from '../entities/client.entity';

@InputType()
export class CreateClientInput extends OmitType(Client, ['apiKey']) {}

@InputType()
export class UpdateCredentialsInput {
  @Field(() => String)
  clientId: string;

  @Field(() => Credentials)
  credentials: Credentials;
}

@ObjectType()
export class ClientOutput extends CoreOutput {
  @Field(() => Client, { nullable: true })
  client?: Client;
}

@ObjectType()
export class ClientsOutput extends CoreOutput {
  @Field(() => [Client], { nullable: true })
  clients?: Client[];
}

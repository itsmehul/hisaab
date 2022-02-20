import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const AuthClient = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    let client;
    if (context.getType() === 'http') {
      const request = context.switchToHttp().getRequest();
      client = request.client;
    } else {
      const gqlContext = GqlExecutionContext.create(context).getContext();
      client = gqlContext['client'];
    }
    return client;
  },
);

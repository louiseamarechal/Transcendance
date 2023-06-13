import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUserId = createParamDecorator(
  (_: string | undefined, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return request.user['sub'];
  },
);

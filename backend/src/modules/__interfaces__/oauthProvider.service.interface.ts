import { Logger } from '@nestjs/common';
import { OAuthUserInfo } from '../auth/dtos/oauth-user.dto';

export interface OAuthProviderService {
  exchangeCodeForUser(code: string): Promise<OAuthUserInfo>;
}

export abstract class AbstractOAuthService {
  protected readonly logger = new Logger(this.constructor.name);
  abstract exchangeCodeForUser(code: string): Promise<OAuthUserInfo>;
}

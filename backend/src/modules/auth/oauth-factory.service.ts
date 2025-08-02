import { Injectable, NotFoundException } from '@nestjs/common';
import { OAuthProviderService } from '../__interfaces__/oauthProvider.service.interface';
import { GoogleOAuthService } from './services/google-oauth.service';
import { GithubOAuthService } from './services/github-oauth.service';

@Injectable()
export class OAuthFactoryService {
  private readonly oauthServices: Record<string, OAuthProviderService> = {
    github: new GithubOAuthService(),
    google: new GoogleOAuthService(),
  };

  getOAuthService(provider: string): OAuthProviderService {
    const service = this.oauthServices[provider.toLowerCase()];
    if (!service) {
      throw new NotFoundException(`OAuth service for ${provider} not found`);
    }
    return service;
  }
}

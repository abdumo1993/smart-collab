import {
  AbstractOAuthService,
  OAuthProviderService,
} from '@/modules/__interfaces__/oauthProvider.service.interface';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { OAuthUserInfo } from '../dtos/oauth-user.dto';

import axios, { AxiosResponse } from 'axios';

// Define interfaces for GitHub OAuth responses
interface GithubTokenResponse {
  access_token: string;
  token_type: string;
  scope: string;
}

interface GithubUserInfo {
  id: number;
  login: string;
  name?: string;
  email?: string;
}

interface GithubEmail {
  email: string;
  primary: boolean;
  verified: boolean;
  visibility: string | null;
}

@Injectable()
export class GithubOAuthService
  extends AbstractOAuthService
  implements OAuthProviderService
{
  private readonly clientId: string = process.env.GITHUB_CLIENT_ID!;
  private readonly clientSecret: string = process.env.GITHUB_CLIENT_SECRET!;
  private readonly callbackUrl: string = process.env.GITHUB_CALLBACK_URL!;

  async exchangeCodeForUser(code: string): Promise<OAuthUserInfo> {
    try {
      const tokenRes: AxiosResponse<GithubTokenResponse> = await axios.post(
        'https://github.com/login/oauth/access_token',
        new URLSearchParams({
          client_id: this.clientId,
          client_secret: this.clientSecret,
          code,
          redirect_uri: this.callbackUrl,
        }).toString(),
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );

      const accessToken: string = tokenRes.data.access_token;

      const userRes: AxiosResponse<GithubUserInfo> = await axios.get(
        'https://api.github.com/user',
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );

      const emailRes: AxiosResponse<GithubEmail[]> = await axios.get(
        'https://api.github.com/user/emails',
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );

      const user: GithubUserInfo = userRes.data;
      const email: string | undefined =
        emailRes.data.find((e: GithubEmail) => e.primary && e.verified)
          ?.email ?? user.email;

      if (!email) {
        this.logger.error('No verified primary email found for GitHub user');
        throw new UnauthorizedException(
          'GitHub OAuth failed: No verified primary email available',
        );
      }

      return {
        email,
        firstName: user.name?.split(' ')[0] || user.login,
        lastName: user.name?.split(' ')[1] || '',
        providerId: user.id.toString(),
      };
    } catch (error) {
      // Type-safe error handling
      if (axios.isAxiosError(error)) {
        this.logger.error(
          'Failed to exchange code for access token',
          error.response?.data || error.message,
        );
        throw new UnauthorizedException(
          `GitHub OAuth failed: ${error.message}`,
        );
      }
      this.logger.error('Failed to exchange code for access token', error);
      throw new UnauthorizedException('GitHub OAuth failed: Unknown error');
    }
  }
}
// @Injectable()
// export class GithubOAuthService
//   extends AbstractOAuthService
//   implements OAuthProviderService
// {
//   private readonly clientId = process.env.GITHUB_CLIENT_ID!;
//   private readonly clientSecret = process.env.GITHUB_CLIENT_SECRET!;
//   private readonly callbackUrl = process.env.GITHUB_CALLBACK_URL!;

//   async exchangeCodeForUser(code: string): Promise<OAuthUserInfo> {
//     try {
//       const res = await axios.post(
//         'https://github.com/login/oauth/access_token',
//         {
//           client_id: this.clientId,
//           client_secret: this.clientSecret,
//           code,
//           redirect_uri: this.callbackUrl,
//         },
//         {
//           headers: { Accept: 'application/json' },
//         },
//       );
//       const accessToken = res.data.acccess_token;
//       const userRes = await axios.get('https://api.github.com/user', {
//         headers: { Authorization: `Bearer ${accessToken}` },
//       });
//       const emailRes = await axios.get('https://api.github.com/emails', {
//         headers: { Authorization: `Bearer ${accessToken}` },
//       });

//       const user = userRes.data;
//       const email = emailRes.data.find((e) => e.primary && e.verified)?.email;

//       return {
//         email,
//         firstName: user.name?.split(' ')[0] || user.login,
//         lastName: user.name?.split(' ')[1] || '',
//         providerId: user.id.toString(),
//       };
//     } catch (error) {
//       this.logger.error(
//         'failed to exchange code for accesstoken',
//         error.message,
//       );
//       throw new UnauthorizedException('Github OAuth failed');
//     }
//   }
// }

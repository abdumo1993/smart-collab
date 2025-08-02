import {
  AbstractOAuthService,
  OAuthProviderService,
} from '@/modules/__interfaces__/oauthProvider.service.interface';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { OAuthUserInfo } from '../dtos/oauth-user.dto';

import axios, { AxiosResponse } from 'axios';

// Define interfaces for Google OAuth responses
interface GoogleTokenResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
  refresh_token?: string;
}

interface GoogleUserInfo {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  locale: string;
}

@Injectable()
export class GoogleOAuthService implements OAuthProviderService {
  private readonly clientId: string = process.env.GOOGLE_CLIENT_ID!;
  private readonly clientSecret: string = process.env.GOOGLE_CLIENT_SECRET!;
  private readonly callbackUrl: string = process.env.GOOGLE_CALLBACK_URL!;

  async exchangeCodeForUser(code: string): Promise<OAuthUserInfo> {
    try {
      const tokenRes: AxiosResponse<GoogleTokenResponse> = await axios.post(
        'https://oauth2.googleapis.com/token',
        new URLSearchParams({
          client_id: this.clientId,
          client_secret: this.clientSecret,
          code,
          grant_type: 'authorization_code',
          redirect_uri: this.callbackUrl,
        }).toString(),
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        },
      );

      const accessToken: string = tokenRes.data.access_token;

      const userRes: AxiosResponse<GoogleUserInfo> = await axios.get(
        'https://www.googleapis.com/oauth2/v2/userinfo',
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );

      const profile: GoogleUserInfo = userRes.data;

      return {
        email: profile.email || '',
        firstName: profile.given_name || '',
        lastName: profile.family_name || '',
        providerId: profile.id || '',
      };
    } catch (error) {
      // Type-safe error handling
      if (axios.isAxiosError(error)) {
        throw new UnauthorizedException(
          `Google OAuth failed: ${error.message}`,
        );
      }
      throw new UnauthorizedException(
        'Google OAuth failed: Unknown error',
        error.message,
      );
    }
  }
}

// @Injectable()
// export class GoogleOAuthService
//   extends AbstractOAuthService
//   implements OAuthProviderService
// {
//   private readonly clientId = process.env.GOOGLE_CLIENT_ID!;
//   private readonly clientSecret = process.env.GOOGLE_CLIENT_SECRET!;
//   private readonly callbackUrl = process.env.GOOGLE_CALLBACK_URL!;

//   async exchangeCodeForUser(code: string): Promise<OAuthUserInfo> {
//     try {
//       const res = await axios.post(
//         'https://oauth2.googleapis.com/token',
//         {
//           client_id: this.clientId,
//           client_secret: this.clientSecret,
//           code,
//           grant_type: 'authorization_code',
//           redirect_uri: this.callbackUrl,
//         },
//         {
//           headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
//         },
//       );
//       const accessToken = res.data.acccess_token;
//       const userRes = await axios.get(
//         'https://www.googleapis.com/oauth2/v2/userinfo',
//         {
//           headers: { Authorization: `Bearer ${accessToken}` },
//         },
//       );
//       const profile = userRes.data;

//       return {
//         email: profile.email,
//         firstName: profile.given_name,
//         lastName: profile.family_name,
//         providerId: profile.id,
//       };
//     } catch (error) {
//       this.logger.error(
//         'failed to exchange code for accesstoken',
//         error.message,
//       );
//       throw new UnauthorizedException('Google OAuth failed');
//     }
//   }
// }

import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { OAuthCallbackDto, OAuthAccountDto } from '../../../modules/auth/dtos';

export const GitHubAuthDocs = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Initiate GitHub OAuth',
      description: 'Redirects user to GitHub for OAuth authentication',
    }),
    ApiResponse({
      status: 302,
      description: 'Redirects to GitHub OAuth page',
    }),
  );

export const GitHubCallbackDocs = () =>
  applyDecorators(
    ApiOperation({
      summary: 'GitHub OAuth Callback',
      description: 'Handles GitHub OAuth callback and returns JWT tokens',
    }),
    ApiResponse({
      status: 200,
      description: 'OAuth authentication successful',
      type: OAuthCallbackDto,
    }),
    ApiResponse({
      status: 401,
      description: 'OAuth authentication failed',
    }),
  );

export const GoogleAuthDocs = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Initiate Google OAuth',
      description: 'Redirects user to Google for OAuth authentication',
    }),
    ApiResponse({
      status: 302,
      description: 'Redirects to Google OAuth page',
    }),
  );

export const GoogleCallbackDocs = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Google OAuth Callback',
      description: 'Handles Google OAuth callback and returns JWT tokens',
    }),
    ApiResponse({
      status: 200,
      description: 'OAuth authentication successful',
      type: OAuthCallbackDto,
    }),
    ApiResponse({
      status: 401,
      description: 'OAuth authentication failed',
    }),
  );

export const GetOAuthAccountsDocs = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Get OAuth Accounts',
      description:
        'Retrieve all OAuth accounts linked to the authenticated user',
    }),
    ApiResponse({
      status: 200,
      description: 'OAuth accounts retrieved successfully',
      type: [OAuthAccountDto],
    }),
  );

export const UnlinkOAuthAccountDocs = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Unlink OAuth Account',
      description: 'Unlink an OAuth account from the authenticated user',
    }),
    ApiResponse({
      status: 200,
      description: 'OAuth account unlinked successfully',
    }),
  );

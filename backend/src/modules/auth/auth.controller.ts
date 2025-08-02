import { ApiTags } from '@nestjs/swagger';
import {
  LoginDocs,
  RefreshDocs,
  DebugGetAllUsersDocs,
  DebugAdminLoginDocs,
  DebugStudentLoginDocs,
  DebugTeacherLoginDocs,
} from '../../common/decorators/swagger/auth.swagger.docs';
import {
  GitHubAuthDocs,
  GitHubCallbackDocs,
  GetOAuthAccountsDocs,
  UnlinkOAuthAccountDocs,
} from '../../common/decorators/swagger/oauth.swagger.docs';
import { LoginDto, RegisterDto, TokensDto, OAuthAccountDto } from './dtos';
import { User } from '@prisma/client';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Get,
  UnauthorizedException,
  HttpCode,
  HttpStatus,
  ForbiddenException,
  Logger,
  Param,
  NotFoundException,
  Res,
  Redirect,
  Query,
} from '@nestjs/common';
import { ApiResponse } from '../../common/response/api-response.dto';
import { RefreshJwtAuthGuard } from '../../common/guards/refresh-jwt-auth.guard';
import { LogoutDocs } from '../../common/decorators/swagger/auth.swagger.docs';
import { GetUser, Public } from '../../common/decorators/auth';
import { Request } from 'express';
import { UserResponseDto } from '../user/dtos';
import { Role } from '@prisma/client';
import {
  EmailConfirmationDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  CreateUserDto,
} from '../user/dtos';
import { OAuthFactoryService } from './oauth-factory.service';
import { OAuthUserInfo } from './dtos/oauth-user.dto';

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  protected readonly redirectUrls = new Map<string, string>();
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UserService,
    private readonly oauthFactory: OAuthFactoryService,
  ) {
    this.populateRedirectUrls();
  }

  private populateRedirectUrls() {
    this.redirectUrls.set(
      'github',
      `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&redirect_uri=${process.env.GITHUB_CALLBACK_URL}&scope=user:email&state=`,
    );
    this.redirectUrls.set(
      'google',
      `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${process.env.GOOGLE_CALLBACK_URL}&response_type=code&scope=openid%20email%20profile&state=`,
    );
  }

  // Public registration
  @Post('register')
  @Public()
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Body() createUserDto: CreateUserDto,
  ): Promise<ApiResponse<UserResponseDto>> {
    // Only allow non-admin registration here
    if (createUserDto.role === Role.ADMIN) {
      throw new ForbiddenException('Cannot self-register as admin');
    }
    const user = await this.usersService.createUser(createUserDto);
    return ApiResponse.success(
      201,
      user,
      'Registration successful. Please check your email to confirm your account.',
    );
  }

  // Email confirmation
  @Post('confirm-email')
  @Public()
  async confirmEmail(
    @Body() dto: EmailConfirmationDto,
  ): Promise<ApiResponse<void>> {
    await this.usersService.confirmEmail(dto.token);
    return ApiResponse.success(200, undefined, 'Email confirmed successfully');
  }

  // Forgot password
  @Post('forgot-password')
  @Public()
  async forgotPassword(
    @Body() dto: ForgotPasswordDto,
  ): Promise<ApiResponse<void>> {
    await this.usersService.forgotPassword(dto.email);
    return ApiResponse.success(
      200,
      undefined,
      'If your email exists, a reset link has been sent',
    );
  }

  // Reset password
  @Post('reset-password')
  @Public()
  async resetPassword(
    @Body() dto: ResetPasswordDto,
  ): Promise<ApiResponse<void>> {
    await this.usersService.resetPassword(dto.token, dto.newPassword);
    return ApiResponse.success(200, undefined, 'Password reset successfully');
  }

  @Post('login')
  @Public()
  @LoginDocs()
  async login(@Body() loginDto: LoginDto): Promise<ApiResponse<TokensDto>> {
    const tokens = await this.authService.login(loginDto);
    return ApiResponse.success(200, tokens, 'Login successful');
  }

  @Post('refresh')
  @RefreshDocs()
  @UseGuards(RefreshJwtAuthGuard)
  async refresh(@Req() req: Request): Promise<ApiResponse<TokensDto>> {
    const refreshToken = req
      .get('authorization')
      ?.replace('Bearer ', '')
      .trim();
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is required');
    }
    const tokens = await this.authService.refreshTokens(refreshToken);
    return ApiResponse.success(200, tokens, 'Tokens refreshed successfully');
  }

  @Get('logout')
  @LogoutDocs()
  async logout(@GetUser() user: User): Promise<ApiResponse<void>> {
    await this.authService.logout(user.id);
    return ApiResponse.success(200, undefined, 'Logout successful');
  }

  // ! Debug Routes. Remove before production.
  @Get('debug_get_all_users')
  @DebugGetAllUsersDocs()
  async debugGetAllUsers(): Promise<ApiResponse<UserResponseDto[]>> {
    const users = await this.usersService.findAllUsers(1, 100);
    return ApiResponse.success(200, users.data, 'All users retrieved');
  }

  @Post('debug_admin_login')
  @Public()
  @DebugAdminLoginDocs()
  async getAdminToken(): Promise<ApiResponse<TokensDto>> {
    const loginDto = {
      email: 'admin1@email.email',
      password: 'adminpassword1',
    };
    const tokens = await this.authService.login(loginDto);
    return ApiResponse.success(200, tokens, 'Admin login successful');
  }

  @Post('debug_student_login')
  @Public()
  @DebugStudentLoginDocs()
  async getStudentToken(): Promise<ApiResponse<TokensDto>> {
    const loginDto = {
      email: 'student1@email.email',
      password: 'studentpassword1',
    };
    const tokens = await this.authService.login(loginDto);
    return ApiResponse.success(200, tokens, 'Student login successful');
  }

  @Post('debug_teacher_login')
  @Public()
  @DebugTeacherLoginDocs()
  async getTeacherToken(): Promise<ApiResponse<TokensDto>> {
    const loginDto = {
      email: 'teacher1@email.email',
      password: 'teacher1password',
    };
    const tokens = await this.authService.login(loginDto);
    return ApiResponse.success(200, tokens, 'Teacher login successful');
  }

  // Get OAuth accounts for the authenticated user
  @Get('oauth/accounts')
  @GetOAuthAccountsDocs()
  async getOAuthAccounts(
    @GetUser() user: User,
  ): Promise<ApiResponse<OAuthAccountDto[]>> {
    const accounts = await this.usersService.getOAuthAccounts(user.id);
    return ApiResponse.success(
      200,
      accounts,
      'OAuth accounts retrieved successfully',
    );
  }

  // Unlink OAuth account
  @Post('oauth/accounts/:provider/unlink')
  @UnlinkOAuthAccountDocs()
  async unlinkOAuthAccount(
    @GetUser() user: User,
    @Param('provider') provider: string,
  ): Promise<ApiResponse<void>> {
    await this.usersService.unlinkOAuthAccount(user.id, provider);
    return ApiResponse.success(
      200,
      undefined,
      'OAuth account unlinked successfully',
    );
  }

  // OAuth2

  @Get('login/:provider')
  @Public()
  @Redirect()
  async oauthLogin(@Param('provider') provider: string) {
    let redirectUrl = this.redirectUrls.get(provider);
    if (!redirectUrl) {
      throw new NotFoundException(`OAuth provider ${provider} not found`);
    }
    let state = Buffer.from(JSON.stringify({ provider })).toString('base64url');
    redirectUrl += state;
    return {
      url: redirectUrl,
      statusCode: 302,
    };
  }

  @Get('callback/oauth')
  @Public()
  @Redirect()
  async handleOauthCallback(
    @Query('code') code: string,
    @Query('state') stateParam: string,
  ) {
    if (!code || !stateParam) {
      throw new UnauthorizedException('Missing code or state');
    }

    let provider: string;

    try {
      const decoded = JSON.parse(
        Buffer.from(stateParam, 'base64url').toString(),
      );
      provider = decoded.provider;
    } catch (err) {
      throw new UnauthorizedException('Invalid state parameter');
    }

    const service = this.oauthFactory.getOAuthService(provider);

    try {
      const oauthProfile: OAuthUserInfo =
        await service.exchangeCodeForUser(code);

      // Find or create user by OAuth profile
      const user = await this.usersService.findOrCreateUserByOAuth(
        oauthProfile,
        provider,
      );

      // Generate JWT tokens for the user
      const tokens = await this.authService.generateTokensForUser({
        userId: user.userId,
        email: user.email,
        role: user.role,
      });

      // Redirect to frontend with tokens in query params
      const redirectUrl = new URL(
        process.env.FRONTEND_URL || 'http://localhost:3000',
      );
      redirectUrl.searchParams.set('access_token', tokens.accessToken);
      redirectUrl.searchParams.set('refresh_token', tokens.refreshToken);
      redirectUrl.searchParams.set('user_id', user.userId);

      return {
        url: redirectUrl.toString(),
        statusCode: 302,
      };
    } catch (error) {
      this.logger.error(`OAuth callback failed: ${error.message}`);
      throw new UnauthorizedException(error.message || 'OAuth callback failed');
    }
  }
}

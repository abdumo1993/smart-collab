import { ApiTags } from '@nestjs/swagger';
import {
  LoginDocs,
  RegisterDocs,
  RefreshDocs,
  DebugGetAllUsersDocs,
  DebugAdminLoginDocs,
  DebugStudentLoginDocs,
  DebugTeacherLoginDocs,
} from '../../common/decorators/swagger/auth.swagger.docs';
import {
  GitHubAuthDocs,
  GitHubCallbackDocs,
  GoogleAuthDocs,
  GoogleCallbackDocs,
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
import { AuthGuard } from '@nestjs/passport';
import { AuthenticatedUserPayload } from '@/common/request/express.request';

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UserService,
  ) {}

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
}

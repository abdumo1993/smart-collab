import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { TokensService } from './tokens.service';
import { LoginDto, RegisterDto, TokensDto } from './dtos';
import { IAuthService } from '../__interfaces__/auth.service.interface';
import { Role } from '@prisma/client';
import { AuthenticatedUserPayload } from '@/common/request/express.request';

@Injectable()
export class AuthService implements IAuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UserService,
    private readonly tokensService: TokensService,
  ) {}

  async login(loginDto: LoginDto): Promise<TokensDto> {
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if email is confirmed
    if (!user.isEmailConfirmed) {
      throw new UnauthorizedException(
        'Please confirm your email before logging in',
      );
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.tokensService.generateTokens(
      user.id,
      user.email,
      user.role,
    );

    await this.tokensService.saveRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  async register(registerDto: RegisterDto): Promise<void> {
    // This method is now handled by the controller directly
    // Registration creates a user with isEmailConfirmed: false
    // User must confirm email before they can login
    throw new Error('Registration is handled by the controller');
  }

  async refreshTokens(refreshToken: string): Promise<TokensDto> {
    try {
      const payload = await this.tokensService.verifyRefreshToken(refreshToken);
      const user = await this.usersService.findUserById(payload.sub);

      return this.tokensService.generateTokens(
        user.userId,
        user.email,
        user.role,
      );
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async validateUser(
    email: string,
    password: string,
  ): Promise<AuthenticatedUserPayload> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if email is confirmed
    if (!user.isEmailConfirmed) {
      throw new UnauthorizedException(
        'Please confirm your email before logging in',
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return {
      sub: user.id,
      email: user.email,
      role: user.role,
    };
  }

  async logout(userId: string): Promise<void> {
    await this.tokensService.deleteRefreshToken(userId);
  }

  async generateTokensForUser(user: {
    userId: string;
    email: string;
    role: Role;
  }): Promise<TokensDto> {
    // Generate tokens for the user
    const tokens = await this.tokensService.generateTokens(
      user.userId,
      user.email,
      user.role,
    );

    await this.tokensService.saveRefreshToken(user.userId, tokens.refreshToken);
    return tokens;
  }
}

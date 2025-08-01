import { type AuthenticatedUserPayload } from '@/common/request/express.request';
import { type LoginDto } from '../auth/dtos';
import { type TokensDto } from '../auth/dtos/tokens.dto';
import { RegisterDto } from '../auth/dtos';
import { Role } from '@prisma/client';

export abstract class IAuthService {
  abstract login(loginDto: LoginDto): Promise<TokensDto>;

  abstract register(registerDto: RegisterDto): Promise<void>;
  abstract refreshTokens(refreshToken: string): Promise<TokensDto>;
  abstract logout(userId: string): Promise<void>;
  abstract validateUser(
    email: string,
    password: string,
  ): Promise<AuthenticatedUserPayload>;
  abstract generateTokensForUser(user: {
    userId: string;
    email: string;
    role: Role;
  }): Promise<TokensDto>;
}

import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TokensService } from './tokens.service';
import { UserModule } from '../user/user.module';
import { SharedModule } from '../shared/shared.module';
import { PrismaModule } from '../../prisma/prisma.module';
import { OAuthFactoryService } from './oauth-factory.service';
import { GithubOAuthService } from './services/github-oauth.service';
import { GoogleOAuthService } from './services/google-oauth.service';

@Module({
  imports: [
    UserModule,
    SharedModule,
    PassportModule,
    PrismaModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_ACCESS_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
    ConfigModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    TokensService,
    OAuthFactoryService,
    GithubOAuthService,
    GoogleOAuthService,
  ],
  exports: [AuthService, TokensService],
})
export class AuthModule {}

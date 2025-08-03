// import { Injectable, Logger } from '@nestjs/common';
// import { PassportStrategy } from '@nestjs/passport';
// import { Strategy } from 'passport-google-oauth20';
// import { ConfigService } from '@nestjs/config';
// import { AuthService } from '../auth.service';

// @Injectable()
// export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
//   private readonly logger = new Logger(GoogleStrategy.name);

//   constructor(
//     private configService: ConfigService,
//     private authService: AuthService,
//   ) {
//     super({
//       clientID: configService.get<string>('GOOGLE_CLIENT_ID'),
//       clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET'),
//       callbackURL: configService.get<string>('GOOGLE_CALLBACK_URL'),
//       scope: ['email', 'profile'],
//     });
//   }

//   async validate(
//     accessToken: string,
//     refreshToken: string,
//     profile: any,
//     done: any,
//   ) {
//     try {
//       this.logger.log(`Google OAuth validation for profile: ${profile.id}`);

//       const { id, emails, name } = profile;
//       const email = emails?.[0]?.value;

//       if (!email) {
//         this.logger.error('No email found in Google profile');
//         return done(new Error('Email is required for Google OAuth'), null);
//       }

//       const firstName = name?.givenName || '';
//       const lastName = name?.familyName || '';

//       const user = await this.authService.validateOAuthUser({
//         provider: 'google',
//         providerId: id,
//         email,
//         firstName,
//         lastName,
//         accessToken,
//       });

//       this.logger.log(
//         `Google OAuth validation successful for user: ${user.sub}`,
//       );
//       done(null, user);
//     } catch (error) {
//       this.logger.error(`Google OAuth validation failed: ${error.message}`);
//       done(error, null);
//     }
//   }
// }

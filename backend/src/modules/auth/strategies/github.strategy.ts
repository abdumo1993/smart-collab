// import { Injectable, Logger } from '@nestjs/common';
// import { PassportStrategy } from '@nestjs/passport';
// import { Strategy } from 'passport-github2';
// import { ConfigService } from '@nestjs/config';
// import { AuthService } from '../auth.service';

// @Injectable()
// export class GitHubStrategy extends PassportStrategy(Strategy, 'github') {
//   private readonly logger = new Logger(GitHubStrategy.name);

//   constructor(
//     private configService: ConfigService,
//     private authService: AuthService,
//   ) {
//     super({
//       clientID: configService.get<string>('GITHUB_CLIENT_ID'),
//       clientSecret: configService.get<string>('GITHUB_CLIENT_SECRET'),
//       callbackURL: configService.get<string>('GITHUB_CALLBACK_URL'),
//       scope: ['user:email'],
//     });
//   }

//   async validate(
//     accessToken: string,
//     refreshToken: string,
//     profile: any,
//     done: any,
//   ) {
//     try {
//       this.logger.log(`GitHub OAuth validation for profile: ${profile.id}`);

//       const { id, emails, displayName, username } = profile;
//       const email = emails?.[0]?.value;

//       if (!email) {
//         this.logger.error('No email found in GitHub profile');
//         return done(new Error('Email is required for GitHub OAuth'), null);
//       }

//       // Parse display name or use username as fallback
//       let firstName = '';
//       let lastName = '';

//       if (displayName) {
//         const nameParts = displayName.split(' ');
//         firstName = nameParts[0] || '';
//         lastName = nameParts.slice(1).join(' ') || '';
//       } else {
//         firstName = username || '';
//       }

//       const user = await this.authService.validateOAuthUser({
//         provider: 'github',
//         providerId: id.toString(),
//         email,
//         firstName,
//         lastName,
//         accessToken,
//       });

//       this.logger.log(
//         `GitHub OAuth validation successful for user: ${user.sub}`,
//       );
//       done(null, user);
//     } catch (error) {
//       this.logger.error(`GitHub OAuth validation failed: ${error.message}`);
//       done(error, null);
//     }
//    }
// }

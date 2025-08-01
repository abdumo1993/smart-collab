import { ApiProperty } from '@nestjs/swagger';

export class OAuthCallbackDto {
  @ApiProperty({
    description: 'JWT access token for API authentication',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  accessToken!: string;

  @ApiProperty({
    description: 'JWT refresh token for token renewal',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  refreshToken!: string;

  @ApiProperty({
    description: 'OAuth provider name',
    example: 'github',
    enum: ['github', 'google'],
  })
  provider!: string;

  @ApiProperty({
    description: 'User information from OAuth provider',
    example: {
      id: '123456',
      email: 'user@example.com',
      firstName: 'John',
      lastName: 'Doe',
    },
  })
  user!: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
}

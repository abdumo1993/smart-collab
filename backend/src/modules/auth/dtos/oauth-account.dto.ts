import { ApiProperty } from '@nestjs/swagger';

export class OAuthAccountDto {
  @ApiProperty({
    description: 'OAuth account ID',
    example: '12345678-1234-1234-1234-123456789012',
  })
  id!: string;

  @ApiProperty({
    description: 'OAuth provider name',
    example: 'github',
    enum: ['github', 'google'],
  })
  provider!: string;

  @ApiProperty({
    description: 'Provider account ID',
    example: '123456',
  })
  providerAccountId!: string;

  @ApiProperty({
    description: 'When the OAuth account was created',
    example: '2024-01-01T00:00:00.000Z',
  })
  createdAt!: Date;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class OAuthLoginDto {
  @ApiProperty({ example: 'google' })
  @IsString()
  provider!: string;

  @ApiProperty()
  @IsString()
  accessToken!: string;
}

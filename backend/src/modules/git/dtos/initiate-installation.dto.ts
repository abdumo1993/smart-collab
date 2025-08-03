import { IsString, IsUrl, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class InitiateInstallationDto {
  @ApiProperty({
    description: 'GitHub repository URL',
    example: 'https://github.com/username/repo-name',
  })
  @IsString()
  @Matches(/^https:\/\/github\.com\/[^\/]+\/[^\/]+$/, {
    message: 'URL must be a valid GitHub repository URL',
  })
  repositoryUrl: string;

  @ApiProperty({
    description: 'Frontend redirect URL after GitHub App installation',
    example: 'http://localhost:3000/dashboard',
  })
  @IsString()
  // @IsUrl()
  redirectUrl: string;

  @ApiProperty({
    description: 'Optional state parameter for additional data',
    required: false,
    example: '{"source": "dashboard"}',
  })
  @IsString()
  state?: string;
}

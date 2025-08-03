import { IsString, IsUrl, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ValidateRepositoryDto {
  @ApiProperty({
    description: 'GitHub repository URL to validate',
    example: 'https://github.com/username/repo-name',
  })
  @IsString()
  // @IsUrl()
  @Matches(/^https:\/\/github\.com\/[^\/]+\/[^\/]+$/, {
    message: 'URL must be a valid GitHub repository URL',
  })
  repositoryUrl: string;
}

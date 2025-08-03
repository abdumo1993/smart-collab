import { IsString, IsUrl, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddRepositoryDto {
  @ApiProperty({
    description: 'GitHub repository URL',
    example: 'https://github.com/username/repo-name',
  })
  @IsString()
  // @IsUrl()
  @Matches(/^https:\/\/github\.com\/[^\/]+\/[^\/]+$/, {
    message: 'URL must be a valid GitHub repository URL',
  })
  repositoryUrl: string;
}

import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class InstallationCallbackDto {
  @ApiProperty({
    description: 'GitHub App installation ID',
    example: '12345678',
  })
  @IsString()
  @IsNotEmpty()
  installationId: string;

  @ApiProperty({
    description: 'Repository full name',
    example: 'username/repo-name',
  })
  @IsString()
  @IsNotEmpty()
  repositoryFullName: string;
}

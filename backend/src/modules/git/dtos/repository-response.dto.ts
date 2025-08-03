import { ApiProperty } from '@nestjs/swagger';

export class RepositoryResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  fullName: string;

  @ApiProperty()
  private: boolean;

  @ApiProperty({ required: false })
  installationId?: string;

  @ApiProperty({ required: false })
  webhookId?: string;

  @ApiProperty({ required: false })
  webhookUrl?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

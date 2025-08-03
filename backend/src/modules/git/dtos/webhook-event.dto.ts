import { ApiProperty } from '@nestjs/swagger';

export class WebhookEventDto {
  @ApiProperty()
  event: string;

  @ApiProperty()
  repository: {
    id: number;
    name: string;
    full_name: string;
    private: boolean;
    owner: {
      login: string;
      id: number;
    };
  };

  @ApiProperty({ required: false })
  sender?: {
    login: string;
    id: number;
  };

  @ApiProperty({ required: false })
  ref?: string;

  @ApiProperty({ required: false })
  before?: string;

  @ApiProperty({ required: false })
  after?: string;

  @ApiProperty({ required: false })
  pull_request?: {
    id: number;
    number: number;
    title: string;
    state: string;
    user: {
      login: string;
      id: number;
    };
  };
}

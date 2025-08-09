import {
  Controller,
  Post,
  Param,
  Body,
  Headers,
  HttpStatus,
  HttpException,
  Logger,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { GitHubAppService } from '../services/github-app.service';
import { RepositoryService } from '../services/repository.service';
import { WebhookHandlerService } from '../services/webhook-handler.service';
import { ApiResponse as ApiResponseDto } from '../../../common/response/api-response.dto';
import { ConfigService } from '@nestjs/config';

@ApiTags('GitHub Webhooks')
@Controller('api/git/webhooks')
export class WebhookController {
  private readonly logger = new Logger(WebhookController.name);

  constructor(
    private readonly githubAppService: GitHubAppService,
    private readonly repositoryService: RepositoryService,
    private readonly webhookHandlerService: WebhookHandlerService,
    private readonly configService: ConfigService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Generic webhook endpoint for GitHub events' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Webhook processed successfully',
  })
  async handleGenericWebhook(
    @Body() payload: any,
    @Headers() headers: any,
  ): Promise<ApiResponseDto<void>> {
    try {
      this.logger.log('Received webhook event');

      // Verify webhook signature
      const signature = headers['x-hub-signature-256'];
      if (!signature) {
        this.logger.warn('Missing webhook signature');
        throw new HttpException(
          'Missing webhook signature',
          HttpStatus.UNAUTHORIZED,
        );
      }

      const rawBody = JSON.stringify(payload);

      // Extract repository information from payload
      const repositoryFullName = payload.repository?.full_name;
      if (!repositoryFullName) {
        throw new HttpException(
          'Repository information not found in payload',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Find repository in database
      const repository =
        await this.repositoryService.findRepositoryByFullName(
          repositoryFullName,
        );

      if (!repository) {
        this.logger.warn(
          `Repository ${repositoryFullName} not found in database`,
        );
        // Still process the webhook but log the warning
      } else {
        this.logger.log(
          `Found repository ${repositoryFullName} for user ${repository.userId}`,
        );
      }

      // Verify webhook signature using global secret
      // const webhookSecret = repository?.webhookSecret || undefined;
      this.logger.debug(
        `Webhook verification for ${repositoryFullName}: using global secret`,
      );
      this.logger.debug(`Repository found: ${!!repository}`);
      this.logger.debug(`Repository ID: ${repository?.id}`);

      // TODO: Remove this bypass in production
      let isDevelopment = this.configService.get('NODE_ENV') === 'development';
      isDevelopment = false;
      let isValidSignature = true;

      if (!isDevelopment) {
        isValidSignature = this.githubAppService.verifyWebhookSignature(
          rawBody,
          signature,
          // webhookSecret, // GitHub Apps use global webhook secret
        );
      } else {
        this.logger.warn(
          'Skipping webhook signature verification in development',
        );
      }

      if (!isValidSignature) {
        this.logger.error('Invalid webhook signature');
        throw new HttpException(
          'Invalid webhook signature',
          HttpStatus.UNAUTHORIZED,
        );
      }

      // Get event type
      const eventType = this.webhookHandlerService.getEventType(headers);
      this.logger.log(`Processing ${eventType} event`);

      // Validate payload
      if (!this.webhookHandlerService.validatePayload(payload)) {
        throw new HttpException(
          'Invalid webhook payload',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Process webhook event
      await this.webhookHandlerService.handleWebhookEvent(eventType, payload);

      this.logger.log(
        `Webhook processed successfully for ${repositoryFullName} (${eventType})`,
      );

      return ApiResponseDto.success(
        200,
        undefined,
        'Webhook processed successfully',
      );
    } catch (error) {
      this.logger.error(
        `Webhook processing error: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  @Post('github')
  @ApiOperation({ summary: 'Legacy webhook endpoint (deprecated)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Webhook processed successfully',
  })
  async handleLegacyWebhook(
    @Body() payload: any,
    @Headers() headers: any,
  ): Promise<ApiResponseDto<void>> {
    // Redirect to the main webhook handler
    return this.handleGenericWebhook(payload, headers);
  }
}

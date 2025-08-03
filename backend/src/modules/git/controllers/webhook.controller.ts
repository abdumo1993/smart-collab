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

@ApiTags('GitHub Webhooks')
@Controller('api/git/webhooks')
export class WebhookController {
  private readonly logger = new Logger(WebhookController.name);

  constructor(
    private readonly githubAppService: GitHubAppService,
    private readonly repositoryService: RepositoryService,
    private readonly webhookHandlerService: WebhookHandlerService,
  ) {}

  @Post(':userId/:repoFullName')
  @ApiOperation({ summary: 'Repository-specific webhook endpoint' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiParam({
    name: 'repoFullName',
    description: 'Repository full name (URL encoded)',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Webhook processed successfully',
  })
  async handleRepositoryWebhook(
    @Param('userId') userId: string,
    @Param('repoFullName') repoFullName: string,
    @Body() payload: any,
    @Headers() headers: any,
  ): Promise<ApiResponseDto<void>> {
    try {
      // Decode repository full name
      const decodedRepoFullName = decodeURIComponent(repoFullName);

      // Verify webhook signature
      const signature = headers['x-hub-signature-256'];
      if (!signature) {
        throw new HttpException(
          'Missing webhook signature',
          HttpStatus.UNAUTHORIZED,
        );
      }

      const rawBody = JSON.stringify(payload);
      const isValidSignature = this.githubAppService.verifyWebhookSignature(
        rawBody,
        signature,
      );

      if (!isValidSignature) {
        this.logger.error(
          `Invalid webhook signature for repository ${decodedRepoFullName}`,
        );
        throw new HttpException(
          'Invalid webhook signature',
          HttpStatus.UNAUTHORIZED,
        );
      }

      // Get repository from database
      const repository = await this.repositoryService.getRepositoryByFullName(
        userId,
        decodedRepoFullName,
      );
      if (!repository) {
        this.logger.error(
          `Repository ${decodedRepoFullName} not found for user ${userId}`,
        );
        throw new HttpException('Repository not found', HttpStatus.NOT_FOUND);
      }

      // Get event type
      const eventType = this.webhookHandlerService.getEventType(headers);

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
        `Webhook processed successfully for ${decodedRepoFullName}`,
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
  @ApiOperation({ summary: 'Legacy webhook endpoint' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Webhook processed successfully',
  })
  async handleLegacyWebhook(
    @Body() payload: any,
    @Headers() headers: any,
  ): Promise<ApiResponseDto<void>> {
    try {
      // Verify webhook signature
      const signature = headers['x-hub-signature-256'];
      if (!signature) {
        throw new HttpException(
          'Missing webhook signature',
          HttpStatus.UNAUTHORIZED,
        );
      }

      const rawBody = JSON.stringify(payload);
      const isValidSignature = this.githubAppService.verifyWebhookSignature(
        rawBody,
        signature,
      );

      if (!isValidSignature) {
        this.logger.error('Invalid webhook signature for legacy endpoint');
        throw new HttpException(
          'Invalid webhook signature',
          HttpStatus.UNAUTHORIZED,
        );
      }

      // Get event type
      const eventType = this.webhookHandlerService.getEventType(headers);

      // Validate payload
      if (!this.webhookHandlerService.validatePayload(payload)) {
        throw new HttpException(
          'Invalid webhook payload',
          HttpStatus.BAD_REQUEST,
        );
      }

      // For legacy endpoint, we need to find the repository by full name
      const repositoryFullName = payload.repository?.full_name;
      if (!repositoryFullName) {
        throw new HttpException(
          'Repository information not found in payload',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Find repository in database (this is less secure but maintains backward compatibility)
      // In production, you might want to disable this endpoint
      const repository =
        await this.repositoryService.findRepositoryByFullName(
          repositoryFullName,
        );
      if (!repository) {
        this.logger.warn(
          `Repository ${repositoryFullName} not found in database`,
        );
        // Still process the webhook but log the warning
      }

      // Process webhook event
      await this.webhookHandlerService.handleWebhookEvent(eventType, payload);

      this.logger.log(
        `Legacy webhook processed successfully for ${repositoryFullName}`,
      );

      return ApiResponseDto.success(
        200,
        undefined,
        'Webhook processed successfully',
      );
    } catch (error) {
      this.logger.error(
        `Legacy webhook processing error: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}

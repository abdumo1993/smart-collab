import {
  Injectable,
  Logger,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { GitHubAppService } from './github-app.service';
import { RepositoryResponseDto } from '../dtos/repository-response.dto';
import { ConfigService } from '@nestjs/config';
// import { randomBytes } from 'crypto'; // No longer needed - GitHub Apps use global webhook secret

@Injectable()
export class RepositoryService {
  private readonly logger = new Logger(RepositoryService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly githubAppService: GitHubAppService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Validate repository URL format and check if user can access it
   */
  async validateRepository(
    userId: string,
    repositoryUrl: string,
  ): Promise<RepositoryResponseDto> {
    // Validate repository URL format
    const repository =
      await this.githubAppService.validateRepository(repositoryUrl);

    // Check if repository is already connected by this user
    const existingRepo = await this.prisma.repository.findUnique({
      where: {
        userId_fullName: {
          userId,
          fullName: repository.full_name,
        },
      },
    });

    if (existingRepo) {
      throw new ConflictException('Repository is already connected');
    }

    return {
      id: '',
      name: repository.name,
      fullName: repository.full_name,
      private: repository.private,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  /**
   * Complete repository connection after GitHub App installation
   */
  async completeRepositoryConnection(
    userId: string,
    installationId: string,
    repositoryFullName: string,
  ): Promise<RepositoryResponseDto> {
    // Get repositories accessible to this installation
    const repositories =
      await this.githubAppService.getInstallationRepositories(installationId);

    const targetRepo = repositories.find(
      (repo) => repo.full_name === repositoryFullName,
    );
    if (!targetRepo) {
      throw new NotFoundException('Repository not found in installation');
    }

    // Generate webhook secret
    // const webhookSecret = randomBytes(32).toString('hex');
    const webhookUrl = `${this.configService.get('GITHUB_APP_WEBHOOK_URL')}`;

    // Create webhook
    const webhook = await this.githubAppService.createWebhook(
      installationId,
      repositoryFullName,
      webhookUrl,
      // webhookSecret, // GitHub Apps use global webhook secret
    );

    // Save repository to database
    const repository = await this.prisma.repository.create({
      data: {
        userId,
        name: targetRepo.name,
        fullName: targetRepo.full_name,
        private: targetRepo.private,
        installationId,
        webhookId: webhook.id.toString(),
        webhookUrl,
        // webhookSecret, // Not needed - GitHub Apps use global secret
      },
    });

    this.logger.log(
      `Repository ${repositoryFullName} connected for user ${userId}`,
    );

    return {
      id: repository.id,
      name: repository.name,
      fullName: repository.fullName,
      private: repository.private,
      installationId: repository.installationId || undefined,
      webhookId: repository.webhookId || undefined,
      webhookUrl: repository.webhookUrl || undefined,
      createdAt: repository.createdAt,
      updatedAt: repository.updatedAt,
    };
  }

  /**
   * Get all repositories for a user
   */
  async getUserRepositories(userId: string): Promise<RepositoryResponseDto[]> {
    const repositories = await this.prisma.repository.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return repositories.map((repo) => ({
      id: repo.id,
      name: repo.name,
      fullName: repo.fullName,
      private: repo.private,
      installationId: repo.installationId || undefined,
      webhookId: repo.webhookId || undefined,
      webhookUrl: repo.webhookUrl || undefined,
      createdAt: repo.createdAt,
      updatedAt: repo.updatedAt,
    }));
  }

  /**
   * Get specific repository
   */
  async getRepository(
    userId: string,
    repositoryId: string,
  ): Promise<RepositoryResponseDto> {
    const repository = await this.prisma.repository.findFirst({
      where: {
        id: repositoryId,
        userId,
      },
    });

    if (!repository) {
      throw new NotFoundException('Repository not found');
    }

    return {
      id: repository.id,
      name: repository.name,
      fullName: repository.fullName,
      private: repository.private,
      installationId: repository.installationId || undefined,
      webhookId: repository.webhookId || undefined,
      webhookUrl: repository.webhookUrl || undefined,
      createdAt: repository.createdAt,
      updatedAt: repository.updatedAt,
    };
  }

  /**
   * Remove repository connection
   */
  async removeRepository(userId: string, repositoryId: string): Promise<void> {
    const repository = await this.prisma.repository.findFirst({
      where: {
        id: repositoryId,
        userId,
      },
    });

    if (!repository) {
      throw new NotFoundException('Repository not found');
    }

    // Delete webhook from GitHub if it exists
    if (
      repository.installationId &&
      repository.webhookId &&
      repository.fullName
    ) {
      try {
        await this.githubAppService.deleteWebhook(
          repository.installationId,
          repository.fullName,
          repository.webhookId,
        );
      } catch (error) {
        this.logger.warn(
          `Failed to delete webhook for repository ${repository.fullName}:`,
          error,
        );
      }
    }

    // Delete from database
    await this.prisma.repository.delete({
      where: { id: repositoryId },
    });

    this.logger.log(
      `Repository ${repository.fullName} removed for user ${userId}`,
    );
  }

  /**
   * Get repository by full name for webhook processing
   */
  async getRepositoryByFullName(userId: string, fullName: string) {
    return this.prisma.repository.findUnique({
      where: {
        userId_fullName: {
          userId,
          fullName,
        },
      },
    });
  }

  /**
   * Find repository by full name (for legacy webhook support)
   */
  async findRepositoryByFullName(fullName: string) {
    return this.prisma.repository.findFirst({
      where: {
        fullName,
      },
    });
  }
}

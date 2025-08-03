import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class RedirectService {
  private readonly logger = new Logger(RedirectService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Save redirect URL for a user and repository
   */
  async saveRedirectUrl(
    userId: string,
    repositoryFullName: string,
    redirectUrl: string,
    state?: string,
  ): Promise<void> {
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1); // Expires in 1 hour

    await this.prisma.gitHubInstallationRedirect.upsert({
      where: {
        userId_repositoryFullName: {
          userId,
          repositoryFullName,
        },
      },
      update: {
        redirectUrl,
        state,
        expiresAt,
      },
      create: {
        userId,
        repositoryFullName,
        redirectUrl,
        state,
        expiresAt,
      },
    });

    this.logger.log(
      `Redirect URL saved for user ${userId} and repository ${repositoryFullName}`,
    );
  }

  /**
   * Get redirect URL for a user and repository
   */
  async getRedirectUrl(
    userId: string,
    repositoryFullName: string,
  ): Promise<{ redirectUrl: string; state?: string }> {
    const redirect = await this.prisma.gitHubInstallationRedirect.findUnique({
      where: {
        userId_repositoryFullName: {
          userId,
          repositoryFullName,
        },
      },
    });

    if (!redirect) {
      throw new NotFoundException('Redirect URL not found');
    }

    // Check if expired
    if (new Date() > redirect.expiresAt) {
      await this.prisma.gitHubInstallationRedirect.delete({
        where: { id: redirect.id },
      });
      throw new NotFoundException('Redirect URL has expired');
    }

    return {
      redirectUrl: redirect.redirectUrl,
      state: redirect.state || undefined,
    };
  }

  /**
   * Delete redirect URL after use
   */
  async deleteRedirectUrl(
    userId: string,
    repositoryFullName: string,
  ): Promise<void> {
    await this.prisma.gitHubInstallationRedirect.delete({
      where: {
        userId_repositoryFullName: {
          userId,
          repositoryFullName,
        },
      },
    });

    this.logger.log(
      `Redirect URL deleted for user ${userId} and repository ${repositoryFullName}`,
    );
  }

  /**
   * Clean up expired redirect URLs
   */
  async cleanupExpiredRedirects(): Promise<void> {
    const deleted = await this.prisma.gitHubInstallationRedirect.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });

    if (deleted.count > 0) {
      this.logger.log(`Cleaned up ${deleted.count} expired redirect URLs`);
    }
  }
}

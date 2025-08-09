import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import * as jwt from 'jsonwebtoken';

interface GitHubRepository {
  id: number;
  name: string;
  full_name: string;
  private: boolean;
  owner: {
    login: string;
    id: number;
  };
}

interface GitHubInstallation {
  id: number;
  account: {
    login: string;
    id: number;
  };
  repositories: GitHubRepository[];
}

interface GitHubWebhook {
  id: number;
  url: string;
  events: string[];
  active: boolean;
}

@Injectable()
export class GitHubAppService {
  private readonly logger = new Logger(GitHubAppService.name);
  private readonly apiClient: AxiosInstance;

  constructor(private readonly configService: ConfigService) {
    this.apiClient = axios.create({
      baseURL: 'https://api.github.com',
      headers: {
        Accept: 'application/vnd.github.v3+json',
        'User-Agent': 'SmartCollab-App',
      },
    });
  }

  /**
   * Generate JWT token for GitHub App authentication
   */
  private generateAppJWT(): string {
    const appId = this.configService.get<string>('GITHUB_APP_ID');
    const privateKey = this.configService.get<string>('GITHUB_APP_PRIVATE_KEY');

    if (!appId || !privateKey) {
      throw new BadRequestException('GitHub App configuration is missing');
    }

    const now = Math.floor(Date.now() / 1000);
    const payload = {
      iat: now,
      exp: now + 600, // 10 minutes
      iss: appId,
    };

    try {
      const decodedPrivateKey = Buffer.from(privateKey, 'base64').toString(
        'utf-8',
      );
      const token = jwt.sign(payload, decodedPrivateKey, {
        algorithm: 'RS256',
      });
      return token;
    } catch (error) {
      throw new BadRequestException(
        'Failed to generate JWT token: ' + error.message,
      );
    }
  }

  /**
   * Get installation access token
   */
  private async getInstallationToken(installationId: string): Promise<string> {
    const jwt = this.generateAppJWT();

    const response = await this.apiClient.post(
      `/app/installations/${installationId}/access_tokens`,
      {},
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      },
    );

    return response.data.token;
  }

  extractFullName(repoUrl: string): { owner; repo; fullName } {
    const match = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
    if (!match) {
      throw new BadRequestException('Invalid GitHub repository URL');
    }

    const [, owner, repo] = match;
    const fullName = `${owner}/${repo}`;
    return { owner: owner, repo: repo, fullName: fullName };
  }

  /**
   * Validate repository URL format and basic existence
   */
  async validateRepository(repositoryUrl: string): Promise<GitHubRepository> {
    try {
      // Extract owner and repo from URL
      // const match = repositoryUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
      // if (!match) {
      //   throw new BadRequestException('Invalid GitHub repository URL');
      // }

      // const [, owner, repo] = match;
      // const fullName = `${owner}/${repo}`;
      const { owner, repo, fullName } = this.extractFullName(repositoryUrl);

      // For now, we'll just validate the URL format and return a basic structure
      // The actual repository access will be validated after GitHub App installation
      return {
        id: 0, // Will be filled after installation
        name: fullName,
        full_name: fullName,
        private: false, // Will be determined after installation
        owner: {
          login: owner,
          id: 0, // Will be filled after installation
        },
      };
    } catch (error) {
      throw new BadRequestException('Invalid fullNamesitory URL format');
    }
  }

  /**
   * Get installation information
   */
  async getInstallation(installationId: string): Promise<GitHubInstallation> {
    const jwt = this.generateAppJWT();

    const response = await this.apiClient.get(
      `/app/installations/${installationId}`,
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      },
    );

    return response.data;
  }

  /**
   * Get all installations for the GitHub App
   */
  async getAppInstallations(): Promise<GitHubInstallation[]> {
    const jwt = this.generateAppJWT();

    const response = await this.apiClient.get('/app/installations', {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });

    return response.data;
  }

  /**
   * Get repositories accessible to an installation
   */
  async getInstallationRepositories(
    installationId: string,
  ): Promise<GitHubRepository[]> {
    const token = await this.getInstallationToken(installationId);

    const response = await this.apiClient.get(`/installation/repositories`, {
      headers: {
        Authorization: `token ${token}`,
      },
    });

    return response.data.repositories;
  }

  /**
   * Find installation by account login
   */
  async findInstallationByAccount(
    accountLogin: string,
  ): Promise<GitHubInstallation | null> {
    const installations = await this.getAppInstallations();
    return (
      installations.find(
        (installation) => installation.account.login === accountLogin,
      ) || null
    );
  }

  /**
   * Check if a repository is accessible through any installation
   * Returns the installation and repository if found
   */
  async findRepositoryInstallation(repositoryFullName: string): Promise<{
    installation: GitHubInstallation;
    repository: GitHubRepository;
  } | null> {
    // Extract owner from repository full name
    const [owner] = repositoryFullName.split('/');
    if (!owner) {
      return null;
    }

    // Find installation for the account
    const installation = await this.findInstallationByAccount(owner);
    if (!installation) {
      return null;
    }

    // Get repositories for this installation
    const repositories = await this.getInstallationRepositories(
      installation.id.toString(),
    );

    // Find the target repository
    const repository = repositories.find(
      (repo) => repo.full_name === repositoryFullName,
    );

    return repository ? { installation, repository } : null;
  }

  /**
   * Create webhook for a repository
   */
  async createWebhook(
    installationId: string,
    repositoryFullName: string,
    webhookUrl: string,
    // webhookSecret: string, // GitHub Apps use global webhook secret
  ): Promise<GitHubWebhook> {
    const token = await this.getInstallationToken(installationId);

    const response = await this.apiClient.post(
      `/repos/${repositoryFullName}/hooks`,
      {
        name: 'web',
        active: true,
        events: ['push', 'pull_request'],
        config: {
          url: webhookUrl,
          content_type: 'json',
          // secret: webhookSecret, // GitHub ignores this for GitHub Apps
        },
      },
      {
        headers: {
          Authorization: `token ${token}`,
        },
      },
    );

    return response.data;
  }

  /**
   * Delete webhook
   */
  async deleteWebhook(
    installationId: string,
    repositoryFullName: string,
    webhookId: string,
  ): Promise<void> {
    const token = await this.getInstallationToken(installationId);

    await this.apiClient.delete(
      `/repos/${repositoryFullName}/hooks/${webhookId}`,
      {
        headers: {
          Authorization: `token ${token}`,
        },
      },
    );
  }

  /**
   * Get GitHub App installation URL
   */
  getInstallationUrl(): string {
    const clientId = this.configService.get<string>('GITHUB_APP_CLIENT_ID');
    return `https://github.com/apps/smartcollabapp/installations/new?client_id=${clientId}`;
  }

  /**
   * Verify webhook signature
   */
  verifyWebhookSignature(
    payload: string,
    signature: string,
    // webhookSecret?: string, // GitHub Apps use global webhook secret
  ): boolean {
    // Use global webhook secret for GitHub Apps
    const secret = this.configService.get<string>('GITHUB_APP_WEBHOOK_SECRET');

    if (!secret) {
      this.logger.warn('Webhook secret not configured');
      return false;
    }

    const crypto = require('crypto');
    const expectedSignature = `sha256=${crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex')}`;

    this.logger.debug(`Signature verification:`);
    this.logger.debug(`  Received signature: ${signature}`);
    this.logger.debug(`  Expected signature: ${expectedSignature}`);
    this.logger.debug(
      `  Using secret: ${secret ? '***' + secret.slice(-4) : 'none'}`,
    );

    // Use simple string comparison (case-sensitive)
    const isValid = signature === expectedSignature;

    this.logger.debug(`  Signature valid: ${isValid}`);

    // If signature is invalid, also try case-insensitive comparison for debugging
    if (!isValid) {
      const isValidCaseInsensitive =
        signature.toLowerCase() === expectedSignature.toLowerCase();
      this.logger.debug(
        `  Signature valid (case-insensitive): ${isValidCaseInsensitive}`,
      );
    }

    return isValid;
  }
}

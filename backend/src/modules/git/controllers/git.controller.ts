import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
  Request,
  BadRequestException,
  HttpStatus,
  Query,
  Res,
  HttpException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RepositoryService } from '../services/repository.service';
import { GitHubAppService } from '../services/github-app.service';
import { RedirectService } from '../services/redirect.service';
import { ConfigService } from '@nestjs/config';
import {
  AddRepositoryDto,
  ValidateRepositoryDto,
  CompleteRepositoryDto,
  RepositoryResponseDto,
  InitiateInstallationDto,
  InstallationCallbackDto,
} from '../dtos';
import { ApiResponse as ApiResponseDto } from '../../../common/response/api-response.dto';
import { GetUser } from '@/common/decorators/auth';
import { User } from '@prisma/client';
import { Response } from 'express';

@ApiTags('GitHub Integration')
@Controller('api/git')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class GitController {
  constructor(
    private readonly repositoryService: RepositoryService,
    private readonly githubAppService: GitHubAppService,
    private readonly redirectService: RedirectService,
    private readonly configService: ConfigService,
  ) {}

  @Post('repositories/validate')
  @ApiOperation({ summary: 'Validate GitHub repository URL' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Repository validation successful',
    type: RepositoryResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid repository URL or access denied',
  })
  async validateRepository(
    @GetUser() user: User,
    @Body() validateDto: ValidateRepositoryDto,
  ): Promise<ApiResponseDto<RepositoryResponseDto>> {
    const repository = await this.repositoryService.validateRepository(
      user.id,
      validateDto.repositoryUrl,
    );

    return ApiResponseDto.success(
      200,
      repository,
      'Repository validation successful',
    );
  }

  @Post('repositories/initiate')
  @ApiOperation({
    summary: 'Start repository connection process with redirect URL',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Installation URL generated',
  })
  async initiateRepositoryConnection(
    @GetUser() user: User,
    @Body() initiateDto: InitiateInstallationDto,
  ): Promise<
    ApiResponseDto<{ installationUrl: string; repositoryFullName: string }>
  > {
    // Validate repository first
    const repository = await this.githubAppService.validateRepository(
      initiateDto.repositoryUrl,
    );

    // const { owner, repo, fullName } = this.githubAppService.extractFullName(
    //   initiateDto.repositoryUrl,
    // );
    // // Extract repository full name from URL
    // const match = initiateDto.repositoryUrl.match(
    //   /github\.com\/([^\/]+)\/([^\/]+)/,
    // );
    // if (!match) {
    //   throw new BadRequestException('Invalid GitHub repository URL');
    // }
    // const [, owner, repo] = match;
    // const repositoryFullName = `${owner}/${repo}`;
const repositoryFullName = repository.full_name as string;
    // Save redirect URL for this user and repository
    await this.redirectService.saveRedirectUrl(
      user.id,
      repositoryFullName,
      initiateDto.redirectUrl,
      initiateDto.state,
    );

    // Generate installation URL with state parameter
    const baseUrl = this.githubAppService.getInstallationUrl();
    const state = encodeURIComponent(
      JSON.stringify({
        userId: user.id,
        repositoryFullName: repositoryFullName, // why not use just repository
        state: initiateDto.state,
      }),
    );
    const installationUrl = `${baseUrl}&state=${state}`;

    return ApiResponseDto.success(
      200,
      { installationUrl, repositoryFullName},
      'Repository connection initiated',
    );
  }

  @Post('repositories/complete')
  @ApiOperation({
    summary: 'Complete repository connection after GitHub App installation',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Repository connection completed',
    type: RepositoryResponseDto,
  })
  async completeRepositoryConnection(
    @GetUser() user: User,
    @Body() completeDto: CompleteRepositoryDto,
  ): Promise<ApiResponseDto<RepositoryResponseDto>> {
    const repository =
      await this.repositoryService.completeRepositoryConnection(
        user.id,
        completeDto.installationId,
        completeDto.repositoryFullName,
      );
    return ApiResponseDto.success(
      200,
      repository,
      'Repository connection completed successfully',
    );
  }

  @Get('repositories')
  @ApiOperation({ summary: 'Get user repositories' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User repositories retrieved',
    type: [RepositoryResponseDto],
  })
  async getUserRepositories(
    @GetUser() user: User,
  ): Promise<ApiResponseDto<RepositoryResponseDto[]>> {
    const repositories = await this.repositoryService.getUserRepositories(
      user.id,
    );

    return ApiResponseDto.success(
      200,
      repositories,
      'Repositories retrieved successfully',
    );
  }

  @Get('repositories/:id')
  @ApiOperation({ summary: 'Get specific repository' })
  @ApiParam({ name: 'id', description: 'Repository ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Repository retrieved',
    type: RepositoryResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Repository not found',
  })
  async getRepository(
    @GetUser() user: User,
    @Param('id') id: string,
  ): Promise<ApiResponseDto<RepositoryResponseDto>> {
    const repository = await this.repositoryService.getRepository(user.id, id);

    return ApiResponseDto.success(
      200,
      repository,
      'Repository retrieved successfully',
    );
  }

  @Delete('repositories/:id')
  @ApiOperation({ summary: 'Remove repository connection' })
  @ApiParam({ name: 'id', description: 'Repository ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Repository connection removed',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Repository not found',
  })
  async removeRepository(
    @GetUser() user: User,
    @Param('id') id: string,
  ): Promise<ApiResponseDto<void>> {
    await this.repositoryService.removeRepository(user.id, id);

    return ApiResponseDto.success(
      200,
      undefined,
      'Repository connection removed successfully',
    );
  }

  @Get('config/test')
  @ApiOperation({ summary: 'Test GitHub App configuration' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Configuration test result',
  })
  async testConfig(): Promise<ApiResponseDto<any>> {
    const appId = this.configService.get<string>('GITHUB_APP_ID');
    const privateKey = this.configService.get<string>('GITHUB_APP_PRIVATE_KEY');
    const clientId = this.configService.get<string>('GITHUB_APP_CLIENT_ID');

    return ApiResponseDto.success(
      200,
      {
        appId: appId ? 'Set' : 'Not set',
        privateKey: privateKey ? `Set (${privateKey.length} chars)` : 'Not set',
        clientId: clientId ? 'Set' : 'Not set',
        installationUrl: this.githubAppService.getInstallationUrl(),
      },
      'Configuration test completed',
    );
  }

  @Get('jwt/test')
  @ApiOperation({ summary: 'Test JWT generation' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'JWT test result',
  })
  async testJWT(): Promise<ApiResponseDto<any>> {
    try {
      // Test JWT generation
      const jwt = this.githubAppService['generateAppJWT']();

      // Test GitHub API call
      const response = await this.githubAppService['apiClient'].get('/app', {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      return ApiResponseDto.success(
        200,
        {
          jwtGenerated: true,
          jwtLength: jwt.length,
          githubResponse: response.data,
        },
        'JWT test successful',
      );
    } catch (error) {
      return ApiResponseDto.success(
        500,
        {
          jwtGenerated: false,
          error: error.message,
          response: error.response?.data,
        },
        'JWT test failed',
      );
    }
  }

  @Get('redirects/test')
  @ApiOperation({ summary: 'Test redirect URLs in database' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Redirect URLs test result',
  })
  async testRedirects(@GetUser() user: User): Promise<ApiResponseDto<any>> {
    try {
      // This is a temporary endpoint to check redirect URLs
      // In production, you'd want to remove this or secure it properly
      const redirects = await this.redirectService[
        'prisma'
      ].gitHubInstallationRedirect.findMany({
        where: { userId: user.id },
        select: {
          id: true,
          repositoryFullName: true,
          redirectUrl: true,
          createdAt: true,
          expiresAt: true,
        },
      });

      return ApiResponseDto.success(
        200,
        {
          redirects,
          count: redirects.length,
        },
        'Redirect URLs retrieved',
      );
    } catch (error) {
      return ApiResponseDto.success(
        500,
        {
          error: error.message,
        },
        'Failed to retrieve redirect URLs',
      );
    }
  }

  @Get('installations/check/:repositoryFullName')
  @ApiOperation({ summary: 'Check if repository has been installed' })
  @ApiParam({ name: 'repositoryFullName', description: 'Repository full name' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Installation check result',
  })
  async checkInstallation(
    @GetUser() user: User,
    @Param('repositoryFullName') repositoryFullName: string,
  ): Promise<ApiResponseDto<any>> {
    try {
      // Get all installations for the GitHub App
      const installations = await this.githubAppService.getAppInstallations();
      console.log(installations, repositoryFullName);

      // Check if any installation has access to this repository
      const installation = installations.find((inst) =>
        inst.repositories?.some(
          (repo) => repo.full_name === repositoryFullName,
        ),
      );

      if (installation) {
        return ApiResponseDto.success(
          200,
          {
            installed: true,
            installationId: installation.id,
            repositories: installation.repositories,
          },
          'Repository is installed',
        );
      } else {
        return ApiResponseDto.success(
          200,
          {
            installed: false,
            installations: installations.length,
          },
          'Repository is not installed',
        );
      }
    } catch (error) {
      return ApiResponseDto.success(
        500,
        {
          error: error.message,
        },
        'Failed to check installation',
      );
    }
  }

  @Get('installations/callback')
  @ApiOperation({
    summary:
      'GitHub App installation callback - for OAuth flows (not used for GitHub Apps)',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Callback endpoint (GitHub Apps don't use this)",
  })
  async installationCallback(): Promise<ApiResponseDto<{ message: string }>> {
    return ApiResponseDto.success(
      200,
      { message: "GitHub Apps don't use callback URLs for installation" },
      'This endpoint is not used for GitHub App installations',
    );
  }
}

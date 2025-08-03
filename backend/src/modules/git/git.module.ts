import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../prisma/prisma.module';
import { GitController } from './controllers/git.controller';
import { WebhookController } from './controllers/webhook.controller';
import { GitHubAppService } from './services/github-app.service';
import { RepositoryService } from './services/repository.service';
import { WebhookHandlerService } from './services/webhook-handler.service';
import { RedirectService } from './services/redirect.service';

@Module({
  imports: [PrismaModule, ConfigModule],
  controllers: [GitController, WebhookController],
  providers: [
    GitHubAppService,
    RepositoryService,
    WebhookHandlerService,
    RedirectService,
  ],
  exports: [
    GitHubAppService,
    RepositoryService,
    WebhookHandlerService,
    RedirectService,
  ],
})
export class GitModule {}

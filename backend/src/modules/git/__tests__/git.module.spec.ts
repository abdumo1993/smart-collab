import { Test, TestingModule } from '@nestjs/testing';
import { GitModule } from '../git.module';
import { GitController } from '../controllers/git.controller';
import { WebhookController } from '../controllers/webhook.controller';
import { GitHubAppService } from '../services/github-app.service';
import { RepositoryService } from '../services/repository.service';
import { WebhookHandlerService } from '../services/webhook-handler.service';

describe('GitModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [GitModule],
    }).compile();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should have GitController', () => {
    const controller = module.get<GitController>(GitController);
    expect(controller).toBeDefined();
  });

  it('should have WebhookController', () => {
    const controller = module.get<WebhookController>(WebhookController);
    expect(controller).toBeDefined();
  });

  it('should have GitHubAppService', () => {
    const service = module.get<GitHubAppService>(GitHubAppService);
    expect(service).toBeDefined();
  });

  it('should have RepositoryService', () => {
    const service = module.get<RepositoryService>(RepositoryService);
    expect(service).toBeDefined();
  });

  it('should have WebhookHandlerService', () => {
    const service = module.get<WebhookHandlerService>(WebhookHandlerService);
    expect(service).toBeDefined();
  });
});

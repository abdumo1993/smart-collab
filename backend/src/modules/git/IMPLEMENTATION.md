# GitHub Integration Module Implementation

This document provides a comprehensive guide to the implemented GitHub integration module based on the specifications in the README.md.

## Implementation Overview

The GitHub integration module has been fully implemented with the following components:

### 1. Database Schema

**Repository Model** (added to `prisma/schema.prisma`):

```prisma
model Repository {
  id                String   @id @default(uuid())
  userId            String
  user              User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  name              String   // Repository name (e.g., "repo-name")
  fullName          String   // Full repository name (e.g., "username/repo-name")
  private           Boolean  @default(false)
  installationId    String?  // GitHub App installation ID
  webhookId         String?  // GitHub webhook ID
  webhookUrl        String?  // Our webhook endpoint URL
  webhookSecret     String?  // Secret for webhook signature verification
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  @@unique([userId, fullName])
}
```

### 2. DTOs

- **AddRepositoryDto**: Repository URL validation
- **RepositoryResponseDto**: Repository response data
- **ValidateRepositoryDto**: Repository validation request
- **CompleteRepositoryDto**: Repository connection completion
- **WebhookEventDto**: Webhook event data

### 3. Services

#### GitHubAppService (`services/github-app.service.ts`)

- Handles GitHub App authentication using JWT tokens
- Validates repository URLs and checks access
- Creates and manages webhooks
- Verifies webhook signatures
- Generates installation URLs

#### RepositoryService (`services/repository.service.ts`)

- Manages repository connections in the database
- Handles repository validation and connection flow
- Provides CRUD operations for repositories
- Generates webhook secrets and URLs

#### WebhookHandlerService (`services/webhook-handler.service.ts`)

- Processes GitHub webhook events (push, pull_request, ping)
- Validates webhook payloads
- Extracts event types from headers
- Provides extensible event handling framework

### 4. Controllers

#### GitController (`controllers/git.controller.ts`)

- Repository management endpoints
- GitHub App installation flow
- User repository operations
- Protected by JWT authentication

#### WebhookController (`controllers/webhook.controller.ts`)

- Webhook event endpoints
- Signature verification
- Event processing
- Repository-specific and legacy webhook support

### 5. Module Configuration

The `GitModule` is properly configured with:

- PrismaModule for database access
- ConfigModule for environment variables
- JwtModule for GitHub App JWT generation
- All services and controllers registered

## API Endpoints

### Repository Management

| Method | Endpoint                         | Description                    |
| ------ | -------------------------------- | ------------------------------ |
| POST   | `/api/git/repositories/validate` | Validate repository URL        |
| POST   | `/api/git/repositories/initiate` | Start repository connection    |
| POST   | `/api/git/repositories/complete` | Complete repository connection |
| GET    | `/api/git/repositories`          | Get user repositories          |
| GET    | `/api/git/repositories/:id`      | Get specific repository        |
| DELETE | `/api/git/repositories/:id`      | Remove repository              |

### Webhooks

| Method | Endpoint                                  | Description                 |
| ------ | ----------------------------------------- | --------------------------- |
| POST   | `/api/git/webhooks/:userId/:repoFullName` | Repository-specific webhook |
| POST   | `/api/git/webhooks/github`                | Legacy webhook endpoint     |

### Installation Callback

| Method | Endpoint                          | Description                      |
| ------ | --------------------------------- | -------------------------------- |
| GET    | `/api/git/installations/callback` | GitHub App installation callback |

## Environment Configuration

Add these variables to your `.env` file:

```env
# GitHub App Configuration
GITHUB_APP_ID=your_app_id
GITHUB_APP_PRIVATE_KEY=base64_encoded_private_key
GITHUB_APP_CLIENT_ID=your_client_id
GITHUB_APP_CLIENT_SECRET=your_client_secret
GITHUB_APP_WEBHOOK_SECRET=your_webhook_secret
GITHUB_APP_WEBHOOK_URL=http://localhost:4000/api/git/webhooks
```

## User Flow Implementation

1. **Repository Validation**: User enters repository URL, system validates it exists and is accessible
2. **Installation Initiation**: System generates GitHub App installation URL
3. **GitHub App Installation**: User installs the app on their repository
4. **Connection Completion**: System creates webhook and saves repository connection
5. **Webhook Processing**: System processes push and pull request events

## Security Features

- **Webhook Signature Verification**: All webhooks verified using HMAC-SHA256
- **Repository-Specific Access**: Users only grant access to specific repositories
- **Secure Token Storage**: GitHub App tokens generated on-demand
- **Input Validation**: All inputs validated using class-validator
- **JWT Authentication**: All endpoints protected by JWT authentication

## Webhook Event Handling

The module handles these GitHub webhook events:

- **push**: Code pushes to any branch
- **pull_request**: Pull request events (opened, closed, synchronized, etc.)
- **ping**: Webhook verification events

## Error Handling

Comprehensive error handling for:

- Repository validation errors
- GitHub API errors
- Webhook signature verification failures
- Database operation errors
- Installation callback errors

## Testing

A basic test suite is included to verify module instantiation:

```bash
npm test -- --testPathPattern=git
```

## Database Migration

To apply the database changes:

```bash
npx prisma migrate dev --name add_repository_model
```

## Usage Example

### Frontend Integration

```typescript
// Validate repository
const response = await fetch('/api/git/repositories/validate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({
    repositoryUrl: 'https://github.com/username/repo-name',
  }),
});

// Initiate connection
const initiateResponse = await fetch('/api/git/repositories/initiate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({
    repositoryUrl: 'https://github.com/username/repo-name',
  }),
});

// Open GitHub App installation page
window.open(initiateResponse.data.installationUrl, '_blank');

// Complete connection (after installation)
const completeResponse = await fetch('/api/git/repositories/complete', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({
    installationId: '12345678',
    repositoryFullName: 'username/repo-name',
  }),
});
```

## Future Enhancements

The implementation provides a solid foundation for:

- Multiple GitHub accounts per user
- Branch-specific webhook configurations
- Advanced webhook event filtering
- Repository activity analytics
- Integration with document collaboration features

## Notes

- The implementation uses GitHub Apps instead of OAuth Apps for better security
- Webhook secrets are generated per repository for enhanced security
- The legacy webhook endpoint is included for backward compatibility
- All endpoints are properly documented with Swagger annotations
- The module is fully integrated with the existing NestJS application structure

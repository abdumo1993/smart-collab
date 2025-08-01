# GitHub Integration Module

This module provides GitHub repository integration with automatic webhook setup using GitHub Apps.

## Features

- **Repository Validation**: Validate GitHub repository URLs and check access
- **GitHub App Integration**: Use GitHub Apps for repository-specific permissions
- **Automatic Webhook Setup**: Create webhooks automatically during repository connection
- **Webhook Event Handling**: Process push and pull request events
- **Security**: Webhook signature verification and repository-specific access

## Architecture

### GitHub App vs OAuth App

This implementation uses **GitHub Apps** instead of OAuth Apps for better security:

- **Repository-specific permissions**: Users only grant access to specific repositories
- **No account-level tokens**: No broad access to all user repositories
- **Granular permissions**: Request only needed permissions
- **Installation-based**: Each repository connection is a separate installation

## Components

### Services

1. **GitHubAppService** (`services/github-app.service.ts`)
   - Handles GitHub App authentication and API operations
   - Generates JWT tokens for GitHub App authentication
   - Creates and manages webhooks
   - Validates repository access

2. **RepositoryService** (`services/repository.service.ts`)
   - Manages repository connections in the database
   - Handles repository validation and connection flow
   - Provides CRUD operations for repositories

3. **WebhookHandlerService** (`services/webhook-handler.service.ts`)
   - Processes GitHub webhook events
   - Handles push and pull request events
   - Verifies webhook signatures

### Controllers

1. **GitController** (`controllers/git.controller.ts`)
   - Repository management endpoints
   - GitHub App installation flow
   - User repository operations

2. **WebhookController** (`controllers/webhook.controller.ts`)
   - Webhook event endpoints
   - Signature verification
   - Event processing

### DTOs

- `AddRepositoryDto`: Repository URL validation
- `RepositoryResponseDto`: Repository response data
- `ValidateRepositoryDto`: Repository validation request
- `CompleteRepositoryDto`: Repository connection completion
- `WebhookEventDto`: Webhook event data

## API Endpoints

### Repository Management

- `POST /api/git/repositories/validate` - Validate repository URL
- `POST /api/git/repositories/initiate` - Start repository connection
- `POST /api/git/repositories/complete` - Complete repository connection
- `GET /api/git/repositories` - Get user repositories
- `GET /api/git/repositories/:id` - Get specific repository
- `DELETE /api/git/repositories/:id` - Remove repository

### Webhooks

- `POST /api/git/webhooks/:userId/:repoFullName` - Repository-specific webhook
- `POST /api/git/webhooks/github` - Legacy webhook endpoint

### Installation Callback

- `GET /api/git/installations/callback` - GitHub App installation callback

## User Flow

1. **User enters repository URL**
2. **System validates repository existence and format**
3. **User clicks "Connect Repository"**
4. **GitHub App installation page opens in popup**
5. **User selects repository and installs app**
6. **Installation callback completes the connection**
7. **Webhook is automatically created for the repository**

## Environment Variables

Add these to your `.env` file:

```env
# GitHub App Configuration
GITHUB_APP_ID=your_app_id
GITHUB_APP_PRIVATE_KEY=base64_encoded_private_key
GITHUB_APP_CLIENT_ID=your_client_id
GITHUB_APP_CLIENT_SECRET=your_client_secret
GITHUB_APP_WEBHOOK_SECRET=your_webhook_secret
GITHUB_APP_WEBHOOK_URL=http://localhost:3001/api/git/webhooks
```

## Database Schema

The module adds a `Repository` model to the database:

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

## Security Features

- **Webhook Signature Verification**: All webhooks are verified using HMAC-SHA256
- **Repository-Specific Access**: Users only grant access to specific repositories
- **Secure Token Storage**: GitHub App tokens are generated on-demand
- **Input Validation**: All inputs are validated using class-validator

## Webhook Events

The module handles the following GitHub webhook events:

- **push**: Code pushes to any branch
- **pull_request**: Pull request events (opened, closed, synchronized, etc.)
- **ping**: Webhook verification events

## Error Handling

- Repository validation errors
- GitHub API errors
- Webhook signature verification failures
- Database operation errors
- Installation callback errors

## Testing

Run the tests with:

```bash
npm test -- --testPathPattern=git
```

## Future Enhancements

- Support for multiple GitHub accounts per user
- Branch-specific webhook configurations
- Advanced webhook event filtering
- Repository activity analytics
- Integration with document collaboration features

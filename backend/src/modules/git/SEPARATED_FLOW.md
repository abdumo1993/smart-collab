# Separated Flow Architecture - Updated for GitHub Apps

This document describes the updated separated flow architecture for GitHub App integration that works correctly with GitHub Apps (which don't use callback URLs for installation).

## Architecture Overview

```
Frontend → Backend → GitHub App Installation → Frontend Polling → Backend Complete
```

1. **Frontend** initiates connection with redirect URL
2. **Backend** saves redirect URL and generates GitHub App installation URL
3. **User** installs GitHub App on their repository (no callback)
4. **Frontend** polls backend to check if installation is complete
5. **Backend** completes the connection when installation is detected

## Key Difference: GitHub Apps vs OAuth Apps

- **GitHub Apps** don't use callback URLs for installation
- **OAuth Apps** use callback URLs for authorization
- **GitHub Apps** require polling or webhook events to detect installation

## API Flow

### 1. Initiate Installation

**Endpoint:** `POST /api/git/repositories/initiate`

**Request:**

```json
{
  "repositoryUrl": "https://github.com/username/repo-name",
  "redirectUrl": "http://localhost:3000/dashboard",
  "state": "{\"source\": \"dashboard\"}"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "installationUrl": "https://github.com/apps/smartcollabapp/installations/new?client_id=xxx&state=...",
    "repositoryFullName": "username/repo-name"
  },
  "message": "Repository connection initiated"
}
```

### 2. GitHub App Installation

**User flow:**

1. Frontend opens installation URL in popup/new tab
2. User installs GitHub App on their repository
3. **No automatic redirect** - GitHub Apps don't use callbacks

### 3. Check Installation Status

**Endpoint:** `GET /api/git/installations/check/:repositoryFullName`

**Response:**

```json
{
  "success": true,
  "data": {
    "installed": true,
    "installationId": "12345678",
    "repositories": [...]
  },
  "message": "Repository is installed"
}
```

### 4. Complete Connection

**Endpoint:** `POST /api/git/repositories/complete`

**Request:**

```json
{
  "installationId": "12345678",
  "repositoryFullName": "username/repo-name"
}
```

## Frontend Implementation

### 1. Initiate Connection

```typescript
const initiateConnection = async (repositoryUrl: string) => {
  const response = await fetch('/api/git/repositories/initiate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      repositoryUrl,
      redirectUrl: `${window.location.origin}/dashboard`,
      state: JSON.stringify({ source: 'dashboard' }),
    }),
  });

  const { data } = await response.json();

  // Open GitHub App installation
  const popup = window.open(
    data.installationUrl,
    '_blank',
    'width=800,height=600',
  );

  // Start polling for installation
  pollForInstallation(data.repositoryFullName, popup);
};
```

### 2. Poll for Installation

```typescript
const pollForInstallation = async (
  repositoryFullName: string,
  popup: Window,
) => {
  const pollInterval = setInterval(async () => {
    try {
      // Check if popup is closed (user completed installation)
      if (popup.closed) {
        clearInterval(pollInterval);

        // Check if installation is complete
        const checkResponse = await fetch(
          `/api/git/installations/check/${encodeURIComponent(repositoryFullName)}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const checkData = await checkResponse.json();

        if (checkData.data.installed) {
          // Complete the connection
          await completeConnection(
            checkData.data.installationId,
            repositoryFullName,
          );
        } else {
          showErrorMessage('Installation not detected. Please try again.');
        }
      }
    } catch (error) {
      console.error('Error checking installation:', error);
    }
  }, 3000); // Poll every 3 seconds

  // Stop polling after 5 minutes
  setTimeout(() => {
    clearInterval(pollInterval);
    if (!popup.closed) {
      popup.close();
    }
    showErrorMessage('Installation timeout. Please try again.');
  }, 300000);
};
```

### 3. Complete Connection

```typescript
const completeConnection = async (
  installationId: string,
  repositoryFullName: string,
) => {
  try {
    const response = await fetch('/api/git/repositories/complete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        installationId,
        repositoryFullName,
      }),
    });

    if (response.ok) {
      showSuccessMessage('Repository connected successfully!');
      // Refresh repository list or redirect
    }
  } catch (error) {
    showErrorMessage('Failed to connect repository');
  }
};
```

## Alternative: Webhook-Based Approach

For a more robust solution, you can also use GitHub App webhook events:

1. **Set up webhook** in your GitHub App settings
2. **Listen for installation events** (`installation` and `installation_repositories`)
3. **Process installation events** to automatically complete connections

## Benefits of This Architecture

1. **Works with GitHub Apps** - No callback URLs needed
2. **Separation of concerns** - Backend handles GitHub integration, frontend handles UI
3. **Security** - No sensitive data passed through frontend
4. **Scalability** - Backend can handle multiple frontend clients
5. **Flexibility** - Frontend can customize polling behavior
6. **Reliability** - Polling ensures installation detection

## Configuration

### GitHub App Settings

```
Homepage URL: http://localhost:3000
Callback URL: [Leave empty - not used for GitHub Apps]
Webhook URL: http://localhost:4000/api/git/webhooks (optional)
```

### Environment Variables

```env
GITHUB_APP_ID=your_app_id
GITHUB_APP_PRIVATE_KEY=base64_encoded_private_key
GITHUB_APP_CLIENT_ID=your_client_id
GITHUB_APP_CLIENT_SECRET=your_client_secret
GITHUB_APP_WEBHOOK_SECRET=your_webhook_secret
GITHUB_APP_WEBHOOK_URL=http://localhost:4000/api/git/webhooks
```

This updated architecture properly handles GitHub App installations without relying on callback URLs, which are not supported for GitHub App installations.

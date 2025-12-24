# API Documentation

Base URL: http://localhost:4000/api

## Authentication

- POST /auth/register - Body: {email, password} - Creates user, returns token
- POST /auth/login - Body: {email, password} - Returns token

## Vaults (Auth Required)

- POST /vault - Body: {title, content} - Creates vault
- GET /vault - Lists user's vaults
- GET /vault/:id - Gets vault metadata
- POST /vault/:id/share - Body: {expiresAt, maxViews, password?} - Generates link
- GET /vault/:id/logs - Gets access logs

## Public Access

- GET /access/:token?password=xxx - Accesses content if valid

## Link Management (Auth Required)

- POST /link/:id/revoke - Revokes link
- GET /link/:id/status - Gets link status

Errors: {error: message} with HTTP codes (401 unauthorized, etc.).

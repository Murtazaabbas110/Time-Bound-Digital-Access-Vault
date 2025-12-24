# Time-Bound Digital Access Vault

A secure full-stack MERN web application for storing sensitive text in vaults and sharing via temporary, rule-based links. Enforces access constraints server-side with a responsive frontend.

## System Overview

Users can create vaults with encrypted content, generate share links (expiration, max views, optional password), track access attempts via logs, and restrict access once rules are violated.

## Features

- User registration/login with JWT
- Vault creation with AES-256-GCM encryption
- Share links with server-side validation
- Public access page for link viewing
- Audit logs (timestamp, outcome, IP)
- Race-safe concurrency, rate limiting, hashed tokens

## Tech Stack

- Frontend: React (Vite), Tailwind CSS + daisyUI (luxury theme), React Router, Axios
- Backend: Node.js/Express, MongoDB/Mongoose, JWT, bcrypt, crypto
- Tools: dotenv, nodemon, express-rate-limit

## Setup

1. Clone repo: `git clone https://github.com/Murtazaabbas110/Time-Bound-Digital-Access-Vault.git`
2. Backend: `cd backend`, `npm i`, create `.env` (see below), `npm run dev`
3. Frontend: `cd frontend`, `npm i`, create `.env` (VITE_BACKEND_URL=http://localhost:4000), `npm run dev`

### .env (Backend)

MONGO_URI=<your-mongo-uri>
PORT=4000
BASE_URL=http://localhost:5173
ENC_KEY_BASE64=<32-byte-base64>
TOKEN_HMAC_SECRET=<long-secret>
JWT_SECRET=<long-secret>
ACCESS_RATE_LIMIT_WINDOW_MS=60000
ACCESS_RATE_LIMIT_MAX=30

Access app at http://localhost:5173 (or Vite port).

## Architecture

- **Frontend**: SPA with protected routes (AuthContext). Public access page handles password/forms. API calls with Axios interceptors.
- **Backend**: REST API. Auth middleware protects routes. Encryption for content. Atomic ops for views. Logs in MongoDB.
- **Database**: Schemas for User, VaultItem, AccessLink, AccessLog.
- **Security**: No client validation, HTTPS in prod assumed, anti-brute via rate limits.

## Assumptions

- Text-only content.
- No email verification.
- Dev mode; prod needs secure env management.
- MongoDB Atlas for DB.
- If no hosting: Local due to time limits.

## API Documentation

See [API.md](API.md) for endpoints. Import [postman_collection.json](postman_collection.json) into Postman for testing.


# Audio Rights Hub Backend

This backend powers the Audio Copyright Management Platform for COSOTA-like workflows, supporting artist registration, audio copyright, licensing, payments, blockchain registration, and AI-based audio feature extraction.

## Tech Stack
- **Node.js** + **Express** (REST API)
- **MySQL** (Relational Database)
- **Sequelize** (ORM)
- **JWT** (Authentication)
- **RBAC** (Role-based Access Control)
- **Web3.js**/**ethers.js** (Blockchain integration)
- **Python/Flask** (AI microservice for audio feature extraction)
- **AWS S3/local** (Audio file storage)

## Folder Structure
```
/backend
  /src
    /api           # Express route handlers/controllers
      /auth
      /artists
      /audios
      /copyrights
      /payments
      /licensing
      /admin
    /middleware    # Auth, error handling, validation, etc.
    /models        # Sequelize models (MySQL)
    /services      # Business logic, DB, blockchain, AI integration
    /utils         # Helpers, validators, etc.
    /jobs          # Async jobs (feature extraction, notifications)
    /config        # Env, DB, blockchain, etc.
    /logs          # Audit and activity logs
    /tests         # Unit/integration tests
  app.js           # Express app entry point
  package.json
  .env
```

## Key Features
- Artist registration, verification, and wallet creation
- Audio upload, copyright request, and payment flow
- Role-based admin dashboard (manager, officer, cashier)
- AI-powered audio fingerprinting (librosa)
- Blockchain-based copyright and licensing
- Licensing, renewal, and certificate generation

## Getting Started
1. `cd backend`
2. `npm install`
3. Configure `.env`
4. `npm run dev`

---
See each folder's README for more details on endpoints and implementation.

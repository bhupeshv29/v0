# V0 Build Clone

## Overview
A high-performance AI code generation platform built with Next.js 15 and Prisma. This system orchestrates a multi-agent workflow to transform natural language prompts into fully functional, sandboxed Next.js applications using Google Gemini and E2B code interpreters.

## Features
- AI Agent Orchestration: Uses Inngest Agent Kit to manage specialized agents for coding, title generation, and user communication.
- Secure Code Execution: Integrates E2B Sandboxes to provide isolated, real-time preview environments for generated applications.
- Persistent Storage: Robust data modeling with Prisma and PostgreSQL for project management and message history.
- Authentication & Billing: Complete user lifecycle management and credit-based usage tracking via Clerk and Clerk Billings.
- Modern UI/UX: Fully responsive interface built with Shadcn UI, Tailwind CSS 4, and Framer-like transitions.

## Getting Started
### Installation
1. Clone the Repository:
   ```bash
   git clone https://github.com/bhupeshv29/v0.git
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Initialize the database:
   ```bash
   npx prisma generate
   npx prisma db push
   ```
4. Start the Docker container for the database:
   ```bash
   docker-compose up -d
   ```
5. Run the Inngest development server:
   ```bash
   npx inngest-cli@latest dev
   ```
6. Start the development server:
   ```bash
   npm run dev
   ```

### Environment Variables
Create a `.env` file in the root directory and populate it with the following:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/v0build?schema=public"
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
GEMINI_API_KEY=AIza...
E2B_API_KEY=e2b_...
```

# V0 Build Clone API

## Overview
Backend infrastructure designed for high-concurrency AI agent processing. It utilizes Inngest for background job orchestration and Prisma for relational data persistence between the Next.js edge runtime and the coding agents.

## Features
- Inngest: Background worker management for long-running LLM tasks.
- Prisma ORM: Type-safe database queries and schema migrations.
- Clerk Auth: Server-side route protection and identity verification.

## API Documentation
### Base URL
`/api`

### Endpoints

#### POST /api/inngest
**Request**:
Standard Inngest event payload triggered by the application server.
```json
{
  "name": "code-agent/run",
  "data": {
    "value": "Build a weather app",
    "projectId": "cm1234567890"
  }
}
```

**Response**:
```json
{
  "url": "http://sandbox-id.e2b.dev",
  "title": "Weather App",
  "summary": "<task_summary>Generated weather components</task_summary>"
}
```

**Errors**:
- 500: Inngest executor failure or LLM timeout.

#### POST /module/messages/actions/index.js -> createMessages
**Request**:
```json
{
  "value": "Add a dark mode toggle",
  "projectId": "clz12345"
}
```

**Response**:
```json
{
  "id": "msg_01",
  "content": "Add a dark mode toggle",
  "role": "USER",
  "projectId": "clz12345",
  "createdAt": "2023-10-27T10:00:00Z"
}
```

**Errors**:
- 401: Unauthorized access (Clerk).
- 404: Project not found.
- 429: Usage credits exhausted.

#### GET /module/projects/actions/index.js -> getProjects
**Request**:
None (Requires User Session)

**Response**:
```json
[
  {
    "id": "proj_01",
    "name": "blue-mountain",
    "userId": "user_29",
    "createdAt": "2023-10-25T12:00:00Z"
  }
]
```

**Errors**:
- 401: Unauthorized access.

## Technologies Used

| Technology | Purpose |
| :--- | :--- |
| Next.js 15 | Full-stack Framework |
| Prisma | Database ORM |
| PostgreSQL | Relational Database |
| Google Gemini | Large Language Model |
| E2B | Sandboxed Code Interpreter |
| Inngest | Event-driven Background Jobs |
| Clerk | Auth & Subscription Management |
| Shadcn UI | Component Library |
| TanStack Query | Server State Management |

## Author Info
- Github: [bhupeshv29](https://github.com/bhupeshv29)

![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=nextdotjs&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=flat&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat&logo=postgresql&logoColor=white)


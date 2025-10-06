# GridPlus – Smart Grid Monitoring & Alerting Platform

[![Node Version](https://img.shields.io/badge/node-20.16.0-339933?logo=node.js)](https://nodejs.org/en) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE) [![Express](https://img.shields.io/badge/web-Express-000000?logo=express)](https://expressjs.com/) [![MongoDB Atlas](https://img.shields.io/badge/db-MongoDB%20Atlas-47A248?logo=mongodb)](https://www.mongodb.com/atlas)

> IBM Internship Project · Lead Developer: Aryan Soni
>
> Deployed on AWS EC2 (Ubuntu) with CloudFront CDN. Future AWS integrations planned.

---

## Table of Contents

-   [Overview](#overview)
-   [Live Demo](#live-demo)
-   [Architecture](#architecture)
-   [Key Features](#key-features)
-   [Tech Stack](#tech-stack)
-   [Data Model](#data-model)
-   [Authentication & Authorization](#authentication--authorization)
-   [Operations & SRE](#operations--sre)
-   [Getting Started](#getting-started)
-   [Environment Variables](#environment-variables)
-   [Project Structure](#project-structure)
-   [API Surface](#api-surface)
-   [Deployment](#deployment)
-   [Roadmap](#roadmap)
-   [License](#license)
-   [Team & Contact](#team--contact)

---

## Overview

GridPlus is a full‑stack application for real‑time monitoring, alerting, and lifecycle management of electrical meters in industrial and commercial environments. It includes a responsive dashboard, robust auth, alerting (including fire/emergency), scheduled jobs, analytics, and email notifications.

---

## Live Demo

-   CloudFront: `https://d17yvdk2uely6c.cloudfront.net/meters`
-   EC2 (direct): `http://54.166.141.1:3000`

> Demo accounts can be created via Signup; emails are sent to configured addresses in `.env` and sample targets in `utils/email.js`.

---

## Architecture

High-level components:

-   Web server (`Express`) renders views via `EJS` with `ejs-mate` layouts
-   MongoDB Atlas with `Mongoose` models (`Meter`, `Alert`, `User`)
-   Session-backed auth via `passport-local` and `connect-mongo`
-   Background jobs via `node-cron` for:
    -   Synthetic meter readings (`utils/simulateReadingJob.js`) every 20 minutes
    -   Payment request notifications every 30 minutes
-   Email notifications via `Nodemailer` (Gmail/SMTP)
-   MVC organization with modular routers and controllers

Request flow (simplified): browser → `Express` routes → controllers → services/utils → MongoDB → EJS views → response

---

## Key Features

-   Responsive dashboard (EJS, Bootstrap, custom CSS)
-   CRUD for meters; owner-only edits/deletes with guard middleware
-   Alerting on threshold violations; log, acknowledge, and comment
-   Fire prediction logic with emergency email notification
-   Analytics with charts and progress indicators
-   Session-based authentication with 7‑day persistence
-   Flash messages and centralized error handling
-   Input validation with `Joi` on both server and client paths
-   CSV-ready alert logs and quick meter search
-   Payment request emails (demo)

---

## Tech Stack

-   Languages: JavaScript (Node.js), HTML, CSS
-   Backend: Node.js, Express.js, MVC, Express Router
-   Views/UI: EJS + `ejs-mate`, Bootstrap 5, vanilla JS
-   Database: MongoDB Atlas, `mongoose`
-   AuthN/Z: `passport`, `passport-local`, `express-session`, `connect-mongo`
-   Validation: `joi`
-   Email: `nodemailer`
-   Jobs/Scheduling: `node-cron`
-   Utilities: `method-override`, `dotenv`, `connect-flash`
-   Runtime: Node v20.16.0

---

## Data Model

-   Meter: `name`, `location`, arrays of `current`, `voltage`, `powerFactor`, `temperature`, `load`; `status`, `alertCount`, `alerts[]`, `updatedAt[]`, `fire`, `owner`
-   Alert: `name`, reading snapshot fields, `reason`, `acknowledged`, `comment`, timestamps
-   User: `username`, `email`, `passwordHash` (via `passport-local-mongoose`)

---

## Authentication & Authorization

-   Session-based auth persisted in MongoDB using `connect-mongo`
-   Local strategy via `passport-local`; passwords hashed and salted
-   Route protection middleware for login checks and owner checks
-   Redirect-after-login support to return users to intended routes
-   HTTP-only cookies, 7‑day session TTL, secrets stored in environment variables

---

## Operations & SRE

-   Health endpoint: `GET /health` → `OK`
-   Background jobs (`node-cron`):
    -   Every 20 minutes: simulate meter readings (`utils/simulateReadingJob.js`)
    -   Every 30 minutes: send payment request emails for all meters
-   Hardening:
    -   Centralized error middleware using `utils/ExpressError`
    -   Unhandled promise rejection listener
    -   Increased `keepAliveTimeout`/`headersTimeout` for managed hosting (e.g., Render/AWS ALB)

---

## Getting Started

### Prerequisites

-   Node.js v20.16.0
-   MongoDB Atlas cluster (or a local MongoDB)

### Installation

1. Clone and enter the repository:
    ```bash
    git clone https://github.com/AryanSONI00/GridPlus.git
    cd GridPlus
    ```
2. Install dependencies:
    ```bash
    npm install
    ```
3. Configure environment variables: see [Environment Variables](#environment-variables)
4. (Optional) Seed sample data: run the script in `init/index.js` if provided
5. Start the server:
    ```bash
    node app.js
    ```
6. Open the app:
    - Local: `http://localhost:3000`

> Note: A `start` npm script is not defined. You can run `node app.js` directly, or add a script: `"start": "node app.js"`.

---

## Environment Variables

Create a `.env` file in the project root with the following keys:

```ini
ATLAS_DB=<your_mongodb_atlas_connection_string>
SESSION_SECRET=<a_strong_random_string>
EMAIL_USER=<smtp_username_or_gmail_address>
EMAIL_PASS=<smtp_app_password_or_secret>
NODE_ENV=production
PORT=3000
```

Used by:

-   `app.js`: `ATLAS_DB`, `SESSION_SECRET`, `NODE_ENV`, `PORT`
-   `utils/email.js`: `EMAIL_USER`, `EMAIL_PASS`

---

## Project Structure

```
GridPlus/
  app.js
  controllers/
  models/
  routes/
  views/
  public/
  utils/
  init/
  middleware.js
  schema.js
  README.md
  package.json
```

-   Controllers: request orchestration and business logic
-   Models: Mongoose schemas (`meter`, `alert`, `user`)
-   Routes: modular `Express.Router` endpoints for `users`, `meters`, `alerts`
-   Views: EJS templates with `ejs-mate` layouts
-   Utils: email, async wrapper, simulation job, error helpers

---

## API Surface

User

-   `GET /signup` – render signup
-   `POST /signup` – create account
-   `GET /login` – render login
-   `POST /login` – authenticate (Passport local)
-   `GET /logout` – end session

Meters

-   `GET /meters` – list all meters
-   `GET /meters/new` – new meter form (auth)
-   `POST /meters` – create meter (auth)
-   `GET /meters/:id` – show meter
-   `GET /meters/:id/edit` – edit form (auth + owner)
-   `PUT /meters/:id` – update (auth + owner)
-   `DELETE /meters/:id` – delete (auth + owner)
-   `POST /meters/:id/request-payment` – send payment email (auth + owner)

Alerts

-   `GET /alerts` – alert log (auth)
-   `PUT /alerts/:id/comment` – add/update comment (auth)
-   `PUT /alerts/:id/acknowledge` – set acknowledgement (auth)

Utilities

-   `GET /health` – health check

> Many endpoints render server-side views. JSON APIs can be added alongside as needed.

---

## Deployment

-   Current: AWS EC2 (Ubuntu) + CloudFront CDN, MongoDB Atlas
-   Suggested production configuration:
    -   Configure `.env` with production values
    -   Ensure `NODE_ENV=production`
    -   Use a process manager (PM2/systemd) and reverse proxy (Nginx/ALB)
    -   Set `SESSION_SECRET` and rotate regularly
    -   Configure SMTP credentials for `nodemailer`
    -   Monitor health (`/health`) and logs

Future integrations (planned):

-   AWS S3 (assets), CloudWatch (metrics/logs), SES (email), Lambda (serverless jobs)

---

## Roadmap

-   Role-based access control (admin/user)
-   Real-time updates via WebSockets
-   Advanced analytics & reporting
-   Mobile application
-   Multi-tenancy and org-level separation
-   IoT device integration for live meter data
-   Enhanced billing and payments

---

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

---

## Team & Contact

-   Lead Developer: Aryan Soni (IBM Internship Project)
-   GitHub: `https://github.com/AryanSONI00`
-   X (Twitter): `https://x.com/Aryansoni_77/`
-   Instagram: `https://www.instagram.com/itz_aryannn0/`
-   LinkedIn: `https://www.linkedin.com/in/aryan-soni-604696252/`

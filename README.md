# GridPlus

[Live Demo](https://d17yvdk2uely6c.cloudfront.net/meters)

> **IBM Internship Project** > _Lead Developer: Raghav Agarwal_
> Deployed on **AWS EC2 t3.micro & Cloudfront** | Future AWS integrations planned

---

## Table of Contents

-   [Overview](#overview)
-   [Live Demo](#live-demo)
-   [Tech Stack](#tech-stack)
-   [Features](#features)
-   [How Authentication Works](#how-authentication-works)
-   [Getting Started](#getting-started)
-   [Project Structure & MVC](#project-structure--mvc)
-   [Data Model](#data-model)
-   [Deployment](#deployment)
-   [Future Plans](#future-plans)
-   [License](#license)
-   [Team & Credits](#team--credits)
-   [Contact](#contact)

---

## Overview

**GridPlus** is a full-stack web application for real-time monitoring, alerting, and management of electrical meters in industrial and commercial environments. It provides a responsive dashboard, robust authentication, alerting, analytics, and a clean, modern UI.

---

## Live Demo

🌐 [http://54.166.141.1:3000](http://54.166.141.1:3000)

---

## Tech Stack

-   **Languages:** JavaScript (Node.js, Express), HTML, CSS, EJS
-   **Frontend:** EJS templates, Bootstrap 5, custom CSS, vanilla JS
-   **Backend:** Node.js, Express.js, MVC architecture, Express Router
-   **Database:** MongoDB Atlas (cloud), Mongoose ODM
-   **Authentication:** Passport.js (local strategy), express-session, connect-mongo
-   **Validation:** Joi (client & server-side)
-   **Email:** Nodemailer (Gmail/SMTP)
-   **Other:** Chart.js (analytics), method-override, dotenv, connect-flash, node-cron
-   **DevOps:** Deployed on AWS EC2 t3.micro (Ubuntu) & Cloudfront, future AWS tools planned

---

## Features

-   **Responsive, Clean UI:** Modern, mobile-friendly interface with EJS, Bootstrap, and custom CSS.
-   **Authentication & Authorization:**
    -   Session-based login with express-session and connect-mongo.
    -   Passport.js local strategy for secure auth.
    -   Cookie expiry (7 days), persistent login (no need to re-login).
    -   Route protection: only logged-in users can manage meters; only owners can edit/delete their meters.
    -   Redirect-after-login: If a user tries to access a protected route, they're redirected to login and then back to their intended action.
-   **Meter Management:**
    -   Register, edit, delete, and monitor multiple meters.
    -   Only the owner can edit/delete their meters.
    -   Quick search for meters.
-   **Alert System:**
    -   Automatic detection of abnormal readings (current, voltage, power factor, temperature, load).
    -   Fire prediction logic.
    -   Alert logging, acknowledgment, admin comments.
    -   Download alert logs as CSV.
-   **Dashboard & Analytics:**
    -   Visualize meter data with interactive charts (line, bar, radar, scatter, doughnut, polar area).
    -   Animated progress bars for energy overview.
-   **Email Notifications:** Alert, fire, and payment request emails.
-   **Robust Error Handling:**
    -   Custom ExpressError class.
    -   Centralized error middleware.
    -   wrapAsync utility for async route error handling.
-   **Validation:**
    -   Joi for both client and server-side validation.
    -   Handles edge cases and invalid input gracefully.
-   **API & Code Quality:**
    -   Clean, RESTful APIs.
    -   Express Router for modular routes.
    -   Clean, well-structured MongoDB schema.
    -   Middlewares for flash messages, error handling, and more.
-   **Sample Data Initialization:** Seed database for demo/testing.
-   **Security:** HTTP-only cookies, environment variables for secrets, input validation.

---

## How Authentication Works

-   **Session-Based Auth:** Uses express-session and connect-mongo to store sessions in MongoDB Atlas.
-   **Persistent Login:** Users stay logged in for 7 days (cookie expiry), unless they log out.
-   **Redirect After Login:** If a user tries to access a protected route, they're redirected to login, and after successful login, they're automatically redirected to their original destination.
-   **Route Protection:** Only authenticated users can access/modify their own meters and alerts.
-   **Password Security:** Passwords are hashed and never stored in plain text.

---

## Getting Started

### Prerequisites

-   Node.js v20.16.0
-   MongoDB Atlas (or local MongoDB)

### Installation

1. **Clone the repository:**
    ```bash
    git clone <repo-url>
    cd GridPlus
    ```
2. **Install dependencies:**
    ```bash
    npm install
    ```
3. **Set up environment variables:**
    - Create a `.env` file in the root directory:
        ```
        ATLAS_DB=your_mongodb_atlas_url
        SESSION_SECRET=your_session_secret
        EMAIL_USER=your_email@gmail.com
        EMAIL_PASS=your_email_password
        NODE_ENV=production
        PORT=3000
        ```
4. **(Optional) Initialize sample data:**
    - Run the script in `init/index.js` to seed the database.
5. **Start the application:**
    ```bash
    npm start
    ```
6. **Visit the app:**
    - Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Project Structure & MVC

-   **MVC Architecture:** Clear separation of concerns with Models, Views (EJS), and Controllers.
-   **Express Router:** Modular route handling for users, meters, and alerts.
-   **Directory Structure:**
    ```
    GridPlus/
      app.js
      controllers/
      models/
      routes/
      views/
      public/
      utils/
      ...
    ```

---

## Data Model

-   **Meter:** name, location, readings, status, alerts, fire, owner, timestamps
-   **Alert:** meter name, readings, reason, acknowledged, comment, triggeredAt
-   **User:** username, email, hashed password

---

## Deployment

-   **Current:** AWS EC2 t3.micro (Ubuntu), Node.js, MongoDB Atlas
-   **Planned:** Integration with other AWS services (S3 for assets, CloudWatch for monitoring, SES for email, etc.)

---

## Future Plans

-   Integrate more AWS tools (S3 for asset storage, CloudWatch for monitoring, SES for email, Lambda for serverless jobs, etc.)
-   Advanced analytics and reporting (custom dashboards, exportable reports)
-   Real-time data streaming and updates (WebSockets)
-   Role-based access control (admin, user, etc.)
-   Mobile app version
-   More granular alerting and notification options
-   Multi-tenancy and organization support
-   Enhanced search and filtering for meters and alerts
-   Integration with IoT devices for live meter data
-   Improved payment and billing features

---

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

---

## Team & Credits

-   **Lead Developer:** Raghav Agarwal (IBM Internship Project)
-   Special thanks to the GridPlus team and contributors.

---

## Contact

-   [GitHub](https://github.com/git-raghav)
-   [Twitter](https://x.com/raghavsayshii/)
-   [Instagram](https://www.instagram.com/raghavsayshii/)
-   [LinkedIn](https://www.linkedin.com/in/raghav-agarwal-5a7702293/)

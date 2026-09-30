# REST API Health Monitor

A lightweight, in-memory Node.js and Express service that allows developers to register, manage, and check the health status of REST API endpoints in real-time.

---

## 🛠️ Tech Stack

* **Runtime:** Node.js
* **Framework:** Express.js
* **Language:** JavaScript (ES6+)
* **HTTP Client:** Fetch API / Axios (for endpoint health checks)
* **Version Control:** Git

---

## 📁 Project Structure

```text
api-health-monitor/
├── src/
│   ├── routes/
│   │   └── monitorRoutes.js   # Route definitions for CRUD & health checks
│   ├── services/
│   │   └── healthService.js   # Logic for checking endpoint availability
│   └── server.js              # Express app entry point & middleware setup
├── .env.example               # Environment variable configuration template
├── .gitignore                 # Files excluded from version control
├── package.json               # Dependencies and scripts
└── README.md                  # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites

* Node.js (v18.x or higher recommended)
* npm (comes bundled with Node.js)

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/api-health-monitor.git
   cd api-health-monitor
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory (or copy from `.env.example`):
   ```bash
   PORT=3000
   ```

4. **Start the server**
   ```bash
   npm start
   ```
   The server will run at `http://localhost:3000`.

---

## 📖 API Documentation

### Base Route

#### `GET /health`
Checks whether the API service itself is operational.

* **Response:** `200 OK`
  ```json
  {
    "status": "ok"
  }
  ```

---

### Monitor Endpoints

#### `POST /monitors`
Registers a new API endpoint to monitor.

* **Request Body:**
  ```json
  {
    "name": "JSONPlaceholder API",
    "url": "https://jsonplaceholder.typicode.com/posts/1"
  }
  ```
* **Response:** `201 Created`
  ```json
  {
    "id": 1,
    "name": "JSONPlaceholder API",
    "url": "https://jsonplaceholder.typicode.com/posts/1",
    "status": "unknown",
    "lastCheck": null
  }
  ```

#### `GET /monitors`
Retrieves all registered monitors.

* **Response:** `200 OK`
  ```json
  [
    {
      "id": 1,
      "name": "JSONPlaceholder API",
      "url": "https://jsonplaceholder.typicode.com/posts/1",
      "status": "up",
      "lastCheck": {
        "statusCode": 200,
        "responseTime": 142,
        "checkedAt": "2026-09-30T21:15:00.000Z"
      }
    }
  ]
  ```

#### `GET /monitors/:id`
Retrieves details of a specific monitor by ID.

* **Response:** `200 OK`
  ```json
  {
    "id": 1,
    "name": "JSONPlaceholder API",
    "url": "https://jsonplaceholder.typicode.com/posts/1",
    "status": "up",
    "lastCheck": {
      "statusCode": 200,
      "responseTime": 142,
      "checkedAt": "2026-09-30T21:15:00.000Z"
    }
  }
  ```

#### `DELETE /monitors/:id`
Deletes a registered monitor.

* **Response:** `200 OK`
  ```json
  {
    "message": "Monitor deleted successfully"
  }
  ```

---

### Health Checking

#### `POST /monitors/:id/check`
Triggers an immediate HTTP check for the target endpoint.

* **Successful Check (`200 OK`):**
  ```json
  {
    "id": 1,
    "name": "JSONPlaceholder API",
    "url": "https://jsonplaceholder.typicode.com/posts/1",
    "status": "up",
    "lastCheck": {
      "status": "up",
      "statusCode": 200,
      "responseTime": 142,
      "checkedAt": "2026-09-30T21:15:00.000Z"
    }
  }
  ```

* **Failed Check (e.g., Timeout, 500, or invalid connection) (`200 OK`):**
  ```json
  {
    "id": 1,
    "name": "Failing Service",
    "url": "https://invalid-url-domain.com",
    "status": "down",
    "lastCheck": {
      "status": "down",
      "statusCode": null,
      "error": "ENOTFOUND",
      "responseTime": 305,
      "checkedAt": "2026-09-30T21:15:00.000Z"
    }
  }
  ```

---

### Summary Endpoint

#### `GET /summary`
Aggregates the current status across all registered monitors.

* **Response:** `200 OK`
  ```json
  {
    "total": 5,
    "up": 3,
    "down": 1,
    "unknown": 1
  }
  ```

---

## 🛡️ Error Handling

The application features centralized error middleware that intercepts and handles runtime errors gracefully without crashing the server:

* **400 Bad Request:** Triggered when required request body fields (`name`, `url`) are missing or malformed.
* **404 Not Found:** Returned when querying or operating on a monitor ID that does not exist.
* **500 Internal Server Error:** Standardized fallback response for uncaught server-side exceptions.

---

## 📝 Commit Strategy

Below is the structured commit workflow followed during development:

* `feat: initialize express server`
* `feat: add monitor CRUD endpoints`
* `feat: add endpoint health checking`
* `feat: add monitoring summary`
* `docs: document API endpoints`
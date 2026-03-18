<p align="center">
  <img src="https://img.icons8.com/external-flaticons-lineal-color-flat-icons/128/external-ticket-cinema-flaticons-lineal-color-flat-icons-2.png" alt="ShowSphere Logo" width="120" height="120">
</p>

<h1 align="center">ShowSphere</h1>

<p align="center">
  <strong>A Production-Ready Event Ticketing Platform Built with Microservices Architecture</strong>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#architecture">Architecture</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#api-reference">API Reference</a> •
  <a href="#contributing">Contributing</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React">
  <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js">
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB">
  <img src="https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white" alt="Redis">
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker">
  <img src="https://img.shields.io/badge/Kubernetes-326CE5?style=for-the-badge&logo=kubernetes&logoColor=white" alt="Kubernetes">
  <img src="https://img.shields.io/badge/Stripe-008CDD?style=for-the-badge&logo=stripe&logoColor=white" alt="Stripe">
</p>

<p align="center">
  <img src="https://img.shields.io/github/license/ankiitsingh21/ShowSphere?style=flat-square" alt="License">
  <img src="https://img.shields.io/github/actions/workflow/status/ankiitsingh21/ShowSphere/tests.yml?style=flat-square&label=tests" alt="Tests">
  <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square" alt="PRs Welcome">
</p>

---

## Overview

**ShowSphere** is a fully-featured, scalable event ticketing platform that demonstrates modern software architecture patterns. Built using a **microservices architecture**, it enables users to list, purchase, and manage event tickets with real-time updates and secure payment processing.

This project showcases:
- **Domain-Driven Design** with isolated, independently deployable services
- **Event-Driven Architecture** using NATS Streaming for asynchronous communication
- **Optimistic Concurrency Control** to handle race conditions
- **Kubernetes Orchestration** for container management and scaling

---

## Features

<table>
<tr>
<td width="50%">

### User Management
- Secure user registration and authentication
- JWT-based session management
- Cookie-based token storage
- Password hashing with scrypt

### Ticket Management
- Create and list tickets for sale
- Real-time ticket availability
- Edit/update ticket details
- Automatic reservation on order

</td>
<td width="50%">

### Order Processing
- Instant ticket reservation
- 60-second payment window
- Automatic order expiration
- Order history tracking

### Payment System
- Secure Stripe integration
- Real-time payment processing
- Order completion on success
- Payment failure handling

</td>
</tr>
</table>

### Additional Highlights

| Feature | Description |
|---------|-------------|
| **Microservices** | 5 independent backend services with dedicated databases |
| **Event-Driven** | Asynchronous communication via NATS Streaming |
| **Concurrency Control** | Optimistic locking with version numbers |
| **Shared Library** | Common NPM package for reusable code |
| **Full Testing** | Comprehensive test suites with in-memory MongoDB |
| **CI/CD Ready** | GitHub Actions workflow for automated testing |
| **Production Ready** | Kubernetes manifests for deployment |

---

## Architecture

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                                   KUBERNETES CLUSTER                             │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│    ┌──────────────────────────────────────────────────────────────────────┐     │
│    │                        NGINX INGRESS CONTROLLER                       │     │
│    │                         (ticketing.dev)                               │     │
│    └────────────┬──────────────┬──────────────┬──────────────┬────────────┘     │
│                 │              │              │              │                   │
│    ┌────────────▼────┐  ┌──────▼──────┐  ┌───▼────┐  ┌──────▼──────┐           │
│    │  /api/users/*   │  │/api/tickets │  │/api/   │  │/api/payments│           │
│    └────────┬────────┘  └──────┬──────┘  │orders/*│  └──────┬──────┘           │
│             │                  │         └───┬────┘         │                   │
│    ┌────────▼────────┐  ┌──────▼──────┐  ┌───▼────────┐  ┌──▼───────────┐      │
│    │   AUTH SERVICE  │  │   TICKETS   │  │   ORDERS   │  │   PAYMENTS   │      │
│    │   (Port 3000)   │  │   SERVICE   │  │   SERVICE  │  │   SERVICE    │      │
│    └────────┬────────┘  └──────┬──────┘  └───┬────────┘  └──────┬───────┘      │
│             │                  │             │                   │              │
│    ┌────────▼────────┐  ┌──────▼──────┐  ┌───▼────────┐  ┌──────▼───────┐      │
│    │   MongoDB       │  │   MongoDB   │  │   MongoDB  │  │   MongoDB    │      │
│    │   (auth-db)     │  │ (tickets-db)│  │ (orders-db)│  │ (payments-db)│      │
│    └─────────────────┘  └─────────────┘  └────────────┘  └──────────────┘      │
│                                                                                  │
│    ┌─────────────────────────────────────────────────────────────────────┐      │
│    │                      NATS STREAMING SERVER                          │      │
│    │                    (Event Bus - ticketing)                          │      │
│    └───────────────────────────────┬─────────────────────────────────────┘      │
│                                    │                                             │
│    ┌───────────────────────────────▼─────────────────────────────────────┐      │
│    │                       EXPIRATION SERVICE                             │      │
│    │                  (Bull Queue + Redis)                                │      │
│    └─────────────────────────────────────────────────────────────────────┘      │
│                                                                                  │
│    ┌─────────────────────────────────────────────────────────────────────┐      │
│    │                         CLIENT (Next.js)                             │      │
│    │                        React + Bootstrap                             │      │
│    └─────────────────────────────────────────────────────────────────────┘      │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### Microservices Overview

```mermaid
graph TB
    subgraph Client["Frontend"]
        C[Next.js Client]
    end
    
    subgraph Gateway["API Gateway"]
        I[Nginx Ingress]
    end
    
    subgraph Services["Microservices"]
        A[Auth Service]
        T[Tickets Service]
        O[Orders Service]
        P[Payments Service]
        E[Expiration Service]
    end
    
    subgraph Databases["Data Layer"]
        MA[(Auth MongoDB)]
        MT[(Tickets MongoDB)]
        MO[(Orders MongoDB)]
        MP[(Payments MongoDB)]
        R[(Redis)]
    end
    
    subgraph Messaging["Event Bus"]
        N[NATS Streaming]
    end
    
    C --> I
    I --> A
    I --> T
    I --> O
    I --> P
    
    A --> MA
    T --> MT
    O --> MO
    P --> MP
    E --> R
    
    T <--> N
    O <--> N
    P <--> N
    E <--> N
```

---

## Event Flow

### Order Creation Flow

```mermaid
sequenceDiagram
    participant U as User
    participant C as Client
    participant O as Orders Service
    participant T as Tickets Service
    participant E as Expiration Service
    participant P as Payments Service
    participant N as NATS

    U->>C: Click "Purchase"
    C->>O: POST /api/orders
    O->>O: Create Order (status: created)
    O->>N: Publish OrderCreated
    N->>T: OrderCreated Event
    T->>T: Mark Ticket Reserved
    N->>E: OrderCreated Event
    E->>E: Schedule Expiration Job (60s)
    N->>P: OrderCreated Event
    P->>P: Store Order Info
    O-->>C: Return Order
    C-->>U: Show Payment Form
```

### Payment Flow

```mermaid
sequenceDiagram
    participant U as User
    participant C as Client
    participant P as Payments Service
    participant S as Stripe
    participant N as NATS
    participant O as Orders Service
    participant T as Tickets Service

    U->>C: Submit Payment
    C->>P: POST /api/payments
    P->>S: Create Charge
    S-->>P: Charge Success
    P->>P: Save Payment Record
    P->>N: Publish PaymentCreated
    N->>O: PaymentCreated Event
    O->>O: Mark Order Complete
    N->>T: Order Complete
    T->>T: Keep Ticket Reserved
    P-->>C: Payment Success
    C-->>U: Redirect to Orders
```

### Order Expiration Flow

```mermaid
sequenceDiagram
    participant E as Expiration Service
    participant R as Redis/Bull
    participant N as NATS
    participant O as Orders Service
    participant T as Tickets Service

    R->>E: Job Timeout (60s)
    E->>N: Publish ExpirationComplete
    N->>O: ExpirationComplete Event
    O->>O: Check Order Status
    alt Order Not Paid
        O->>O: Mark Order Cancelled
        O->>N: Publish OrderCancelled
        N->>T: OrderCancelled Event
        T->>T: Unreserve Ticket
    else Order Already Paid
        O->>O: No Action
    end
```

---

## Tech Stack

### Backend Services

| Service | Technology | Purpose |
|---------|------------|---------|
| **Auth** | Node.js, Express, TypeScript, MongoDB | User authentication & authorization |
| **Tickets** | Node.js, Express, TypeScript, MongoDB | Ticket CRUD operations |
| **Orders** | Node.js, Express, TypeScript, MongoDB | Order management |
| **Payments** | Node.js, Express, TypeScript, MongoDB, Stripe | Payment processing |
| **Expiration** | Node.js, TypeScript, Bull, Redis | Background job processing |

### Frontend

| Technology | Purpose |
|------------|---------|
| **Next.js 16** | React framework with SSR |
| **React 19** | UI components |
| **Bootstrap 5** | Styling & responsive design |
| **Axios** | HTTP client |
| **react-stripe-checkout** | Stripe payment integration |

### Infrastructure

| Technology | Purpose |
|------------|---------|
| **Docker** | Containerization |
| **Kubernetes** | Container orchestration |
| **Skaffold** | Local development workflow |
| **NATS Streaming** | Event bus / message broker |
| **Nginx Ingress** | Load balancing & routing |
| **GitHub Actions** | CI/CD pipeline |

### Shared Library

The `@showsphere/common` NPM package contains:
- Custom error classes (BadRequestError, NotFoundError, etc.)
- Express middlewares (currentUser, requireAuth, errorHandler)
- Event definitions and base classes
- TypeScript interfaces and types
- Mongoose plugins (optimistic concurrency)

---

## Project Structure

```
ShowSphere/
├── auth/                          # Authentication Service
│   ├── src/
│   │   ├── routes/               # API route handlers
│   │   │   ├── signup.ts
│   │   │   ├── signin.ts
│   │   │   ├── signout.ts
│   │   │   └── current-user.ts
│   │   ├── modals/               # Mongoose models
│   │   ├── services/             # Business logic (password hashing)
│   │   ├── test/                 # Test setup
│   │   ├── app.ts                # Express app configuration
│   │   └── index.ts              # Service entry point
│   ├── Dockerfile
│   └── package.json
│
├── tickets/                       # Tickets Service
│   ├── src/
│   │   ├── routes/               # CRUD endpoints
│   │   ├── models/               # Ticket model
│   │   ├── events/               # Event publishers & listeners
│   │   │   ├── publishers/
│   │   │   └── listeners/
│   │   ├── __mocks__/            # Jest mocks
│   │   └── nats-wrapper.ts       # NATS client singleton
│   ├── Dockerfile
│   └── package.json
│
├── orders/                        # Orders Service
│   ├── src/
│   │   ├── routes/               # Order management endpoints
│   │   ├── models/               # Order & Ticket models
│   │   └── events/               # Event handling
│   ├── Dockerfile
│   └── package.json
│
├── payments/                      # Payments Service
│   ├── src/
│   │   ├── routes/               # Payment endpoints
│   │   ├── models/               # Order & Payment models
│   │   ├── events/               # Event handling
│   │   └── stripe.ts             # Stripe configuration
│   ├── Dockerfile
│   └── package.json
│
├── expiration/                    # Expiration Service
│   ├── src/
│   │   ├── queues/               # Bull queue configuration
│   │   ├── events/               # Event handling
│   │   └── nats-wrapper.ts
│   ├── Dockerfile
│   └── package.json
│
├── client/                        # Next.js Frontend
│   ├── pages/
│   │   ├── auth/                 # Authentication pages
│   │   ├── tickets/              # Ticket pages
│   │   ├── orders/               # Order pages
│   │   ├── _app.jsx              # App wrapper
│   │   └── index.jsx             # Landing page
│   ├── components/               # Reusable components
│   ├── hooks/                    # Custom React hooks
│   ├── api/                      # API client configuration
│   └── package.json
│
├── common/                        # Shared NPM Package
│   ├── src/
│   │   ├── errors/               # Custom error classes
│   │   ├── middlewares/          # Express middlewares
│   │   ├── events/               # Event definitions
│   │   ├── types/                # TypeScript types
│   │   └── plugin/               # Mongoose plugins
│   └── package.json
│
├── infra/                         # Infrastructure
│   └── k8s/                      # Kubernetes manifests
│       ├── auth-depl.yaml
│       ├── auth-mongo-depl.yaml
│       ├── tickets-depl.yaml
│       ├── tickets-mongo-depl.yaml
│       ├── orders-depl.yaml
│       ├── orders-mongo-depl.yaml
│       ├── payments-depl.yaml
│       ├── payments-mongo-depl.yaml
│       ├── expiration-depl.yaml
│       ├── expiration-red-depl.yaml
│       ├── nats-depl.yaml
│       ├── client-depl.yaml
│       └── ingress-srv.yaml
│
├── nats-test/                     # NATS Testing Utilities
├── .github/
│   └── workflows/
│       └── tests.yml             # CI/CD configuration
├── skaffold.yaml                 # Skaffold configuration
└── README.md
```

---

## Getting Started

### Prerequisites

Ensure you have the following installed:

| Tool | Version | Purpose |
|------|---------|---------|
| [Docker Desktop](https://www.docker.com/products/docker-desktop) | Latest | Container runtime |
| [Kubernetes](https://kubernetes.io/) | v1.25+ | Container orchestration |
| [Skaffold](https://skaffold.dev/) | v2.0+ | Development workflow |
| [Node.js](https://nodejs.org/) | v18+ | JavaScript runtime |
| [kubectl](https://kubernetes.io/docs/tasks/tools/) | Latest | Kubernetes CLI |

### Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/ankiitsingh21/ShowSphere.git
cd ShowSphere
```

#### 2. Enable Kubernetes

Enable Kubernetes in Docker Desktop:
- Open Docker Desktop → Settings → Kubernetes → Enable Kubernetes

#### 3. Install NGINX Ingress Controller

```bash
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.2/deploy/static/provider/cloud/deploy.yaml
```

#### 4. Configure Host File

Add the following entry to your hosts file:

**Windows:** `C:\Windows\System32\drivers\etc\hosts`  
**Mac/Linux:** `/etc/hosts`

```
127.0.0.1 ticketing.dev
```

#### 5. Create Kubernetes Secrets

```bash
# JWT Secret
kubectl create secret generic jwt-secret --from-literal=JWT_KEY=your_jwt_secret_key

# Stripe Secret
kubectl create secret generic stripe-secret --from-literal=STRIPE_KEY=your_stripe_secret_key
```

#### 6. Start the Application

```bash
skaffold dev
```

#### 7. Access the Application

Open your browser and navigate to:

```
https://ticketing.dev
```

> **Note:** You may need to type `thisisunsafe` in Chrome to bypass the self-signed certificate warning.

---

## API Reference

### Authentication Service

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/users/signup` | Register new user | No |
| `POST` | `/api/users/signin` | Sign in user | No |
| `POST` | `/api/users/signout` | Sign out user | No |
| `GET` | `/api/users/currentuser` | Get current user | No |

<details>
<summary><strong>Request/Response Examples</strong></summary>

#### Sign Up
```bash
POST /api/users/signup
Content-Type: application/json

{
  "email": "test@test.com",
  "password": "password123"
}
```

**Response (201 Created):**
```json
{
  "id": "64a7b8c9d1e2f3a4b5c6d7e8",
  "email": "test@test.com"
}
```

#### Sign In
```bash
POST /api/users/signin
Content-Type: application/json

{
  "email": "test@test.com",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "id": "64a7b8c9d1e2f3a4b5c6d7e8",
  "email": "test@test.com"
}
```

</details>

---

### Tickets Service

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/tickets` | Create new ticket | Yes |
| `GET` | `/api/tickets` | List all available tickets | No |
| `GET` | `/api/tickets/:id` | Get ticket by ID | No |
| `PUT` | `/api/tickets/:id` | Update ticket | Yes |

<details>
<summary><strong>Request/Response Examples</strong></summary>

#### Create Ticket
```bash
POST /api/tickets
Content-Type: application/json
Cookie: session=<jwt_cookie>

{
  "title": "Concert Ticket",
  "price": 99.99
}
```

**Response (201 Created):**
```json
{
  "id": "64a7b8c9d1e2f3a4b5c6d7e8",
  "title": "Concert Ticket",
  "price": 99.99,
  "userId": "64a7b8c9d1e2f3a4b5c6d7e9",
  "version": 0
}
```

#### List Tickets
```bash
GET /api/tickets
```

**Response (200 OK):**
```json
[
  {
    "id": "64a7b8c9d1e2f3a4b5c6d7e8",
    "title": "Concert Ticket",
    "price": 99.99,
    "userId": "64a7b8c9d1e2f3a4b5c6d7e9",
    "version": 0
  }
]
```

</details>

---

### Orders Service

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/orders` | Create new order | Yes |
| `GET` | `/api/orders` | List user's orders | Yes |
| `GET` | `/api/orders/:id` | Get order by ID | Yes |
| `DELETE` | `/api/orders/:id` | Cancel order | Yes |

<details>
<summary><strong>Request/Response Examples</strong></summary>

#### Create Order
```bash
POST /api/orders
Content-Type: application/json
Cookie: session=<jwt_cookie>

{
  "ticketId": "64a7b8c9d1e2f3a4b5c6d7e8"
}
```

**Response (201 Created):**
```json
{
  "id": "64a7b8c9d1e2f3a4b5c6d7f0",
  "status": "created",
  "expiresAt": "2024-01-15T10:31:00.000Z",
  "ticket": {
    "id": "64a7b8c9d1e2f3a4b5c6d7e8",
    "title": "Concert Ticket",
    "price": 99.99
  },
  "userId": "64a7b8c9d1e2f3a4b5c6d7e9",
  "version": 0
}
```

</details>

---

### Payments Service

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/payments` | Process payment | Yes |

<details>
<summary><strong>Request/Response Examples</strong></summary>

#### Create Payment
```bash
POST /api/payments
Content-Type: application/json
Cookie: session=<jwt_cookie>

{
  "token": "tok_visa",
  "orderId": "64a7b8c9d1e2f3a4b5c6d7f0"
}
```

**Response (201 Created):**
```json
{
  "id": "64a7b8c9d1e2f3a4b5c6d7f1"
}
```

</details>

---

## Event Types

The system uses the following events for inter-service communication:

| Event | Publisher | Subscribers | Purpose |
|-------|-----------|-------------|---------|
| `ticket:created` | Tickets | Orders | Sync ticket data |
| `ticket:updated` | Tickets | Orders | Sync ticket updates |
| `order:created` | Orders | Tickets, Payments, Expiration | Reserve ticket, process payment |
| `order:cancelled` | Orders | Tickets, Payments | Release ticket reservation |
| `expiration:complete` | Expiration | Orders | Trigger order cancellation |
| `payment:created` | Payments | Orders | Mark order as complete |

---

## Testing

Each service includes a comprehensive test suite using Jest and Supertest with an in-memory MongoDB instance.

### Running Tests

```bash
# Run tests for a specific service
cd auth && npm test

# Run tests in CI mode (single run)
cd auth && npm run test:ci

# Run all service tests
cd auth && npm run test:ci
cd tickets && npm run test:ci
cd orders && npm run test:ci
cd payments && npm run test:ci
```

### Test Configuration

- **Test Framework:** Jest with ts-jest preset
- **HTTP Testing:** Supertest
- **Database:** MongoDB Memory Server (in-memory)
- **Mocking:** Jest mocks for NATS wrapper

---

## Screenshots

### Landing Page - Ticket Listing
<p align="center">
  <img src="https://via.placeholder.com/800x400/1a1a2e/eaeaea?text=Ticket+Listing+Page" alt="Landing Page" width="100%">
</p>

### Ticket Purchase Flow
<p align="center">
  <img src="https://via.placeholder.com/800x400/16213e/eaeaea?text=Ticket+Purchase+Page" alt="Ticket Purchase" width="100%">
</p>

### Stripe Payment Integration
<p align="center">
  <img src="https://via.placeholder.com/800x400/0f3460/eaeaea?text=Payment+Page+with+Countdown" alt="Payment Page" width="100%">
</p>

### Order History
<p align="center">
  <img src="https://via.placeholder.com/800x400/1a1a2e/eaeaea?text=Order+History+Page" alt="Order History" width="100%">
</p>

> **Note:** Replace placeholder images with actual screenshots of your application.

---

## Environment Variables

### Auth Service
| Variable | Description |
|----------|-------------|
| `JWT_KEY` | Secret key for JWT signing |
| `MONGO_URI` | MongoDB connection string |

### Tickets / Orders Service
| Variable | Description |
|----------|-------------|
| `JWT_KEY` | Secret key for JWT signing |
| `MONGO_URI` | MongoDB connection string |
| `NATS_URL` | NATS Streaming server URL |
| `NATS_CLUSTER_ID` | NATS cluster identifier |
| `NATS_CLIENT_ID` | NATS client identifier |

### Payments Service
| Variable | Description |
|----------|-------------|
| `JWT_KEY` | Secret key for JWT signing |
| `MONGO_URI` | MongoDB connection string |
| `NATS_URL` | NATS Streaming server URL |
| `NATS_CLUSTER_ID` | NATS cluster identifier |
| `NATS_CLIENT_ID` | NATS client identifier |
| `STRIPE_KEY` | Stripe secret API key |

### Expiration Service
| Variable | Description |
|----------|-------------|
| `NATS_URL` | NATS Streaming server URL |
| `NATS_CLUSTER_ID` | NATS cluster identifier |
| `NATS_CLIENT_ID` | NATS client identifier |
| `REDIS_HOST` | Redis server hostname |

---

## Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository**

2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Make your changes**

4. **Run tests**
   ```bash
   npm run test:ci
   ```

5. **Commit your changes**
   ```bash
   git commit -m "Add amazing feature"
   ```

6. **Push to your branch**
   ```bash
   git push origin feature/amazing-feature
   ```

7. **Open a Pull Request**

### Code Style

- Run `npm run format` before committing to ensure consistent code formatting
- Follow TypeScript best practices
- Write meaningful commit messages
- Include tests for new features

---

## Roadmap

- [ ] Add user profile management
- [ ] Implement ticket categories
- [ ] Add search and filtering
- [ ] Email notifications
- [ ] Admin dashboard
- [ ] Rate limiting
- [ ] Horizontal pod autoscaling
- [ ] Helm charts for deployment
- [ ] Prometheus metrics
- [ ] Distributed tracing with Jaeger

---

## License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

---

## Acknowledgments

- [Stephen Grider](https://www.udemy.com/user/sgslo/) for the microservices course inspiration
- [NATS.io](https://nats.io/) for the excellent messaging system
- [Stripe](https://stripe.com/) for payment infrastructure

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/ankiitsingh21">Ankit Singh</a>
</p>

<p align="center">
  <a href="#showsphere">Back to top</a>
</p>

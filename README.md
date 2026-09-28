## Author

---

**Sri Rakesh Kumar**  
Software Engineer | Full Stack Developer | Backend Developer

### Connect with me

💼 LinkedIn: [Sri Rakesh Kumar](https://www.linkedin.com/in/sri-rakesh-kumar-1567a223b/?skipRedirect=true)

🌐 Portfolio: [My Portfolio](https://sri-rakesh-kumar-portfolio.netlify.app/#home)

---

⭐ If you found this project useful, consider giving it a star.

# NotificationHub 🚀

An event-driven notification platform built using **Node.js**, **GraphQL**, **Kafka**, **MongoDB**, **Docker**, and **AWS**. The system supports asynchronous notification processing with retry mechanisms, email delivery, and real-time scalable architecture.

---

## Live Architecture

```text
Client
   ↓
GraphQL API
   ↓
Authentication (JWT)
   ↓
Notification Service
   ↓
Kafka Producer
   ↓
Kafka Topic
   ↓
Kafka Consumer
   ↓
Email Service
   ↓
Recipient Inbox
```

---

## Features

### Authentication & Security

- User Signup
- User Login
- JWT Authentication
- Password hashing using bcrypt
- Protected APIs

### Notification Features

- Send notification requests
- Welcome email on Signup
- Login alert email
- Email notification delivery
- Notification status tracking

### Event-Driven Architecture

- Kafka Producer
- Kafka Consumer
- Asynchronous processing
- Decoupled services

### Reliability Features

- Retry mechanism for failed notifications
- Configurable retry count
- Notification status updates:
  - PENDING
  - SENT
  - FAILED

### Testing

- Unit tests
- Retry mechanism test cases
- API validation tests

### DevOps

- Dockerized application
- Docker Compose support
- Environment-based configuration
- AWS deployment ready

---

## Tech Stack

| Category         | Technology              |
| ---------------- | ----------------------- |
| Backend          | Node.js                 |
| Language         | TypeScript              |
| API              | GraphQL                 |
| Database         | MongoDB Atlas           |
| Authentication   | JWT                     |
| Message Broker   | KafkaJS                 |
| Email Service    | Nodemailer / Amazon SES |
| Containerization | Docker                  |
| Deployment       | AWS EC2                 |
| Testing          | Jest                    |

---

## Project Structure

```text
notification_hub/

├── src/
│   ├── config/
│   ├── graphql/
│   ├── middleware/
│   ├── models/
│   ├── services/
│   ├── kafka/
│   ├── templates/
│   ├── utils/
│   └── server.ts
│
├── tests/
│
├── Dockerfile
├── docker-compose.yml
├── package.json
├── tsconfig.json
├── .env.example
└── README.md
```

---

## Environment Variables

Create a `.env` file:

```env
PORT=3000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

KAFKA_BROKER=kafka:9092

SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
EMAIL_FROM=your_email@gmail.com
```

---

## Installation

Clone repository:

```bash
git clone <repository-url>
```

Move into project:

```bash
cd notification_hub
```

Install dependencies:

```bash
npm install
```

Run locally:

```bash
npm run dev
```

---

## Docker Setup

Build and start services:

```bash
docker compose up --build
```

Stop services:

```bash
docker compose down
```

---

## API Flow

### Signup

```text
User Signup
      ↓
Create User
      ↓
Generate JWT
      ↓
Publish Kafka Event
      ↓
Consumer Processes Event
      ↓
Welcome Email Sent
```

### Login

```text
User Login
      ↓
Validate Credentials
      ↓
Generate JWT
      ↓
Publish Kafka Event
      ↓
Consumer Processes Event
      ↓
Login Alert Email Sent
```

### Notification Flow

```text
Create Notification
      ↓
Kafka Producer
      ↓
Kafka Topic
      ↓
Kafka Consumer
      ↓
Send Email
      ↓
Update Status
```

---

## Retry Mechanism

```text
Email Failure
      ↓
Retry Count ++
      ↓
Retry < Max Limit ?
      ↓
Yes
      ↓
Republish Event
      ↓
Retry Again

Else

FAILED
```

---

## Deployment

Application deployed using:

- AWS EC2
- Docker Compose
- MongoDB Atlas
- Amazon SES

---

## Future Enhancements

- React frontend dashboard
- SMS notifications
- Push notifications
- Notification analytics
- Admin dashboard
- Monitoring with CloudWatch
- CI/CD pipeline

---

## Key Learning Outcomes

- Event-driven architecture
- Kafka integration
- JWT authentication
- Docker containerization
- Retry strategies
- Cloud deployment using AWS
- Scalable backend design



- testing pr commits 
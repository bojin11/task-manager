# 📝 Task Manager

A full-stack Task Manager application built with React, Apollo Client, GraphQL, Prisma, and Express.

---

## 📦 Project Structure

```
task-manager/
├── client/     # React frontend with Apollo Client
├── server/     # Express backend with GraphQL and Prisma
└── prisma/     # Prisma schema and migration files
```

---

## ⚙️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/task-manager.git
cd task-manager
```

---

### 2. Start the Server

```bash
cd server
npm install              # Install backend dependencies
npx tsc                  # Compile TypeScript to JavaScript
node dist/server.js      # Start the GraphQL server
```

Server runs at: [http://localhost:3001/graphql](http://localhost:3001/graphql)

---

### 3. Start the Client

```bash
cd client
npm install              # Install frontend dependencies
npm start                # Start React development server
```

Client runs at: [http://localhost:3000](http://localhost:3000)

---

### 4. Open Prisma Studio (View/Edit DB)

```bash
cd server
npx prisma studio
```

Studio runs at: [http://localhost:5555](http://localhost:5555)

---

## 🧪 Tech Stack

- **Frontend**: React, TypeScript, Apollo Client
- **Backend**: Express, GraphQL, Apollo Server, Prisma, SQLite (or other DB)
- **Tooling**: Prisma Studio, TypeScript, Node.js

---

## 💡 Notes

- Make sure your database is set up before starting the server.
- You can modify the schema in `prisma/schema.prisma` and re-generate types with:
  ```bash
  npx prisma generate
  ```

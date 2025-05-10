import express from "express";
import { graphqlHTTP } from "express-graphql";
import { buildSchema } from "graphql";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const schema = buildSchema(`
  type Task {
    id: ID!
    title: String!
    completed: Boolean!
    createdAt: String!
    updatedAt: String!
  }

  type Query {
    tasks: [Task]
    task(id: ID!): Task
  }

  type Mutation {
    createTask(title: String!): Task
    deleteTask(id: ID!): Boolean
    updateTask(id: ID!, title: String, completed: Boolean): Task
  }
`);

const root = {
  tasks: async () => await prisma.task.findMany(),

  task: async ({ id }: { id: number }) => {
    return await prisma.task.findUnique({
      where: { id: Number(id) },
    });
  },

  createTask: async ({ title }: { title: string }) => {
    return await prisma.task.create({
      data: { title },
    });
  },

  deleteTask: async ({ id }: { id: number }) => {
    await prisma.task.delete({
      where: { id: Number(id) },
    });
    return true;
  },

  updateTask: async ({
    id,
    title,
    completed,
  }: {
    id: number;
    title?: string;
    completed?: boolean;
  }) => {
    return await prisma.task.update({
      where: { id: Number(id) },
      data: { title, completed },
    });
  },
};

const app = express();
app.use(cors());

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    rootValue: root,
    graphiql: true,
  })
);

app.listen(3001, () =>
  console.log("Server is running on http://localhost:3001/graphql")
);

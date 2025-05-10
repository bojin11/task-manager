"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_graphql_1 = require("express-graphql");
const graphql_1 = require("graphql");
const cors_1 = __importDefault(require("cors"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const schema = (0, graphql_1.buildSchema)(`
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
    task: async ({ id }) => {
        return await prisma.task.findUnique({
            where: { id: Number(id) },
        });
    },
    createTask: async ({ title }) => {
        return await prisma.task.create({
            data: { title },
        });
    },
    deleteTask: async ({ id }) => {
        await prisma.task.delete({
            where: { id: Number(id) },
        });
        return true;
    },
    updateTask: async ({ id, title, completed, }) => {
        return await prisma.task.update({
            where: { id: Number(id) },
            data: { title, completed },
        });
    },
};
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use("/graphql", (0, express_graphql_1.graphqlHTTP)({
    schema,
    rootValue: root,
    graphiql: true,
}));
app.listen(3001, () => console.log("Server is running on http://localhost:3001/graphql"));

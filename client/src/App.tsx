import React, { useState } from "react";
import {
  useQuery,
  useLazyQuery,
  useMutation,
  gql,
  ApolloProvider,
  ApolloClient,
  InMemoryCache,
} from "@apollo/client";
import "./App.css";

// GraphQL operations
const GET_TASKS = gql`
  query {
    tasks {
      id
      title
      completed
      createdAt
      updatedAt
    }
  }
`;

const GET_TASK_BY_ID = gql`
  query GetTask($id: ID!) {
    task(id: $id) {
      id
      title
      completed
      createdAt
      updatedAt
    }
  }
`;

const CREATE_TASK = gql`
  mutation CreateTask($title: String!) {
    createTask(title: $title) {
      id
      title
      completed
      createdAt
      updatedAt
    }
  }
`;

const DELETE_TASK = gql`
  mutation DeleteTask($id: ID!) {
    deleteTask(id: $id)
  }
`;

const UPDATE_TASK = gql`
  mutation UpdateTask($id: ID!, $title: String, $completed: Boolean) {
    updateTask(id: $id, title: $title, completed: $completed) {
      id
      title
      completed
      createdAt
      updatedAt
    }
  }
`;

// TypeScript interfaces
interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

interface GetTasksData {
  tasks: Task[];
}

interface CreateTaskVars {
  title: string;
}

interface UpdateTaskVars {
  id: string;
  title?: string;
  completed?: boolean;
}

interface DeleteTaskVars {
  id: string;
}

interface GetTaskByIdVars {
  id: string;
}

function App() {
  const { loading, error, data } = useQuery<GetTasksData>(GET_TASKS);
  const [getTaskById, { data: taskData }] = useLazyQuery<
    { task: Task },
    GetTaskByIdVars
  >(GET_TASK_BY_ID);
  const [createTask] = useMutation<any, CreateTaskVars>(CREATE_TASK);
  const [deleteTask] = useMutation<any, DeleteTaskVars>(DELETE_TASK);
  const [updateTask] = useMutation<any, UpdateTaskVars>(UPDATE_TASK);

  const [title, setTitle] = useState("");
  const [taskIdToFind, setTaskIdToFind] = useState("");

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const handleCreateTask = () => {
    if (!title.trim()) return;
    createTask({
      variables: { title },
      refetchQueries: [{ query: GET_TASKS }],
    });
    setTitle("");
  };

  const handleDeleteTask = (id: string) => {
    deleteTask({
      variables: { id },
      refetchQueries: [{ query: GET_TASKS }],
    });
  };

  const toggleTaskCompletion = (task: Task) => {
    updateTask({
      variables: { id: task.id, completed: !task.completed },
      refetchQueries: [{ query: GET_TASKS }],
    });
  };

  const handleUpdateTitle = (task: Task) => {
    const newTitle = prompt("Enter new title:", task.title);
    if (newTitle !== null) {
      updateTask({
        variables: { id: task.id, title: newTitle },
        refetchQueries: [{ query: GET_TASKS }],
      });
    }
  };

  const handleFetchTaskById = () => {
    if (!taskIdToFind.trim()) return;
    getTaskById({ variables: { id: taskIdToFind } });
  };

  return (
    <div>
      <h1>Task Manager</h1>

      {/* Create Task */}
      <div>
        <input
          type="text"
          placeholder="New task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button onClick={handleCreateTask}>Create</button>
      </div>

      {/* Search Task by ID */}
      <div style={{ marginTop: 20 }}>
        <input
          type="text"
          placeholder="Enter task ID"
          value={taskIdToFind}
          onChange={(e) => setTaskIdToFind(e.target.value)}
        />
        <button onClick={handleFetchTaskById}>Find Task</button>
      </div>

      {/* Show Single Task */}
      {taskData?.task && (
        <div style={{ marginTop: 10 }}>
          <h3>Found Task:</h3>
          <p>
            <strong>{taskData.task.title}</strong>
          </p>
          <p>Completed: {taskData.task.completed ? "Yes" : "No"}</p>
          <p>Created: {new Date(taskData.task.createdAt).toLocaleString()}</p>
          <p>Updated: {new Date(taskData.task.updatedAt).toLocaleString()}</p>
        </div>
      )}

      {/* Task List */}
      <ul>
        {data?.tasks.map((task) => (
          <li key={task.id}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleTaskCompletion(task)}
            />
            <strong>{task.title}</strong>
            <small style={{ marginLeft: 8 }}>
              (Created: {new Date(task.createdAt).toLocaleString()}, Updated:{" "}
              {new Date(task.updatedAt).toLocaleString()})
            </small>
            <button onClick={() => handleUpdateTitle(task)}>Edit</button>
            <button onClick={() => handleDeleteTask(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

const client = new ApolloClient({
  uri: "http://localhost:3001/graphql",
  cache: new InMemoryCache(),
});

export default function ApolloApp() {
  return (
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  );
}

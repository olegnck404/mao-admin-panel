// src/infrastructure/api/taskApi.ts

import axios from "axios";
import { Task } from "../../domain/entities/Task";

// Используем переменную окружения, для удобства в докере
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const API_URL = `${API_BASE_URL}/tasks`;

export const fetchTasks = async (): Promise<Task[]> => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const createTask = async (task: Task): Promise<Task> => {
  const response = await axios.post(API_URL, task);
  return response.data;
};

export const updateTask = async (id: string, task: Partial<Task>): Promise<Task> => {
  const response = await axios.put(`${API_URL}/${id}`, task);
  return response.data;
};

export const deleteTask = async (id: string): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};
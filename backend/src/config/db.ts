import mongoose from "mongoose";

export async function connectDB() {
  const uri = process.env.MONGO_URI || "mongodb://localhost:27017/mao-admin-panel";
  await mongoose.connect(uri);
  console.log("MongoDB connected");
}

type TaskType = 'personal' | 'global';

interface ITask extends mongoose.Document {
  type: TaskType;
  title: string;
  description?: string;
  dueDate: Date;
  priority: 'Low' | 'Medium' | 'High';
  status: 'Todo' | 'In Progress' | 'Done';
  assignees: string[]; // for global
  assignee?: string;   // for personal
  completedBy: string[];
}
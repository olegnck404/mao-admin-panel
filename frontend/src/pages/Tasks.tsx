import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  Button,
  Checkbox,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import axios from "axios";
import { useEffect, useState } from "react";

interface Task {
  _id: string;
  title: string;
  isGlobal: boolean;
  assignees: string[]; // для общих задач
  assignee?: string; // для личных
  dueDate: string; // ISO string
  priority: "High" | "Medium" | "Low";
  status: "Todo" | "In Progress" | "Done";
  completedBy: string[]; // кто выполнил
}

interface User {
  _id: string;
  name: string;
}

export default function Tasks() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterUser, setFilterUser] = useState<string>("");
  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>([]);

  const [newTask, setNewTask] = useState<Partial<Task>>({
    title: "",
    isGlobal: false,
    assignees: [],
    assignee: "",
    dueDate: new Date().toISOString(),
    priority: "Medium",
    status: "Todo",
    completedBy: [],
  });

  // Загрузка юзеров с бекенда
  const fetchUsers = async () => {
    try {
      const res = await axios.get<User[]>("/api/users");
      setUsers(res.data);
    } catch (error) {
      console.error("Failed to fetch users", error);
    }
  };

  // Загрузка тасков с бекенда, с дефолтами для полей
  const fetchTasks = async () => {
    try {
      const res = await axios.get<Task[]>("/api/task");
      const tasksWithDefaults = res.data.map((task) => ({
        ...task,
        completedBy: task.completedBy || [],
        assignees: task.assignees || [],
      }));
      setTasks(tasksWithDefaults);
    } catch (error) {
      console.error("Failed to fetch tasks", error);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchTasks();
  }, []);

  // Фильтрация тасков по ID и пользователю (ассигни)
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task._id.includes(searchQuery);
    const matchesUser =
      !filterUser ||
      (!task.isGlobal && task.assignee === filterUser) ||
      (task.isGlobal && task.assignees.includes(filterUser));
    return matchesSearch && matchesUser;
  });

  // Добавление новой задачи
  const handleAddTask = async () => {
    if (
      !newTask.title ||
      (!newTask.assignee && !newTask.isGlobal) ||
      (newTask.isGlobal &&
        (!newTask.assignees || newTask.assignees.length === 0))
    ) {
      alert("Please fill all required fields");
      return;
    }
    try {
      const taskToSend = {
        ...newTask,
        dueDate:
          typeof newTask.dueDate === "string"
            ? newTask.dueDate
            : newTask.dueDate?.toISOString(),
        assignees: newTask.isGlobal ? newTask.assignees : [],
        isGlobal: newTask.isGlobal,
      };
      await axios.post("/api/task", taskToSend);
      setOpenDialog(false);
      setNewTask({
        title: "",
        isGlobal: false,
        assignees: [],
        assignee: "",
        dueDate: new Date().toISOString(),
        priority: "Medium",
        status: "Todo",
        completedBy: [],
      });
      fetchTasks();
    } catch (error) {
      console.error("Failed to add task", error);
    }
  };

  // Удаление выбранных задач
  const handleDeleteTasks = async (ids: string[]) => {
    try {
      await Promise.all(ids.map((id) => axios.delete(`/api/task/${id}`)));
      setSelectedTaskIds([]);
      fetchTasks();
    } catch (error) {
      console.error("Failed to delete tasks", error);
    }
  };

  // Тоггл статуса персональной задачи (выполнено/не выполнено)
  const togglePersonalComplete = async (task: Task) => {
    try {
      const isCompleted = task.completedBy.includes(task.assignee || "");
      const updatedCompletedBy = isCompleted ? [] : [task.assignee || ""];
      const updatedStatus = isCompleted ? "Todo" : "Done";

      await axios.put(`/api/task/${task._id}`, {
        completedBy: updatedCompletedBy,
        status: updatedStatus,
      });
      fetchTasks();
    } catch (error) {
      console.error("Failed to update task", error);
    }
  };

  // Тоггл статуса конкретного работника в общей задаче
  const toggleCommonComplete = async (task: Task, user: string) => {
    try {
      let updatedCompletedBy = task.completedBy.includes(user)
        ? task.completedBy.filter((u) => u !== user)
        : [...task.completedBy, user];
      let updatedStatus =
        updatedCompletedBy.length === task.assignees.length
          ? "Done"
          : "In Progress";

      await axios.put(`/api/task/${task._id}`, {
        completedBy: updatedCompletedBy,
        status: updatedStatus,
      });
      fetchTasks();
    } catch (error) {
      console.error("Failed to update task", error);
    }
  };

  // Отметить все/снять отметку со всех работников общей задачи
  const toggleCompleteAll = async (task: Task) => {
    try {
      const allCompleted = task.completedBy.length === task.assignees.length;
      const updatedCompletedBy = allCompleted ? [] : [...task.assignees];
      const updatedStatus = allCompleted ? "Todo" : "Done";

      await axios.put(`/api/task/${task._id}`, {
        completedBy: updatedCompletedBy,
        status: updatedStatus,
      });
      fetchTasks();
    } catch (error) {
      console.error("Failed to update task", error);
    }
  };

  // Выделение задач для удаления
  const toggleSelectTask = (taskId: string) => {
    setSelectedTaskIds((prev) =>
      prev.includes(taskId)
        ? prev.filter((id) => id !== taskId)
        : [...prev, taskId]
    );
  };

  // Цвета для приоритета и статуса
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return theme.palette.error.main;
      case "Medium":
        return theme.palette.warning.main;
      case "Low":
        return theme.palette.success.main;
      default:
        return theme.palette.primary.main;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Todo":
        return theme.palette.info.main;
      case "In Progress":
        return theme.palette.warning.main;
      case "Done":
        return theme.palette.success.main;
      default:
        return theme.palette.primary.main;
    }
  };

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Фильтры и поиск */}
      <Box
        sx={{
          mb: 3,
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "stretch", sm: "center" },
          gap: 2,
        }}
      >
        <TextField
          sx={{ flex: 1 }}
          placeholder="Search by Task ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <SearchIcon sx={{ color: "neutral.main", mr: 1 }} />
            ),
          }}
        />
        <FormControl sx={{ minWidth: 180 }}>
          <InputLabel>Filter by User</InputLabel>
          <Select
            value={filterUser}
            label="Filter by User"
            onChange={(e) => setFilterUser(e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            {users.map((user) => (
              <MenuItem key={user._id} value={user.name}>
                {user.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          variant="contained"
          color="error"
          startIcon={<DeleteIcon />}
          disabled={selectedTaskIds.length === 0}
          onClick={() => handleDeleteTasks(selectedTaskIds)}
          sx={{ minWidth: 130 }}
        >
          Delete Selected
        </Button>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
          sx={{ minWidth: 130 }}
        >
          Add Task
        </Button>
      </Box>

      {/* Таблица задач */}
      <TableContainer component={Paper} sx={{ flex: 1 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox" />
              <TableCell>Title</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Assignee(s)</TableCell>
              <TableCell>Due Date</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Completion</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTasks.map((task) => {
              const isSelected = selectedTaskIds.includes(task._id);
              const completedBy = task.completedBy || [];
              const assignees = task.assignees || [];

              return (
                <TableRow key={task._id} hover selected={isSelected}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={isSelected}
                      onChange={() => toggleSelectTask(task._id)}
                    />
                  </TableCell>
                  <TableCell>{task.title}</TableCell>
                  <TableCell>{task.isGlobal ? "Common" : "Personal"}</TableCell>
                  <TableCell>
                    {task.isGlobal ? (
                      <Box>
                        <Button
                          onClick={() => toggleCompleteAll(task)}
                          size="small"
                          variant="outlined"
                          sx={{ mb: 1 }}
                        >
                          {completedBy.length === assignees.length
                            ? "Unmark All"
                            : "Mark All Done"}
                        </Button>
                        <Box>
                          {assignees.map((user) => (
                            <Box
                              key={user}
                              sx={{ display: "flex", alignItems: "center" }}
                            >
                              <Checkbox
                                checked={completedBy.includes(user)}
                                onChange={() =>
                                  toggleCommonComplete(task, user)
                                }
                              />
                              <Typography>{user}</Typography>
                            </Box>
                          ))}
                        </Box>
                      </Box>
                    ) : (
                      <Checkbox
                        checked={completedBy.includes(task.assignee || "")}
                        onChange={() => togglePersonalComplete(task)}
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    {new Date(task.dueDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={task.priority}
                      size="small"
                      sx={{
                        bgcolor: alpha(getPriorityColor(task.priority), 0.1),
                        color: getPriorityColor(task.priority),
                        fontWeight: 600,
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={task.status}
                      size="small"
                      sx={{
                        bgcolor: alpha(getStatusColor(task.status), 0.1),
                        color: getStatusColor(task.status),
                        fontWeight: 600,
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    {task.isGlobal ? (
                      <Typography>
                        {completedBy.length}/{assignees.length} done
                      </Typography>
                    ) : (
                      <Typography>
                        {completedBy.length === 1 ? "Done" : "Not done"}
                      </Typography>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Диалог добавления задачи */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add New Task</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
            <TextField
              label="Title"
              fullWidth
              value={newTask.title}
              onChange={(e) =>
                setNewTask({ ...newTask, title: e.target.value })
              }
            />
            <FormControl fullWidth>
              <InputLabel>Type</InputLabel>
              <Select
                value={newTask.isGlobal ? "common" : "personal"}
                label="Type"
                onChange={(e) =>
                  setNewTask({
                    ...newTask,
                    isGlobal: e.target.value === "common",
                    assignee: "",
                    assignees: [],
                  })
                }
              >
                <MenuItem value="personal">Personal</MenuItem>
                <MenuItem value="common">Common</MenuItem>
              </Select>
            </FormControl>
            {newTask.isGlobal ? (
              <FormControl fullWidth>
                <InputLabel>Assignees</InputLabel>
                <Select
                  multiple
                  value={newTask.assignees || []}
                  onChange={(e) =>
                    setNewTask({
                      ...newTask,
                      assignees: e.target.value as string[],
                    })
                  }
                  input={<OutlinedInput label="Assignees" />}
                  renderValue={(selected) => (selected as string[]).join(", ")}
                >
                  {users.map((user) => (
                    <MenuItem key={user._id} value={user.name}>
                      <Checkbox
                        checked={newTask.assignees?.includes(user.name)}
                      />
                      <ListItemText primary={user.name} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : (
              <FormControl fullWidth>
                <InputLabel>Assignee</InputLabel>
                <Select
                  value={newTask.assignee || ""}
                  label="Assignee"
                  onChange={(e) =>
                    setNewTask({ ...newTask, assignee: e.target.value })
                  }
                >
                  {users.map((user) => (
                    <MenuItem key={user._id} value={user.name}>
                      {user.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Due Date"
                value={newTask.dueDate ? new Date(newTask.dueDate) : null}
                onChange={(date) =>
                  setNewTask({
                    ...newTask,
                    dueDate: date
                      ? date.toISOString()
                      : new Date().toISOString(),
                  })
                }
                slotProps={{ textField: { fullWidth: true, margin: "dense" } }}
              />
            </LocalizationProvider>
            <FormControl fullWidth>
              <InputLabel>Priority</InputLabel>
              <Select
                value={newTask.priority || "Medium"}
                label="Priority"
                onChange={(e) =>
                  setNewTask({
                    ...newTask,
                    priority: e.target.value as Task["priority"],
                  })
                }
              >
                <MenuItem value="High">High</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="Low">Low</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={newTask.status || "Todo"}
                label="Status"
                onChange={(e) =>
                  setNewTask({
                    ...newTask,
                    status: e.target.value as Task["status"],
                  })
                }
              >
                <MenuItem value="Todo">Todo</MenuItem>
                <MenuItem value="In Progress">In Progress</MenuItem>
                <MenuItem value="Done">Done</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleAddTask} variant="contained" color="primary">
            Add Task
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

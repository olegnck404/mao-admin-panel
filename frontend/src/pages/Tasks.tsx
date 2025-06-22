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
import { useAuth } from "../contexts/AuthContext";

interface Task {
  _id: string;
  title: string;
  isGlobal: boolean;
  assignees: string[]; // for global tasks
  assignee?: string; // for personal tasks
  dueDate: string; // ISO string
  priority: "High" | "Medium" | "Low";
  status: "Todo" | "In Progress" | "Done";
  completedBy: string[]; // who completed
}

interface User {
  _id: string;
  name: string;
  completedBy: [],
}

export default function Tasks() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { user } = useAuth();

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

  const [addTaskError, setAddTaskError] = useState<string>("");

  // Loading users from the backend
  const fetchUsers = async () => {
    try {
      const res = await axios.get<User[]>("/api/users");
      setUsers(res.data);
    } catch (error) {
      console.error("Failed to fetch users", error);
    }
  };

  // Loading tasks from the backend, with defaults for fields
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

  useEffect(() => {
    console.log("TASKS FROM BACKEND:", tasks);
  }, [tasks]);

  // Filtering tasks by user (for an employee — only their own and global)
  const filteredTasks = tasks.filter((task) => {
    if (!user) return false;
    if (user.role === "user") {
      return (
        (task.isGlobal && task.assignees.includes(user.name)) ||
        (!task.isGlobal && task.assignee === user.name)
      );
    }
    // For admin/manager — filtering by search and filter
    const matchesSearch = task._id.includes(searchQuery);
    const matchesUser =
      !filterUser ||
      (!task.isGlobal && task.assignee === filterUser) ||
      (task.isGlobal && task.assignees.includes(filterUser));
    return matchesSearch && matchesUser;
  });

  // Adding a new task
  const isTaskFormValid =
    !!newTask.title &&
    ((newTask.isGlobal && newTask.assignees && newTask.assignees.length > 0) ||
      (!newTask.isGlobal && newTask.assignee));

  const handleAddTask = async () => {
    setAddTaskError("");
    alert("handleAddTask called");
    if (!isTaskFormValid) {
      setAddTaskError("Please fill all required fields");
      return;
    }
    try {
      const taskToSend = {
        ...newTask,
        dueDate: newTask.dueDate || new Date().toISOString(),
        assignees: newTask.isGlobal
          ? newTask.assignees
          : newTask.assignee
          ? [newTask.assignee]
          : [],
        isGlobal: newTask.isGlobal,
      };
      console.log("SENDING TASK:", taskToSend);
      const res = await axios.post("/api/task", taskToSend);
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
    } catch (error: any) {
      setAddTaskError(error?.response?.data?.message || "Failed to add task");
      console.error("Failed to add task", error);
    }
  };

  // Deleting selected tasks
  const handleDeleteTasks = async (ids: string[]) => {
    try {
      await Promise.all(ids.map((id) => axios.delete(`/api/task/${id}`)));
      setSelectedTaskIds([]);
      fetchTasks();
    } catch (error) {
      console.error("Failed to delete tasks", error);
    }
  };

  // Toggle status of a personal task (completed/not completed)
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

  // Toggle status of a specific employee in a global task
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

  // Mark all/unmark all employees in a global task
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

  // Selecting tasks for deletion
  const toggleSelectTask = (taskId: string) => {
    setSelectedTaskIds((prev) =>
      prev.includes(taskId)
        ? prev.filter((id) => id !== taskId)
        : [...prev, taskId]
    );
  };

  // Colors for priority and status
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
      {/* Filters and search */}
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
        {/* Only for admin/manager filter by user and buttons */}
        {user?.role !== "user" && (
          <>
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
          </>
        )}
      </Box>

      {/* Tasks table */}
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

      {/* Add task dialog — only for admin/manager */}
      {user?.role !== "user" && (
        <Dialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Add New Task</DialogTitle>
          <DialogContent>
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}
            >
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
                    renderValue={(selected) =>
                      (selected as string[]).join(", ")
                    }
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
                  slotProps={{
                    textField: { fullWidth: true, margin: "dense" },
                  }}
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
              {addTaskError && (
                <Typography color="error" sx={{ mt: 1, mb: 1 }}>
                  {addTaskError}
                </Typography>
              )}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button
              onClick={handleAddTask}
              variant="contained"
              color="primary"
              disabled={!isTaskFormValid}
            >
              Add Task
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
}

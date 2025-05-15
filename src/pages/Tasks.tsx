import AddIcon from "@mui/icons-material/Add";
import FilterListIcon from "@mui/icons-material/FilterList";
import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  InputLabel,
  ListItemText,
  MenuItem,
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
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import axios from "axios";
import { useEffect, useState } from "react";

interface Task {
  _id: string;
  title: string;
  assignee?: string;
  dueDate: string;
  priority: "High" | "Medium" | "Low";
  status: "Todo" | "In Progress" | "Done";
  isCommon: boolean;
  assigneesCommon?: string[];
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
  const [filterUser, setFilterUser] = useState<string | "">("");
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);

  const [newTask, setNewTask] = useState<Partial<Task>>({
    title: "",
    dueDate: new Date().toISOString(),
    priority: "Medium",
    status: "Todo",
    isCommon: false,
    assigneesCommon: [],
  });

  useEffect(() => {
    fetchUsers();
    fetchTasks();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get<User[]>("/api/users");
      setUsers(res.data);
    } catch {
      // handle error
    }
  };

  const fetchTasks = async () => {
    try {
      const res = await axios.get<Task[]>("/api/task");
      setTasks(res.data);
    } catch {
      // handle error
    }
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesUser = filterUser
      ? task.isCommon
        ? task.assigneesCommon?.includes(filterUser)
        : task.assignee === filterUser
      : true;
    return matchesSearch && matchesUser;
  });

  const handleSelectTask = (id: string) => {
    setSelectedTasks((prev) =>
      prev.includes(id) ? prev.filter((tid) => tid !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = filteredTasks
        .filter((t) => t.isCommon)
        .flatMap((t) => [t._id]);
      setSelectedTasks(allIds);
    } else {
      setSelectedTasks([]);
    }
  };

  const handleDeleteSelected = async () => {
    try {
      await Promise.all(
        selectedTasks.map((id) => axios.delete(`/api/task/${id}`))
      );
      setSelectedTasks([]);
      fetchTasks();
    } catch {
      // handle error
    }
  };

  const handleMarkDoneSelected = async () => {
    try {
      await Promise.all(
        selectedTasks.map((id) =>
          axios.put(`/api/task/${id}`, { status: "Done" })
        )
      );
      setSelectedTasks([]);
      fetchTasks();
    } catch {
      // handle error
    }
  };

  const handleAddTask = async () => {
    try {
      let taskToCreate = { ...newTask };
      if (
        taskToCreate.isCommon &&
        (!taskToCreate.assigneesCommon ||
          taskToCreate.assigneesCommon.length === 0)
      ) {
        alert("Please select at least one assignee for common task");
        return;
      }
      if (!taskToCreate.isCommon && !taskToCreate.assignee) {
        alert("Please select assignee for personal task");
        return;
      }
      if (typeof taskToCreate.dueDate === "object") {
        taskToCreate.dueDate = (taskToCreate.dueDate as Date).toISOString();
      }
      await axios.post("/api/task", taskToCreate);
      setOpenDialog(false);
      setNewTask({
        title: "",
        dueDate: new Date().toISOString(),
        priority: "Medium",
        status: "Todo",
        isCommon: false,
        assigneesCommon: [],
      });
      fetchTasks();
    } catch {
      // handle error
    }
  };

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
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
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <SearchIcon sx={{ color: "neutral.main", mr: 1 }} />
            ),
          }}
        />

        <FormControl sx={{ minWidth: 180 }}>
          <InputLabel>User Filter</InputLabel>
          <Select
            value={filterUser}
            label="User Filter"
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
          color="primary"
          startIcon={<FilterListIcon />}
          onClick={() => {
            setSearchQuery("");
            setFilterUser("");
            setSelectedTasks([]);
            fetchTasks();
          }}
          sx={{ minWidth: 120 }}
        >
          Reset Filters
        </Button>

        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
          sx={{ minWidth: 120 }}
        >
          Add Task
        </Button>
      </Box>

      <Box sx={{ mb: 2 }}>
        {selectedTasks.length > 0 && (
          <>
            <Button color="error" onClick={handleDeleteSelected} sx={{ mr: 1 }}>
              Delete Selected
            </Button>
            <Button color="success" onClick={handleMarkDoneSelected}>
              Mark Done Selected
            </Button>
          </>
        )}
      </Box>

      {isMobile ? (
        <Grid container spacing={2}>
          {filteredTasks.map((task) => (
            <Grid item xs={12} key={task._id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    {task.isCommon && (
                      <Checkbox
                        checked={selectedTasks.includes(task._id)}
                        onChange={() => handleSelectTask(task._id)}
                      />
                    )}
                    <Typography
                      variant="subtitle1"
                      fontWeight={600}
                      sx={{ ml: task.isCommon ? 1 : 0 }}
                    >
                      {task.title}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Assignee:{" "}
                    {task.isCommon
                      ? `Common (${task.assigneesCommon?.length || 0} users)`
                      : task.assignee}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Due: {new Date(task.dueDate).toLocaleDateString()}
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                    <Chip
                      label={task.priority}
                      size="small"
                      sx={{
                        bgcolor: alpha(theme.palette.error.main, 0.1),
                        color: theme.palette.error.main,
                        fontWeight: 600,
                      }}
                    />
                    <Chip
                      label={task.status}
                      size="small"
                      sx={{
                        bgcolor: alpha(theme.palette.success.main, 0.1),
                        color: theme.palette.success.main,
                        fontWeight: 600,
                      }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <TableContainer component={Paper} sx={{ flex: 1 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={
                      selectedTasks.length > 0 &&
                      selectedTasks.length <
                        filteredTasks.filter((t) => t.isCommon).length
                    }
                    checked={
                      filteredTasks.length > 0 &&
                      selectedTasks.length ===
                        filteredTasks.filter((t) => t.isCommon).length
                    }
                    onChange={(e) => handleSelectAll(e.target.checked)}
                  />
                </TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Assignee</TableCell>
                <TableCell>Due Date</TableCell>
                <TableCell>Priority</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTasks.map((task) => (
                <TableRow key={task._id} hover>
                  <TableCell padding="checkbox">
                    {task.isCommon ? (
                      <Checkbox
                        checked={selectedTasks.includes(task._id)}
                        onChange={() => handleSelectTask(task._id)}
                      />
                    ) : null}
                  </TableCell>
                  <TableCell>{task.title}</TableCell>
                  <TableCell>
                    {task.isCommon
                      ? `Common (${task.assigneesCommon?.length || 0} users)`
                      : task.assignee}
                  </TableCell>
                  <TableCell>
                    {new Date(task.dueDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={task.priority}
                      size="small"
                      sx={{
                        bgcolor: alpha(theme.palette.error.main, 0.1),
                        color: theme.palette.error.main,
                        fontWeight: 600,
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={task.status}
                      size="small"
                      sx={{
                        bgcolor: alpha(theme.palette.success.main, 0.1),
                        color: theme.palette.success.main,
                        fontWeight: 600,
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

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
              value={newTask.title || ""}
              onChange={(e) =>
                setNewTask({ ...newTask, title: e.target.value })
              }
            />

            <FormControl fullWidth>
              <InputLabel>Is Common Task?</InputLabel>
              <Select
                value={newTask.isCommon ? "yes" : "no"}
                label="Is Common Task?"
                onChange={(e) =>
                  setNewTask({ ...newTask, isCommon: e.target.value === "yes" })
                }
              >
                <MenuItem value="no">No (Personal Task)</MenuItem>
                <MenuItem value="yes">Yes (Common Task)</MenuItem>
              </Select>
            </FormControl>

            {!newTask.isCommon ? (
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
            ) : (
              <FormControl fullWidth>
                <InputLabel>Assignees (Common Task)</InputLabel>
                <Select
                  multiple
                  value={newTask.assigneesCommon || []}
                  onChange={(e) => {
                    const value = e.target.value;
                    setNewTask({
                      ...newTask,
                      assigneesCommon:
                        typeof value === "string" ? value.split(",") : value,
                    });
                  }}
                  renderValue={(selected) => (selected as string[]).join(", ")}
                >
                  {users.map((user) => (
                    <MenuItem key={user._id} value={user.name}>
                      <Checkbox
                        checked={
                          newTask.assigneesCommon?.includes(user.name) || false
                        }
                      />
                      <ListItemText primary={user.name} />
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
                  setNewTask({ ...newTask, dueDate: date?.toISOString() || "" })
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

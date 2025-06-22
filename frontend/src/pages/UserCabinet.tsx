import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AssignmentIcon from "@mui/icons-material/Assignment";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import ErrorIcon from "@mui/icons-material/Error";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import {
    Avatar,
    Box,
    Button,
    Chip,
    CircularProgress,
    Grid,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Paper,
    Stack,
    Typography
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { ProtectedRoute, useAuth } from "../contexts/AuthContext";

type Task = {
  _id: string;
  title: string;
  description?: string;
  dueDate: string;
  priority: "Low" | "Medium" | "High";
  status: "Todo" | "In Progress" | "Done";
};

type Attendance = {
  _id: string;
  employeeName: string;
  date: string;
  checkIn: string;
  checkOut: string;
};

type RewardFine = {
  _id: string;
  employeeName: string;
  date: string;
  type: "reward" | "penalty";
  amount: number;
  reason?: string;
};

type Stats = {
  totalRewards: number;
  totalPenalties: number;
  netBalance: number;
};

export default function UserCabinet() {
  const { user } = useAuth();

  const [tasks, setTasks] = useState<Task[] | null>(null);
  const [attendance, setAttendance] = useState<Attendance[] | null>(null);
  const [rewards, setRewards] = useState<RewardFine[] | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function fetchAll() {
      setLoading(true);
      setError(null);
      try {
        const [tasksRes, attRes, rewRes, statsRes] = await Promise.all([
          axios.get<Task[]>("/api/user/me/tasks"),
          axios.get<Attendance[]>("/api/user/me/attendance"),
          axios.get<RewardFine[]>("/api/user/me/rewards"),
          axios.get<Stats>("/api/user/me/stats"),
        ]);
        if (!cancelled) {
          setTasks(tasksRes.data);
          setAttendance(attRes.data);
          setRewards(rewRes.data);
          setStats(statsRes.data);
        }
      } catch (e: any) {
        setError("Failed to load your data");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchAll();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
        <CircularProgress />
      </Box>
    );

  if (error)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );

  if (!user) return null;

  if (user.role === "admin") {
    return (
      <Box>
        <Typography variant="h4">Admin Panel</Typography>
        <Button href="/users">Users</Button>
        <Button href="/tasks">Tasks</Button>
        <Button href="/rewards">Rewards/Fines</Button>
        <Button href="/dashboard">Dashboard</Button>
        <Typography mt={2}>Welcome, {user.name} (admin)</Typography>
      </Box>
    );
  }
  if (user.role === "manager") {
    return (
      <Box>
        <Typography variant="h4">Manager Cabinet</Typography>
        <Button href="/tasks">Tasks</Button>
        <Button href="/users">Users</Button>
        <Button href="/dashboard">Reports</Button>
        <Typography mt={2}>Welcome, {user.name} (manager)</Typography>
      </Box>
    );
  }
  // user
  return (
    <ProtectedRoute>
      <Box sx={{ p: { xs: 1, sm: 3 }, maxWidth: 1100, mx: "auto" }}>
        <Typography variant="h4" fontWeight={700} mb={2}>
          Personal Cabinet
        </Typography>
        <Paper sx={{ p: { xs: 2, sm: 3 }, mb: 3 }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar
              sx={{
                bgcolor: "primary.main",
                width: 56,
                height: 56,
                fontSize: 32,
              }}
            >
              {user?.name?.charAt(0) || "U"}
            </Avatar>
            <Box>
              <Typography variant="h6">{user?.name}</Typography>
              <Typography color="text.secondary">{user?.email}</Typography>
              <Chip
                label={user?.role === "admin" ? "Administrator" : "Employee"}
                color={user?.role === "admin" ? "secondary" : "primary"}
                size="small"
                sx={{ mt: 1 }}
              />
            </Box>
          </Stack>
        </Paper>

        <Grid container spacing={3}>
          {/* Statistics */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, mb: 2 }}>
              <Typography variant="h6" gutterBottom>
                Your Statistics
              </Typography>
              <Stack direction="row" spacing={2} alignItems="center" mb={1}>
                <EmojiEventsIcon color="success" />
                <Typography>
                  Rewards:{" "}
                  <b style={{ color: "#28CD41" }}>
                    {stats?.totalRewards ?? 0}₴
                  </b>
                </Typography>
              </Stack>
              <Stack direction="row" spacing={2} alignItems="center" mb={1}>
                <ErrorIcon color="error" />
                <Typography>
                  Fines:{" "}
                  <b style={{ color: "#FF3B30" }}>
                    {stats?.totalPenalties ?? 0}₴
                  </b>
                </Typography>
              </Stack>
              <Stack direction="row" spacing={2} alignItems="center">
                {stats && stats.netBalance >= 0 ? (
                  <TrendingUpIcon color="success" />
                ) : (
                  <TrendingDownIcon color="error" />
                )}
                <Typography>
                  Balance:{" "}
                  <b
                    style={{
                      color:
                        stats && stats.netBalance >= 0 ? "#28CD41" : "#FF3B30",
                    }}
                  >
                    {stats?.netBalance ?? 0}₴
                  </b>
                </Typography>
              </Stack>
            </Paper>
            {/* Rewards and Fines */}
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Rewards and Fines
              </Typography>
              <List dense>
                {rewards && rewards.length > 0 ? (
                  rewards.map((r) => (
                    <ListItem key={r._id}>
                      <ListItemAvatar>
                        <Avatar
                          sx={{
                            bgcolor:
                              r.type === "reward"
                                ? "success.main"
                                : "error.main",
                          }}
                        >
                          {r.type === "reward" ? (
                            <EmojiEventsIcon />
                          ) : (
                            <ErrorIcon />
                          )}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <>
                            {r.type === "reward" ? "Reward" : "Fine"}:{" "}
                            <b
                              style={{
                                color:
                                  r.type === "reward" ? "#28CD41" : "#FF3B30",
                              }}
                            >
                              {r.amount}₴
                            </b>
                          </>
                        }
                        secondary={
                          r.reason ? (
                            <>Reason: {r.reason}</>
                          ) : null
                        }
                      />
                    </ListItem>
                  ))
                ) : (
                  <ListItem>
                    <ListItemText primary="No data on rewards/fines" />
                  </ListItem>
                )}
              </List>
            </Paper>
          </Grid>
          {/* Tasks */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Your Tasks
              </Typography>
              <List dense>
                {tasks && tasks.length > 0 ? (
                  tasks.map((task) => (
                    <ListItem
                      key={task._id}
                      sx={{
                        borderLeft: 4,
                        borderColor: getPriorityColor(task.priority),
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: getPriorityColor(task.priority) }}>
                          <AssignmentIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <span>
                            <b>{task.title}</b> —{" "}
                            <Chip
                              label={task.status}
                              color={getStatusColor(task.status)}
                              size="small"
                              sx={{ ml: 1 }}
                            />
                          </span>
                        }
                        secondary={
                          <>
                            {task.description && <span>{task.description}. </span>}
                            Deadline:{" "}
                            {new Date(task.dueDate).toLocaleDateString()}
                          </>
                        }
                      />
                    </ListItem>
                  ))
                ) : (
                  <ListItem>
                    <ListItemText primary="No active tasks" />
                  </ListItem>
                )}
              </List>
            </Paper>
          </Grid>
          {/* Attendance */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Attendance
              </Typography>
              <List dense>
                {attendance && attendance.length > 0 ? (
                  attendance.map((a) => (
                    <ListItem key={a._id}>
                      <ListItemAvatar>
                        <Avatar>
                          <AccessTimeIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={`Check-in: ${a.checkIn}`}
                        secondary={`Check-out: ${a.checkOut} (${new Date(
                          a.date,
                        ).toLocaleDateString()})`}
                      />
                    </ListItem>
                  ))
                ) : (
                  <ListItem>
                    <ListItemText primary="No attendance data" />
                  </ListItem>
                )}
              </List>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </ProtectedRoute>
  );
}

// Helper functions for priority and status color
function getPriorityColor(priority: string) {
  switch (priority) {
    case "High":
      return "#FF3B30";
    case "Medium":
      return "#FF9500";
    case "Low":
      return "#28CD41";
    default:
      return "grey";
  }
}
function getStatusColor(status: string) {
  switch (status) {
    case "Done":
      return "success";
    case "In Progress":
      return "warning";
    case "Todo":
      return "default";
    default:
      return "default";
  }
}

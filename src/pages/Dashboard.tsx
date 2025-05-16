// frontend/src/pages/Dashboard.tsx
// Проверь точный путь и название файла
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import FormatListBulletedRoundedIcon from "@mui/icons-material/FormatListBulletedRounded";
import PaidRoundedIcon from "@mui/icons-material/PaidRounded";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import TrendingDownRoundedIcon from "@mui/icons-material/TrendingDownRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import {
  Avatar,
  Box,
  Grid,
  LinearProgress,
  Paper,
  Typography,
} from "@mui/material";
import { keyframes } from "@mui/system";
import React, { useEffect, useState } from "react";
import { fetchDashboardData } from "../infrastructure/api/dashboardApi";

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: { value: number; isPositive: boolean };
  color: string;
  delay?: number;
}

const StatCard = ({
  title,
  value,
  icon,
  trend,
  color,
  delay = 0,
}: StatCardProps) => (
  <Paper
    sx={{
      p: 3,
      height: "100%",
      display: "flex",
      flexDirection: "column",
      position: "relative",
      overflow: "hidden",
      animation: `${fadeInUp} 0.6s ease-out forwards`,
      animationDelay: `${delay}s`,
      opacity: 0,
      "&::before": {
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: 4,
        bgcolor: color,
      },
      transition: "all 0.3s ease-in-out",
      "&:hover": {
        transform: "translateY(-4px)",
        "& .icon-wrapper": {
          transform: "scale(1.1)",
        },
      },
    }}
  >
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        mb: 2,
      }}
    >
      <Avatar
        className="icon-wrapper"
        sx={{
          bgcolor: `${color}15`,
          color: color,
          width: 48,
          height: 48,
          transition: "transform 0.3s ease-in-out",
        }}
      >
        {icon}
      </Avatar>
      {trend && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            color: trend.isPositive ? "success.main" : "error.main",
            bgcolor: trend.isPositive ? "success.lighter" : "error.lighter",
            py: 0.5,
            px: 1,
            borderRadius: 1,
            transition: "transform 0.3s ease-in-out",
            "&:hover": {
              transform: "scale(1.05)",
            },
          }}
        >
          {trend.isPositive ? (
            <TrendingUpRoundedIcon />
          ) : (
            <TrendingDownRoundedIcon />
          )}
          <Typography variant="caption" sx={{ ml: 0.5, fontWeight: 500 }}>
            {trend.value}%
          </Typography>
        </Box>
      )}
    </Box>
    <Typography variant="h4" sx={{ mb: 0.5, letterSpacing: "-0.025em" }}>
      {value}
    </Typography>
    <Typography
      variant="body2"
      color="text.secondary"
      sx={{ letterSpacing: "-0.011em" }}
    >
      {title}
    </Typography>
  </Paper>
);

interface ActivityItemProps {
  avatar: string;
  name: string;
  action: string;
  time: string;
  color: string;
  delay?: number;
}

const ActivityItem = ({
  avatar,
  name,
  action,
  time,
  color,
  delay = 0,
}: ActivityItemProps) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      mb: 2,
      opacity: 0,
      animation: `${fadeInUp} 0.6s ease-out forwards`,
      animationDelay: `${delay}s`,
      transition: "all 0.3s ease-in-out",
      "&:hover": {
        transform: "translateX(4px)",
      },
    }}
  >
    <Avatar
      sx={{
        bgcolor: `${color}15`,
        color: color,
        transition: "transform 0.3s ease-in-out",
        "&:hover": {
          transform: "scale(1.1)",
        },
      }}
    >
      {avatar}
    </Avatar>
    <Box sx={{ ml: 2, flex: 1 }}>
      <Typography variant="subtitle2" sx={{ letterSpacing: "-0.025em" }}>
        {name}
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ letterSpacing: "-0.011em" }}
      >
        {action}
      </Typography>
    </Box>
    <Typography
      variant="caption"
      color="text.secondary"
      sx={{ letterSpacing: "-0.011em" }}
    >
      {time}
    </Typography>
  </Box>
);

interface TaskProgressProps {
  title: string;
  progress: number;
  total: number;
  color: string;
  delay?: number;
}

const TaskProgress = ({
  title,
  progress,
  total,
  color,
  delay = 0,
}: TaskProgressProps) => (
  <Box
    sx={{
      mb: 2,
      opacity: 0,
      animation: `${fadeInUp} 0.6s ease-out forwards`,
      animationDelay: `${delay}s`,
      transition: "all 0.3s ease-in-out",
      "&:hover": {
        transform: "translateX(4px)",
      },
    }}
  >
    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
      <Typography variant="body2" sx={{ letterSpacing: "-0.011em" }}>
        {title}
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ letterSpacing: "-0.011em" }}
      >
        {progress}/{total}
      </Typography>
    </Box>
    <LinearProgress
      variant="determinate"
      value={(progress / total) * 100}
      sx={{
        height: 6,
        borderRadius: 3,
        bgcolor: `${color}15`,
        "& .MuiLinearProgress-bar": {
          bgcolor: color,
          transition: "transform 0.6s ease-in-out",
        },
      }}
    />
  </Box>
);

interface DashboardData {
  activeEmployees: number;
  pendingTasks: number;
  lateArrivals: number;
  totalRewards: number;
  recentActivities: ActivityItemProps[];
  taskProgress: TaskProgressProps[];
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData()
      .then((res) => setData(res.data))
      .catch(() => setError("Failed to load dashboard data"));
  }, []);

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (!data) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography
        variant="h4"
        gutterBottom
        fontWeight="600"
        sx={{
          letterSpacing: "-0.025em",
          opacity: 0,
          animation: `${fadeInUp} 0.6s ease-out forwards`,
        }}
      >
        Welcome back, Admin
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Employees"
            value={data.activeEmployees}
            icon={<PeopleRoundedIcon />}
            trend={{ value: 12, isPositive: true }}
            color="#0051FF"
            delay={0.1}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Pending Tasks"
            value={data.pendingTasks}
            icon={<FormatListBulletedRoundedIcon />}
            trend={{ value: 5, isPositive: false }}
            color="#28CD41"
            delay={0.2}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Late Arrivals Today"
            value={data.lateArrivals}
            icon={<AccessTimeRoundedIcon />}
            color="#FF3B30"
            delay={0.3}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Rewards"
            value={`$${data.totalRewards}`}
            icon={<PaidRoundedIcon />}
            trend={{ value: 8, isPositive: true }}
            color="#FF2D55"
            delay={0.4}
          />
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper
            sx={{
              p: 3,
              height: "100%",
              opacity: 0,
              animation: `${fadeInUp} 0.6s ease-out forwards`,
              animationDelay: "0.5s",
            }}
          >
            <Typography
              variant="h6"
              gutterBottom
              sx={{ letterSpacing: "-0.025em" }}
            >
              Recent Activity
            </Typography>
            {data.recentActivities.map((activity, idx) => (
              <ActivityItem
                key={activity.id}
                {...activity}
                delay={0.6 + idx * 0.1}
              />
            ))}
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 3,
              height: "100%",
              opacity: 0,
              animation: `${fadeInUp} 0.6s ease-out forwards`,
              animationDelay: "0.5s",
            }}
          >
            <Typography
              variant="h6"
              gutterBottom
              sx={{ letterSpacing: "-0.025em" }}
            >
              Task Progress
            </Typography>
            {data.taskProgress.map((progress, idx) => (
              <TaskProgress
                key={progress.title}
                {...progress}
                delay={0.6 + idx * 0.1}
              />
            ))}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

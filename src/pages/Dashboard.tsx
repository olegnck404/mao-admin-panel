import { Grid, Paper, Typography, Box, Avatar, LinearProgress } from '@mui/material';
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';
import FormatListBulletedRoundedIcon from '@mui/icons-material/FormatListBulletedRounded';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import PaidRoundedIcon from '@mui/icons-material/PaidRounded';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import TrendingDownRoundedIcon from '@mui/icons-material/TrendingDownRounded';
import { keyframes } from '@mui/system';

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
  value: string;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color: string;
  delay?: number;
}

const StatCard = ({ title, value, icon, trend, color, delay = 0 }: StatCardProps) => (
  <Paper
    sx={{
      p: 3,
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      overflow: 'hidden',
      animation: `${fadeInUp} 0.6s ease-out forwards`,
      animationDelay: `${delay}s`,
      opacity: 0,
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 4,
        bgcolor: color,
      },
      transition: 'all 0.3s ease-in-out',
      '&:hover': {
        transform: 'translateY(-4px)',
        '& .icon-wrapper': {
          transform: 'scale(1.1)',
        },
      },
    }}
  >
    <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
      <Avatar
        className="icon-wrapper"
        sx={{
          bgcolor: `${color}15`,
          color: color,
          width: 48,
          height: 48,
          transition: 'transform 0.3s ease-in-out',
        }}
      >
        {icon}
      </Avatar>
      {trend && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            color: trend.isPositive ? 'success.main' : 'error.main',
            bgcolor: trend.isPositive ? 'success.lighter' : 'error.lighter',
            py: 0.5,
            px: 1,
            borderRadius: 1,
            transition: 'transform 0.3s ease-in-out',
            '&:hover': {
              transform: 'scale(1.05)',
            },
          }}
        >
          {trend.isPositive ? <TrendingUpRoundedIcon /> : <TrendingDownRoundedIcon />}
          <Typography variant="caption" sx={{ ml: 0.5, fontWeight: 500 }}>
            {trend.value}%
          </Typography>
        </Box>
      )}
    </Box>
    <Typography variant="h4" sx={{ mb: 0.5, letterSpacing: '-0.025em' }}>
      {value}
    </Typography>
    <Typography variant="body2" color="text.secondary" sx={{ letterSpacing: '-0.011em' }}>
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

const ActivityItem = ({ avatar, name, action, time, color, delay = 0 }: ActivityItemProps) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      mb: 2,
      opacity: 0,
      animation: `${fadeInUp} 0.6s ease-out forwards`,
      animationDelay: `${delay}s`,
      transition: 'all 0.3s ease-in-out',
      '&:hover': {
        transform: 'translateX(4px)',
      },
    }}
  >
    <Avatar
      sx={{
        bgcolor: `${color}15`,
        color: color,
        transition: 'transform 0.3s ease-in-out',
        '&:hover': {
          transform: 'scale(1.1)',
        },
      }}
    >
      {avatar}
    </Avatar>
    <Box sx={{ ml: 2, flex: 1 }}>
      <Typography variant="subtitle2" sx={{ letterSpacing: '-0.025em' }}>
        {name}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ letterSpacing: '-0.011em' }}>
        {action}
      </Typography>
    </Box>
    <Typography variant="caption" color="text.secondary" sx={{ letterSpacing: '-0.011em' }}>
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

const TaskProgress = ({ title, progress, total, color, delay = 0 }: TaskProgressProps) => (
  <Box
    sx={{
      mb: 2,
      opacity: 0,
      animation: `${fadeInUp} 0.6s ease-out forwards`,
      animationDelay: `${delay}s`,
      transition: 'all 0.3s ease-in-out',
      '&:hover': {
        transform: 'translateX(4px)',
      },
    }}
  >
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
      <Typography variant="body2" sx={{ letterSpacing: '-0.011em' }}>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ letterSpacing: '-0.011em' }}>
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
        '& .MuiLinearProgress-bar': {
          bgcolor: color,
          transition: 'transform 0.6s ease-in-out',
        },
      }}
    />
  </Box>
);

export default function Dashboard() {
  return (
    <Box>
      <Typography
        variant="h4"
        gutterBottom
        fontWeight="600"
        sx={{
          letterSpacing: '-0.025em',
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
            value="24"
            icon={<PeopleRoundedIcon />}
            trend={{ value: 12, isPositive: true }}
            color="#0051FF"
            delay={0.1}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Pending Tasks"
            value="12"
            icon={<FormatListBulletedRoundedIcon />}
            trend={{ value: 5, isPositive: false }}
            color="#28CD41"
            delay={0.2}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Late Arrivals Today"
            value="3"
            icon={<AccessTimeRoundedIcon />}
            color="#FF3B30"
            delay={0.3}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Rewards"
            value="$1.2K"
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
              height: '100%',
              opacity: 0,
              animation: `${fadeInUp} 0.6s ease-out forwards`,
              animationDelay: '0.5s',
            }}
          >
            <Typography variant="h6" gutterBottom sx={{ letterSpacing: '-0.025em' }}>
              Recent Activity
            </Typography>
            <ActivityItem
              avatar="J"
              name="John Doe"
              action="Completed the kitchen cleaning task"
              time="2m ago"
              color="#0051FF"
              delay={0.6}
            />
            <ActivityItem
              avatar="S"
              name="Sarah Smith"
              action="Marked attendance for morning shift"
              time="15m ago"
              color="#28CD41"
              delay={0.7}
            />
            <ActivityItem
              avatar="M"
              name="Mike Johnson"
              action="Received a reward for excellent service"
              time="1h ago"
              color="#FF2D55"
              delay={0.8}
            />
            <ActivityItem
              avatar="A"
              name="Anna White"
              action="Arrived 10 minutes late"
              time="2h ago"
              color="#FF3B30"
              delay={0.9}
            />
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 3,
              height: '100%',
              opacity: 0,
              animation: `${fadeInUp} 0.6s ease-out forwards`,
              animationDelay: '0.5s',
            }}
          >
            <Typography variant="h6" gutterBottom sx={{ letterSpacing: '-0.025em' }}>
              Task Progress
            </Typography>
            <TaskProgress
              title="Kitchen Tasks"
              progress={8}
              total={10}
              color="#0051FF"
              delay={0.6}
            />
            <TaskProgress
              title="Service Tasks"
              progress={5}
              total={8}
              color="#28CD41"
              delay={0.7}
            />
            <TaskProgress
              title="Maintenance Tasks"
              progress={3}
              total={5}
              color="#FF2D55"
              delay={0.8}
            />
            <TaskProgress
              title="Training Tasks"
              progress={2}
              total={4}
              color="#FF9500"
              delay={0.9}
            />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
} 
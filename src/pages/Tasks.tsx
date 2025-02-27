import { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  IconButton,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  Grid,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import FilterListIcon from '@mui/icons-material/FilterList';
import SearchIcon from '@mui/icons-material/Search';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

interface Task {
  id: number;
  title: string;
  assignee: string;
  dueDate: Date;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Todo' | 'In Progress' | 'Done';
}

const initialTasks: Task[] = [
  {
    id: 1,
    title: 'Review menu items',
    assignee: 'John Doe',
    dueDate: new Date(),
    priority: 'High',
    status: 'Todo',
  },
  {
    id: 2,
    title: 'Update inventory',
    assignee: 'Jane Smith',
    dueDate: new Date(),
    priority: 'Medium',
    status: 'In Progress',
  },
  {
    id: 3,
    title: 'Staff training',
    assignee: 'Mike Johnson',
    dueDate: new Date(),
    priority: 'Low',
    status: 'Done',
  },
];

export default function Tasks() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [openDialog, setOpenDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [newTask, setNewTask] = useState<Partial<Task>>({
    title: '',
    assignee: '',
    dueDate: new Date(),
    priority: 'Medium',
    status: 'Todo',
  });

  const handleAddTask = () => {
    if (newTask.title && newTask.assignee && newTask.dueDate) {
      setTasks([
        ...tasks,
        {
          id: tasks.length + 1,
          title: newTask.title,
          assignee: newTask.assignee,
          dueDate: newTask.dueDate,
          priority: newTask.priority as 'High' | 'Medium' | 'Low',
          status: newTask.status as 'Todo' | 'In Progress' | 'Done',
        },
      ]);
      setOpenDialog(false);
      setNewTask({
        title: '',
        assignee: '',
        dueDate: new Date(),
        priority: 'Medium',
        status: 'Todo',
      });
    }
  };

  const filteredTasks = tasks.filter(
    (task) =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.assignee.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return theme.palette.error.main;
      case 'Medium':
        return theme.palette.warning.main;
      case 'Low':
        return theme.palette.success.main;
      default:
        return theme.palette.primary.main;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Todo':
        return theme.palette.info.main;
      case 'In Progress':
        return theme.palette.warning.main;
      case 'Done':
        return theme.palette.success.main;
      default:
        return theme.palette.primary.main;
    }
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box
        sx={{
          mb: 3,
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'stretch', sm: 'center' },
          gap: 2,
        }}
      >
        <Box sx={{ flex: 1 }}>
          <TextField
            fullWidth
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ color: 'neutral.main', mr: 1 }} />,
            }}
          />
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<FilterListIcon />}
            sx={{ minWidth: 100 }}
          >
            Filter
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => setOpenDialog(true)}
            sx={{ minWidth: 100 }}
          >
            Add Task
          </Button>
        </Box>
      </Box>

      {isMobile ? (
        <Grid container spacing={2}>
          {filteredTasks.map((task) => (
            <Grid item xs={12} key={task.id}>
              <Card>
                <CardContent>
                  <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                    {task.title}
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Assignee: {task.assignee}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Due: {task.dueDate.toLocaleDateString()}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Chip
                        label={task.priority}
                        size="small"
                        sx={{
                          bgcolor: `${getPriorityColor(task.priority)}15`,
                          color: getPriorityColor(task.priority),
                          fontWeight: 600,
                        }}
                      />
                      <Chip
                        label={task.status}
                        size="small"
                        sx={{
                          bgcolor: `${getStatusColor(task.status)}15`,
                          color: getStatusColor(task.status),
                          fontWeight: 600,
                        }}
                      />
                    </Box>
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
                <TableCell>Title</TableCell>
                <TableCell>Assignee</TableCell>
                <TableCell>Due Date</TableCell>
                <TableCell>Priority</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell>{task.title}</TableCell>
                  <TableCell>{task.assignee}</TableCell>
                  <TableCell>{task.dueDate.toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Chip
                      label={task.priority}
                      size="small"
                      sx={{
                        bgcolor: `${getPriorityColor(task.priority)}15`,
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
                        bgcolor: `${getStatusColor(task.status)}15`,
                        color: getStatusColor(task.status),
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
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Title"
              fullWidth
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            />
            <TextField
              label="Assignee"
              fullWidth
              value={newTask.assignee}
              onChange={(e) => setNewTask({ ...newTask, assignee: e.target.value })}
            />
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Due Date"
                value={newTask.dueDate}
                onChange={(date) => setNewTask({ ...newTask, dueDate: date || new Date() })}
                slotProps={{ textField: { fullWidth: true, margin: 'dense' } }}
              />
            </LocalizationProvider>
            <FormControl fullWidth>
              <InputLabel>Priority</InputLabel>
              <Select
                value={newTask.priority}
                label="Priority"
                onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
              >
                <MenuItem value="High">High</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="Low">Low</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={newTask.status}
                label="Status"
                onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
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
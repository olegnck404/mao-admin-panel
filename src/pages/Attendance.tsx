import { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Tooltip,
  Avatar,
  useTheme,
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import AddIcon from '@mui/icons-material/Add';
import FilterListIcon from '@mui/icons-material/FilterList';
import SearchIcon from '@mui/icons-material/Search';
import { alpha } from '@mui/material/styles';

interface AttendanceRecord {
  id: number;
  employeeName: string;
  date: Date;
  checkIn: string;
  checkOut: string;
  status: 'on_time' | 'late' | 'absent';
  lateMinutes?: number;
}

const initialRecords: AttendanceRecord[] = [
  {
    id: 1,
    employeeName: 'John Doe',
    date: new Date(),
    checkIn: '09:00',
    checkOut: '17:00',
    status: 'on_time',
  },
  {
    id: 2,
    employeeName: 'Jane Smith',
    date: new Date(),
    checkIn: '09:15',
    checkOut: '17:00',
    status: 'late',
    lateMinutes: 15,
  },
];

export default function Attendance() {
  const theme = useTheme();
  const [records, setRecords] = useState<AttendanceRecord[]>(initialRecords);
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [newRecord, setNewRecord] = useState<Partial<AttendanceRecord>>({
    employeeName: '',
    checkIn: '',
    checkOut: '',
    status: 'on_time',
  });

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setNewRecord({
      employeeName: '',
      checkIn: '',
      checkOut: '',
      status: 'on_time',
    });
  };

  const handleSave = () => {
    if (selectedDate) {
      const checkInTime = newRecord.checkIn?.split(':').map(Number) || [9, 0];
      const isLate = checkInTime[0] > 9 || (checkInTime[0] === 9 && checkInTime[1] > 0);
      const lateMinutes = isLate
        ? (checkInTime[0] - 9) * 60 + checkInTime[1]
        : undefined;

      const record: AttendanceRecord = {
        id: records.length + 1,
        employeeName: newRecord.employeeName || '',
        date: selectedDate,
        checkIn: newRecord.checkIn || '',
        checkOut: newRecord.checkOut || '',
        status: isLate ? 'late' : 'on_time',
        ...(isLate && { lateMinutes }),
      };

      setRecords([...records, record]);
      handleClose();
    }
  };

  const getStatusColor = (status: AttendanceRecord['status']) => {
    switch (status) {
      case 'on_time':
        return theme.palette.success.main;
      case 'late':
        return theme.palette.warning.main;
      case 'absent':
        return theme.palette.error.main;
      default:
        return theme.palette.grey[500];
    }
  };

  const getStatusBgColor = (status: AttendanceRecord['status']) => {
    return alpha(getStatusColor(status), 0.1);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight="600">
          Attendance
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            size="small"
            placeholder="Search records..."
            InputProps={{
              startAdornment: <SearchIcon sx={{ color: 'neutral.main', mr: 1 }} />,
            }}
            sx={{
              width: 240,
              '& .MuiOutlinedInput-root': {
                bgcolor: 'background.paper',
              },
            }}
          />
          <Tooltip title="Filter">
            <IconButton sx={{ bgcolor: 'background.paper' }}>
              <FilterListIcon />
            </IconButton>
          </Tooltip>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpen}
          >
            Add Record
          </Button>
        </Box>
      </Box>

      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Employee</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Check In</TableCell>
                <TableCell>Check Out</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Late (minutes)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {records.map((record) => (
                <TableRow key={record.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar
                        sx={{
                          width: 24,
                          height: 24,
                          fontSize: '0.75rem',
                          bgcolor: theme.palette.primary.main,
                        }}
                      >
                        {record.employeeName.charAt(0)}
                      </Avatar>
                      {record.employeeName}
                    </Box>
                  </TableCell>
                  <TableCell>{record.date.toLocaleDateString()}</TableCell>
                  <TableCell>{record.checkIn}</TableCell>
                  <TableCell>{record.checkOut}</TableCell>
                  <TableCell>
                    <Chip
                      label={record.status.replace('_', ' ')}
                      sx={{
                        bgcolor: getStatusBgColor(record.status),
                        color: getStatusColor(record.status),
                        fontWeight: 600,
                      }}
                    />
                  </TableCell>
                  <TableCell>{record.lateMinutes || '-'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
          },
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h6" fontWeight="600">
            New Attendance Record
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ pb: 2 }}>
          <TextField
            autoFocus
            margin="dense"
            label="Employee Name"
            fullWidth
            value={newRecord.employeeName}
            onChange={(e) => setNewRecord({ ...newRecord, employeeName: e.target.value })}
          />
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Date"
              value={selectedDate}
              onChange={(newValue: Date | null) => setSelectedDate(newValue)}
              slotProps={{ textField: { fullWidth: true, margin: 'dense' } }}
            />
          </LocalizationProvider>
          <TextField
            margin="dense"
            label="Check In Time"
            type="time"
            fullWidth
            value={newRecord.checkIn}
            onChange={(e) => setNewRecord({ ...newRecord, checkIn: e.target.value })}
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{
              step: 300,
            }}
          />
          <TextField
            margin="dense"
            label="Check Out Time"
            type="time"
            fullWidth
            value={newRecord.checkOut}
            onChange={(e) => setNewRecord({ ...newRecord, checkOut: e.target.value })}
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{
              step: 300,
            }}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Status</InputLabel>
            <Select
              value={newRecord.status}
              label="Status"
              onChange={(e) =>
                setNewRecord({ ...newRecord, status: e.target.value as AttendanceRecord['status'] })
              }
            >
              <MenuItem value="on_time">On Time</MenuItem>
              <MenuItem value="late">Late</MenuItem>
              <MenuItem value="absent">Absent</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleClose} variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleSave} variant="contained">
            Create Record
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 
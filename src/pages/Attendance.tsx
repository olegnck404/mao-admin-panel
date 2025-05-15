import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import SearchIcon from "@mui/icons-material/Search";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
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
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import axios from "axios";
import { useEffect, useState } from "react";

interface AttendanceRecord {
  id: number;
  employeeName: string;
  date: Date;
  checkIn: string;
  checkOut: string;
  status: "on_time" | "late" | "absent";
  lateMinutes?: number;
}

interface User {
  _id: string;
  name: string;
}

export default function Attendance() {
  const theme = useTheme();

  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [newRecord, setNewRecord] = useState<Partial<AttendanceRecord>>({
    employeeName: "",
    checkIn: "",
    checkOut: "",
    status: "on_time",
  });
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await axios.get<User[]>("/api/users");
        setUsers(res.data);
      } catch (error) {
        console.error("Failed to fetch users", error);
      }
    }
    fetchUsers();
  }, []);

  // Для примера — пока локальные записи (в будущем заменить на загрузку с сервера)
  useEffect(() => {
    // Можно загрузить сохранённые записи посещаемости с API, если есть
  }, []);

  const handleOpen = () => setOpen(true);

  const handleClose = () => {
    setOpen(false);
    setNewRecord({
      employeeName: "",
      checkIn: "",
      checkOut: "",
      status: "on_time",
    });
    setSelectedDate(new Date());
  };

  const handleSave = () => {
    if (!selectedDate || !newRecord.employeeName) {
      alert("Please select employee and date");
      return;
    }

    let status: AttendanceRecord["status"] = "on_time";
    let lateMinutes: number | undefined;

    if (newRecord.status === "absent") {
      status = "absent";
      lateMinutes = undefined;
    } else {
      if (!newRecord.checkIn) {
        alert("Please enter check-in time");
        return;
      }
      const checkInTime = newRecord.checkIn.split(":").map(Number);
      const isLate =
        checkInTime[0] > 9 || (checkInTime[0] === 9 && checkInTime[1] > 0);
      status = isLate ? "late" : "on_time";
      lateMinutes = isLate
        ? (checkInTime[0] - 9) * 60 + checkInTime[1]
        : undefined;
    }

    const record: AttendanceRecord = {
      id: records.length > 0 ? Math.max(...records.map((r) => r.id)) + 1 : 1,
      employeeName: newRecord.employeeName,
      date: selectedDate,
      checkIn: newRecord.checkIn || "",
      checkOut: newRecord.checkOut || "",
      status,
      lateMinutes,
    };

    setRecords([...records, record]);
    handleClose();
  };

  const handleDelete = (id: number) => {
    setRecords(records.filter((record) => record.id !== id));
  };

  const getStatusColor = (status: AttendanceRecord["status"]) => {
    switch (status) {
      case "on_time":
        return theme.palette.success.main;
      case "late":
        return theme.palette.warning.main;
      case "absent":
        return theme.palette.error.main;
      default:
        return theme.palette.grey[500];
    }
  };

  const getStatusBgColor = (status: AttendanceRecord["status"]) =>
    alpha(getStatusColor(status), 0.1);

  const filteredRecords = records.filter((record) =>
    record.employeeName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4" fontWeight="600">
          Attendance
        </Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          <TextField
            size="small"
            placeholder="Search records..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <SearchIcon sx={{ color: "neutral.main", mr: 1 }} />
              ),
            }}
            sx={{
              width: 240,
              "& .MuiOutlinedInput-root": { bgcolor: "background.paper" },
            }}
          />
          <Tooltip title="Filter">
            <IconButton sx={{ bgcolor: "background.paper" }}>
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
                <TableCell align="center">Actions</TableCell>{" "}
                {/* Колонка для кнопок */}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRecords.map((record) => (
                <TableRow key={record.id} hover>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Avatar
                        sx={{
                          width: 24,
                          height: 24,
                          fontSize: "0.75rem",
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
                      label={record.status.replace("_", " ")}
                      sx={{
                        bgcolor: getStatusBgColor(record.status),
                        color: getStatusColor(record.status),
                        fontWeight: 600,
                      }}
                    />
                  </TableCell>
                  <TableCell>{record.lateMinutes ?? "-"}</TableCell>
                  <TableCell align="center">
                    <Tooltip title="Delete">
                      <IconButton
                        onClick={() => handleDelete(record.id)}
                        color="error"
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
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
        PaperProps={{ sx: { borderRadius: 2 } }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h6" fontWeight="600">
            New Attendance Record
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ pb: 2 }}>
          <FormControl fullWidth margin="dense">
            <InputLabel>Employee Name</InputLabel>
            <Select
              value={newRecord.employeeName}
              label="Employee Name"
              onChange={(e) =>
                setNewRecord({ ...newRecord, employeeName: e.target.value })
              }
            >
              {users.map((user) => (
                <MenuItem key={user._id} value={user.name}>
                  {user.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Date"
              value={selectedDate}
              onChange={(newValue) => setSelectedDate(newValue)}
              slotProps={{ textField: { fullWidth: true, margin: "dense" } }}
            />
          </LocalizationProvider>

          {/* При статусе "absent" скрываем время */}
          {newRecord.status !== "absent" && (
            <>
              <TextField
                margin="dense"
                label="Check In Time"
                type="time"
                fullWidth
                value={newRecord.checkIn}
                onChange={(e) =>
                  setNewRecord({ ...newRecord, checkIn: e.target.value })
                }
                InputLabelProps={{ shrink: true }}
                inputProps={{ step: 300 }}
              />
              <TextField
                margin="dense"
                label="Check Out Time"
                type="time"
                fullWidth
                value={newRecord.checkOut}
                onChange={(e) =>
                  setNewRecord({ ...newRecord, checkOut: e.target.value })
                }
                InputLabelProps={{ shrink: true }}
                inputProps={{ step: 300 }}
              />
            </>
          )}

          <FormControl fullWidth margin="dense">
            <InputLabel>Status</InputLabel>
            <Select
              value={newRecord.status}
              label="Status"
              onChange={(e) =>
                setNewRecord({
                  ...newRecord,
                  status: e.target.value as AttendanceRecord["status"],
                })
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

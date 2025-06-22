import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import {
    Avatar,
    Box,
    Button,
    Chip,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
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
    Typography,
    useTheme,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import axios from "axios";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";

interface RewardRecord {
  _id: string;
  employeeName: string;
  date: Date;
  type: "reward" | "penalty";
  amount: number;
  reason: string;
}

interface Employee {
  _id: string;
  name: string;
}

export default function Rewards() {
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuth();

  const [records, setRecords] = useState<RewardRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [newRecord, setNewRecord] = useState<Partial<RewardRecord>>({
    employeeName: "",
    type: "reward",
    amount: 0,
    reason: "",
  });
  const [searchQuery, setSearchQuery] = useState("");

  // New state for employees
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loadingEmployees, setLoadingEmployees] = useState(false);

  // Loading records
  useEffect(() => {
    async function fetchRecords() {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get<RewardRecord[]>("/api/rewards-fines");
        const data = res.data.map((r) => ({ ...r, date: new Date(r.date) }));
        setRecords(data);
      } catch {
        setError("Failed to fetch records");
        enqueueSnackbar("Failed to fetch records", { variant: "error" });
      } finally {
        setLoading(false);
      }
    }
    fetchRecords();
  }, [enqueueSnackbar]);

  // Loading employees for dropdown
  useEffect(() => {
    async function fetchEmployees() {
      setLoadingEmployees(true);
      try {
        const res = await axios.get<Employee[]>("/api/users");
        setEmployees(res.data);
      } catch {
        enqueueSnackbar("Failed to load employees", { variant: "error" });
      } finally {
        setLoadingEmployees(false);
      }
    }
    fetchEmployees();
  }, [enqueueSnackbar]);

  const handleOpen = () => setOpen(true);

  const handleClose = () => {
    setOpen(false);
    setNewRecord({
      employeeName: "",
      type: "reward",
      amount: 0,
      reason: "",
    });
    setSelectedDate(new Date());
  };

  const handleSave = async () => {
    if (
      !selectedDate ||
      !newRecord.employeeName ||
      !newRecord.amount ||
      newRecord.amount <= 0
    ) {
      enqueueSnackbar("Please fill in all required fields correctly.", {
        variant: "warning",
      });
      return;
    }

    const recordToSend = {
      employeeName: newRecord.employeeName,
      date: selectedDate,
      type: newRecord.type || "reward",
      amount: newRecord.amount,
      reason: newRecord.reason || "",
    };

    try {
      const response = await axios.post<RewardRecord>(
        "/api/rewards-fines",
        recordToSend
      );
      setRecords((prev) => [
        ...prev,
        { ...response.data, date: new Date(response.data.date) },
      ]);
      enqueueSnackbar("Record created successfully!", { variant: "success" });
      handleClose();
    } catch {
      enqueueSnackbar("Failed to save record", { variant: "error" });
    }
  };

  const calculateTotal = (type: "reward" | "penalty") =>
    records
      .filter((record) => record.type === type)
      .reduce((sum, record) => sum + record.amount, 0);

  // Filtering records: employee sees only their own
  const filteredRecords = records.filter((record) => {
    if (!user) return false;
    if (user.role === "user") {
      return record.employeeName === user.name;
    }
    return (
      record.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.reason.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const rewardsTotal = calculateTotal("reward");
  const penaltiesTotal = calculateTotal("penalty");
  const netTotal = rewardsTotal - penaltiesTotal;

  return (
    <Box>
      {/* Header, search, buttons */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4" fontWeight="600">
          Rewards & Penalties
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
              "& .MuiOutlinedInput-root": {
                bgcolor: "background.paper",
              },
            }}
          />
          {/* Add button only for admin/manager */}
          {user?.role !== "user" && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleOpen}
            >
              Add Record
            </Button>
          )}
        </Box>
      </Box>

      {/* Loading states */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error" align="center" sx={{ py: 10 }}>
          {error}
        </Typography>
      ) : (
        <>
          {/* Statistics */}
          <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
            {/* ... Statistics (no changes) */}
            <Paper
              sx={{ p: 3, flex: 1, position: "relative", overflow: "hidden" }}
            >
              <Box sx={{ position: "relative", zIndex: 1 }}>
                <Typography variant="h6" gutterBottom fontWeight="600">
                  Total Rewards
                </Typography>
                <Typography variant="h3" color="primary.main" sx={{ mb: 1 }}>
                  ${rewardsTotal}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <TrendingUpIcon color="success" />
                  <Typography variant="body2" color="success.main">
                    {(
                      (rewardsTotal / (rewardsTotal + penaltiesTotal || 1)) *
                      100
                    ).toFixed(1)}
                    %
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ ml: 1 }}
                  >
                    of total transactions
                  </Typography>
                </Box>
              </Box>
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  p: 2,
                  opacity: 0.1,
                }}
              >
                <TrendingUpIcon sx={{ fontSize: 80, color: "primary.main" }} />
              </Box>
            </Paper>
            {/* ... Total Penalties and Net Balance (as before) */}
            <Paper
              sx={{ p: 3, flex: 1, position: "relative", overflow: "hidden" }}
            >
              <Box sx={{ position: "relative", zIndex: 1 }}>
                <Typography variant="h6" gutterBottom fontWeight="600">
                  Total Penalties
                </Typography>
                <Typography variant="h3" color="error.main" sx={{ mb: 1 }}>
                  ${penaltiesTotal}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <TrendingDownIcon color="error" />
                  <Typography variant="body2" color="error.main">
                    {(
                      (penaltiesTotal / (rewardsTotal + penaltiesTotal || 1)) *
                      100
                    ).toFixed(1)}
                    %
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ ml: 1 }}
                  >
                    of total transactions
                  </Typography>
                </Box>
              </Box>
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  p: 2,
                  opacity: 0.1,
                }}
              >
                <TrendingDownIcon sx={{ fontSize: 80, color: "error.main" }} />
              </Box>
            </Paper>
            <Paper
              sx={{
                p: 3,
                flex: 1,
                bgcolor:
                  netTotal >= 0
                    ? alpha(theme.palette.success.main, 0.1)
                    : alpha(theme.palette.error.main, 0.1),
              }}
            >
              <Typography variant="h6" fontWeight="600">
                Net Balance
              </Typography>
              <Typography
                variant="h3"
                color={netTotal >= 0 ? "success.main" : "error.main"}
              >
                ${netTotal}
              </Typography>
            </Paper>
          </Box>

          {/* Table */}
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Employee</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Reason</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredRecords.map((record) => (
                  <TableRow key={record._id} hover>
                    <TableCell>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
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
                    <TableCell>
                      <Chip
                        label={record.type}
                        sx={{
                          bgcolor:
                            record.type === "reward"
                              ? alpha(theme.palette.success.main, 0.1)
                              : alpha(theme.palette.error.main, 0.1),
                          color:
                            record.type === "reward"
                              ? theme.palette.success.main
                              : theme.palette.error.main,
                          fontWeight: 600,
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography
                        color={
                          record.type === "reward"
                            ? "success.main"
                            : "error.main"
                        }
                        fontWeight="600"
                      >
                        ${record.amount}
                      </Typography>
                    </TableCell>
                    <TableCell>{record.reason}</TableCell>
                  </TableRow>
                ))}
                {filteredRecords.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No data
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}

      {/* Dialog for adding a record */}
      {user?.role !== "user" && (
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Add Record</DialogTitle>
          <DialogContent sx={{ minWidth: 400 }}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Date"
                value={selectedDate}
                onChange={(newValue: Date | null) => setSelectedDate(newValue)}
                slotProps={{ textField: { fullWidth: true, margin: "dense" } }}
              />
            </LocalizationProvider>
            <FormControl fullWidth margin="dense" disabled={loadingEmployees}>
              <InputLabel>Employee</InputLabel>
              <Select
                value={newRecord.employeeName}
                label="Employee"
                onChange={(e) =>
                  setNewRecord({ ...newRecord, employeeName: e.target.value })
                }
              >
                {employees.map((e) => (
                  <MenuItem key={e._id} value={e.name}>
                    {e.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="dense">
              <InputLabel>Type</InputLabel>
              <Select
                value={newRecord.type}
                label="Type"
                onChange={(e) =>
                  setNewRecord({ ...newRecord, type: e.target.value as any })
                }
              >
                <MenuItem value="reward">Reward</MenuItem>
                <MenuItem value="penalty">Fine</MenuItem>
              </Select>
            </FormControl>
            <TextField
              margin="dense"
              label="Amount"
              type="number"
              fullWidth
              value={newRecord.amount}
              onChange={(e) =>
                setNewRecord({ ...newRecord, amount: Number(e.target.value) })
              }
            />
            <TextField
              margin="dense"
              label="Reason"
              fullWidth
              value={newRecord.reason}
              onChange={(e) => setNewRecord({ ...newRecord, reason: e.target.value })}
            />
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleSave} variant="contained">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
}

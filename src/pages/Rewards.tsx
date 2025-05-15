import AddIcon from "@mui/icons-material/Add";
import FilterListIcon from "@mui/icons-material/FilterList";
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
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";

interface RewardRecord {
  id: number;
  employeeName: string;
  date: Date;
  type: "reward" | "penalty";
  amount: number;
  reason: string;
}

export default function Rewards() {
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();

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

  const filteredRecords = records.filter(
    (record) =>
      record.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.reason.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const rewardsTotal = calculateTotal("reward");
  const penaltiesTotal = calculateTotal("penalty");
  const netTotal = rewardsTotal - penaltiesTotal;

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
          <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
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
              sx={{ p: 3, flex: 1, position: "relative", overflow: "hidden" }}
            >
              <Box sx={{ position: "relative", zIndex: 1 }}>
                <Typography variant="h6" gutterBottom fontWeight="600">
                  Net Balance
                </Typography>
                <Typography
                  variant="h3"
                  color={netTotal >= 0 ? "success.main" : "error.main"}
                  sx={{ mb: 1 }}
                >
                  ${Math.abs(netTotal)}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  {netTotal >= 0 ? (
                    <TrendingUpIcon color="success" />
                  ) : (
                    <TrendingDownIcon color="error" />
                  )}
                  <Typography
                    variant="body2"
                    color={netTotal >= 0 ? "success.main" : "error.main"}
                  >
                    {netTotal >= 0 ? "Positive" : "Negative"} balance
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Box>

          <Paper>
            <TableContainer>
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
                    <TableRow key={record.id} hover>
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
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </>
      )}

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 2 } }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h6" fontWeight="600">
            New Record
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ pb: 2 }}>
          <TextField
            autoFocus
            margin="dense"
            label="Employee Name"
            fullWidth
            value={newRecord.employeeName}
            onChange={(e) =>
              setNewRecord({ ...newRecord, employeeName: e.target.value })
            }
          />
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Date"
              value={selectedDate}
              onChange={(newValue: Date | null) => setSelectedDate(newValue)}
              slotProps={{ textField: { fullWidth: true, margin: "dense" } }}
            />
          </LocalizationProvider>
          <FormControl fullWidth margin="dense">
            <InputLabel>Type</InputLabel>
            <Select
              value={newRecord.type}
              label="Type"
              onChange={(e) =>
                setNewRecord({
                  ...newRecord,
                  type: e.target.value as RewardRecord["type"],
                })
              }
            >
              <MenuItem value="reward">Reward</MenuItem>
              <MenuItem value="penalty">Penalty</MenuItem>
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            label="Amount"
            type="number"
            fullWidth
            value={newRecord.amount}
            onChange={(e) =>
              setNewRecord({
                ...newRecord,
                amount: parseFloat(e.target.value) || 0,
              })
            }
            InputProps={{
              startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>,
            }}
          />
          <TextField
            margin="dense"
            label="Reason"
            fullWidth
            multiline
            rows={4}
            value={newRecord.reason}
            onChange={(e) =>
              setNewRecord({ ...newRecord, reason: e.target.value })
            }
          />
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

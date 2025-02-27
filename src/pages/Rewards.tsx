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
  Chip,
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
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import { alpha } from '@mui/material/styles';

interface RewardRecord {
  id: number;
  employeeName: string;
  date: Date;
  type: 'reward' | 'penalty';
  amount: number;
  reason: string;
}

const initialRecords: RewardRecord[] = [
  {
    id: 1,
    employeeName: 'John Doe',
    date: new Date(),
    type: 'reward',
    amount: 100,
    reason: 'Outstanding customer service',
  },
  {
    id: 2,
    employeeName: 'Jane Smith',
    date: new Date(),
    type: 'penalty',
    amount: 50,
    reason: 'Late arrival',
  },
];

export default function Rewards() {
  const theme = useTheme();
  const [records, setRecords] = useState<RewardRecord[]>(initialRecords);
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [newRecord, setNewRecord] = useState<Partial<RewardRecord>>({
    employeeName: '',
    type: 'reward',
    amount: 0,
    reason: '',
  });

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setNewRecord({
      employeeName: '',
      type: 'reward',
      amount: 0,
      reason: '',
    });
  };

  const handleSave = () => {
    if (selectedDate) {
      const record: RewardRecord = {
        id: records.length + 1,
        employeeName: newRecord.employeeName || '',
        date: selectedDate,
        type: newRecord.type || 'reward',
        amount: newRecord.amount || 0,
        reason: newRecord.reason || '',
      };

      setRecords([...records, record]);
      handleClose();
    }
  };

  const calculateTotal = (type: 'reward' | 'penalty') => {
    return records
      .filter((record) => record.type === type)
      .reduce((sum, record) => sum + record.amount, 0);
  };

  const rewardsTotal = calculateTotal('reward');
  const penaltiesTotal = calculateTotal('penalty');
  const netTotal = rewardsTotal - penaltiesTotal;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight="600">
          Rewards & Penalties
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

      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Paper sx={{ p: 3, flex: 1, position: 'relative', overflow: 'hidden' }}>
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Typography variant="h6" gutterBottom fontWeight="600">
              Total Rewards
            </Typography>
            <Typography variant="h3" color="primary.main" sx={{ mb: 1 }}>
              ${rewardsTotal}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <TrendingUpIcon color="success" />
              <Typography variant="body2" color="success.main">
                +{((rewardsTotal / (rewardsTotal + penaltiesTotal)) * 100).toFixed(1)}%
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                of total transactions
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              right: 0,
              p: 2,
              opacity: 0.1,
            }}
          >
            <TrendingUpIcon sx={{ fontSize: 80, color: 'primary.main' }} />
          </Box>
        </Paper>
        <Paper sx={{ p: 3, flex: 1, position: 'relative', overflow: 'hidden' }}>
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Typography variant="h6" gutterBottom fontWeight="600">
              Total Penalties
            </Typography>
            <Typography variant="h3" color="error.main" sx={{ mb: 1 }}>
              ${penaltiesTotal}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <TrendingDownIcon color="error" />
              <Typography variant="body2" color="error.main">
                {((penaltiesTotal / (rewardsTotal + penaltiesTotal)) * 100).toFixed(1)}%
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                of total transactions
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              right: 0,
              p: 2,
              opacity: 0.1,
            }}
          >
            <TrendingDownIcon sx={{ fontSize: 80, color: 'error.main' }} />
          </Box>
        </Paper>
        <Paper sx={{ p: 3, flex: 1, position: 'relative', overflow: 'hidden' }}>
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Typography variant="h6" gutterBottom fontWeight="600">
              Net Balance
            </Typography>
            <Typography
              variant="h3"
              color={netTotal >= 0 ? 'success.main' : 'error.main'}
              sx={{ mb: 1 }}
            >
              ${Math.abs(netTotal)}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              {netTotal >= 0 ? (
                <TrendingUpIcon color="success" />
              ) : (
                <TrendingDownIcon color="error" />
              )}
              <Typography
                variant="body2"
                color={netTotal >= 0 ? 'success.main' : 'error.main'}
              >
                {netTotal >= 0 ? 'Positive' : 'Negative'} balance
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
                  <TableCell>
                    <Chip
                      label={record.type}
                      sx={{
                        bgcolor: record.type === 'reward'
                          ? alpha(theme.palette.success.main, 0.1)
                          : alpha(theme.palette.error.main, 0.1),
                        color: record.type === 'reward'
                          ? theme.palette.success.main
                          : theme.palette.error.main,
                        fontWeight: 600,
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography
                      color={record.type === 'reward' ? 'success.main' : 'error.main'}
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
          <FormControl fullWidth margin="dense">
            <InputLabel>Type</InputLabel>
            <Select
              value={newRecord.type}
              label="Type"
              onChange={(e) =>
                setNewRecord({ ...newRecord, type: e.target.value as RewardRecord['type'] })
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
              setNewRecord({ ...newRecord, amount: parseFloat(e.target.value) || 0 })
            }
            InputProps={{
              startAdornment: '$',
            }}
          />
          <TextField
            margin="dense"
            label="Reason"
            fullWidth
            multiline
            rows={4}
            value={newRecord.reason}
            onChange={(e) => setNewRecord({ ...newRecord, reason: e.target.value })}
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
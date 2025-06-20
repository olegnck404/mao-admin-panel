import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CleaningServicesIcon from "@mui/icons-material/CleaningServices";
import {
  Avatar,
  Box,
  CircularProgress,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Button,
  Stack,
} from "@mui/material";
import axios from "axios";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import UserEditDialog from "./UserEditDialog";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  totalRewards?: number;
  totalPenalties?: number;
  netBalance?: number;
}

export default function UsersList() {
  const { enqueueSnackbar } = useSnackbar();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [editUser, setEditUser] = useState<User | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetchUsersStats();
  }, []);

  const fetchUsersStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get<User[]>("/api/users/stats");
      setUsers(res.data);
    } catch {
      setError("Failed to fetch users stats");
      enqueueSnackbar("Failed to fetch users stats", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId: string) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`/api/users/${userId}`);
      enqueueSnackbar("User deleted", { variant: "success" });
      setUsers(users.filter((u) => u._id !== userId));
    } catch {
      enqueueSnackbar("Failed to delete user", { variant: "error" });
    }
  };

  const handleEditOpen = (user: User) => {
    setEditUser(user);
    setDialogOpen(true);
  };

  const handleEditClose = () => {
    setDialogOpen(false);
    setEditUser(null);
  };

  const handleSave = async (data: {
    name: string;
    email: string;
    role: string;
    password?: string;
  }) => {
    if (!editUser) return;
    try {
      await axios.put(`/api/users/${editUser._id}`, data);
      enqueueSnackbar("User updated", { variant: "success" });
      handleEditClose();
      fetchUsersStats();
    } catch {
      enqueueSnackbar("Failed to update user", { variant: "error" });
    }
  };

  // Очистка БД
  const handleClearDatabase = async () => {
    if (
      !window.confirm(
        "Are you sure you want to completely clear the database? This action cannot be undone.",
      )
    )
      return;
    try {
      await axios.post("/api/maintenance/clear-db");
      enqueueSnackbar("Database cleared", { variant: "success" });
      fetchUsersStats();
    } catch {
      enqueueSnackbar("Failed to clear database", { variant: "error" });
    }
  };

  return (
    <Box>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        mb={3}
      >
        <Typography variant="h4">Users List & Stats</Typography>
        <Button
          variant="outlined"
          color="error"
          startIcon={<CleaningServicesIcon />}
          onClick={handleClearDatabase}
        >
          Очистить БД
        </Button>
      </Stack>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error" align="center" sx={{ py: 10 }}>
          {error}
        </Typography>
      ) : (
        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>User</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Total Rewards</TableCell>
                  <TableCell>Total Penalties</TableCell>
                  <TableCell>Net Balance</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user._id} hover>
                    <TableCell>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Avatar sx={{ bgcolor: "primary.main" }}>
                          {user.name.charAt(0)}
                        </Avatar>
                        {user.name}
                      </Box>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>${user.totalRewards ?? 0}</TableCell>
                    <TableCell>${user.totalPenalties ?? 0}</TableCell>
                    <TableCell
                      sx={{
                        color:
                          (user.netBalance ?? 0) >= 0
                            ? "success.main"
                            : "error.main",
                        fontWeight: 600,
                      }}
                    >
                      ${Math.abs(user.netBalance ?? 0)}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        color="primary"
                        onClick={() => handleEditOpen(user)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(user._id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      <UserEditDialog
        open={dialogOpen}
        onClose={handleEditClose}
        onSave={handleSave}
        user={editUser}
      />
    </Box>
  );
}

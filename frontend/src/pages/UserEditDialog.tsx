import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    TextField,
    Typography,
} from "@mui/material";
import { useEffect, useState } from "react";

interface UserEditDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: {
    name: string;
    email: string;
    role: string;
    password?: string;
  }) => void;
  user: {
    name: string;
    email: string;
    role: string;
    totalRewards?: number;
    totalPenalties?: number;
    netBalance?: number;
  } | null;
}

export default function UserEditDialog({
  open,
  onClose,
  onSave,
  user,
}: UserEditDialogProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setRole(user.role);
      setPassword("");
    }
  }, [user]);

  const handleSave = () => {
    onSave({ name, email, role, password: password.trim() || undefined });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit User</DialogTitle>
      <DialogContent>
        {/* User balances */}
        {user && (
          <Box mb={2}>
            <Typography variant="subtitle1" fontWeight={600}>
              Statistics:
            </Typography>
            <Typography variant="body2">
              Total Rewards: ${user.totalRewards ?? 0}
            </Typography>
            <Typography variant="body2">
              Total Penalties: ${user.totalPenalties ?? 0}
            </Typography>
            <Typography variant="body2" fontWeight={600} mt={1}>
              Net Balance:{" "}
              <span
                style={{
                  color: (user.netBalance ?? 0) >= 0 ? "green" : "red",
                  fontWeight: 700,
                }}
              >
                ${Math.abs(user.netBalance ?? 0)}
              </span>
            </Typography>
            <Divider sx={{ my: 2 }} />
          </Box>
        )}

        <TextField
          label="Name"
          margin="dense"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
        />
        <TextField
          label="Email"
          type="email"
          margin="dense"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Role"
          margin="dense"
          fullWidth
          value={role}
          onChange={(e) => setRole(e.target.value)}
        />
        <TextField
          label="Password"
          type="password"
          margin="dense"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          helperText="Leave blank if you don't want to change the password"
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
        <Button onClick={handleSave} variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

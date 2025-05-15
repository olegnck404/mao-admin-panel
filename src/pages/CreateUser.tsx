import {
  Alert,
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";

export default function CreateUser() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.password) {
      setError("All fields are required.");
      setSuccess(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to create user");
      }

      setSuccess(true);
      setError(null);
      setFormData({ name: "", email: "", password: "", role: "user" });
    } catch (err: any) {
      setError(err.message);
      setSuccess(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 6, px: 2 }}>
      <Typography variant="h5" fontWeight={600} gutterBottom>
        Create New User
      </Typography>

      {success && (
        <Alert severity="success" sx={{ my: 2 }}>
          User created successfully!
        </Alert>
      )}
      {error && (
        <Alert severity="error" sx={{ my: 2 }}>
          {error}
        </Alert>
      )}

      <Box display="flex" flexDirection="column" gap={3} mt={4}>
        <TextField
          label="Name"
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
          fullWidth
        />
        <TextField
          label="Email"
          type="email"
          value={formData.email}
          onChange={(e) => handleChange("email", e.target.value)}
          fullWidth
        />
        <TextField
          label="Password"
          type="password"
          value={formData.password}
          onChange={(e) => handleChange("password", e.target.value)}
          fullWidth
        />
        <FormControl fullWidth>
          <InputLabel>Role</InputLabel>
          <Select
            value={formData.role}
            label="Role"
            onChange={(e) => handleChange("role", e.target.value)}
          >
            {["user", "admin", "manager"].map((role) => (
              <MenuItem
                key={role}
                value={role}
                sx={{
                  "&:hover": {
                    backgroundColor: "primary.light",
                    color: "white",
                  },
                }}
              >
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button variant="contained" onClick={handleSubmit}>
          Create User
        </Button>
      </Box>
    </Box>
  );
}

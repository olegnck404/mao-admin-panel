import { Box, Button, MenuItem, TextField, Typography } from "@mui/material";
import axios from "axios";
import { useSnackbar } from "notistack";
import { useState } from "react";

export default function CreateUser() {
  const { enqueueSnackbar } = useSnackbar();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "user",
    password: "",
  });

  const handleChange = (key: string, value: string) => {
    setFormData({ ...formData, [key]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:4000/api/users", formData);
      enqueueSnackbar("User created successfully!", { variant: "success" });
      setFormData({ name: "", email: "", role: "user", password: "" });
    } catch (error: any) {
      enqueueSnackbar(
        error.response?.data?.message || "Failed to create user.",
        { variant: "error" }
      );
    }
  };

  return (
    <Box sx={{ maxWidth: 500, mx: "auto", mt: 5 }}>
      <Typography variant="h5" fontWeight={600} mb={3}>
        Create New User
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Name"
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Email"
          value={formData.email}
          onChange={(e) => handleChange("email", e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          select
          fullWidth
          label="Role"
          value={formData.role}
          onChange={(e) => handleChange("role", e.target.value)}
          sx={{ mb: 2 }}
        >
          <MenuItem value="user">User</MenuItem>
          <MenuItem value="admin">Admin</MenuItem>
          <MenuItem value="manager">Manager</MenuItem>
        </TextField>
        <TextField
          fullWidth
          label="Password"
          type="password"
          value={formData.password}
          onChange={(e) => handleChange("password", e.target.value)}
          sx={{ mb: 3 }}
        />
        <Button type="submit" variant="contained" fullWidth>
          Create User
        </Button>
      </form>
    </Box>
  );
}

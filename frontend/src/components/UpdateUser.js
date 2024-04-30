import React, { useState } from "react";
import axios from "axios";
import { Box, Button, MenuItem, Select, TextField } from "@mui/material";

const UpdateUser = ({ user, onUserUpdated }) => {
  const safeDob = user.dob ? new Date(user.dob) : null;
  const initialDob = safeDob ? safeDob.toISOString().split("T")[0] : "";
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    dob: initialDob,
    gender: user.gender,
  });
  const [error, setError] = useState(null);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/users/${user._id}`, formData);
      onUserUpdated();
    } catch (error) {
      console.error(
        "Error updating user:",
        error.response?.data?.message || error.message
      );
      if (error.response) {
        setError(error.response.data.message);
      } else {
        setError("An unexpected error occurred");
      }
    }
  };

  return (
    <Box>
      {error && (
        <div className="error-message" style={{ color: "red" }}>
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 2 }}>
          <TextField
            id="outlined-basic"
            label="Name"
            variant="filled"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div style={{ marginBottom: 2 }}>
          <TextField
            id="outlined-basic"
            label="Email"
            variant="filled"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div style={{ marginBottom: 2 }}>
          <label>Date of Birth:</label>
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            required
          />
        </div>

        <div style={{ marginBottom: 2 }}>
          {/* <label>Gender:</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select> */}
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={formData.gender}
            label="DOB"
            onChange={handleChange}
            name="gender"
            required
          >
            <MenuItem value="Male">Male</MenuItem>
            <MenuItem value="Female">Female</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </Select>
        </div>

        <Button type="submit" variant="contained">
          Update User
        </Button>
      </form>
    </Box>
  );
};

export default UpdateUser;

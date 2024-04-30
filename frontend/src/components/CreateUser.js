import React, { useState } from "react";
import axios from "axios";
import { Button, MenuItem, Select, TextField } from "@mui/material";

const CreateUser = ({ onUserCreated }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    dob: "",
    gender: "Male",
  });
  const [error, setError] = useState(null);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/users",
        formData
      );
      console.log("User created:", response.data);
      onUserCreated(); 
      setFormData({
        name: "",
        email: "",
        dob: "",
        gender: "Male",
      })
    } catch (error) {
      console.error(
        "Error creating user:",
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
    <form onSubmit={handleSubmit}>
        {error && <div className="error-message" style={{color:'red'}}>{error}</div>}
      <div>
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
     
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={formData.gender}
          label="gender"
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
        Create User
      </Button>
    </form>
  );
};

export default CreateUser;

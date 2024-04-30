import React, { useEffect, useState } from "react";
import Pagination from "./Pagination"; 
import { Button, Checkbox, List, ListItem, Typography } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material"; 

const ListUsers = ({ users, onEditUser, onDeleteUser, currentPage, totalPages, onPageChange }) => {
  const [selectedUsers, setSelectedUsers] = useState([]); 

  const handleCheckboxChange = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId) 
        : [...prev, userId] 
    );
  };

  const deleteSelectedUsers = async () => {
    try {
      await onDeleteUser(selectedUsers); 
      setSelectedUsers([]); 
    } catch (error) {
      console.error("Error deleting users:", error);
    }
  };

  return (
    <div>
      <Typography variant="h4">Users List</Typography>

      <Button
        variant="contained"
        color="secondary"
        onClick={deleteSelectedUsers}
        disabled={selectedUsers.length === 0}
        startIcon={<Delete />}
      >
        Delete Selected
      </Button> 

      <List>
        {users.map((user) => (
          <ListItem key={user._id}>
            <Checkbox
              checked={selectedUsers.includes(user._id)}
              onChange={() => handleCheckboxChange(user._id)}
              color="primary"
            />
            <Typography style={{marginRight:2}}>
              {user.name} - {user.email} -{" "}
              {user.dob ? new Date(user.dob).toDateString() : "Invalid Date"} - {user.gender}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => onEditUser(user)}
              startIcon={<Edit />}
              style={{marginRight:2}}
            >
              Edit
            </Button> 
            <Button
              variant="contained"
              color="secondary"
              onClick={() => onDeleteUser([user._id])}
              startIcon={<Delete />}
            >
              Delete
            </Button>
          </ListItem>
        ))}
      </List>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange} 
      />
    </div>
  );
};

export default ListUsers;

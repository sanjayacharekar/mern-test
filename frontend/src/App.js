import React, { useState, useEffect } from "react";
import axios from "axios";
import Container from '@mui/material/Container';

import CreateUser from "./components/CreateUser";
import UpdateUser from "./components/UpdateUser";
import ListUsers from "./components/ListUsers";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [refresh, setRefresh] = useState(false);

  const fetchUsers = async (page = 1) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/users?page=${page}`
      );
      setUsers(response.data.data);
      setTotalPages(response.data.totalPages);
      setCurrentPage(page);
    } catch (error) {
      console.error(
        "Error fetching users:",
        error.response?.data?.message || error.message
      );
    }
  };

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

  const handleUserCreated = () => {
    fetchUsers(currentPage);
  };

  const handleUserUpdated = () => {
    setIsEditing(false);
    setUserToEdit(null);
    fetchUsers(currentPage);
  };

  const handleEditUser = (user) => {
    setUserToEdit(user);
    setIsEditing(true);
  };

  const handleDeleteUser = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/users/${id}`);
      fetchUsers(currentPage);
    } catch (error) {
      console.error(
        "Error deleting user:",
        error.response?.data?.message || error.message
      );
    }
  };

  return (
    <Container
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <h1>User Management</h1>
      {isEditing ? (
        <UpdateUser user={userToEdit} onUserUpdated={handleUserUpdated} />
      ) : (
        <CreateUser onUserCreated={handleUserCreated} />
      )}
      <ListUsers
        users={users}
        onEditUser={handleEditUser}
        onDeleteUser={handleDeleteUser}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </Container>
  );
};

export default UserManagement;

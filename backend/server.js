const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const User = require("./model");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extends: true }));
mongoose
  .connect("mongodb://localhost:27017/users")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });


  app.post("/users", async (req, res) => {
    try {
      const user = new User(req.body);
      await user.save();
      res.status(201).json({ message: "User created successfully", user });
    } catch (error) {
      let statusCode = 500;
      let errorMessage = "Internal Server Error";
  
      if (error.name === "ValidationError") {
        statusCode = 400; 
        errorMessage = "Validation error: Check input data";
      } else if (error.code === 11000) {
        statusCode = 409; // Conflict
        errorMessage = `Duplicate key error: ${Object.keys(error.keyPattern).join(", ")} must be unique`;
      }
  
      res.status(statusCode).json({ message: errorMessage, error: error.message });
    }
  });
  


app.get("/users", async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;

    const skip = (page - 1) * limit;
    const users = await User.find().skip(skip).limit(limit);

    const totalUsers = await User.countDocuments();

    res.status(200).json({
      data: users,
      total: totalUsers,
      page,
      totalPages: Math.ceil(totalUsers / limit),
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
});

app.get("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user", error });
  }
});

app.put("/users/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    let statusCode = 500;
    let errorMessage = "Internal Server Error";

    if (error.name === "ValidationError") {
      statusCode = 400; 
      errorMessage = "Validation error: Check input data";
    } else if (error.code === 11000) {
      statusCode = 409; 
      errorMessage = `Duplicate key error: ${Object.keys(error.keyPattern).join(", ")} must be unique`;
    }

    res.status(statusCode).json({ message: errorMessage, error: error.message });
  }
});

app.delete("/users/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error });
  }
});

app.delete("/users", async (req, res) => {
    const { ids } = req.body; 
  
    if (!Array.isArray(ids)) {
      return res.status(400).json({ message: "IDs must be provided as an array" });
    }
  
    try {
      const result = await User.deleteMany({ _id: { $in: ids } });
  
      if (result.deletedCount === 0) {
        return res.status(404).json({ message: "No users found with the provided IDs" });
      }
  
      res.status(200).json({
        message: `${result.deletedCount} user(s) deleted successfully`,
        deletedCount: result.deletedCount,
      });
    } catch (error) {
      res.status(500).json({ message: "Error deleting users", error });
    }
  });
app.listen(5000, () => {
  console.log(`Server running on port 5000`);
});

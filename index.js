const express = require("express");
const mysql = require("mysql2");
const app = express();
const port = 3000;

app.use(express.json());
// Create a MySQL connection
const connection = mysql.createConnection({
  host: "localhost",
  user: "user",
  password: "123",
  database: "study",
  port: 3307,
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    return;
  }
  console.log("Connected to the database");

  // Perform a sample query
  //   connection.query("SELECT * FROM user", (err, rows) => {
  //     if (err) {
  //       console.error("Error executing query:", err);
  //       return;
  //     }
  //     console.log("Query result:", rows);

  //     // Close the MySQL connection
  //     connection.end((err) => {
  //       if (err) {
  //         console.error("Error closing connection:", err);
  //         return;
  //       }
  //       console.log("Connection closed");
  //     });
  //   });
});
// In-memory "users" data
let users = [
  { id: 1, name: "John Doe" },
  { id: 2, name: "Jane Smith" },
  { id: 3, name: "Bob Johnson" },
];

// Get all users
app.get("/users", (req, res) => {
  connection.query("SELECT * FROM user", (err, rows) => {
    if (err) {
      console.error("Error executing query:", err);
      return;
    }
    console.log("Query result:", rows);
    res.json(rows);

    // Close the MySQL connection
    connection.end((err) => {
      if (err) {
        console.error("Error closing connection:", err);
        return;
      }
      console.log("Connection closed");
    });
  });
});

// Get a specific user by ID
app.get("/users/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const user = users.find((user) => user.id === id);

  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ error: "User not found" });
  }
});

// Create a new user
app.post("/users", (req, res) => {
  const user = req.body;
  users.push(user);
  res.status(201).json(user);
});

// Update an existing user
app.put("/users/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const user = users.find((user) => user.id === id);

  if (user) {
    user.name = req.body.name;
    res.json(user);
  } else {
    res.status(404).json({ error: "User not found" });
  }
});

// Delete a user
app.delete("/users/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) {
    const deletedUser = users.splice(index, 1);
    res.json(deletedUser[0]);
  } else {
    res.status(404).json({ error: "User not found" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

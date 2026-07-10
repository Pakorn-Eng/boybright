const express = require("express");
const app = express();
const port = 8000;
const mysql = require("mysql2/promise");
const bodyParser = require("body-parser");

app.use(bodyParser.json());

let users = [];

let counter = 1;
let conn = null;

const initMySQL = async () => {
  conn = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "tutorial",
    port: 3306,
  });
};

app.get("/testdb-new", async (req, res) => {
  try {
    const results = await conn.query("SELECT * FROM users");
    res.json(results[0]);
  } catch (error) {
    console.error("Error connecting to the database:", error.message);
    res.status(500).json({ error: "Error connecting to the database" });
    return;
  }
});

app.get("/users", async (req, res) => {
  const results = await conn.query("SELECT * FROM users");
  res.json(results[0]);
});

app.get("/user/:id", async (req, res) => {
  try {
    let id = req.params.id;
    const results = await conn.query("SELECT * FROM users WHERE id = ?", [id]);
    if (results[0].length == 0) {
      throw { statusCode: 404, message: "User not found" };
    }
    res.json(results[0][0]);
  } catch (error) {
    console.error("Error message", error.message);
    let statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      messsage: "someething went wrong",
      Error: error.message,
    });
  }
});

app.post("/user", async (req, res) => {
  try {
    let user = req.body;
    const results = await conn.query("INSERT INTO users SET ?", user);
    console.log("Results:", results[0]);
    res.json({
      message: "User created successfully",
      user: user,
      results: results[0],
    });
  } catch (error) {
    console.error("Error inserting user into the database:", error.message);
    res.status(500).json({ error: "Error inserting user into the database" });
  }
});

app.put("/user/:id", async (req, res) => {
  try {
    let id = req.params.id;
    let updatedUser = req.body;
    const results = await conn.query("UPDATE users SET ? WHERE id = ?", [
      updatedUser,
      id,
    ]);
    res.json({
      message: "User updated successfully",
      user: updatedUser,
      results: results[0],
    });
  } catch (error) {
    console.error("Error updating user in the database:", error.message);
    res.status(500).json({ error: "Error updating user in the database" });
  }
});

// path put /user/:id
app.patch("/user/:id", (req, res) => {
  let id = req.params.id;
  let selectIndex = users.findIndex((user) => user.id == id);

  //update user
  let updatedUser = req.body;
  if (updatedUser.firstname) {
    users[selectIndex].firstname = updatedUser.firstname;
  }

  if (updatedUser.lastname) {
    users[selectIndex].lastname = updatedUser.lastname;
  }

  res.json({
    user: updatedUser,
    selectIndex: selectIndex,
    message: "User updated successfully",
  });
});

// path delete /user/:id
app.delete("/user/:id", (req, res) => {
  let id = req.params.id;
  let selectIndex = users.findIndex((user) => user.id == id);

  //delete users[selectIndex]; เปลี่นเป็น splice
  users.splice(selectIndex, 1);

  res.json({
    selectIndex: selectIndex,
    message: "User deleted successfully",
  });
});

app.listen(port, async () => {
  await initMySQL();
  console.log(`Server is running on http://localhost:${port}`);
});

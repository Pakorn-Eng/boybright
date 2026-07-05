const express = require("express");
const app = express();
const port = 8000;
const bodyParser = require("body-parser");

app.use(bodyParser.json());

let users = [];

let counter = 1;

app.get("/users", (req, res) => {
  res.json(users);
});

app.post("/user", (req, res) => {
  let user = req.body;
  user.id = counter;

  counter += 1;
  users.push(user);
  res.json({
    user: user,
    message: "User added successfully",
  });
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

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

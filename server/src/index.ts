import express from "express";
import { registerHandler } from "./handlers/register";
import { createTable, getUsers } from "./data/queries";

const app = express();
const port = 3000;

app.use(express.json())

app.get("/", (req, res) => {
  res.send("Express + TypeScript Server hello");
  console.log("GET request from home route received.");
});

app.get("/users", async (req, res) => {
  const users = await getUsers() 
  if (users.rows.length === 0){
    res.send("Users table is empty")
    return
  }
  res.send(JSON.stringify(users.rows))
})

app.post("/register", registerHandler)


app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

import express from "express";
import { registerHandler } from "./handlers/register";
import { clearTable, getUsers } from "./data/queries";

const app = express();
const port = 3000;

app.use(express.json())

app.get("/", (req, res) => {
  res.send("Express + TypeScript Server hello");
  console.log("GET request from home route received.");
});

app.post("/users", async (req, res) => {
  const {body} = req

  if(body.cmd === "clear") {
    await clearTable();
    res.status(200).send("Users table successfully cleared")
    return
  }

  const users = await getUsers() 
  if ("errorMessage" in users){
    res.send("Users table is empty")
  }

  res.send(JSON.stringify(users))
})



app.post("/register", registerHandler)


app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

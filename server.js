import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  password: "bjerg",
  database: "noteToDo",
  port: 5432,
});

db.connect();

const app = express();
const port = 3000;

async function getPremadeTodo() {
  const response = await db.query("SELECT * FROM todo_premade");
  return response.rows;
}

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/to-do", async (req, res) => {
  const premades = await getPremadeTodo();
  res.render("todo.ejs", { premade: premades });
});

app.get("/note", async (req, res) => {
  res.render("note.ejs");
});
app.get("/create/to-do", async (req, res) => {
  res.render("add-todo.ejs");
});
app.get("/create/note", async (req, res) => {
  res.render("add-note.ejs");
});

app.post("/add-premade", async (req, res) => {
  const title = req.body.title;
  const description = req.body.description;
  const day = req.body.day;
});

app.listen(port, () => {
  console.log(`Listening to port ${port}`);
});

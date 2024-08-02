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

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

let currentId = 1;

async function getPremadeTodo() {
  const response = await db.query("SELECT * FROM todo_premade");
  return response.rows;
}

async function getNotes(technology_id) {
  const response = await db.query("SELECT * FROM note WHERE technology_id=$1", [
    technology_id,
  ]);
  return response.rows;
}

async function getTechnology() {
  const response = await db.query(
    "SELECT name, id FROM technology ORDER BY id "
  );
  return response.rows;
}

async function getHistoryFinished() {
  const response = await db.query(
    "SELECT * FROM todo_history WHERE is_finished=true"
  );
  return response.rows;
}
async function getHistoryUnfinished() {
  const response = await db.query(
    "SELECT * FROM todo_history WHERE is_finished=false"
  );
  return response.rows;
}

async function getNotesByTechnology(technology_id) {
  const response = await db.query(
    "SELECT note.id, title, date, technology_id AS tech_id,  description FROM note JOIN technology ON technology.id = note.technology_id WHERE technology_id=$1",
    [technology_id]
  );
  return response.rows;
}

app.get("/to-do", async (req, res) => {
  const todo = await getHistoryUnfinished();
  const history = await getHistoryFinished();
  res.render("todo.ejs", { todo: todo, history: history });
});

app.get("/note", async (req, res) => {
  const technologies = await getTechnology();
  const filteredList = await getNotesByTechnology(currentId);

  res.render("note.ejs", {
    technology: technologies,
    notes: filteredList,
    currentTechnology: currentId,
  });
});

app.get("/", (req, res) => {
  res.redirect("/note");
});

app.get("/create/technology", async (req, res) => {
  res.render("add-note.ejs");
});
app.post("/create/note", async (req, res) => {
  const id = req.body.technology_id;
  const title = req.body.title;
  const description = req.body.description;
  try {
    const response = await db.query(
      "INSERT INTO note (technology_id, title, description) VALUES ($1, $2, $3) RETURNING *",
      [id, title, description]
    );
    const data = response.rows;
    currentId = data[0].technology_id;
    if (response) {
      console.log("Successfully inserted");
    }
  } catch (error) {
    console.error({ Error: error.message });
  }
  res.redirect("/");
});

app.post("/delete/note", async (req, res) => {
  const tech_id = req.body.tech_id;
  const id = req.body.id;
  try {
    const response = await db.query("DELETE FROM note WHERE id=$1", [id]);
    if (response) {
      console.log("Succesfully deleted");
    }
    currentId = tech_id;
  } catch (error) {
    console.error({ Error: error.message });
  }
  res.redirect("/");
});

app.post("/create/technology", async (req, res) => {
  const name = req.body.name;
  const lang_origin = req.body.lang_origin;
  const category = req.body.category;

  try {
    const response = await db.query(
      "INSERT INTO technology (name, origin_language, categories) VALUES ($1, $2, $3)",
      [name, lang_origin, category]
    );
    if (response) {
      console.log("Successfully added");
    }
  } catch (error) {
    console.error({ error: Error.message });
  }
  res.redirect("/create/technology");
});

app.post("/technology", async (req, res) => {
  currentId = parseInt(req.body.technology);
  res.redirect("/note");
});

app.listen(port, () => {
  console.log(`Listening to port ${port}`);
});

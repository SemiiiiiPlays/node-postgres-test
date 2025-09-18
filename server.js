const {Pool} = require("pg")
const express = require("express")
const bodyParser = require("body-parser");
const path = require("path");
const app = express()

app.use(express.urlencoded({ extended: true }));
app.use(express.json())
app.use(express.static(path.join(__dirname, "public")));

const pool = new Pool({
    host: "localhost",
    user: "postgres",
    port: 5432,
    password: "Haveyouevertriedthis1?",
    database: "autoIncrementTest"
})

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/users", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json([]);
  }
});

app.post("/submit", async (req, res) => {
    const { name, fav_word } = req.body;
    console.log("📩 Received form submission:", req.body);
    const insert_query= "INSERT INTO users (name, fav_word) VALUES ($1, $2)"

    await pool.query(insert_query, [name, fav_word], (err, result)=>{
      if (!err){
          console.log(result)
          res.redirect("/");
      }else{
          console.error(err);
          res.status(500).send("Error saving data");
      }
    })

});

app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});
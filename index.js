import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

var D = "Today";

const db = new pg.Client(
  {
    user : "postgres",
    host : "localhost",
    database : "Permalist",
    password : "yuvraj",
    port : 5432,
  }
);

db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


app.get("/", async (req, res) => {

  const result = await db.query("select * from items where day = $1 order by id asc",[D]);
  const items = result.rows;
  res.render("index.ejs", {
    listTitle: D,
    listItems: items,
  });
});

app.post("/day",(req, res) => {
  //console.log(req.body.day);
  D = req.body.day;
  res.redirect("/");
})

app.post("/add",async (req, res) => {
  const item = req.body.newItem;
  await db.query("insert into items(title,day) values($1,$2)",[item,D]);
  res.redirect("/");
});

app.post("/edit", async (req, res) => {
    const id = req.body.updatedItemId;
    const item_name = req.body.updatedItemTitle;
    await db.query("update items set title = $1 where id = $2",[item_name,id]);
    res.redirect("/");

});

app.post("/delete", async(req, res) => {
    const id = req.body.deleteItemId;
    await db.query("delete from items where id = $1",[id]);
    res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

const cors = require("cors");
const express = require("express");
const logger = require("morgan");
const path = require("path");

const usersRouter = require("./routes/users");
const app = express();

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use("/users", usersRouter);

app.get("/", (req, res) => {
  res.status(200).send({ message: "Bienvenue dans votre interface FlexCart" });
});
const { appUrl } = process.env;
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`use api on ${appUrl}`);
});

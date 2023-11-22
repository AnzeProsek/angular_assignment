const express = require("express");
const connectDb = require("./db");
const cors = require("cors");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/routes");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(authRoutes);

connectDb()
  .then(() => {
    console.log("db connection succeeded");
    app.listen(3000, () => console.log("server started at 3000"));
  })
  .catch((err) => console.log(err));

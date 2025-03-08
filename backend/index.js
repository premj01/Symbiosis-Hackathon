const express = require('express')
const app = express();
const { port, hostname, db } = require('./config/config')
const router = require('./router/route')
const authrouter = require('./router/router.auth')

const cors = require('cors');

// database connection 
const ConnectDB = require('./config/config.db');
ConnectDB(db);

app.use(cors());
app.use(express.json());



app.use("/auth", authrouter)
app.use("/", router);

app.get("*", (req, res) => {
  res.status(404).json(JSON.stringify({ message: "Nikal BC <br><h1>404</h1>" }));
});

app.listen(port, () => {
  console.log(`Server Started on PORT http://${hostname}:${port}`);
});
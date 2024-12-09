require('dotenv').config();

const PORT = process.env.PORT || 5000;


const express = require("express");
const app = express();
const usersRoutes = require("./routes/users.js");
const middlewareLogReq = require("./middleware/logs.js");
const { config } = require('dotenv');


// Middleware logRequest dipanggil sebelum route lainnya
app.use(middlewareLogReq);
app.use(express.json());

app.use("/users", usersRoutes);

// app.post("/", (req, res) => {
  //   res.send("hello world");
  // });
  
 
 

app.listen(PORT, () => {
  console.log(`server berhasil di running in ${PORT}`);
});

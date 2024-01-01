require("dotenv").config();
const express = require('express');
const app = express();

const port = process.env.PORT || 5000;
const router = express.Router();
const multer = require("multer");
const logger = require("morgan")
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const upload = multer({ dest: "./public/uploads" });
const contactRouter = require('./routes/contactRoutes');
const userRouter = require("./routes/userRoutes")
const campaignRouter = require("./routes/campaignRoutes")
const errorHandler = require("./middleware/errorhandler")
const connectDb = require("./config/dbConnection")
connectDb();
app.get('/', (req, res) => {
  res.send('Hello World!');
});
// app.get('/api', (req, res) => {
//   res.send('Hello World!');
// });
// app.get('/api/contacts', (req, res) => {
//   res.send('Hello World!');
// });
// const getuser = (req, res) => {
//   res.send('Hello get World!');
// }
// const postuser = (req, res) => {
//   res.json({ user: 'Hello ' + req.body.name });
// }
//  router.route("/").get(getuser).post(postuser);

// app.post("/upload",upload.single("image"),(req,res)=>{

//   res.send(req.file);
// })

//  app.use("/api/contacts", router);
// app.post('/name', (req, res) => {
//   res.json({ user: 'Hello ' + req.body.name });
// });
// app.use(logger("dev"));
// app.use("*", (req, res) => {
//   res.status(404);
//   throw new Error("not found");
// })

app.use('/api/contacts',contactRouter);
app.use('/api/user',userRouter);
app.use('/api/campaign',campaignRouter);
app.use(errorHandler);
var http = require('http');
// http.createServer(function (req,res){
//   res.write('a monk');
//   res.end();
// }).listen(80)
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
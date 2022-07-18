const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRouter = require("./route/User");
const blogRouter = require("./route/Blog");

dotenv.config();

app.use(express.json());
app.use(cors());

app.use("/api", userRouter);
app.use("/api", blogRouter);


mongoose.connect(process.env.MONGO)
.then(() => console.log(`mongo is connected`))
.catch((error) => console.log(error));

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`${PORT}`)
})
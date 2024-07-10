require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const Schema = mongoose.Schema;
const app = express();

const mongoDB = process.env.MONGODB_URI;
const PORT = process.env.PORT || 3000

mongoose.set("strictQuery", false);

process.env.API_KEY;

const Person = mongoose.model(
  "Person",
  new Schema({
    name: { type: String, required: true },
    position: { type: String, required: true }
  })
);

// Set view engine to Jade (Pug)
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'views')));

async function main() {
  try {
    await mongoose.connect(mongoDB);
    console.log("Connected to MongoDB");

    // Start the server after fetching data
    app.listen(PORT, () => console.log(`Server started at port ${PORT}!`));
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
  }
}

main().catch((err) => console.log(err));

// Serve index.pug when the root URL is accessed
app.get("/", async(req, res, next) => { 
  try {
    // Fetch character positions from database
    const characters = await Person.find({});
    console.log(characters);
    // Render index.pug without rendering characters visually
    res.render("index", { characters });
  } catch (err) {
    next(err);
  }
});

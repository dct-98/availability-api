const express = require('express');
const { MongoClient } = require('mongodb');
const { generateid } = require('./generateid/generateid');
const { Schedule } = require('./schedule/schedule');
const { currentWeek } = require('./schedule/currentWeek');

const app = express();
const PORT = process.env.PORT || 3000;
const uri = process.env.DB_URI;
const DB_NAME = process.env.DB_NAME;
const COLLECTION_NAME = process.env.COLLECTION_NAME;

let db;

// Middleware to ensure database connection
app.use((req, res, next) => {
  if (!db) {
    return res.status(500).send('Failed to connect to the database');
  }
  
  req.db = db.collection(COLLECTION_NAME);
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.post('/submit', async (req, res) => {
  try {
    let randomID;
    let existingDoc;
    do {
      randomID = generateid();
      existingDoc = await req.db.findOne({ _id: randomID });
    } while (existingDoc);

    const scheduleObj = new Schedule(randomID, currentWeek());

    await req.db.insertOne({ _id: randomID, ...scheduleObj });
    res.json({ success: true, randomID });
  } catch (err) {
    console.error(err);
    res.status(500).send('An error has occurred');
  }
});

app.get('/schedules/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const schedule = await req.db.findOne({ _id: id });

    if (schedule) {
      res.json(schedule);
    } else {
      res.status(404).send('Schedule not found');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('An error has occurred');
  }
});

const startServer = async () => {
  try {
    const client = await MongoClient.connect(uri, { 
      useNewUrlParser: true, 
      useUnifiedTopology: true, 
      poolSize: 10 // adjust the pool size according to your needs
    });
    db = client.db(DB_NAME);

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server started on http://localhost:${PORT}`);
    });

  } catch (err) {
    console.error('Failed to connect to database:', err);
  }
}

startServer();
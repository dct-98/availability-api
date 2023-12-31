const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const { generateid } = require('./generateid/generateid');
const { Schedule } = require('./schedule/schedule');
const { currentWeek } = require('./schedule/currentWeek');

const app = express();
const PORT = process.env.PORT || 3000;
const uri = process.env.DB_URI;
const collectionName = process.env.COLLECTION_NAME;
const allowedOrigins = ['http://localhost:5173', 'https://your-netlify-app-name.netlify.app'];

app.use(cors({
  origin: function (origin, callback) {
      // If no origin or origin is in the list, allow it
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
          callback(null, true);
      } else {
          callback(new Error('Not allowed by CORS'));
      }
  }
}));

let db;

// Middleware to ensure database connection
app.use((req, res, next) => {
  if (!db) {
    return res.status(500).json({ error: 'Failed to connect to the database' });
  }
  
  req.db = db.collection(collectionName);
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// POST endpoint to create a schedule
app.post('/schedules', async (req, res) => {
  try {
    let randomID;
    let existingDoc;
    do {
      randomID = generateid();
      existingDoc = await req.db.findOne({ _id: randomID });
    } while (existingDoc);

    const scheduleObj = new Schedule(randomID);
    
    // Update the available days based on the remaining days of the week.
    scheduleObj.daysRemaining(currentWeek());

    await req.db.insertOne({ _id: randomID, ...scheduleObj });
    res.status(201).json({ success: true, randomID }); // 201 means "Created"
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error has occurred' });
  }
});

// GET endpoint to retrieve a specific schedule by ID
app.get('/schedules/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const schedule = await req.db.findOne({ _id: id });

    if (schedule) {
      res.json(schedule);
    } else {
      res.status(404).json({ error: 'Schedule not found' }); // 404 means "Not Found"
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error has occurred' });
  }
});

const startServer = async () => {
  try {
    const client = await MongoClient.connect(uri, { 
      useNewUrlParser: true, 
      useUnifiedTopology: true, 
    });
    db = client.db(); // The database name is inferred from the connection URI

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server started on http://localhost:${PORT}`);
    });

  } catch (err) {
    console.error('Failed to connect to database:', err);
  }
}

startServer();
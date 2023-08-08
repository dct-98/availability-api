const express = require('express')
const app = express()
const { MongoClient } = require('mongodb')
const { generateid } = require('./generateid/generateid')
const { Schedule } = require('./schedule/schedule')
const { currentWeek } = require('./schedule/currentWeek')
const uri = process.env.DB_URI
const DB_NAME = process.env.DB_NAME
const COLLECTION_NAME = process.env.COLLECTION_NAME

app.use(express.urlencoded({ extended: false }));

app.post('/submit', async(req, res) => {
  const client = new MongoClient(uri)
  try {

    await client.connect()
    const database = client.db(DB_NAME)
    const collection = database.collection(COLLECTION_NAME)

    //  Generate random id, checking if id already exists

    let randomID
    let existingDoc;
    do {
      randomID = generateid()
      existingDoc = await collection.findOne({ _id:randomID })
    } while (existingDoc)

    const scheduleObj = new Schedule(randomID, currentWeek())

    await collection.insertOne({ _id:randomID, ...scheduleObj})
    res.json({ success: true, randomID });
  }
  catch (err) {
    console.log(err)
    res.status(500).send('An error has occured')
  }
  finally {
    client.close()
  }
})

app.get('/schedules/:id', async(req, res) => {
  const client = new MongoClient(uri)

  try {
    await client.connect()
    const database = client.db(DB_NAME)
    const collection = database.collection(COLLECTION_NAME)


    const id = req.params.id
    const schedule = await collection.findOne({ _id:id })

    if (schedule) {
      res.json(schedule)
    }
    else {
      res.status(404).send('Schedule not found')
    }
  }
  catch(err) {
    console.log(err)
    res.status(500).send('An error has occured')
  }
  finally {
    client.close()
  }

})

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
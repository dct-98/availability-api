const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const { MongoClient } = require('mongodb')
const { generateid } = require('./generateid/generateid')
const MongoClient = mongodb.MongoClient
const uri = process.env.DB_URI
const db = process.env.DB_NAME

app.use(bodyParser.urlencoded({ extended: false }))

app.post('/submit', async(req, res) => {
  const client = new MongoClient(uri)
  try {
    await client.connect()
    const db = client.db(DB_NAME)
    const collection = 


    //  Generate random id, checking if id already exists
    let random_id;
    let existingDoc;
    do {
      random_id = generateid()
      existingDoc = await collection.findOne({ random_id })
    } while (existingDoc)

    const date = new Date()
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    const currentDayIndex = date.getDay()
    const availableDays = [...daysOfWeek.slice(currentDayIndex + 1), ...daysOfWeek.slice(0, currentDayIndex + 1)]
    const unavailableDays = [];

    const document = {
      id,
      availableDays,
      unavailableDays
    }

    await collection.insertOne(document)

    res.send(`Document inserted with id: ${random_id}`)

  }
  catch (err) {
    console.log(err)
    res.status(500).send('An error has occured')
  }
  finally {
    client.close()
  }

  res.json({ random_id })
})
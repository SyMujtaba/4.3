const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;

const app = express();
const port = process.env.PORT || 3000;
const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost:27017/HardrockGYM';

let HardrockGYMapi;

MongoClient.connect(mongoUrl, (err, client) => {
  if (err) {
    console.error(err);
  } else {
    console.log(`Connected to HardrockGYM database: ${mongoUrl}`);
    db = client.db();
  }
});

app.use(bodyParser.json());

app.get('/HardrockGYMapi/data', (req, res) => {
  db.collection('data').find().toArray((err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error fetching data from HardrockGYM database');
    } else {
      res.send(data);
    }
  });
});

app.post('/HardrockGYMapi/data', (req, res) => {
  const newData = req.body;
  db.collection('data').insertOne(newData, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error inserting data into HardrockGYM database');
    } else {
      res.send(result.ops[0]);
    }
  });
});

app.put('/HardrockGYM/data/:id', (req, res) => {
  const id = req.params.id;
  const updatedData = req.body;
  db.collection('data').updateOne({_id: id}, {$set: updatedData}, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error updating data in HardrockGYM database');
    } else {
      res.send(result);
    }
  });
});

app.delete('/HardrockGYMapi/data/:id', (req, res) => {
  const id = req.params.id;
  db.collection('data').deleteOne({_id: id}, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error deleting data from HardrockGYM database');
    } else {
      res.send(result);
    }
  });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

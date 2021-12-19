const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;


// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.k1z8j.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
	try {
		await client.connect();

		const database = client.db('calculate_txt_db');
		const calculationsCollection = database.collection('calculations');

		// add calculation
		app.post('/calculations', async (req, res) => {
			const calculation = req.body;
			const insertCalc = await calculationsCollection.insertOne(calculation);
			res.json(insertCalc);
		});

		// get calculations
		app.get('/calculations', async (req, res) => {
			const calculations = await calculationsCollection.find({}).toArray();
			res.json(calculations);
		});
	}
	finally {
		// await client.close();
	}
}
run().catch(console.dir);

app.get('/', (req, res) => {
	res.send('Running Calculate from .txt server.');
});

app.listen(port, () => {
	console.log('Running Calculate from .txt server on port', port);
});
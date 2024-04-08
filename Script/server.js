const express = require('express');
const app = express();
const port = 3000;
const cors = require('cors');
const fs = require('fs');
const bodyParser = require("body-parser");
const tf = require('@tensorflow/tfjs');
//const neuralNetwork = require('./neural_network');

app.use(express.json());
app.use(cors());
//app.use(bodyParser.urlencoded({ extended: true }));

const { myconnection } = require('./connection');

// Endpoint to retrieve data from the comp_sci table
app.get('/table', async (req, res) => {
    try {
        const results = await myconnection.query('SELECT comp_sci.crn, class_list.class_name, class_list.semester, class_list.credit_hours, comp_sci.satisfied FROM comp_sci JOIN class_list ON comp_sci.crn = class_list.crn_num');
        res.json(results[0]);
    } catch (error) {
        console.error('Error retrieving data from MySQL:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Endpoint to toggle the satisfied status of a class in the it table
app.post('/postit', async (req, res) => {
    const { crn } = req.body;
    
    if (!crn) {
        return res.status(400).json({ error: 'Missing crn' });
    }

    try {
        // Retrieve the current value of satisfied for the given crn
        const [currentResults] = await myconnection.query('SELECT satisfied FROM it WHERE crn = ?', [crn]);
        const currentSatisfiedValue = currentResults[0].satisfied;

        // Toggle the value between 0 and 1
        const newSatisfiedValue = currentSatisfiedValue === '1' ? '0' : '1';

        // Update the value in the database
        await myconnection.query('UPDATE it SET satisfied = ? WHERE crn = ?', [newSatisfiedValue, crn]);
        
        res.status(200).json({ message: 'Record updated successfully' });
    } catch (error) {
        console.error('Error updating record in MySQL:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Endpoint to retrieve data from the business table
app.get('/table2', async (req, res) => {
    try {
        const results = await myconnection.query('SELECT business.crn, class_list.class_name, class_list.credit_hours, business.satisfied FROM business JOIN class_list ON business.crn = class_list.crn_num');
        res.json(results[0]);
    } catch (error) {
        console.error('Error retrieving data from MySQL:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Endpoint to retrieve data from the it table
app.get('/table3', async (req, res) => {
    try {
        const results = await myconnection.query('SELECT it.crn, class_list.class_name, class_list.credit_hours, it.satisfied FROM it JOIN class_list ON it.crn = class_list.crn_num');
        res.json(results[0]);
    } catch (error) {
        console.error('Error retrieving data from MySQL:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/executeQuery', async (req, res) => {
    try {
        // Execute the query to retrieve data
        const results = await myconnection.query('SELECT it.crn, class_list.class_name, class_list.credit_hours, it.satisfied FROM it JOIN class_list ON it.crn = class_list.crn_num');
        
        // Send the results as JSON response
        res.json(results[0]);
    } catch (error) {
        console.error('Error executing query in MySQL:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

/*app.get('/filterClasses', async (req, res) => {
    try {
        // Retrieve data from the database
        const [rows] = await myconnection.query('SELECT it.crn, class_list.class_name, class_list.credit_hours, it.satisfied FROM it JOIN class_list ON it.crn = class_list.crn_num');
        
        // Filter rows based on the condition (remove rows where course.satisfied === 1)
        const filteredRows = rows.filter(course => course.satisfied !== '1');

        // Generate CSV data from filtered rows
        //const csvData = filteredRows.map(course => `${course.class_name},${course.crn},${course.credit_hours},${course.satisfied}`).join('\n');

        // Set response headers for CSV file download
        //res.setHeader('Content-Disposition', 'attachment; filename=filtered_classes.csv');
        //res.setHeader('Content-Type', 'text/csv');

        // Send CSV data as response
        //res.send(csvData);
        console.log('classes filtered successfully');
    } catch (error) {
        console.error('Error filtering classes:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});*/

// Define input size based on your dataset
const inputSize = 3; // Assuming you have 3 input features (CRN, class name, credit hours)

// Define your neural network using TensorFlow.js
const model = tf.sequential();
model.add(tf.layers.dense({ units: 10, activation: 'relu', inputShape: [inputSize] }));
model.add(tf.layers.dense({ units: 1 }));
model.compile({ optimizer: 'sgd', loss: 'meanSquaredError' });

app.post('/filterClasses', async (req, res) => {
    try {
        // Retrieve filtered data from the database
        const [rows] = await myconnection.query('SELECT it.crn, class_list.class_name, class_list.credit_hours, it.satisfied FROM it JOIN class_list ON it.crn = class_list.crn_num');
        
        // Filter rows based on the condition (remove rows where course.satisfied === '1')
        const filteredRows = rows.filter(course => course.satisfied !== '1');

        // Prepare input data for the neural network
        const inputData = filteredRows.map(course => [course.crn, course.class_name, course.credit_hours]);

        // Convert input data to TensorFlow tensor
        const tensorInputData = tf.tensor(inputData);

        // Define and provide the target labels (desired outputs)
        const targetData = [/* Provide your target labels here */];

        // Train the model using the filtered data
        await model.fit(tensorInputData, targetData);

        res.json({ message: 'Filtered classes processed and model trained successfully' });
    } catch (error) {
        console.error('Error processing filtered classes:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});


const express = require('express');
const app = express();
const port = 3000; 
const cors = require('cors');
const bodyParser = require("body-parser");
app.use(express.json());
app.use(cors());
const tf = require('@tensorflow/tfjs-node');
const { initializeDatabase } = require('./connection');
app.use(express.json());
app.use(cors());

const { myconnection } = require('./connection');


app.get('/table', async (req, res) => {
    let connection = null;
    try {
        // Initialize the connection
        connection = await initializeDatabase();
        if (!connection) {
            throw new Error('Database connection could not be established');
        }

        const sql = 'SELECT comp_sci.crn, class_list.class_name, class_list.credit_hours, comp_sci.satisfied FROM comp_sci JOIN class_list ON comp_sci.crn = class_list.crn_num';
        const [results] = await connection.query(sql);
        res.json(results);
    } catch (error) {
        console.error('Error retrieving data from MySQL:', error);
        res.status(500).json({ error: 'Internal Server Error'});} 
});

app.post('/postComp', async (req, res) => {
    const { crn } = req.body;

    if (!crn) {
        return res.status(400).json({ error: 'Missing crn' });
    }

    let connection = null;
    try {
        connection = await initializeDatabase();
        if (!connection) {
            throw new Error('Failed to connect to database');
        }

        // Retrieve the current value of satisfied for the given CRN
        const [selectResults] = await connection.query('SELECT satisfied FROM comp_sci WHERE crn = ?', [crn]);
        if (selectResults.length === 0) {
            return res.status(404).json({ error: 'CRN not found' });
        }

        // Toggle the value between 0 and 1
        const newSatisfiedValue = selectResults[0].satisfied === 1 ? 0 : 1;

        // Update the value in the database
        const [updateResults] = await connection.query('UPDATE comp_sci SET satisfied = ? WHERE crn = ?', [newSatisfiedValue, crn]);
        if (updateResults.affectedRows === 0) {
            return res.status(404).json({ error: 'No record updated' });
        }

        res.status(200).json({ message: 'Record updated successfully' });
    } catch (error) {
        console.error('Error with database operation:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
});

app.post('/predictcomp', async (req, res) => {
    let connection = null;
    try {
        // Initialize the database connection
        connection = await initializeDatabase();
        if (!connection) {
            throw new Error('Failed to connect to the database');
        }

        const enteringSemester = req.body.semester.toLowerCase();  // Getting the semester from request body
        if (!enteringSemester) {
            return res.status(400).json({ error: 'Semester not specified' });
        }
        console.log('Selected Semester: ',enteringSemester)
        // Query database for the latest data
        const sql = `SELECT crn, credit_hours, fall_offered, spring_offered, summer_offered, area, difficulty, satisfied, prereq
                     FROM class_list JOIN it ON crn_num = crn;`;
        const [rows] = await connection.query(sql);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'No data found for prediction' });
        }
        const processedData = preprocessData(rows, enteringSemester);
        const tensorData = convertToTensor(processedData);

        // Predict using the TensorFlow model
        const predictions = model.predict(tensorData.inputs);
        const predictedScores = await predictions.data();
        console.log('Predicted Scores:', predictedScores)
        // Combine predictions with data to return detailed results
        const results = processedData.map((item, index) => ({
            crn: item.crn,
            predictedScore: predictedScores[index],
            credit_hours: item.credit_hours,
            area: item.area,
            difficulty: item.difficulty,
            satisfied: item.satisfied
        }));
        // Sort and select courses based on predictions and constraints
        const selectedCourses = selectCourses(results, areaCreditRequirements);
        // Send the selected courses back to the client
        res.json(selectedCourses);
    } catch (error) {
        console.error('Error during prediction:', error);
        res.status(500).json({ error: 'Error making prediction', details: error.message });
    }
});

app.post('/executeNextSemesterpredictcomp', async (req, res) => {
    let connection = null;
    try {
        // Initialize the database connection
        connection = await initializeDatabase();
        if (!connection) {
            throw new Error('Failed to connect to database');
        }

        const selectedCourses = req.body.selectedCourses;
        if (!selectedCourses || selectedCourses.length === 0) {
            return res.status(400).json({ error: 'No selected courses provided' });
        }

        // Update 'satisfied' value in the database for selected CRNs
        const updateSql = `UPDATE comp_sci SET satisfied = '1' WHERE crn IN (?)`;
        await connection.query(updateSql, [selectedCourses]);
        let enteringSemester = req.body.semester;
        console.log("Semester received: ",enteringSemester);

        // Reuse connection to call the /predict endpoint again with updated data
        const predictionResponse = await fetch('http://localhost:3000/predictcomp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({semester:enteringSemester}) // Pass the updated semester
        });

        if (!predictionResponse.ok) { // Check if the HTTP request failed
            throw new Error(`HTTP Error Response: ${predictionResponse.status} ${predictionResponse.statusText}`);
        }

        const predictionResults = await predictionResponse.json(); // Convert the response data to JSON
        res.json(predictionResults); // Send the prediction results back to the client
    } catch (error) {
        console.error('Error executing next semester prediction:', error);
        res.status(500).send('Error executing next semester prediction');
    }
});



app.get('/table3', async (req, res) => {
    let connection = null;
    try {
        // Initialize the connection
        connection = await initializeDatabase();
        if (!connection) {
            throw new Error('Database connection could not be established');
        }

        const sql = 'SELECT it.crn, class_list.class_name, class_list.credit_hours, it.satisfied FROM it JOIN class_list ON it.crn = class_list.crn_num';
        const [results] = await connection.query(sql);
        res.json(results);
    } catch (error) {
        console.error('Error retrieving data from MySQL:', error);
        res.status(500).json({ error: 'Internal Server Error'});} 
});


app.post('/postit', async (req, res) => {
    const { crn } = req.body;

    if (!crn) {
        return res.status(400).json({ error: 'Missing crn' });
    }

    let connection = null;
    try {
        connection = await initializeDatabase();
        if (!connection) {
            throw new Error('Failed to connect to database');
        }

        // First, retrieve the current value of satisfied for the given CRN
        const [selectResults] = await connection.query('SELECT satisfied FROM it WHERE crn = ?', [crn]);
        if (selectResults.length === 0) {
            return res.status(404).json({ error: 'CRN not found' });
        }

        // Toggle the value between 0 and 1
        const newSatisfiedValue = selectResults[0].satisfied === 1 ? 0 : 1;

        // Update the value in the database
        const [updateResults] = await connection.query('UPDATE it SET satisfied = ? WHERE crn = ?', [newSatisfiedValue, crn]);
        if (updateResults.affectedRows === 0) {
            return res.status(404).json({ error: 'No record updated' });
        }

        res.status(200).json({ message: 'Record updated successfully' });
    } catch (error) {
        console.error('Error with database operation:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
});

app.post('/executeNextSemesterpredictit', async (req, res) => {
    let connection = null;
    try {
        // Initialize the database connection
        connection = await initializeDatabase();
        if (!connection) {
            throw new Error('Failed to connect to database');
        }

        const selectedCourses = req.body.selectedCourses;
        if (!selectedCourses || selectedCourses.length === 0) {
            return res.status(400).json({ error: 'No selected courses provided' });
        }

        // Update 'satisfied' value in the database for selected CRNs
        const updateSql = `UPDATE it SET satisfied = '1' WHERE crn IN (?)`;
        await connection.query(updateSql, [selectedCourses]);
        let enteringSemester = req.body.semester;
        console.log("Semester received: ",enteringSemester);

        // Reuse connection to call the /predict endpoint again with updated data
        const predictionResponse = await fetch('http://localhost:3000/predictit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({semester:enteringSemester}) // Pass the updated semester
        });

        if (!predictionResponse.ok) { // Check if the HTTP request failed
            throw new Error(`HTTP Error Response: ${predictionResponse.status} ${predictionResponse.statusText}`);
        }

        const predictionResults = await predictionResponse.json(); // Convert the response data to JSON
        res.json(predictionResults); // Send the prediction results back to the client
    } catch (error) {
        console.error('Error executing next semester prediction:', error);
        res.status(500).send('Error executing next semester prediction');
    }
});


app.post('/predictit', async (req, res) => {
    let connection = null;
    try {
        // Initialize the database connection
        connection = await initializeDatabase();
        if (!connection) {
            throw new Error('Failed to connect to the database');
        }

        const enteringSemester = req.body.semester.toLowerCase();  // Getting the semester from request body
        if (!enteringSemester) {
            return res.status(400).json({ error: 'Semester not specified' });
        }
        console.log('Selected Semester: ',enteringSemester)
        // Query database for the latest data
        const sql = `SELECT crn, credit_hours, fall_offered, spring_offered, summer_offered, area, difficulty, satisfied, prereq
                     FROM class_list JOIN it ON crn_num = crn;`;
        const [rows] = await connection.query(sql);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'No data found for prediction' });
        }
        const processedData = preprocessData(rows, enteringSemester);
        const tensorData = convertToTensor(processedData);

        // Predict using the TensorFlow model
        const predictions = model.predict(tensorData.inputs);
        const predictedScores = await predictions.data();
        console.log('Predicted Scores:', predictedScores)
        // Combine predictions with data to return detailed results
        const results = processedData.map((item, index) => ({
            crn: item.crn,
            predictedScore: predictedScores[index],
            credit_hours: item.credit_hours,
            area: item.area,
            difficulty: item.difficulty,
            satisfied: item.satisfied
        }));
        // Sort and select courses based on predictions and constraints
        const selectedCourses = selectCourses(results, areaCreditRequirements);
        // Send the selected courses back to the client
        res.json(selectedCourses);
    } catch (error) {
        console.error('Error during prediction:', error);
        res.status(500).json({ error: 'Error making prediction', details: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

function preprocessData(data, enteringSemester) {
    if (!data || !Array.isArray(data) || data.some(item => !item.crn || isNaN(parseInt(item.credit_hours)))) {
        throw new Error("Invalid data format or missing fields.");
    }
    const satisfactionMap = new Map(data.map(item => [item.crn, parseInt(item.satisfied, 10)]));
    const areaCreditsTaken = {}; // Track credits taken per area, but only satisfied ones

    // Initialize area credits taken to 0 for each area defined in areaCreditRequirements
    Object.keys(areaCreditRequirements).forEach(area => {
        areaCreditsTaken[area] = 0;
    });

    // Compute the credits taken for each area only for satisfied classes
    data.forEach(item => {
        if (parseInt(item.satisfied, 10) === 1) {
            areaCreditsTaken[item.area] += parseInt(item.credit_hours, 10);
        }
    });

    // Process classes to determine eligibility
    return data.map(item => {
        const hasNoPrereq = item.prereq === 'NA';
        const prereqSatisfied = hasNoPrereq || satisfactionMap.get(item.prereq) === 1;
        const isOfferedThisSemester = item[`${enteringSemester}_offered`] === '1' || parseInt(item[`${enteringSemester}_offered`], 10) === 1;
        const notYetSatisfied = parseInt(item.satisfied, 10) === 0;
        const canTakeMoreCreditsInArea = (areaCreditsTaken[item.area] + parseInt(item.credit_hours, 10)) <= areaCreditRequirements[item.area];

        const includeClass = prereqSatisfied && isOfferedThisSemester && notYetSatisfied && canTakeMoreCreditsInArea;

        const maxDifficulty = 5;
        const minDifficulty = 1;

        
        return {
            crn: item.crn,
            features: [
                parseInt(item.credit_hours),
                item.fall_offered === '1' ? 1 : 0,
                item.spring_offered === '1' ? 1 : 0,
                item.summer_offered === '1' ? 1 : 0,
                ...encodeArea(item.area),
                (parseInt(item.difficulty) - minDifficulty) / (maxDifficulty - minDifficulty),
                parseInt(item.satisfied, 10),
                ...encodePrereq(item.prereq)
            ],
            credit_hours: item.credit_hours,
            area: item.area,              
            difficulty: item.difficulty,   
            satisfied: item.satisfied,    
            label: parseFloat(item.recommended), 
            originalDifficulty: parseInt(item.difficulty),
            isEligible: includeClass
        };
    }).filter(item => item.isEligible); // Filter to only include eligible classes
}


function encodePrereq(prereq) {
    const prereqs = ['ARST3170','BIOL1107','BIOL1108','CHEM1211L','CSCI1301','CSCI1302','CSCI2200','CSCI2500','CSCI2510','CSCI3400','ENGL1102','ENGL2111','ENGL2122','ENGL2132','HIST1111','HIST2112','IT2000','IT2010','MATH1113','MATH1120','MATH2221','MATH2222','NA','PHYS1112K','PHYS2211K'];
    const prereqIndex = prereqs.indexOf(prereq);
    return prereqs.map((_, index) => index === prereqIndex ? 1 : 0);
}

function encodeArea(area) {
    const areas = ['A1','A2','A3','B','C1','C2','D1','D2','E4','E1','E2','E3','F1','F2','F3','F4','F5','F6','P1','P2','P3','M1','M2','M3','M4','M5','M6','M7','M8','M9','M10','M11','M12','M13','M14','M15','X1','X2','ML'];
    const areaIndex = areas.indexOf(area);
    return areas.map((_, index) => index === areaIndex ? 1 : 0);
}



const areaCreditRequirements = {
    'A1': 3, 'A2': 3, 'A3': 3, 'B': 4, 'C1': 3, 'C2': 3, 'D': 8, 'D1': 3, 'E4': 3, 'E1': 3, 'E2': 3, 'E3': 3, 'F1': 3, 'F2': 3, 'F3': 3, 'F4': 3, 'F5': 3, 'F6': 3, 'P1': 1, 'P2': 2, 'P3': 1, 'M1': 3, 'M2': 3, 'M3': 3, 'M4': 3, 'M5': 3, 'M6': 3, 'M7': 3, 'M8': 3, 'M9': 3, 'M10': 3, 'M11': 3, 'M12': 3, 'M13': 3, 'M14': 3, 'M15': 4, 'ME': 9, 'X1': 3, 'X2': 3,
    'ML': 8
};


// Function to convert data to tensors
function convertToTensor(data) {
    const inputs = data.map(item => item.features);
    const labels = data.map(item => item.label);

    // Convert arrays to 2D tensor for inputs and 1D tensor for labels
    const inputTensor = tf.tensor2d(inputs);
    const labelTensor = tf.tensor1d(labels);

    return {inputs: inputTensor, labels: labelTensor};
}

function selectCourses(results, areaCreditRequirements) {
    results.sort((a, b) => b.predictedScore - a.predictedScore); // Sorting results by predictedScore in descending order
    const selectedCourses = [];
    const areaCreditHoursTaken = {};
    
    // Initialize credit hours taken for each area to 0
    Object.keys(areaCreditRequirements).forEach(area => areaCreditHoursTaken[area] = 0);

    for (const course of results) {
        const { area, credit_hours } = course;
        if (areaCreditHoursTaken[area] + credit_hours <= areaCreditRequirements[area]) {
            selectedCourses.push(course);
            areaCreditHoursTaken[area] += credit_hours;
        }
        if (selectedCourses.reduce((acc, cur) => acc + cur.credit_hours, 0) >= 15) break; 
    }
    return selectedCourses;
}


let model;
async function loadModel() {
    const modelPath = 'file:///Users/onlyt/Documents/GitHub/Team_3_CSCI_4940/TensorflowModel/model.json';
    model = await tf.loadLayersModel(modelPath);
    console.log("Model 1 loaded successfully");
}
loadModel().catch(console.error);

let model2;
async function loadModel2() {
    const modelPath = 'file:///Users/onlyt/Documents/GitHub/Team_3_CSCI_4940/TensorflowModel2/model.json';
    model2 = await tf.loadLayersModel(modelPath);
    console.log("Model 2 loaded successfully");
}
loadModel2().catch(console.error);
const tf = require('@tensorflow/tfjs-node');
const mysql = require('mysql2');
const { myconnection } = require('../Script/connection');
const { initializeDatabase } = require('../Script/connection');
const areaCreditRequirements = {
    'A1': 3,
    'A2': 3,
    'A3': 3,
    'B': 4,
    'C1': 3,
    'C2': 3,
    'D': 8,
    'D1': 3,
    'E': 3,
    'E1': 3,
    'E2': 3,
    'E3': 3,
    'F1': 3,
    'F2': 3,
    'F3': 3,
    'F4': 3,
    'F5': 3,
    'F6': 3,
    'P1': 1,
    'P2': 2,
    'P3': 1,
    'M1': 3,
    'M2': 3,
    'M3': 3,
    'M4': 3,
    'M5': 3,
    'M6': 3,
    'M7': 3,
    'M8': 3,
    'M9': 3,
    'M10': 3,
    'M11': 3,
    'M12': 3,
    'M13': 3,
    'M14': 3,
    'M15': 4,
    'ME': 9,
    'X1': 3,
    'X2': 3
};


async function loadData() {
    let connection = null;
    try {
        // Initialize the connection
        connection = await initializeDatabase();
        if (connection) {
            const sql = `SELECT crn, credit_hours, fall_offered, spring_offered, summer_offered, area, difficulty, satisfied, prereq, recommended FROM class_list JOIN it ON crn_num=crn;`;
            const [data] = await connection.query(sql);
            return data;
        } else {
            throw new Error('Database connection could not be established.');
        }
    } catch (error) {
        console.error("Failed to load data from database:", error);
        throw error; // Rethrow the error after logging
    } finally {
        // Close the connection if it was successfully opened
        if (connection) {
            await connection.end();
        }
    }
}


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
    const eligibleClasses = data.map(item => {
        const hasNoPrereq = item.prereq === 'NA';
        const prereqSatisfied = hasNoPrereq || satisfactionMap.get(item.prereq) === 1;
        const isOfferedThisSemester = item[`${enteringSemester}_offered`] === '1' || parseInt(item[`${enteringSemester}_offered`], 10) === 1;
        const notYetSatisfied = parseInt(item.satisfied, 10) === 0;

        // Check if adding this class would exceed area credit limits
        const canTakeMoreCreditsInArea = (areaCreditsTaken[item.area] + parseInt(item.credit_hours, 10)) <= areaCreditRequirements[item.area];

        const includeClass = prereqSatisfied && isOfferedThisSemester && notYetSatisfied && canTakeMoreCreditsInArea;

        // Normalize the difficulty to a 0-1 scale for model input
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
                (parseInt(item.difficulty) - minDifficulty) / (maxDifficulty - minDifficulty), // normalized difficulty
                parseInt(item.satisfied, 10),
                ...encodePrereq(item.prereq)  // encoding prerequisites
            ],
            label: parseFloat(item.recommended),
            originalDifficulty: parseInt(item.difficulty),
            isEligible: includeClass
        };
    }).filter(item => item.isEligible);  // Only keep classes that are eligible

    return eligibleClasses;  // Return only eligible classes
}



function convertToTensor(data) {
    // Extract features and labels from the data
    const inputs = data.map(item => [
        item.credit_hours,
        item.fall_offered,
        item.spring_offered,
        item.summer_offered,
        ...encodeArea(item.area),
        normalizeDifficulty(item.difficulty),
        item.satisfied,
        ...encodePrereq(item.prereq)
    ]);
    const labels = data.map(item => item.recommended);

    // Check that all features have the same length to prevent tensor shape errors
    if (!inputs.every(subArr => subArr.length === inputs[0].length)) {
        throw new Error('All input feature arrays must have the same length');
    }

    const numExamples = inputs.length;
    const numFeaturesPerExample = inputs[0].length;

    // Convert arrays to 2D tensor for inputs and 1D tensor for labels
    const inputTensor = tf.tensor2d(inputs, [numExamples, numFeaturesPerExample]);
    const labelTensor = tf.tensor1d(labels.map(Number)); // Ensure labels are treated as numerical data

    return {inputs: inputTensor, labels: labelTensor};
}






function encodePrereq(prereq) {
    const prereqs = ['ARST3170','BIOL1107','BIOL1108','CHEM1211L','CSCI1301','CSCI1302','CSCI2200','CSCI2500','CSCI2510','CSCI3400','ENGL1102','ENGL2111','ENGL2122','ENGL2132','HIST1111','HIST2112','IT2000','IT2010','MATH1113','MATH1120','MATH2221','MATH2222','NA','PHYS1112K','PHYS2211K'];
    const prereqIndex = prereqs.indexOf(prereq);
    return prereqs.map((_, index) => index === prereqIndex ? 1 : 0);
}
//Function to encode categorical 'Area' data
function encodeArea(area) {
    const areas = ['A1','A2','A3','B','C1','C2','D1','D2','E4','E1','E2','E3','F1','F2','F3','F4','F5','F6','P1','P2','P3','M1','M2','M3','M4','M5','M6','M7','M8','M9','M10','M11','M12','M13','M14','M15','X1','X2','ML'];
    const areaIndex = areas.indexOf(area);
    return areas.map((_, index) => index === areaIndex ? 1 : 0);
}

function normalizeDifficulty(difficulty) {
    const maxDifficulty = 5;  // Assuming difficulty ranges from 1 to 5
    const minDifficulty = 1;
    return (difficulty - minDifficulty) / (maxDifficulty - minDifficulty);
}


// Function to create the neural network 
function createModel(inputShape) {
    const model = tf.sequential();
    model.add(tf.layers.dense({units: 64, activation: 'relu', inputShape: [inputShape]}));
    model.add(tf.layers.dense({units: 32, activation: 'relu'}));
    model.add(tf.layers.dense({units: 1, activation: 'linear'}));  // Output layer for regression

    model.compile({
        optimizer: tf.train.adam(),
        loss: 'meanSquaredError',
        metrics: ['mse'] 
    });

    return model;
}



// Train the model
async function trainModel(model, tensorData) {
    const {inputs, labels} = tensorData;  // Destructure the tensorData object to extract inputs and labels
    try {
        const history = await model.fit(inputs, labels, {
            batchSize: 16,
            epochs: 300,
            validationSplit: 0.2
        });
        return history;
    } catch (error) {
        console.error("Error during model training:", error);
        throw error;  // Rethrow to handle it in the calling function
    }
}


async function run() {
    try {
    const rawData = await loadData();

    console.log('Raw Data: ',rawData);
    const tensorData = convertToTensor(rawData);
    console.log('Input Tensor Shape:', tensorData.inputs.shape); 
    console.log('Label Tensor Shape:', tensorData.labels.shape);  
    const model = createModel(tensorData.inputs.shape[1]);
    const history = await trainModel(model, tensorData);
    console.log('Training complete. History:', history.history);
    await model.save('file:///Users/onlyt/Documents/GitHub/Team_3_CSCI_4940/TensorflowModel');
    console.log('Model saved!');
    ;}
    catch (error){
        console.error('Failed to train the model:', error);
    }
}

run().catch(console.error);
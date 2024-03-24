const express = require('express');
const app = express();
const port = 3000; 
const cors = require('cors');
app.use(express.json());
app.use(cors());

const { myconnection } = require('./connection');
app.get('/table', (req, res) => {

 myconnection.query('SELECT comp_sci.crn, class_list.class_name, class_list.semester, class_list.credit_hours, comp_sci.satisfied FROM comp_sci JOIN class_list ON comp_sci.crn = class_list.crn_num ORDER BY class_name ASC;', function (error, results) {
    if (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
    res.json(results);
 });
});
app.post('/postComp', (req, res) => {
    const { crn } = req.body;

    if (!crn) {
        return res.status(400).json({ error: 'Missing crn' });
    }

    // First, retrieve the current value of satisfied for the given crn
    myconnection.query(
        'SELECT satisfied FROM comp_sci WHERE crn = ?',
        [crn],
        (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ error: 'Internal Server Error' });
            }

            // Toggle the value between 0 and 1
            const newSatisfiedValue = results[0].satisfied === '1' ? '0' : '1';

            // Update the value in the database
            myconnection.query(
                'UPDATE comp_sci SET satisfied = ? WHERE crn = ?',
                [newSatisfiedValue, crn],
                (error, results) => {
                    if (error) {
                        console.error(error);
                        return res.status(500).json({ error: 'Internal Server Error' });
                    }
                    res.status(200).json({ message: 'Record updated successfully' });
                }
            );
        }
    );
});



app.get('/table2', (req, res) => {
myconnection.query('SELECT business.crn, class_list.class_name, class_list.credit_hours, business.satisfied FROM business JOIN class_list ON business.crn = class_list.crn_num ORDER BY class_name ASC;' , function (error, results) {
    if (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
    res.json(results);
    });
 });
 app.post('/postBus', (req, res) => {
    const { crn } = req.body;

    if (!crn) {
        return res.status(400).json({ error: 'Missing crn' });
    }

    // First, retrieve the current value of satisfied for the given crn
    myconnection.query(
        'SELECT satisfied FROM business WHERE crn = ?',
        [crn],
        (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ error: 'Internal Server Error' });
            }

            // Toggle the value between 0 and 1
            const newSatisfiedValue = results[0].satisfied === '1' ? '0' : '1';

            // Update the value in the database
            myconnection.query(
                'UPDATE business SET satisfied = ? WHERE crn = ?',
                [newSatisfiedValue, crn],
                (error, results) => {
                    if (error) {
                        console.error(error);
                        return res.status(500).json({ error: 'Internal Server Error' });
                    }
                    res.status(200).json({ message: 'Record updated successfully' });
                }
            );
        }
    );
});
 app.get('/table3', (req, res) => {
    myconnection.query('SELECT it.crn, class_list.class_name, class_list.credit_hours, it.satisfied FROM it JOIN class_list ON it.crn = class_list.crn_num ORDER BY class_name ASC;' , function (error, results) {
        if (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        res.json(results);
        });
     });
     app.post('/postit', (req, res) => {
        const { crn } = req.body;
    
        if (!crn) {
            return res.status(400).json({ error: 'Missing crn' });
        }
    
        // First, retrieve the current value of satisfied for the given crn
        myconnection.query(
            'SELECT satisfied FROM it WHERE crn = ?',
            [crn],
            (error, results) => {
                if (error) {
                    console.error(error);
                    return res.status(500).json({ error: 'Internal Server Error' });
                }
    
                // Toggle the value between 0 and 1
                const newSatisfiedValue = results[0].satisfied === '1' ? '0' : '1';
    
                // Update the value in the database
                myconnection.query(
                    'UPDATE it SET satisfied = ? WHERE crn = ?',
                    [newSatisfiedValue, crn],
                    (error, results) => {
                        if (error) {
                            console.error(error);
                            return res.status(500).json({ error: 'Internal Server Error' });
                        }
                        res.status(200).json({ message: 'Record updated successfully' });
                    }
                );
            }
        );
    });
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});


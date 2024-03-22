const express = require('express');
const app = express();
const port = 3000; 
const cors = require('cors');
app.use(express.json());
app.use(cors());

const { myconnection } = require('./connection');
app.get('/table', (req, res) => {

 myconnection.query('SELECT comp_sci.ID, class_list.class_name, class_list.semester, class_list.credit_hours, comp_sci.satisfied FROM comp_sci JOIN class_list ON comp_sci.ID = class_list.ID;', function (error, results) {
    if (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
    res.json(results);
 });
});


/*app.post('/', (req,res) =>{
    const {coffeeName, coffeePrice}= req.body;
    if (coffeeName && coffeePrice){
    myconnection.query('INSERT INTO cart (coffee_name, coffee_price) VALUES (?, ?)',[coffeeName, coffeePrice],
    (error, results) => {
        if(error){
            console.error(error);
            return res.status(500).json({error: 'Internal Server Error'});
        }
        res.status(200).json({message: 'Added to Cart Successfully'});
    });
} else{
    res.status(400).json({ error: 'Missing data' });
}
});*/

app.get('/table2', (req, res) => {
myconnection.query('SELECT business.crn, class_list.class_name, class_list.credit_hours, business.satisfied FROM business JOIN class_list ON business.crn = class_list.crn_num;' , function (error, results) {
    if (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
    res.json(results);
    });
 });
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

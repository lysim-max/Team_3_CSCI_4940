const mysql = require('mysql2/promise'); // Using mysql2/promise for the promise-based interface
/*const OpenAI = require('openai');*/

// Establish MySQL connection
const myconnection = mysql.createPool({
    host: "127.0.0.1",
    user: "root",
    password: "deadlox02",
    database: "capstone_project"
});

module.exports = { myconnection };

// Initialize OpenAI API
/*const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY }); // Use environment variable for API key

async function main() {
    try {
        // Example usage of OpenAI API
        const completion = await openai.chat.completions.create({
            messages: [{ role: "system", content: "You are a helpful assistant." }],
            model: "gpt-3.5-turbo",
        });
        console.log("AI Connected");
    } catch (error) {
        console.error("Error connecting to OpenAI:", error);
    }
}*/

// Call main function to initialize OpenAI API
//main();

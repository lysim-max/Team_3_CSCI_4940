const mysql2 = require('mysql2/promise');

async function initializeDatabase() {
    try {
        const myconnection = await mysql2.createConnection({
            host: "127.0.0.1",
            user: "root",
            password: "CSCI4400",
            database: "capstone_project"
        });

        return myconnection;
    } catch (error) {
        console.error("Failed to connect to the database:", error);
        return null;
    }
}

module.exports = { initializeDatabase };


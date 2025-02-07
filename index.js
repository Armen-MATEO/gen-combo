const express = require('express');
const mysql = require('mysql2/promise');
require('dotenv').config()

const app = express();
app.use(express.json());

const dbConfig = {
    host: 'localhost',
    user: process.env.mysqluser,
    password: process.env.mysqlpassword,
    database: process.env.mysqldatabase
};

const pool = mysql.createPool(dbConfig);

// util function 
function generateCombinations(items, length) {
   
    // Generate item names
    const formattedItems = [];
    let charCode = 65; 
    items.forEach((count) => {
        for (let i = 1; i <= count; i++) {
            formattedItems.push(String.fromCharCode(charCode) + i);
        }
        charCode++;
    });
    
    //validation check
    function isValidCombination(comb) {
        const prefixes = new Set();
        for (const item of comb) {
            const prefix = item[0];
            if (prefixes.has(prefix)) return false;
            prefixes.add(prefix);
        }
        return true;
    }
    //combine all
    function combine(arr, len, start = 0, path = [], result = []) {
        if (path.length === len) {
            if (isValidCombination(path)) result.push([...path]);
            return;
        }
        for (let i = start; i < arr.length; i++) {
            path.push(arr[i]);
            combine(arr, len, i + 1, path, result);
            path.pop();
        }
        return result;
    }
    
    return combine(formattedItems, length);
}

app.post('/generate', async (req, res) => {
    const { items, length } = req.body;
    if (!items || !length || !Array.isArray(items)) {
        return res.status(400).json({ error: 'Invalid input' });
    }

    const combinations = generateCombinations(items, length);

    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
        // Insert items
        for (const item of combinations.flat()) {
            await connection.query('INSERT IGNORE INTO items (name) VALUES (?)', [item]);
        }

        // Insert combinations
        const [result] = await connection.query('INSERT INTO responses (data) VALUES (?)', [JSON.stringify(combinations)]);
        const responseId = result.insertId;

        for (const comb of combinations) {
            await connection.query('INSERT INTO combinations (response_id, combination) VALUES (?, ?)', [responseId, JSON.stringify(comb)]);
        }

        await connection.commit();
        connection.release();

        res.json({ id: responseId, combination: combinations });
    } catch (err) {
        await connection.rollback();
        connection.release();
        res.status(500).json({ error: err.message });
    }
});

app.listen(3000, () => console.log('Server is running on port 3000  🎶'));

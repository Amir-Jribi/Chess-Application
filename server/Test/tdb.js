const sqlite3 = require('sqlite3').verbose();

// Connect to an in-memory SQLite database
const db = new sqlite3.Database(':memory:', (err) => {
    if (err) {
        console.error('Error connecting to the database:', err.message);
    } else {
        console.log('Connected to the in-memory SQLite database.');
    }
});

// Create users table , asynchronus!
db.run(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        password TEXT NOT NULL
    )
`, (err) => {
    if (err) {
        console.error('Error creating users table:', err.message);
    } else {
        console.log('Users table is ready.');

        // Insert a user after the table is ready
        createUser('testUser', 'testPass');

        // Fetch users after inserting
        getUsers();
    }
});

// Function to create a user
function createUser(username, password) {
    db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, password], function(err) {
        if (err) {
            console.error('Error inserting user:', err.message);
        } else {
            console.log(`User ${username} created with ID ${this.lastID}`);
        }
    });
}

// Function to fetch all users
function getUsers() {
    db.all('SELECT * FROM users', [], (err, rows) => {
        if (err) {
            console.error('Error fetching users:', err.message);
        } else {
            console.log('Users:', rows);
        }
    });
}


// Example of creating a user and fetching users
// createUser('testUser', 'testPass');
// getUsers();

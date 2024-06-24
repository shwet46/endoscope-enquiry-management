
const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5500;

// PostgreSQL connection configuration
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'endoscope',
  password: 'S#wet@46',
  port: 4605, // PostgreSQL default port
});

app.use(express.static('public')); 

// Middleware to parse JSON and urlencoded form data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Login form route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE username = $1 AND password = $2', [username, password]);
    if (result.rows.length === 1) {
      console.log('login successful');
    } else {
      res.send('Invalid username or password');
    }
  } catch (error) {
    console.error('Error executing query', error);
    res.status(500).send('Internal Server Error');
  }
});

// Registration form route
app.post('/register', async (req, res) => {
  const { username, address, password, email } = req.body;
  try {
    await pool.query('INSERT INTO users (username, address, password, email) VALUES ($1, $2, $3, $4)', [username, address, password, email]);
    console.log('registration successful');
  } catch (error) {
    console.error('Error executing query', error);
    res.status(500).send('Internal Server Error');
  }
});

// Data submission form route
app.post('/enquiry', async (req, res) => {
  const {email, category, model, price} = req.body;
  try {
    await pool.query('INSERT INTO enquiry (email, category, model, price) VALUES ($1, $2, $3, $4)', [email, category, model, price]);
    console.log('successfully submitted');
  } catch (error) {
    console.error('Error executing query', error);
    res.status(500).send('Internal Server Error');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

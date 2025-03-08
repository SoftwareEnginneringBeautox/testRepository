// server.js

const express = require('express');
const cors = require('cors');
const pool = require("./config/database.js");
const session = require('express-session');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const isAuthenticated = require('./authMiddleware'); // Custom middleware

const app = express();


// Middleware Setup
app.use(bodyParser.json());
app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173", // Adjust to match your client URL
  credentials: true
}));

// Prevent caching of sensitive pages so that the back button won’t show them after logout
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
});

// Session configuration
app.use(session({
  secret: 'yourSecretKey',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,      // set true if using HTTPS
    httpOnly: true,
    sameSite: 'lax'
  }
}));

// --------------------
// User Management Endpoints
// --------------------

// Register endpoint (for creating new users)
app.post('/adduser', async (req, res) => {
  try {
    const { username, password, role } = req.body;
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const insertst = `INSERT INTO accounts (username, password, role) VALUES ($1, $2, $3) RETURNING id;`;
    const result = await pool.query(insertst, [username, hashedPassword, role]);
    res.json({ success: true, message: `User Added with ID: ${result.rows[0].id}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Error adding user' });
  }
});

// Protected endpoint to get all users
app.get('/getusers', isAuthenticated, (req, res) => {
  pool.query("SELECT * FROM accounts")
    .then((response) => res.send(response.rows))
    .catch((error) => res.status(500).json({ success: false, error: 'Error retrieving users' }));
});

// Protected endpoint to update a user
app.put('/updateuser', isAuthenticated, async (req, res) => {
  const { id, username, password, role } = req.body;
  const updatest = `UPDATE accounts SET username = $1, password = $2, role = $3 WHERE id = $4;`;
  try {
    await pool.query(updatest, [username, password, role, id]);
    res.send("User Updated");
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Error updating user' });
  }
});

// Login endpoint
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const query = 'SELECT * FROM accounts WHERE username = $1';
    const result = await pool.query(query, [username]);

    if (result.rows.length > 0) {
      const user = result.rows[0];
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (passwordMatch) {
        // Save user data in session
        req.session.user = { id: user.id, username: user.username, role: user.role };
        res.json({
          success: true,
          message: "Login successful",
          role: user.role,
          token: "dummyToken",
          username: user.username   // Return username as well
        });
      } else {
        res.json({ success: false, message: "Invalid username or password" });
      }
    } else {
      res.json({ success: false, message: "Invalid username or password" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

// Logout endpoint
app.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Could not log out' });
    }
    res.json({ success: true, message: 'Logged out successfully' });
  });
});

// --------------------
// Patient Records Endpoints
// --------------------

// Create a new patient record
app.post('/api/patients', async (req, res) => {
  try {
    const {
      patient_name,
      person_in_charge,
      package_name,
      treatment,
      total_amount,
      package_discount,
      payment_method,
      date_of_session,
      time_of_session,
      consent_form_signed
    } = req.body;

    const insertQuery = `
      INSERT INTO patient_records (
        patient_name,
        person_in_charge,
        package_name,
        treatment,
        total_amount,
        package_discount,
        payment_method,
        date_of_session,
        time_of_session,
        consent_form_signed
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING id;
    `;

    const values = [
      patient_name,
      person_in_charge,
      package_name,
      treatment,
      total_amount,
      package_discount,
      payment_method,
      date_of_session,
      time_of_session,
      consent_form_signed
    ];

    const result = await pool.query(insertQuery, values);

    res.json({
      success: true,
      message: 'Patient record created',
      patientId: result.rows[0].id
    });
  } catch (error) {
    console.error('Error creating patient record:', error);
    res.status(500).json({ success: false, error: 'Error creating patient record' });
  }
});

// (Optional) Retrieve all patient records
// You can protect it with isAuthenticated if desired
app.get('/api/patients', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM patient_records ORDER BY id DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error retrieving patient records:', error);
    res.status(500).json({ success: false, error: 'Error retrieving patient records' });
  }
});

// Start the server
app.listen(4000, () => {
  console.log('Server is running on port 4000');
});

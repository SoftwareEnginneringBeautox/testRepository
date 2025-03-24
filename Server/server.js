require('dotenv').config(); // Load environment variables

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const crypto = require('crypto'); // For generating random tokens
const pool = require("./config/database.js");
const session = require('express-session');
const bcrypt = require('bcrypt');
const isAuthenticated = require('./middleware/isAuthenticated');

const app = express();

// Use Helmet to set secure HTTP headers
app.use(helmet());

// Apply rate limiting middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: "Too many requests from this IP, please try again after 15 minutes."
});
app.use(limiter);

// Use express.json() for parsing JSON bodies
app.use(express.json());

// Setup CORS to allow credentials from your client origin
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
  secret: process.env.SESSION_SECRET || 'yourSecretKey',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // enable in production (HTTPS required)
    httpOnly: true,
    sameSite: 'lax'
  }
}));

/* --------------------------------------------
   USER MANAGEMENT ENDPOINTS
--------------------------------------------- */

// Register endpoint (for creating new users)
// Updated to include "role" and "dayoff"
app.post('/adduser', async (req, res) => {
  try {
    console.log("Received /adduser payload:", req.body);
    const { username, password, role, dayoff } = req.body;
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const insertst = `
      INSERT INTO accounts (username, password, role, dayoff)
      VALUES ($1, $2, $3, $4)
      RETURNING id;
    `;
    const result = await pool.query(insertst, [username, hashedPassword, role, dayoff]);
    console.log("New user added with ID:", result.rows[0].id);
    res.json({ success: true, message: `User Added with ID: ${result.rows[0].id}` });
  } catch (error) {
    console.error("Error in /adduser:", error);
    res.status(500).json({ success: false, error: 'Error adding user' });
  }
});

// Protected endpoint to get all users
app.get('/getusers', isAuthenticated, (req, res) => {
  pool.query("SELECT * FROM accounts")
    .then((response) => res.send(response.rows))
    .catch((error) => res.status(500).json({ success: false, error: 'Error retrieving users' }));
});

// Protected endpoint to update a user (including "dayoff")
app.put('/updateuser', isAuthenticated, async (req, res) => {
  try {
    const { id, username, password, role, dayoff } = req.body;
    console.log("Updating user:", { id, username, role, dayoff });
    const updatest = `
      UPDATE accounts
      SET username = $1, password = $2, role = $3, dayoff = $4
      WHERE id = $5;
    `;
    await pool.query(updatest, [username, password, role, dayoff, id]);
    res.send("User Updated");
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ success: false, error: 'Error updating user' });
  }
});

// Login endpoint with detailed error logging, input validation, and random token generation
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const query = 'SELECT * FROM accounts WHERE username = $1';
    const result = await pool.query(query, [username]);

    if (result.rows.length > 0) {
      const user = result.rows[0];
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (passwordMatch) {
        // Generate a random token (256-bit token in hex format)
        const token = crypto.randomBytes(32).toString('hex');
        // Save user data along with the token in session
        req.session.user = { id: user.id, username: user.username, role: user.role, token };
        return res.json({
          success: true,
          message: "Login successful",
          role: user.role,
          token, // Return the generated token
          username: user.username
        });
      } else {
        console.log(`Failed login attempt: Incorrect password for username "${username}".`);
        return res.json({ success: false, message: "Invalid username or password" });
      }
    } else {
      console.log(`Failed login attempt: Username "${username}" not found.`);
      return res.json({ success: false, message: "Invalid username or password" });
    }
  } catch (error) {
    console.error(`Error in /login for username "${req.body.username}". Error details:`, error);
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

/* --------------------------------------------
   PATIENT RECORDS ENDPOINTS
--------------------------------------------- */

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

// Retrieve all patient records
app.get('/api/patients', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM patient_records ORDER BY id DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error retrieving patient records:', error);
    res.status(500).json({ success: false, error: 'Error retrieving patient records' });
  }
});

/* --------------------------------------------
   APPOINTMENTS ENDPOINTS
--------------------------------------------- */

// Create a new appointment
app.post('/api/appointments', async (req, res) => {
  try {
    const { full_name, contact_number, age, email, date_of_session, time_of_session } = req.body;
    const insertQuery = `
      INSERT INTO appointments (
        full_name,
        contact_number,
        age,
        email,
        date_of_session,
        time_of_session
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id;
    `;
    const values = [full_name, contact_number, age, email, date_of_session, time_of_session];

    const result = await pool.query(insertQuery, values);

    res.json({
      success: true,
      message: 'Appointment scheduled',
      appointmentId: result.rows[0].id
    });
  } catch (error) {
    console.error('Error scheduling appointment:', error);
    res.status(500).json({ success: false, error: 'Error scheduling appointment' });
  }
});

// Retrieve all appointments
app.get('/api/appointments', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM appointments ORDER BY date_of_session ASC, time_of_session ASC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error retrieving appointments:', error);
    res.status(500).json({ success: false, error: 'Error retrieving appointments' });
  }
});

/* --------------------------------------------
   TREATMENTS ENDPOINTS
--------------------------------------------- */

// Create a new treatment
app.post('/api/treatments', async (req, res) => {
  try {
    const { treatment_name, price, duration, description } = req.body;
    const insertQuery = `
      INSERT INTO treatments (
        treatment_name,
        price,
        duration,
        description
      )
      VALUES ($1, $2, $3, $4)
      RETURNING id;
    `;
    const result = await pool.query(insertQuery, [treatment_name, price, duration, description]);
    res.json({ success: true, message: 'Treatment created', treatmentId: result.rows[0].id });
  } catch (error) {
    console.error('Error creating treatment:', error);
    res.status(500).json({ success: false, error: 'Error creating treatment' });
  }
});

// Retrieve all treatments
app.get('/api/treatments', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM treatments ORDER BY id ASC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error retrieving treatments:', error);
    res.status(500).json({ success: false, error: 'Error retrieving treatments' });
  }
});

/* --------------------------------------------
   PACKAGES ENDPOINTS
--------------------------------------------- */

// Create a new package
app.post('/api/packages', async (req, res) => {
  try {
    const { package_name, treatment, sessions, price } = req.body;
    const insertQuery = `
      INSERT INTO packages (
        package_name,
        treatment,
        sessions,
        price
      )
      VALUES ($1, $2, $3, $4)
      RETURNING id;
    `;
    const result = await pool.query(insertQuery, [package_name, treatment, sessions, price]);
    res.json({ success: true, message: 'Package created', packageId: result.rows[0].id });
  } catch (error) {
    console.error('Error creating package:', error);
    res.status(500).json({ success: false, error: 'Error creating package' });
  }
});

// Retrieve all packages
app.get('/api/packages', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM packages ORDER BY id ASC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error retrieving packages:', error);
    res.status(500).json({ success: false, error: 'Error retrieving packages' });
  }
});

/* --------------------------------------------
   START THE SERVER
--------------------------------------------- */
app.listen(4000, () => {
  console.log('Server is running on port 4000');
});

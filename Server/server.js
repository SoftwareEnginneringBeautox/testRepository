// Load environment variables
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const crypto = require('crypto'); // For generating random tokens
const { Pool } = require('pg'); // Import Pool from pg package
const session = require('express-session');
const bcrypt = require('bcrypt');
const pgSession = require('connect-pg-simple')(session);
<<<<<<< HEAD
const nodemailer = require("nodemailer");

const app = express();

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Use express.json() for parsing JSON bodies
app.use(express.json());
=======
const isAuthenticated = require('./middleware/isAuthenticated');

const requiredEnvVars = [
  'DB_USER',
  'DB_PASSWORD',
  'DB_HOST',
  'DB_PORT',
  'DB_NAME',
  'SESSION_SECRET',
  'CLIENT_ORIGIN' // Expected production client origin
];

console.log("DB Host:", process.env.DB_HOST);
console.log("DB Password:", process.env.DB_PASSWORD);

requiredEnvVars.forEach((key) => {
  if (!process.env[key]) {
    console.error(`Missing required environment variable: ${key}`);
    process.exit(1);
  }
});

// Create PostgreSQL pool
const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
});

const app = express();

// Trust the proxy (important if behind a load balancer)
app.set('trust proxy', 1);
>>>>>>> 830e3c83a60361355b600d99b89ba7a4bf5a5ca7

// Use Helmet to set secure HTTP headers
app.use(helmet());

// Custom key generator for rate limiting to handle x-forwarded-for header safely
const customKeyGenerator = (req) => {
  const xForwarded = req.headers['x-forwarded-for'];
  if (xForwarded) {
    if (typeof xForwarded === 'string') {
      return xForwarded.split(',')[0].trim();
    }
    if (Array.isArray(xForwarded)) {
      return xForwarded[0];
    }
  }
  return req.ip;
};

// Apply rate limiting middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: "Too many requests from this IP, please try again after 15 minutes.",
  keyGenerator: customKeyGenerator,
});
app.use(limiter);


// Setup dynamic CORS to allow multiple origins
const allowedOrigins = [
  process.env.CLIENT_ORIGIN,         // e.g. "https://iewdmb6vjd.ap-southeast-2.awsapprunner.com"
  "http://localhost:3000"            // For local development
];
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Prevent caching of sensitive pages
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
});

// Session configuration using connect-pg-simple for production readiness
app.use(session({
  store: new pgSession({
    pool, // Use your PostgreSQL connection pool
    tableName: 'session',
    createTableIfMissing: true,  // Auto-create the "session" table if it doesn't exist
  }),
  secret: process.env.SESSION_SECRET || 'yourSecretKey',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // Enable in production (HTTPS required)
    httpOnly: true,
    sameSite: 'lax',
  },
}));

/* --------------------------------------------
   HEALTH CHECK ENDPOINT
--------------------------------------------- */
app.get('/health', (req, res) => {
  res.status(200).send("Server is healthy");
});

/* --------------------------------------------
   USER MANAGEMENT ENDPOINTS
--------------------------------------------- */

// Register endpoint (for creating new users)
app.post('/adduser', async (req, res) => {
  try {
    console.log("Received /adduser payload:", req.body);
    const { username, password, role, dayoff, email } = req.body;
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const insertst = `
      INSERT INTO accounts (username, password, role, dayoff, email)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id;
    `;
    const result = await pool.query(insertst, [username, hashedPassword, role, dayoff, email]);
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

<<<<<<< HEAD

app.delete('/deleteuser/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM accounts WHERE id = $1', [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, message: `User with ID ${id} deleted` });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ success: false, error: 'Error deleting user' });
  }
});

// Login endpoint with detailed error logging, input validation, and random token generation
=======
// Login endpoint
>>>>>>> 830e3c83a60361355b600d99b89ba7a4bf5a5ca7
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
          token,
          username: user.username,
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



app.get('/test-email', async (req, res) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: "isjasminedeguia@gmail.com",
      subject: "Test Email",
      text: "This is a test email from your server"
    });

    res.send("Email sent successfully!");
  } catch (err) {
    console.error("Email failed:", err);
    res.status(500).send("Email failed to send");
  }
});

// POST /api/forgot-password
app.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  const otp = generateOTP();
  const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
  console.log("Generated OTP:", otp);
  
  try {
  const result = await pool.query(
    "UPDATE accounts SET otp = $1, otp_expiry = $2 WHERE email = $3 RETURNING *",
    [otp, otpExpiry, email]
  );

  if (result.rowCount === 0) {
        console.log("❌ User not found in DB");
        return res.status(404).json({ message: "User not found" });
      }
  
      console.log("✅ User found, sending email...");
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP is ${otp}`,
    });

    res.json({ message: "OTP sent to email" });
  } catch (err) {
    console.error("❌ Forgot password error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/verify-otp
app.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;

  const result = await pool.query("SELECT otp, otp_expiry FROM accounts WHERE email = $1", [email]);
  const user = result.rows[0];

  if (!user || user.otp !== otp)
    return res.status(400).json({ message: "Invalid OTP" });

  if (new Date(user.otp_expiry) < new Date())
    return res.status(400).json({ message: "OTP expired" });

  res.json({ message: "OTP verified" });
});

// POST /api/reset-password
app.post("/reset-password", async (req, res) => {
  const { email, otp, newPassword } = req.body;

  const result = await pool.query("SELECT otp, otp_expiry FROM accounts WHERE email = $1", [email]);
  const user = result.rows[0];

  if (!user || user.otp !== otp)
    return res.status(400).json({ message: "Invalid OTP" });

  if (new Date(user.otp_expiry) < new Date())
    return res.status(400).json({ message: "OTP expired" });

  const hashed = await bcrypt.hash(newPassword, 10);

  await pool.query(
    "UPDATE accounts SET password = $1, otp = NULL, otp_expiry = NULL WHERE email = $2",
    [hashed, email]
  );

  res.json({ message: "Password reset successful" });
});


/* --------------------------------------------
   START THE SERVER
--------------------------------------------- */
app.listen(4000, () => {
  console.log('Server is running on port 4000');
});

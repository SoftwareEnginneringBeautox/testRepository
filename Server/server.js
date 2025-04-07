// Load environment variables (for local dev; in production, AWS environment variables override these)
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const crypto = require('crypto'); // For generating random tokens
const { Pool } = require('pg'); // Import Pool from pg package
const session = require('express-session');
const bcrypt = require('bcrypt');
const pgSession = require('connect-pg-simple')(session);
const nodemailer = require("nodemailer");
const isAuthenticated = require('./middleware/isAuthenticated');

// Check required environment variables
const requiredEnvVars = [
  'DB_USER',
  'DB_PASSWORD',
  'DB_HOST',
  'DB_PORT',
  'DB_NAME',
  'SESSION_SECRET',
  'CLIENT_ORIGIN',  // e.g., "https://your-production-domain.com"
  'CLIENT_API_KEY'  // For API key-based authentication
];

requiredEnvVars.forEach((key) => {
  if (!process.env[key]) {
    console.error(`Missing required environment variable: ${key}`);
    process.exit(1);
  }
});

console.log("DB Host:", process.env.DB_HOST);
console.log("DB Password:", process.env.DB_PASSWORD);

// Create PostgreSQL pool
const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
});

const app = express();

// Generate a 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// For parsing JSON bodies
app.use(express.json());

// Trust the proxy (important if behind a load balancer)
app.set('trust proxy', 1);

// Use Helmet for secure HTTP headers
app.use(helmet());

// Custom key generator for rate limiting (handles x-forwarded-for)
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

// Apply rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: "Too many requests from this IP, please try again after 15 minutes.",
  keyGenerator: customKeyGenerator,
});
app.use(limiter);

// Dynamic CORS setup to allow both production and local dev
const allowedOrigins = [
  process.env.CLIENT_ORIGIN,                      // e.g., "https://iewdmb6vjd.ap-southeast-2.awsapprunner.com"
  "http://localhost:3000",                        // Local dev
  "https://iewdmb6vjd.ap-southeast-2.awsapprunner.com"  // Ensure no trailing slash here
];
//do not change from line 101 to line 117
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);

    // Normalize the origin by removing any trailing slash
    const normalizedOrigin = origin.endsWith('/') ? origin.slice(0, -1) : origin;
    if (allowedOrigins.indexOf(normalizedOrigin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
var test = 0;
//do not change from line 101 to line 117
// Handle preflight OPTIONS requests
app.options('*', cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    const normalizedOrigin = origin.endsWith('/') ? origin.slice(0, -1) : origin;
    if (allowedOrigins.indexOf(normalizedOrigin) !== -1) {
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

// Session configuration using connect-pg-simple
app.use(session({
  store: new pgSession({
    pool,
    tableName: 'session',
    createTableIfMissing: true,
  }),
  secret: process.env.SESSION_SECRET || 'yourSecretKey',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // enable in production (HTTPS required)
    httpOnly: true,
    // For production, if your client is on a different domain, use 'none'
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
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

// Delete a user
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
      contact_number,
      age,
      email,
      person_in_charge,
      package_name,
      treatment_ids,
      total_amount,
      package_discount,
      payment_method,
      date_of_session,
      time_of_session,
      consent_form_signed,
      archived,
      amount_paid,
      remaining_balance,
      reference_number
    } = req.body;

    const insertQuery = `
      INSERT INTO patient_records (
        patient_name,
        contact_number,
        age,
        email,
        person_in_charge,
        package_name,
        treatment_ids,
        total_amount,
        package_discount,
        payment_method,
        date_of_session,
        time_of_session,
        consent_form_signed,
        archived,
        amount_paid,
        remaining_balance,
        reference_number
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
      RETURNING id;
    `;

    const values = [
      patient_name,
      contact_number,
      age,
      email,
      person_in_charge,
      package_name,
      treatment_ids,
      total_amount,
      package_discount,
      payment_method,
      date_of_session,
      time_of_session,
      consent_form_signed,
      archived,
      amount_paid,
      remaining_balance,
      reference_number
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
    const { full_name, contact_number, age, email, date_of_session, time_of_session, archived } = req.body;
    const insertQuery = `
      INSERT INTO appointments (
        full_name,
        contact_number,
        age,
        email,
        date_of_session,
        time_of_session,
        archived
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id;
    `;
    const values = [full_name, contact_number, age, email, date_of_session, time_of_session, archived];

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
    const today = new Date();
    console.log("🕒 Server date today is:", today.toISOString().slice(0, 10));

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
    const { treatment_name, price, duration, expiration } = req.body;
    const insertQuery = `
      INSERT INTO treatments (
        treatment_name,
        price,
        duration,
        expiration
      )
      VALUES ($1, $2, $3, $4)
      RETURNING id;
    `;
    const result = await pool.query(insertQuery, [treatment_name, price, duration, expiration]);
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
    const { package_name, treatment_ids, sessions, price, expiration } = req.body;
    const insertQuery = `
      INSERT INTO packages (
        package_name,
        treatment_ids,
        sessions,
        price,
        expiration
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id;
    `;
    const result = await pool.query(insertQuery, [package_name, treatment_ids, sessions, price, expiration]);
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
   EMAIL + OTP ENDPOINTS
--------------------------------------------- */
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

  res.json({ success: true, message: "OTP verified" });
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
   EDIT + ARCHIVE ENDPOINTS
--------------------------------------------- */

// POST-based general edit/archive handler
app.post('/api/manage-record', async (req, res) => {
  const { table, id, action, data } = req.body; // action: 'edit' or 'archive'

  const editableTables = ['expenses_tracker', 'patient_records', 'accounts', 'packages', 'treatments', 'appointments'];
  if (!editableTables.includes(table)) {
    return res.status(400).json({ success: false, message: 'Invalid table name' });
  }

  try {
    if (action === 'edit') {
      if (!data || typeof data !== 'object') {
        return res.status(400).json({ success: false, message: 'Missing or invalid data' });
      }

      const fields = Object.keys(data);
      const values = Object.values(data);
      const setClause = fields.map((field, idx) => `${field} = $${idx + 1}`).join(', ');
      const query = `UPDATE ${table} SET ${setClause} WHERE id = $${fields.length + 1}`;
      await pool.query(query, [...values, id]);
      console.log("🔧 Incoming update fields:", fields);
      console.log("🧾 Incoming update values:", values);
      return res.json({ success: true, message: `${table} record updated` });
    }

    if (action === 'archive') {
      const query = `UPDATE ${table} SET archived = TRUE WHERE id = $1`;
      await pool.query(query, [id]);

      return res.json({ success: true, message: `${table} record archived` });
    }

    return res.status(400).json({ success: false, message: 'Invalid action' });
  } catch (err) {
    console.error(`Error in manage-record (${action}):`, err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});


/* --------------------------------------------
   SALES AND EXPENSES ENDPOINTS
--------------------------------------------- */

//Fetch Sales Data
app.get("/sales", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM sales_tracker ORDER BY date_transacted DESC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.get("/api/sales", async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    // Default to last 7 days if dates not provided
    const end = endDate ? new Date(endDate) : new Date();
    const start = startDate ? new Date(startDate) : new Date(end);
    start.setDate(start.getDate() - 7); // Default to a week before end date
    
    // Format dates for SQL query
    const formattedStartDate = start.toISOString().split('T')[0];
    const formattedEndDate = end.toISOString().split('T')[0];
    
    // Get current week's data
    const currentWeekQuery = `
      SELECT 
        TO_CHAR(date_transacted, 'Day') as day,
        SUM(payment) as amount
      FROM 
        sales_tracker
      WHERE 
        date_transacted BETWEEN $1 AND $2
      GROUP BY 
        TO_CHAR(date_transacted, 'Day'), 
        date_transacted
      ORDER BY 
        date_transacted
    `;
    
    // Get previous week's data (same days of week, but 7 days earlier)
    const previousStart = new Date(start);
    previousStart.setDate(previousStart.getDate() - 7);
    const previousEnd = new Date(end);
    previousEnd.setDate(previousEnd.getDate() - 7);
    
    const previousWeekQuery = `
      SELECT 
        TO_CHAR(date_transacted, 'Day') as day,
        SUM(payment) as amount
      FROM 
        sales_tracker
      WHERE 
        date_transacted BETWEEN $1 AND $2
      GROUP BY 
        TO_CHAR(date_transacted, 'Day'),
        date_transacted
      ORDER BY 
        date_transacted
    `;
    
    // Execute both queries
    const currentWeekResult = await pool.query(currentWeekQuery, [formattedStartDate, formattedEndDate]);
    const previousWeekResult = await pool.query(previousWeekQuery, [
      previousStart.toISOString().split('T')[0], 
      previousEnd.toISOString().split('T')[0]
    ]);
    
    // Process results into days of the week
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const salesData = daysOfWeek.map(day => {
      // Find current week data for this day
      const currentDayData = currentWeekResult.rows.find(row => row.day.trim().startsWith(day));
      // Find previous week data for this day
      const previousDayData = previousWeekResult.rows.find(row => row.day.trim().startsWith(day));
      
      return {
        day,
        currentWeek: currentDayData ? parseFloat(currentDayData.amount) : 0,
        previousWeek: previousDayData ? parseFloat(previousDayData.amount) : 0
      };
    });
    
    res.json(salesData);
  } catch (error) {
    console.error("Error fetching sales data for chart:", error);
    res.status(500).json({ error: "Failed to fetch sales data" });
  }
});
app.post("/sales", async (req, res) => {
  try {
    // Destructure incoming data
    const {
      client,
      person_in_charge,
      date_transacted,
      payment_method,
      packages,
      treatment,
      payment,
      reference_no
    } = req.body;

    // (Optional) Basic validation
    if (!client || !date_transacted || payment == null) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: 'client', 'date_transacted', or 'payment'."
      });
    }

    // Insert into sales_tracker table
    const insertQuery = `
      INSERT INTO sales_tracker
        (client, person_in_charge, date_transacted, payment_method, packages, treatment, payment, reference_no)
      VALUES
        ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id;
    `;

    const values = [
      client,
      person_in_charge,
      date_transacted,   // Make sure this is in a valid Date or string format for your DB
      payment_method,
      packages,
      treatment,
      payment,           // e.g. numeric or decimal
      reference_no
    ];

    const result = await pool.query(insertQuery, values);

    // Return the newly created sale ID
    res.status(201).json({
      success: true,
      message: "Sale record created successfully",
      saleId: result.rows[0].id
    });
  } catch (error) {
    console.error("Error creating sale record:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
});

// Create a new expense
app.post("/api/expenses", async (req, res) => {
  try {
    const { category, expense, date } = req.body;

    // Validate required fields
    if (!category || !expense || !date) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: category, expense, and date are required"
      });
    }

    // Insert the expense into the database
    const insertQuery = `
      INSERT INTO expenses_tracker (
        category,
        expense,
        date,
        archived
      )
      VALUES ($1, $2, $3, $4)
      RETURNING id;
    `;

    const result = await pool.query(insertQuery, [category, expense, date, false]);

    // Return success with the new expense ID
    res.status(201).json({
      success: true,
      message: 'Expense created successfully',
      id: result.rows[0].id
    });
  } catch (error) {
    console.error('Error creating expense:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating expense',
      error: error.message
    });
  }
});

// Fetch Expenses Data
app.get("/expenses", async (req, res) => {
  try {
    // Ensure the content type is set to JSON
    res.setHeader('Content-Type', 'application/json');
    
    // Explicitly prevent caching
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    
    // Get the data from the database
    const result = await pool.query("SELECT * FROM expenses_tracker ORDER BY date DESC");
    console.log("API /expenses endpoint called, returning", result.rows.length, "records");
    
    // Count April 2025 records for debugging
    const april2025Count = result.rows.filter(row => {
      if (!row.date) return false;
      const date = new Date(row.date);
      return date.getMonth() + 1 === 4 && date.getFullYear() === 2025;
    }).length;
    
    console.log("April 2025 expenses:", april2025Count);
    
    // Return the data as JSON with explicit JSON.stringify
    // This prevents any chance of returning HTML by mistake
    const jsonResponse = JSON.stringify(result.rows);
    return res.send(jsonResponse);
  } catch (err) {
    // Handle errors by returning JSON, not HTML
    console.error("Error fetching expenses:", err);
    
    // Return a proper JSON error response
    return res.status(500).json({ 
      error: err.message,
      timestamp: new Date().toISOString()
    });
  }
});
app.get("/api/test-expenses", async (req, res) => {
  try {
    // Test the database connection first
    const connectionTest = await pool.query("SELECT NOW() as time");
    console.log("Database connection test:", connectionTest.rows[0]);
    
    // Query the expenses table
    const result = await pool.query("SELECT * FROM expenses_tracker LIMIT 10");
    
    // Log detailed information about the results
    console.log("Expenses test query returned", result.rows.length, "records");
    
    // Count April 2025 records
    const april2025Count = result.rows.filter(row => {
      const date = new Date(row.date);
      return date.getMonth() + 1 === 4 && date.getFullYear() === 2025;
    }).length;
    
    console.log("April 2025 expenses in test:", april2025Count);
    
    // Send response with success details
    res.json({
      success: true,
      message: "Test completed successfully",
      count: result.rows.length,
      april2025Count: april2025Count,
      sample: result.rows.slice(0, 3)
    });
  } catch (err) {
    console.error("Error in test-expenses endpoint:", err);
    res.status(500).json({
      success: false,
      message: "Test failed",
      error: err.message
    });
  }
});

// Fetch Financial Overview (Total Sales, Expenses, Net Income)
app.get("/financial-overview", async (req, res) => {
  try {
    const totalSalesResult = await pool.query("SELECT SUM(payment) AS total_sales FROM sales_tracker");
    const totalExpensesResult = await pool.query("SELECT SUM(expense) AS total_expenses FROM expenses_tracker");

    const totalSales = totalSalesResult.rows[0].total_sales || 0;
    const totalExpenses = totalExpensesResult.rows[0].total_expenses || 0;
    const netIncome = totalSales - totalExpenses;

    res.json({ totalSales, totalExpenses, netIncome });
  } catch (err) {
    res.status(500).send(err.message);
  }
});
// Add this endpoint to your server.js file

// Improved endpoint for expenses with more robust error handling and optional date filtering
// Add this endpoint to your server.js file

// Improved endpoint for expenses with more robust error handling and optional date filtering
app.get("/api/expenses-by-month", async (req, res) => {
  try {
    // Set proper content type and caching headers
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'no-cache, no-store');
    
    // Get query parameters for optional filtering
    const { month, year } = req.query;
    let query = "SELECT * FROM expenses_tracker WHERE archived = FALSE";
    const queryParams = [];
    
    // Add date filtering if month and year are provided
    if (month && year) {
      // SQL date filtering for PostgreSQL
      query += ` AND EXTRACT(MONTH FROM date) = $1 AND EXTRACT(YEAR FROM date) = $2`;
      queryParams.push(parseInt(month), parseInt(year));
    }
    
    // Add ordering
    query += " ORDER BY date DESC";
    
    // Execute the query
    const result = await pool.query(query, queryParams);
    
    console.log(`API /api/expenses-by-month endpoint: Returning ${result.rows.length} records`);
    if (month && year) {
      console.log(`Filtered for month ${month}, year ${year}`);
    }
    
    // Transform the data for easier consumption by the frontend
    const transformedData = result.rows.map(row => ({
      id: row.id,
      category: row.category,
      expense: parseFloat(row.expense), // Ensure numeric value
      date: row.date,
      formattedDate: new Date(row.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long', 
        day: 'numeric'
      })
    }));
    
    // Group by category for convenience (optional)
    const groupedByCategory = {};
    transformedData.forEach(expense => {
      if (!groupedByCategory[expense.category]) {
        groupedByCategory[expense.category] = {
          category: expense.category,
          totalAmount: 0,
          expenses: []
        };
      }
      
      groupedByCategory[expense.category].totalAmount += expense.expense;
      groupedByCategory[expense.category].expenses.push(expense);
    });
    
    // Return both raw data and the pre-grouped data
    res.json({
      success: true,
      count: transformedData.length,
      expenses: transformedData,
      expensesByCategory: Object.values(groupedByCategory)
    });
  } catch (err) {
    console.error("Error fetching expenses:", err);
    res.status(500).json({ 
      success: false, 
      error: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined 
    });
  }
});

// Also add an endpoint that just returns the aggregated summary
app.get("/api/expenses-summary", async (req, res) => {
  try {
    const { month, year } = req.query;
    let whereClause = "WHERE archived = FALSE";
    const queryParams = [];
    
    if (month && year) {
      whereClause += ` AND EXTRACT(MONTH FROM date) = $1 AND EXTRACT(YEAR FROM date) = $2`;
      queryParams.push(parseInt(month), parseInt(year));
    }
    
    // SQL query using group by to aggregate by category
    const query = `
      SELECT 
        category,
        SUM(expense) as total_amount,
        COUNT(*) as transaction_count
      FROM expenses_tracker
      ${whereClause}
      GROUP BY category
      ORDER BY total_amount DESC
    `;
    
    const result = await pool.query(query, queryParams);
    
    console.log(`API /api/expenses-summary endpoint: Returning ${result.rows.length} categories`);
    
    // Calculate total across all categories
    const totalExpenses = result.rows.reduce(
      (sum, row) => sum + parseFloat(row.total_amount), 0
    );
    
    res.json({
      success: true,
      totalExpenses,
      categoryCount: result.rows.length,
      categories: result.rows.map(row => ({
        name: row.category,
        amount: parseFloat(row.total_amount),
        count: parseInt(row.transaction_count),
        percentage: (parseFloat(row.total_amount) / totalExpenses * 100).toFixed(1)
      }))
    });
  } catch (err) {
    console.error("Error fetching expenses summary:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

/* --------------------------------------------
   CATEGORIES MANAGEMENT ENDPOINTS
--------------------------------------------- */

// Create the expense_categories table if it doesn't exist
app.post('/api/initialize-categories-table', async (req, res) => {
  try {
    // Create the categories table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS expense_categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        archived BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    res.json({ success: true, message: 'Expense categories table initialized' });
  } catch (error) {
    console.error('Error initializing expense_categories table:', error);
    res.status(500).json({
      success: false,
      message: 'Error initializing expense_categories table',
      error: error.message
    });
  }
});

// Get all active categories
app.get('/api/categories', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM expense_categories WHERE archived = FALSE ORDER BY name'
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error retrieving categories:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving categories',
      error: error.message
    });
  }
});

// Create a new category
app.post('/api/categories', async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || name.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Category name is required'
      });
    }

    const trimmedName = name.trim();

    // Check if the category already exists (case insensitive)
    const checkQuery = 'SELECT * FROM expense_categories WHERE LOWER(name) = LOWER($1) AND archived = FALSE';
    const checkResult = await pool.query(checkQuery, [trimmedName]);

    if (checkResult.rowCount > 0) {
      return res.status(400).json({
        success: false,
        message: 'This category already exists'
      });
    }

    // Create the new category
    const insertQuery = 'INSERT INTO expense_categories (name) VALUES ($1) RETURNING id';
    const result = await pool.query(insertQuery, [trimmedName]);

    res.status(201).json({
      success: true,
      id: result.rows[0].id,
      message: 'Category created successfully'
    });
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating category',
      error: error.message
    });
  }
});

// Update an existing category
app.put('/api/categories/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    console.log(`Updating category ${id} with name: ${name}`);

    if (!name || name.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Category name is required'
      });
    }

    const query = 'UPDATE expense_categories SET name = $1 WHERE id = $2';
    const result = await pool.query(query, [name.trim(), id]);

    console.log(`Update result: ${result.rowCount} rows affected`);

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    res.json({
      success: true,
      message: 'Category updated successfully'
    });
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating category',
      error: error.message
    });
  }
});

// Archive a category
app.patch('/api/categories/:id/archive', async (req, res) => {
  try {
    const { id } = req.params;

    const query = 'UPDATE expense_categories SET archived = TRUE WHERE id = $1';
    const result = await pool.query(query, [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    res.json({
      success: true,
      message: 'Category archived successfully'
    });
  } catch (error) {
    console.error('Error archiving category:', error);
    res.status(500).json({
      success: false,
      message: 'Error archiving category',
      error: error.message
    });
  }
});

/* --------------------------------------------
   START THE SERVER
--------------------------------------------- */
app.listen(4000, () => {
  console.log('Server is running on port 4000');
});

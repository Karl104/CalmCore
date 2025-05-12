const apiUrl = 'http://localhost/api/auth.php';
const express = require('express');
const cors = require('cors');
const { initializeDatabase } = require('./database/db');
const userController = require('./controllers/userController');
const authController = require('./controllers/authController');
const loginHistoryRoutes = require('./routes/loginHistory'); // Added: Import login history routes

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database
initializeDatabase().catch(console.error);

// Test route
app.get('/api/test', (req, res) => {
    res.json({ message: 'Backend server is running!' });
});

// Auth routes
app.post('/api/auth/login', authController.login);
app.post('/api/auth/register', authController.register);
app.post('/api/auth/forgot-password', authController.forgotPassword);
app.post('/api/auth/reset-password', authController.resetPassword);

// User routes
app.get('/api/users', userController.getAllUsers);
app.get('/api/users/:id', userController.getUserById);
app.post('/api/users', userController.createUser);
app.put('/api/users/:id', userController.updateUser);
app.delete('/api/users/:id', userController.deleteUser);

// Login History routes
app.use('/api', loginHistoryRoutes); // Added: Mount login history routes

// Start server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
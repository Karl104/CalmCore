const { pool } = require('../database/db');
const userController = require('./userController');

const authController = {
    // Login user
    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            const [rows] = await pool.query('SELECT * FROM users WHERE email = ? AND password = ?', [email, password]);
            
            if (rows.length > 0) {
                // Update last login
                await userController.updateLastLogin(rows[0].id);
                
                res.json({
                    status: 'success',
                    message: 'Login successful',
                    token: 'user-token-here', // Add token here
                    user: {
                        id: rows[0].id,
                        name: rows[0].name,
                        email: rows[0].email,
                        role: rows[0].role
                    }
                });
            } else {
                res.status(401).json({
                    status: 'error',
                    message: 'Invalid email or password'
                });
            }
        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({ status: 'error', message: 'Internal server error' });
        }
    },

    // Register new user
    register: async (req, res) => {
        try {
            const { name, email, password } = req.body;
            
            // Check if email already exists
            const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
            if (existing.length > 0) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Email already registered'
                });
            }

            // Create new user
            const result = await pool.query(
                'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
                [name, email, password, 'user']
            );

            res.status(201).json({
                status: 'success',
                message: 'Registration successful',
                userId: result[0].insertId
            });
        } catch (error) {
            console.error('Registration error:', error);
            res.status(500).json({ status: 'error', message: 'Internal server error' });
        }
    },

    // Forgot password
    forgotPassword: async (req, res) => {
        try {
            const { email } = req.body;
            const [rows] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
            
            if (rows.length > 0) {
                // In a real application, you would:
                // 1. Generate a password reset token
                // 2. Store it in the database with an expiration time
                // 3. Send an email with a reset link
                res.json({
                    status: 'success',
                    message: 'Password reset instructions sent to email'
                });
            } else {
                res.status(404).json({
                    status: 'error',
                    message: 'Email not found'
                });
            }
        } catch (error) {
            console.error('Forgot password error:', error);
            res.status(500).json({ status: 'error', message: 'Internal server error' });
        }
    },

    // Reset password
    resetPassword: async (req, res) => {
        try {
            const { email, newPassword } = req.body;
            const [rows] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
            
            if (rows.length > 0) {
                await pool.query('UPDATE users SET password = ? WHERE id = ?', [newPassword, rows[0].id]);
                res.json({
                    status: 'success',
                    message: 'Password reset successful'
                });
            } else {
                res.status(404).json({
                    status: 'error',
                    message: 'Email not found'
                });
            }
        } catch (error) {
            console.error('Reset password error:', error);
            res.status(500).json({ status: 'error', message: 'Internal server error' });
        }
    }
};

module.exports = authController;
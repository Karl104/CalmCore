const { pool } = require('../database/db');

// User controller functions
const userController = {
    // Get all users
    getAllUsers: async (req, res) => {
        try {
            const [rows] = await pool.query('SELECT id, name, email, role, created_at, last_login FROM users');
            res.json({ users: rows });
        } catch (error) {
            console.error('Error getting users:', error);
            res.status(500).json({ status: 'error', message: 'Internal server error' });
        }
    },

    // Get user by ID
    getUserById: async (req, res) => {
        try {
            const [rows] = await pool.query('SELECT id, name, email, role, created_at, last_login FROM users WHERE id = ?', [req.params.id]);
            if (rows.length === 0) {
                return res.status(404).json({ status: 'error', message: 'User not found' });
            }
            res.json({ user: rows[0] });
        } catch (error) {
            console.error('Error getting user:', error);
            res.status(500).json({ status: 'error', message: 'Internal server error' });
        }
    },

    // Create new user
    createUser: async (req, res) => {
        try {
            const { name, email, password, role } = req.body;
            const result = await pool.query(
                'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
                [name, email, password, role || 'user']
            );
            res.status(201).json({ 
                status: 'success', 
                message: 'User created successfully',
                userId: result[0].insertId 
            });
        } catch (error) {
            console.error('Error creating user:', error);
            res.status(500).json({ status: 'error', message: 'Internal server error' });
        }
    },

    // Update user
    updateUser: async (req, res) => {
        try {
            const { name, email, role } = req.body;
            await pool.query(
                'UPDATE users SET name = ?, email = ?, role = ? WHERE id = ?',
                [name, email, role, req.params.id]
            );
            res.json({ status: 'success', message: 'User updated successfully' });
        } catch (error) {
            console.error('Error updating user:', error);
            res.status(500).json({ status: 'error', message: 'Internal server error' });
        }
    },

    // Delete user
    deleteUser: async (req, res) => {
        try {
            await pool.query('DELETE FROM users WHERE id = ?', [req.params.id]);
            res.json({ status: 'success', message: 'User deleted successfully' });
        } catch (error) {
            console.error('Error deleting user:', error);
            res.status(500).json({ status: 'error', message: 'Internal server error' });
        }
    },

    // Update last login
    updateLastLogin: async (userId) => {
        try {
            await pool.query('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?', [userId]);
        } catch (error) {
            console.error('Error updating last login:', error);
        }
    }
};

module.exports = userController; 
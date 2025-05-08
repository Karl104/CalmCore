<template>
  <div class="admin-container">
    <!-- Login Form -->
    <div v-if="!isAuthenticated" class="login-form">
      <h2>Admin Login</h2>
      <div v-if="error" class="error-alert">
        {{ error }}
      </div>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="email">Email</label>
          <input
            type="email"
            id="email"
            v-model="loginCredentials.email"
            required
          />
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input
            type="password"
            id="password"
            v-model="loginCredentials.password"
            required
          />
        </div>
        <button type="submit" class="btn-primary">Login</button>
      </form>
    </div>

    <!-- Admin Dashboard -->
    <div v-else class="dashboard">
      <div class="dashboard-header">
        <h2>Admin Dashboard</h2>
        <button @click="handleLogout" class="btn-danger">Logout</button>
      </div>

      <!-- Admin Directory Section -->
      <div class="section">
        <h3>Admin Directory</h3>
        <div class="admin-info">
          <div class="info-card">
            <h4>Admin Information</h4>
            <div class="info-item">
              <span class="label">Email:</span>
              <span class="value">admin@calmcore.com</span>
            </div>
            <div class="info-item">
              <span class="label">Role:</span>
              <span class="value">Super Administrator</span>
            </div>
            <div class="info-item">
              <span class="label">Last Login:</span>
              <span class="value">{{ lastLoginTime }}</span>
            </div>
            <div class="info-item">
              <span class="label">Status:</span>
              <span class="value status-active">Active</span>
            </div>
          </div>
          <div class="admin-stats">
            <div class="stat-card">
              <h4>Total Users</h4>
              <div class="stat-value">{{ users.length }}</div>
            </div>
            <div class="stat-card">
              <h4>Active Sessions</h4>
              <div class="stat-value">{{ activeSessions }}</div>
            </div>
            <div class="stat-card">
              <h4>Total Logins Today</h4>
              <div class="stat-value">{{ todayLogins }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- User Management Section -->
      <div class="section">
        <h3>User Management</h3>
        <button @click="openDialog = true" class="btn-primary">Add New User</button>

        <table class="data-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user.id">
              <td>{{ user.username }}</td>
              <td>{{ user.role }}</td>
              <td>
                <button @click="handleDeleteUser(user.id)" class="btn-danger">
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Login History Section -->
      <div class="section">
        <h3>Login History</h3>
        <table class="data-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Action</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(history, index) in loginHistory" :key="index">
              <td>{{ history.username }}</td>
              <td>{{ history.action }}</td>
              <td>{{ history.timestamp }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Add User Dialog -->
      <div v-if="openDialog" class="dialog-overlay">
        <div class="dialog">
          <h3>Add New User</h3>
          <div v-if="error" class="error-alert">
            {{ error }}
          </div>
          <div class="form-group">
            <label for="new-username">Username</label>
            <input
              type="text"
              id="new-username"
              v-model="newUser.username"
              required
            />
          </div>
          <div class="form-group">
            <label for="new-password">Password</label>
            <input
              type="password"
              id="new-password"
              v-model="newUser.password"
              required
            />
          </div>
          <div class="dialog-actions">
            <button @click="openDialog = false" class="btn-secondary">Cancel</button>
            <button @click="handleAddUser" class="btn-primary">Add User</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminView',
  data() {
    return {
      users: [],
      loginHistory: [],
      openDialog: false,
      newUser: {
        username: '',
        password: '',
        role: 'user'
      },
      error: '',
      isAuthenticated: false,
      loginCredentials: {
        email: '',
        password: ''
      },
      lastLoginTime: '',
      activeSessions: 0,
      todayLogins: 0
    }
  },
  created() {
    // Check if admin is already logged in
    const adminLoggedIn = localStorage.getItem('adminLoggedIn')
    if (adminLoggedIn === 'true') {
      this.isAuthenticated = true
      this.updateAdminStats()
    }
  },
  methods: {
    updateAdminStats() {
      // Set last login time
      this.lastLoginTime = new Date().toLocaleString()
      
      // Count active sessions (users with loggedInUser in localStorage)
      const activeUsers = Object.keys(localStorage).filter(key => key.startsWith('loggedInUser'))
      this.activeSessions = activeUsers.length

      // Count today's logins
      const today = new Date().toDateString()
      this.todayLogins = this.loginHistory.filter(history => 
        new Date(history.timestamp).toDateString() === today
      ).length
    },
    handleLogin() {
      // Hardcoded admin email account
      if (
        this.loginCredentials.email === 'admin@calmcore.com' && 
        this.loginCredentials.password === 'Admin@123'
      ) {
        this.isAuthenticated = true
        localStorage.setItem('adminLoggedIn', 'true')
        this.addLoginHistory('admin@calmcore.com', 'login')
      } else {
        this.error = 'Invalid credentials'
      }
    },
    handleLogout() {
      this.isAuthenticated = false
      localStorage.removeItem('adminLoggedIn')
      this.addLoginHistory('admin', 'logout')
    },
    addLoginHistory(username, action) {
      const history = {
        username,
        action,
        timestamp: new Date().toLocaleString()
      }
      this.loginHistory.unshift(history)
    },
    handleAddUser() {
      if (!this.newUser.username || !this.newUser.password) {
        this.error = 'Please fill in all fields'
        return
      }
      this.users.push({
        ...this.newUser,
        id: Date.now()
      })
      this.newUser = {
        username: '',
        password: '',
        role: 'user'
      }
      this.openDialog = false
      this.error = ''
    },
    handleDeleteUser(userId) {
      this.users = this.users.filter(user => user.id !== userId)
    }
  }
}
</script>

<style scoped>
.admin-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.login-form {
  max-width: 400px;
  margin: 40px auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section {
  margin-bottom: 30px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
}

.form-group input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 15px;
}

.data-table th,
.data-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.data-table th {
  background-color: #f5f5f5;
}

.btn-primary {
  background-color: #4CAF50;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-danger {
  background-color: #f44336;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-secondary {
  background-color: #9e9e9e;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.error-alert {
  background-color: #ffebee;
  color: #c62828;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 15px;
}

.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.dialog {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  min-width: 400px;
}

.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

button {
  transition: background-color 0.3s;
}

button:hover {
  opacity: 0.9;
}

.admin-info {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 20px;
  margin-bottom: 30px;
}

.info-card {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.info-card h4 {
  margin-bottom: 15px;
  color: #333;
  font-size: 1.1rem;
}

.info-item {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}

.info-item:last-child {
  border-bottom: none;
}

.label {
  color: #666;
  font-weight: 500;
}

.value {
  color: #333;
}

.status-active {
  color: #4CAF50;
  font-weight: 500;
}

.admin-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
}

.stat-card {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.stat-card h4 {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 10px;
}

.stat-value {
  color: #333;
  font-size: 1.8rem;
  font-weight: 600;
}

@media (max-width: 768px) {
  .admin-info {
    grid-template-columns: 1fr;
  }
  
  .admin-stats {
    grid-template-columns: 1fr;
  }
}
</style> 
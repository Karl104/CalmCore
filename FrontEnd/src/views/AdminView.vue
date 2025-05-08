<template>
  <div class="admin-layout">
    <nav class="admin-nav">
      <div class="admin-nav-header">
        <h1>CalmCore Admin</h1>
      </div>
      <div class="admin-nav-footer">
        <button @click="handleLogout" class="btn-logout">Logout</button>
      </div>
    </nav>

    <div class="admin-content">
      <!-- User Management Table -->
      <div class="admin-section">
        <div class="section-header">
          <h3>User Management</h3>
          <button @click="openAddDialog = true" class="btn-primary">Add User</button>
        </div>
        <div class="table-container">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Name</th>
                <th>Role</th>
                <th>Created At</th>
                <th>Last Login</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in filteredUsers" :key="user.id">
                <td>{{ user.email }}</td>
                <td>{{ user.name }}</td>
                <td><span :class="['role-badge', user.role]">{{ user.role }}</span></td>
                <td>{{ formatDate(user.created_at) }}</td>
                <td>{{ user.last_login ? formatDate(user.last_login) : 'Never' }}</td>
                <td>
                  <button @click="editUser(user)" class="btn-secondary">Edit</button>
                  <button @click="handleDeleteUser(user.id)" class="btn-danger">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Login History Table -->
      <div class="admin-section">
        <div class="section-header">
          <h3>Login History</h3>
        </div>
        <div class="table-container">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Action</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(history, index) in loginHistory" :key="index">
                <td>{{ history.email }}</td>
                <td>{{ history.action }}</td>
                <td>{{ formatDate(history.timestamp) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Add/Edit User Dialog -->
      <div v-if="openAddDialog" class="dialog-overlay">
        <div class="dialog">
          <h3>{{ editingUser ? 'Edit User' : 'Add New User' }}</h3>
          <div v-if="error" class="error-alert">
            {{ error }}
          </div>
          <div class="form-group">
            <label for="email">Email</label>
            <input
              type="email"
              id="email"
              v-model="newUser.email"
              required
            />
          </div>
          <div class="form-group">
            <label for="name">Name</label>
            <input
              type="text"
              id="name"
              v-model="newUser.name"
              required
            />
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input
              type="password"
              id="password"
              v-model="newUser.password"
              :required="!editingUser"
              :placeholder="editingUser ? 'Leave blank to keep unchanged' : ''"
            />
          </div>
          <div class="form-group">
            <label for="role">Role</label>
            <select id="role" v-model="newUser.role">
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div class="dialog-actions">
            <button @click="openAddDialog = false" class="btn-secondary">Cancel</button>
            <button @click="handleUserAction" class="btn-primary">
              {{ editingUser ? 'Update' : 'Add' }} User
            </button>
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
      openAddDialog: false,
      editingUser: null,
      newUser: {
        email: '',
        name: '',
        password: '',
        role: 'user'
      },
      error: ''
    }
  },
  computed: {
    filteredUsers() {
      return this.users.filter(user => user.role === 'user')
    }
  },
  created() {
    this.fetchUsers()
    this.fetchLoginHistory()
  },
  methods: {
    formatDate(dateString) {
      return new Date(dateString).toLocaleString()
    },
    async fetchUsers() {
      try {
        const response = await fetch('http://localhost:3000/api/users', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('userToken')}`
          }
        })
        const data = await response.json()
        this.users = data.users
      } catch (error) {
        console.error('Error fetching users:', error)
        this.error = 'Failed to fetch users'
      }
    },
    async fetchLoginHistory() {
      try {
        const response = await fetch('http://localhost:3000/api/login-history', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('userToken')}`
          }
        })
        const data = await response.json()
        this.loginHistory = data.history
      } catch (error) {
        console.error('Error fetching login history:', error)
      }
    },
    editUser(user) {
      this.editingUser = user
      this.newUser = {
        email: user.email,
        name: user.name,
        password: '',
        role: user.role
      }
      this.openAddDialog = true
    },
    async handleUserAction() {
      if (!this.newUser.email || !this.newUser.name || (!this.editingUser && !this.newUser.password)) {
        this.error = 'Please fill in all required fields'
        return
      }

      try {
        const url = this.editingUser
          ? `http://localhost:3000/api/users/${this.editingUser.id}`
          : 'http://localhost:3000/api/users'
        
        const userData = {
          email: this.newUser.email,
          name: this.newUser.name,
          role: this.newUser.role
        }

        if (this.newUser.password) {
          userData.password = this.newUser.password
        }

        const response = await fetch(url, {
          method: this.editingUser ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('userToken')}`
          },
          body: JSON.stringify(userData)
        })

        if (response.ok) {
          this.openAddDialog = false
          this.editingUser = null
          this.newUser = {
            email: '',
            name: '',
            password: '',
            role: 'user'
          }
          this.fetchUsers()
        } else {
          const data = await response.json()
          this.error = data.message || 'Failed to process user'
        }
      } catch (error) {
        console.error('Error processing user:', error)
        this.error = 'An error occurred while processing the user'
      }
    },
    async handleDeleteUser(userId) {
      if (confirm('Are you sure you want to delete this user?')) {
        try {
          const response = await fetch(`http://localhost:3000/api/users/${userId}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('userToken')}`
            }
          })

          if (response.ok) {
            this.users = this.users.filter(user => user.id !== userId)
          } else {
            const data = await response.json()
            this.error = data.message || 'Failed to delete user'
          }
        } catch (error) {
          console.error('Error deleting user:', error)
          this.error = 'An error occurred while deleting the user'
        }
      }
    },
    handleLogout() {
      if (confirm('Are you sure you want to log out?')) {
        localStorage.removeItem('adminLoggedIn')
        localStorage.removeItem('userToken')
        this.$router.push('/login')
      }
    }
  }
}
</script>

<style scoped>
.admin-layout {
  display: grid;
  grid-template-columns: 250px 1fr;
  min-height: 100vh;
}

.admin-nav {
  background: #1a237e;
  color: white;
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.admin-nav-header h1 {
  margin: 0;
  font-size: 1.5rem;
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.admin-nav-footer {
  margin-top: auto;
}

.btn-logout {
  width: 100%;
  padding: 10px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-logout:hover {
  background: rgba(255, 255, 255, 0.2);
}

.admin-content {
  padding: 30px;
  background: #f5f5f5;
}

.admin-section {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
  overflow: hidden;
}

.section-header {
  padding: 20px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.section-header h3 {
  margin: 0;
  color: #1a237e;
}

.table-container {
  overflow-x: auto;
}

.admin-table {
  width: 100%;
  border-collapse: collapse;
}

.admin-table th,
.admin-table td {
  padding: 12px 20px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.admin-table th {
  background: #f8f9fa;
  font-weight: 600;
  color: #1a237e;
}

.role-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 500;
}

.role-badge.admin {
  background: #e3f2fd;
  color: #1565c0;
}

.role-badge.user {
  background: #f5f5f5;
  color: #616161;
}

.btn-primary {
  background: #1a237e;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-primary:hover {
  background: #283593;
}

.btn-secondary {
  background: #e3f2fd;
  color: #1565c0;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 8px;
  transition: background 0.3s;
}

.btn-secondary:hover {
  background: #bbdefb;
}

.btn-danger {
  background: #ffebee;
  color: #c62828;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-danger:hover {
  background: #ffcdd2;
}

.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.dialog {
  background: white;
  border-radius: 8px;
  padding: 24px;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.dialog h3 {
  margin: 0 0 20px;
  color: #1a237e;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #1a237e;
  font-weight: 500;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  transition: border-color 0.3s;
}

.form-group input:focus,
.form-group select:focus {
  border-color: #1a237e;
  outline: none;
}

.error-alert {
  background: #ffebee;
  color: #c62828;
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 16px;
}

.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
}

@media (max-width: 768px) {
  .admin-layout {
    grid-template-columns: 1fr;
  }

  .admin-nav {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 60px;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    z-index: 100;
  }

  .admin-nav-header h1 {
    padding: 0;
    border: none;
  }

  .admin-content {
    padding: 20px;
    padding-bottom: 80px;
  }

  .admin-table th,
  .admin-table td {
    padding: 12px;
  }
}
</style>
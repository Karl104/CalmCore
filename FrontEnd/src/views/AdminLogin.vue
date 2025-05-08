<template>
  <div class="login-page">
    <div class="welcome-section">
      <h1>Welcome Back Admin</h1>
      <p>Please login to access your dashboard</p>
    </div>
    <div class="login-section">
      <div class="login-container">
        <h2>Admin Login</h2>
        <form @submit.prevent="handleAdminLogin">
          <div class="form-group">
            <label for="email">Email:</label>
            <input type="email" id="email" v-model="email" required placeholder="Enter your admin email">
          </div>
          <div class="form-group">
            <label for="password">Password:</label>
            <div class="password-input-container">
              <input :type="passwordFieldType" id="password" v-model="password" required placeholder="Enter your password">
              <span @click="togglePasswordVisibility" class="password-toggle-icon">
                <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
              </span>
            </div>
          </div>
          <div class="action-links">
            <router-link to="/forget" class="forgot-password-link">Forgot Password?</router-link>
            <router-link to="/login" class="user-login-link">User Login</router-link>
          </div>
          <button type="submit" class="login-button">Admin Login</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

const email = ref('');
const password = ref('');
const showPassword = ref(false);
const router = useRouter();

const passwordFieldType = computed(() => showPassword.value ? 'text' : 'password');

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

const handleAdminLogin = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email.value,
        password: password.value
      })
    });

    const data = await response.json();

    if (data.status === 'success') {
      if (data.user && data.user.role === 'admin') {
        localStorage.setItem('userToken', data.token);
        localStorage.setItem('userRole', data.user.role);
        router.push('/admin');
      } else {
        alert('Access denied. This login is for administrators only.');
      }
    } else {
      alert('Invalid admin credentials. Please try again.');
    }
  } catch (error) {
    console.error('Login error:', error);
    alert('An error occurred during login. Please try again.');
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@300..700&display=swap');

.login-page {
  display: flex;
  min-height: 100vh;
  background-color: #f8fafc;
  font-family: 'Quicksand', sans-serif;
}

.welcome-section {
  flex: 1;
  background-color: #151515;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;
}

.welcome-section h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.welcome-section p {
  font-size: 1.2rem;
  opacity: 0.8;
}

.login-section {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
}

.login-container {
  width: 100%;
  max-width: 400px;
  padding: 2rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.login-container h2 {
  text-align: center;
  margin-bottom: 2rem;
  color: #151515;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #151515;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.form-group input:focus {
  outline: none;
  border-color: #151515;
}

.password-input-container {
  position: relative;
}

.password-toggle-icon {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: #64748b;
}

.action-links {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 1rem 0;
}

.forgot-password-link,
.user-login-link {
  color: #151515;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.9rem;
}

.forgot-password-link:hover,
.user-login-link:hover {
  text-decoration: underline;
}

.login-button {
  width: 100%;
  padding: 0.75rem;
  background-color: #151515;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;
}

.login-button:hover {
  background-color: #2d3748;
}

@media (max-width: 768px) {
  .login-page {
    flex-direction: column;
  }

  .welcome-section {
    padding: 3rem 1rem;
  }

  .login-section {
    padding: 1rem;
  }
}
</style>
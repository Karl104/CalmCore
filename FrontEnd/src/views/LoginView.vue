<template>
  <div class="login-page">
    <div class="welcome-section">
      <h1>Welcome Back</h1>
      <p>Log in to continue your journey with CalmCore.</p>

    </div>
    <div class="login-section">
      <div class="login-container">
        <h2>Login</h2>
        <form @submit.prevent="handleLogin">
          <div class="form-group">
            <label for="email">Email:</label>
            <input type="email" id="email" v-model="email" required placeholder="Enter your email">
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
          <p class="forgot-password-link">
          <router-link to="/forget-password">Forgot Password?</router-link>
        </p>
          <button type="submit" class="login-button">Login</button>
        </form>
        <p class="register-link">
          Don't have an account? <router-link to="/register">Register here</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router'; // Import useRouter

const email = ref('');
const password = ref('');
const showPassword = ref(false);
const router = useRouter(); // Initialize router

const passwordFieldType = computed(() => showPassword.value ? 'text' : 'password');

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

const handleLogin = () => {
  // Validate for whitespace in email
  if (/\s/.test(email.value)) {
    alert('Email must not contain whitespace.');
    return;
  }

  // Validate for whitespace in password
  if (/\s/.test(password.value)) {
    alert('Password must not contain whitespace.');
    return;
  }

  // Validate email length (e.g., min 5 characters)
  if (email.value.length < 5) {
    alert('Email must be at least 5 characters long.');
    return;
  }

  // Validate email maximum length (e.g., max 50 characters)
  if (email.value.length > 50) {
    alert('Email must not exceed 50 characters.');
    return;
  }

  // Validate password length (e.g., min 6 characters)
  if (password.value.length < 6) {
    alert('Password must be at least 6 characters long.');
    return;
  }

  const users = JSON.parse(localStorage.getItem('users')) || [];
  const foundUser = users.find(user => user.email === email.value && user.password === password.value);

  if (foundUser) {
    console.log('Login successful for:', email.value);
    // Store login state if necessary, e.g., in localStorage or a global store
    localStorage.setItem('loggedInUser', JSON.stringify(foundUser));
    router.push('/'); // Redirect to home page or dashboard
  } else {
    console.log('Login failed for:', email.value);
    alert('Invalid email or password. Please try again or register.');
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@300..700&display=swap');

.login-page {
  display: flex;
  min-height: 100vh;
  font-family: 'Quicksand', sans-serif;
  background-color: #f4f7f6; /* Light background for the page */
}

.welcome-section {
  flex: 1;
  background-color: #5852c1; /* Example primary color */
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 40px;
  text-align: center;
}

.welcome-section h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  font-weight: 600;
}

.welcome-section p {
  font-size: 1.1rem;
  max-width: 80%;
  line-height: 1.6;
}

.login-section {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px;
}

.login-container {
  width: 100%;
  max-width: 380px;
  background-color: white;
  padding: 30px 40px;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.login-container h2 {
  margin-bottom: 2rem;
  color: #333;
  font-weight: 600;
}

.form-group {
  margin-bottom: 1.5rem;
  text-align: left;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #555;
  font-size: 0.9rem;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing: border-box;
  font-family: 'Quicksand', sans-serif;
  font-size: 1rem;
}

.form-group input:focus {
  outline: none;
  border-color: #6C63FF;
  box-shadow: 0 0 0 2px rgba(108, 99, 255, 0.2);
}

.login-button {
  width: 100%;
  padding: 12px 15px;
  background-color: #6C63FF;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1.1rem;
  font-weight: 600;
  transition: background-color 0.3s ease;
  margin-top: 1rem;
}

.login-button:hover {
  background-color: #574ed9;
}

.register-link {
  margin-top: 1.5rem;
  font-size: 0.9rem;
  color: #555;
}

.register-link a {
  color: #6C63FF;
  text-decoration: none;
  font-weight: 600;
}

.register-link a:hover {
  text-decoration: underline;
}

.password-input-container {
  position: relative;
  display: flex;
  align-items: center;
}

.password-input-container input {
  flex-grow: 1;
  padding-right: 40px; /* Make space for the icon */
}

.password-toggle-icon {
  position: absolute;
  right: 10px;
  cursor: pointer;
  color: #888; /* Icon color */
  font-size: 1.1rem;
}

.password-toggle-icon i {
  vertical-align: middle;
}

.forgot-password-link {
  text-align: left;
  margin-top: 1rem;
  font-size: 0.9rem;
}

.forgot-password-link a {
  color: #6C63FF;
  text-decoration: none;
  font-weight: 600;
}

.forgot-password-link a:hover {
  text-decoration: underline;
}

/* Font Awesome CDN link - ensure this is added to your index.html or main.js if not already present */
/* For example, in index.html: <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"> */

/* Responsive adjustments */
@media (max-width: 768px) {
  .login-page {
    flex-direction: column;
  }
  .welcome-section {
    min-height: 30vh; /* Smaller height on mobile */
    padding: 20px;
  }
  .login-section {
     padding: 20px;
  }
  .login-container {
    padding: 20px;
    box-shadow: none; /* Optional: remove shadow on smaller screens */
  }
}
</style>

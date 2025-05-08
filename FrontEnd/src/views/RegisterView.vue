<template>
  <div class="register-container">
    <h2 class="title">Create Account</h2>
    <form @submit.prevent="register" class="register-form">
      <div class="form-group">
        <label for="name">Name</label>
        <input type="text" id="name" v-model="name" required>
      </div>
      <div class="form-group">
        <label for="email">Email</label>
        <input type="email" id="email" v-model="email" required>
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <div class="password-input-container">
          <input :type="passwordFieldType" id="password" v-model="password" required placeholder="Enter your password">
          <span @click="togglePasswordVisibility" class="password-toggle-icon">
            <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
          </span>
        </div>
        <p v-if="password && !isPasswordValid" class="password-requirements">
          The password must be a combination of at least 8 uppercase letters, lowercase letters, and digits
        </p>
      </div>
      <button type="submit" class="register-button">Register</button>
    </form>
    <p class="login-link">
      Already have an account? <router-link to="/login">Login</router-link>
    </p>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

const name = ref('');
const email = ref('');
const password = ref('');
const showPassword = ref(false);
const router = useRouter();

const passwordFieldType = computed(() => showPassword.value ? 'text' : 'password');

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

const isPasswordValid = computed(() => {
  const value = password.value;
  return value.length >= 8 &&
         /[a-z]/.test(value) &&
         /[A-Z]/.test(value) &&
         /[0-9]/.test(value) &&
         !/\s/.test(value);
});

const register = async () => {
  // Email whitespace validation
  if (/\s/.test(email.value)) {
    alert('Email must not contain whitespace.');
    return;
  }

  // Password validation
  if (!isPasswordValid.value) {
    alert('Password must be at least 8 characters long and contain uppercase, lowercase, and numbers.');
    return;
  }

  try {
    console.log('Attempting to register with:', { 
      email: email.value, 
      name: name.value,
      // Log password length for debugging (never log actual passwords)
      passwordLength: password.value.length 
    });
    
    // Log the full API URL
    const apiUrl = 'http://localhost:3000/api/auth/register';
    console.log('Sending request to:', apiUrl);
    
    const payload = {
      action: 'register',
      email: email.value,
      password: password.value,
      name: name.value
    };
    console.log('Request payload:', { ...payload, password: '******' });

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);
    
    // Try to get the response text first to debug any malformed JSON
    const responseText = await response.text();
    console.log('Raw response:', responseText);
    
    let data;
    try {
      // Then parse it as JSON
      data = JSON.parse(responseText);
      console.log('Parsed response data:', data);
    } catch (jsonError) {
      console.error('Failed to parse JSON response:', jsonError);
      alert('Server returned invalid JSON. Check the console for the raw response.');
      return;
    }

    if (data.status === 'success') {
      console.log('Registration successful for:', email.value);
      alert('Registration successful! Please login with your credentials.');
      router.push('/login');
    } else {
      alert(`Registration failed: ${data.message}`);
    }
  } catch (error) {
    console.error('Registration error:', error);
    
    // More detailed error information
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      alert('Network error: Could not connect to the server. Please check if your backend is running and accessible.');
    } else {
      alert(`An error occurred during registration: ${error.message}`);
    }
  }
};

</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@300..700&display=swap');

.register-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #fff; /* Changed to white */
  color: #333; /* Changed to dark gray for contrast */
  font-family: 'Quicksand', sans-serif;
  padding: 2rem;
  box-sizing: border-box;
}

.title {
  font-size: 2rem; /* Adjusted font size */
  font-weight: 500;
  margin-bottom: 2.5rem;
}

.register-form {
  width: 100%;
  max-width: 350px;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  color: #555; /* Adjusted for white background */
}

.form-group {
  position: relative; /* For positioning the toggle button */
}

.form-group input:not([type="checkbox"]) {
  background-color: #f0f0f0; /* Light gray background for inputs */
  border: 1px solid #ccc; /* Lighter border */
  border-radius: 5px;
  color: #333; /* Dark text color */
  font-family: 'Quicksand', sans-serif;
  font-size: 1rem;
  padding: 0.8rem;
  box-sizing: border-box;
}

.form-group input:focus {
  outline: none;
  border-color: #555; /* Darker border on focus */
}

.register-button {
  background-color: #555; /* Darker gray button */
  border: none;
  color: white;
  border-radius: 5px;
  padding: 0.9rem;
  font-size: 1.1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-top: 1rem;
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
  color: #555; /* Icon color */
  font-size: 1.1rem;
}

.password-toggle-icon i {
  vertical-align: middle;
}

/* Ensure Font Awesome is linked in your project, e.g., in index.html:
   <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"> */

.toggle-password-button {
  position: absolute;
  top: 70%; /* Adjust as needed to align with the input field */
  right: 10px;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #555;
  cursor: pointer;
  font-size: 0.8rem;
}

.password-requirements {
  font-size: 0.8rem;
  color: #DAA520; /* Yellowish color as in the image */
  margin-top: 0.5rem;
}

.register-button:hover {
  background-color: #666; /* Slightly lighter gray on hover */
}

.login-link {
  margin-top: 2rem;
  font-size: 0.9rem;
  color: #777; /* Adjusted for white background */
}

.login-link a {
  color: #333; /* Dark link color */
  text-decoration: underline;
}

.login-link a:hover {
  color: #555; /* Darker link color on hover */
}
</style>

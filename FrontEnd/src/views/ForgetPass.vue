<template>
  <div class="forget-pass-container">
    <h2 class="title">Forgot Password</h2>
    <form @submit.prevent="requestPasswordReset" class="forget-pass-form">
      <div class="form-group">
        <label for="email">Email</label>
        <input type="email" id="email" v-model="email" required placeholder="Enter your email">
      </div>
      <button type="submit" class="submit-button">Send Reset Link</button>
    </form>
    <p class="login-link">
      Remembered your password? <router-link to="/login">Login</router-link>
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const email = ref('');
const router = useRouter();

const requestPasswordReset = () => {
  if (/\s/.test(email.value)) {
    alert('Email must not contain whitespace.');
    return;
  }
  // Basic email validation (can be expanded)
  if (!email.value.includes('@')) {
    alert('Please enter a valid email address.');
    return;
  }
  console.log('Password reset requested for:', email.value);
  // Here you would typically call an API to send a password reset link
  alert('If an account with that email exists, a password reset link has been sent.');
  router.push('/login'); // Redirect to login or a confirmation page
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@300..700&display=swap');

.forget-pass-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #fff; /* White background */
  color: #333; /* Dark gray text for contrast */
  font-family: 'Quicksand', sans-serif;
  padding: 2rem;
  box-sizing: border-box;
}

.title {
  font-size: 2rem;
  font-weight: 500;
  margin-bottom: 2.5rem;
}

.forget-pass-form {
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
  color: #555;
}

.form-group input {
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  border-radius: 5px;
  color: #333;
  font-family: 'Quicksand', sans-serif;
  font-size: 1rem;
  padding: 0.8rem;
  box-sizing: border-box;
}

.form-group input:focus {
  outline: none;
  border-color: #555;
}

.submit-button {
  background-color: #555;
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

.submit-button:hover {
  background-color: #666;
}

.login-link {
  margin-top: 2rem;
  font-size: 0.9rem;
  color: #777;
}

.login-link a {
  color: #333;
  text-decoration: underline;
}

.login-link a:hover {
  color: #555;
}
</style>

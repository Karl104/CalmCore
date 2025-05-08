<template>
  <div class="dashboard">
    <div class="sidebar">
      <h1 class="logo">CalmCore</h1>

      <nav class="nav-menu">
        <div class="nav-item active">
          <span class="nav-icon">⚪</span>
          <span>Today</span>
        </div>
        <router-link to="/inspiration" class="nav-item">
          <span class="nav-icon">💡</span>
          <span>Inspirations</span>
        </router-link>
        <router-link to="/library" class="nav-item">
          <span class="nav-icon">📚</span>
          <span>Library</span>
        </router-link>
        <router-link to="/history" class="nav-item">
          <span class="nav-icon">🕒</span>
          <span>History</span>
        </router-link>
      </nav>

      <div class="sidebar-footer">
        <div class="logout-option" @click="logout">
          <span class="nav-icon">🚪</span>
          <span>Logout</span>
        </div>
      </div>
    </div>

    <div class="main-content">
      <div class="date-display" id="current-date"></div>

      <div class="content-area">
        <div class="book-icon">
          <img src="@/assets/gif.gif" alt="Animation" width="750" height="750">
        </div>

        <h2 class="greeting" id="greeting">Good evening</h2>

        <router-link to="/reflection" class="check-in-btn">Begin Your Check-In</router-link>
      </div>

      <div class="quote-section">
        <h3>Quote of the Day</h3>
        <p class="quote"><i>You have power over your mind not outside events. Realize this, and you will find strength.</i></p>
        <p class="quote-author"> Marcus Aurelius</p>

        <div class="quote-actions">
          <button class="icon-btn star-btn">
            <span class="btn-icon">★</span>
          </button>
          <button class="icon-btn pencil-btn">
            <span class="btn-icon">✎</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { RouterLink } from 'vue-router';

export default {
  methods: {
    logout() {
      localStorage.removeItem('userToken'); // Changed to match router guard
      this.$router.push('/login');
    }
  },
  components: {
    RouterLink
  },
  mounted() {

    function getCurrentDate() {
      const now = new Date();
      const day = now.getDate();
      const month = now.toLocaleDateString('en-US', { month: 'long' });
      const year = now.getFullYear();
      const weekday = now.toLocaleDateString('en-US', { weekday: 'long' });

      return `${weekday}, ${month} ${day}, ${year}`;
    }


    function getGreeting() {
      const hour = new Date().getHours();
      if (hour < 12) return 'Good morning';
      if (hour < 18) return 'Good afternoon';
      return 'Good evening';
    }


    document.getElementById('current-date').textContent = getCurrentDate();
    document.getElementById('greeting').textContent = getGreeting();
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@300..700&display=swap');

.dashboard {
  display: flex;
  min-height: 100vh;
  width: 100%;
  max-width: 100vw;
  margin: 0;
  padding: 0;
  background-color: white;
  color: black;
  font-family: 'Quicksand', sans-serif;
  overflow-x: hidden;
}

.sidebar {
  width: 300px;
  background-color: #151515;
  padding: 2rem 1rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  color: white;
}

.logo {
  font-size: 1.8rem;
  margin-bottom: 3rem;
  padding-left: 1rem;
  color: white;
}

.nav-menu {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 0.8rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
  color: #a0aec0;
  text-decoration: none;
}

.nav-item:hover {
  color: white;
  background-color: rgba(30, 41, 59, 0.5);
}

.nav-item.active {
  background-color: #1e293b;
  color: white;
}

.nav-icon {
  margin-right: 1rem;
}

.sidebar-footer {
  margin-top: auto;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.logout-option {
  display: flex;
  align-items: center;
  padding: 0.8rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
  color: #a0aec0;
}

.logout-option:hover {
  background-color: rgba(30, 41, 59, 0.5);
  color: white;
}

.main-content {
  flex: 1;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  background-color: white;
}

.date-display {
  font-size: 1.2rem;
  text-align: center;
  margin-bottom: 2rem;
  color: #333;
}

.content-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.book-icon {
  margin-bottom: 2rem;
  background-color: white;
  border-radius: 8px;
  padding: 10px;
}

.book-icon img {
  display: block;
  max-width: 100%;
  height: auto;
}

.greeting {
  font-size: 3rem;
  margin-bottom: 2rem;
}

.check-in-btn {
  background-color: #121a2e;
  color: white;
  border: none;
  border-radius: 50px;
  padding: 1rem 2rem;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  text-decoration: none;
}

.check-in-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.quote-section {
  margin-top: 3rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e0e0e0;
  text-align: center;
  color: #333;
}

.quote {
  font-size: 1.2rem;
  margin: 1rem 0 0.5rem;
  line-height: 1.6;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.quote-author {
  font-size: 1rem;
  color: #666;
  margin-top: 0.5rem;
}

.quote-actions {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.icon-btn {
  background-color: #f5f5f5;
  border: none;
  border-radius: 50%;
  width: 3.5rem;
  height: 3.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s, background-color 0.3s;
}

.icon-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: #e8e8e8;
}

.btn-icon {
  font-size: 1.5rem;
}

.star-btn .btn-icon {
  color: #121a2e;
}

.pencil-btn .btn-icon {
  color: #121a2e;
}
</style>

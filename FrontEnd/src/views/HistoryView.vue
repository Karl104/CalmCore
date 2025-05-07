<template>
  <div class="dashboard">
    <div class="sidebar">
      <h1 class="logo">CalmCore</h1>

      <nav class="nav-menu">
        <router-link to="/" class="nav-item">
          <span class="nav-icon">⚪</span>
          <span>Today</span>
        </router-link>
        <router-link to="/inspiration" class="nav-item">
          <span class="nav-icon">💡</span>
          <span>Inspirations</span>
        </router-link>
        <router-link to="/library" class="nav-item">
          <span class="nav-icon">📚</span>
          <span>Library</span>
        </router-link>
        <div class="nav-item active">
          <span class="nav-icon">🕒</span>
          <span>History</span>
        </div>
      </nav>

      <div class="sidebar-footer">
        <div class="logout-option" @click="logout">
          <span class="nav-icon">🚪</span>
          <span>Logout</span>
        </div>
      </div>
    </div>

    <div class="main-content">
      <h2 class="section-title">History</h2>
      <div v-for="(group, date) in groupedHistory" :key="date" class="history-group">
        <h3 class="date-header">{{ formatDateGroup(date) }}</h3>
        <div v-for="entry in group" :key="entry.id" class="history-item" @click="viewEntry(entry)">
          <div v-if="entry.type === 'quote'" class="quote-entry">
            <div class="entry-header">
              <span>Quote journal</span>
              <span class="timestamp">{{ formatTime(entry.timestamp) }}</span>
            </div>
            <p class="entry-content" v-html="entry.userThought"></p>
          </div>
          <div v-if="entry.type === 'reflection'" class="reflection-entry">
            <div class="entry-header">
              <span class="reflection-label">REFLECTION</span>
              <span class="timestamp">{{ formatTime(entry.timestamp) }}</span>
            </div>
            <h4 class="reflection-title">{{ entry.title }}</h4>
            <div class="reflection-tags">
              <span v-if="entry.mood" class="tag mood-tag">{{ entry.mood }}</span>
              <span v-if="entry.sleep" class="tag sleep-tag">Sleep {{ entry.sleep }}/5</span>
              <span v-for="focus in entry.focus" :key="focus" class="tag focus-tag">{{ focus }}</span>
            </div>
            <p v-if="entry.feeling" class="entry-content" v-html="entry.feeling"></p>
          </div>
        </div>
      </div>
      <p v-if="Object.keys(groupedHistory).length === 0">No history entries yet.</p>
    </div>
  </div>
</template>

<script>
import { RouterLink } from 'vue-router';
// No need to import useRouter here as this.$router is available in Options API

export default {
  name: 'HistoryView',
  components: {
    RouterLink
  },
  data() {
    return {
      historyEntries: [] // Initialize as empty, will be fetched
    };
  },
  computed: {
    groupedHistory() {
      const groups = {};
      const sortedEntries = [...this.historyEntries].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)); // Create a sorted copy
      sortedEntries.forEach(entry => {
        const date = new Date(entry.timestamp).toDateString();
        if (!groups[date]) {
          groups[date] = [];
        }
        groups[date].push(entry);
      });
      return groups;
    }
  },
  methods: {
    logout() {
      localStorage.removeItem('loggedInUser');
      this.$router.push('/login');
    },
    formatDateGroup(dateString) {
      const today = new Date().toDateString();
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      const entryDate = new Date(dateString);

      if (dateString === today) {
        return 'TODAY';
      }
      if (dateString === yesterday) {
        const day = entryDate.toLocaleDateString('en-US', { day: '2-digit' });
        const month = entryDate.toLocaleDateString('en-US', { month: '2-digit' });
        return `YESTERDAY, ${day}.${month}`;
      }
      // Format for older dates (e.g., 04 MAY 2025)
      const day = entryDate.toLocaleDateString('en-US', { day: '2-digit' });
      const month = entryDate.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
      const year = entryDate.getFullYear();
      return `${day} ${month} ${year}`;
    },
    formatTime(timestamp) {
      const date = new Date(timestamp);
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    },
    viewEntry(entry) {
      // Placeholder for navigation logic
      console.log('Navigate to entry:', entry);
      // Example: this.$router.push({ name: 'EntryDetail', params: { id: entry.id } });
    },
    fetchHistory() {
      const storedHistory = localStorage.getItem('calmCoreHistory');
      if (storedHistory) {
        this.historyEntries = JSON.parse(storedHistory);
      } else {
        this.historyEntries = []; // Ensure it's an empty array if nothing is stored
      }
    }
  },
  mounted() {
    this.fetchHistory(); // Fetch history when the component mounts
  }
};
</script>

<style scoped>
/* Basic styling, can be copied or adapted from other views like LibraryView */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@300..700&display=swap');

.dashboard {
  display: flex;
  min-height: 100vh;
  width: 100%;
  max-width: 100vw;
  margin: 0;
  padding: 0;
  background-color: #000; /* Dark background */
  color: white;
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
  padding: 2rem 3rem;
  background-color: #000; /* Dark background */
  color: white;
}

.section-title {
  font-size: 1.5rem; /* Adjusted size */
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: #e2e8f0; /* Lighter text for dark mode */
}

.history-group {
  margin-bottom: 2.5rem;
}

.date-header {
  font-size: 0.9rem;
  font-weight: 600;
  color: #a0aec0; /* Dimmer text for date */
  margin-bottom: 1rem;
  text-transform: uppercase;
}

.history-item {
  background-color: #1a1a1a; /* Darker card background */
  border-radius: 10px;
  padding: 1rem 1.5rem;
  margin-bottom: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.history-item:hover {
  background-color: #2d2d2d;
}

.entry-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  color: #a0aec0;
}

.timestamp {
  font-size: 0.8rem;
}

.entry-content {
  font-size: 1rem;
  color: white;
  margin-top: 0.5rem;
}

/* Quote Entry Specific */
.quote-entry .entry-header span:first-child {
  font-weight: 500;
}

/* Reflection Entry Specific */
.reflection-entry .reflection-label {
  font-size: 0.8rem;
  font-weight: bold;
  letter-spacing: 0.5px;
}

.reflection-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: white;
  margin-bottom: 0.8rem;
}

.reflection-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.8rem;
}

.tag {
  background-color: #333;
  color: #e2e8f0;
  padding: 0.3rem 0.7rem;
  border-radius: 15px;
  font-size: 0.8rem;
  display: inline-flex; /* To allow icons potentially */
  align-items: center;
}

/* Optional: Add icons or specific colors to tags */
.mood-tag::before { content: '😊 '; }
.sleep-tag::before { content: '🌙 '; }
.focus-tag::before { content: '⭐ '; } /* Example, adjust as needed */

.reflection-entry .entry-content {
  font-style: italic;
  color: #a0aec0;
}

</style>

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
        <div class="nav-item active">
          <span class="nav-icon">📚</span>
          <span>Library</span>
        </div>
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
      <h2 class="section-title">All Categories</h2>
      <div class="category-tabs">
        <button v-for="category in categories" :key="category.name"
                :class="['category-tab', { active: selectedCategory === category.name }]"
                @click="selectCategory(category.name)">
          <span class="category-icon">{{ category.icon }}</span>
          <span>{{ category.name }}</span>
        </button>
      </div>

      <div class="journal-section">
        <div class="journal-card" v-for="journal in filteredJournals" :key="journal.title">
          <h3>{{ journal.title }}</h3>
          <p>{{ journal.description }}</p>
          <a :href="journal.youtubeLink" target="_blank" v-if="journal.youtubeLink">Watch on YouTube</a>
        </div>
      </div>



      <h2 class="section-title">Mindful Exercises</h2>
      <div class="mindful-exercises">
        <div class="exercise-item">
          <span class="exercise-icon">🌿</span>
          <span>Breathing</span>
          <span class="arrow">›</span>
        </div>
        <div class="exercise-item">
          <span class="exercise-icon">🧘</span>
          <span>Meditation</span>
          <span class="arrow">›</span>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import { RouterLink } from 'vue-router';

export default {
  components: {
    RouterLink
  },
  data() {
    return {
      selectedCategory: 'Productivity',
      categories: [
        { name: 'Productivity', icon: '⚙️' },
        { name: 'Happiness', icon: '☀️' },
        { name: 'Self-Discovery', icon: '🪐' },
        { name: 'Stress & Anxiety', icon: '🌧️' },
        { name: 'Mindset', icon: '🧠' },
        { name: 'Sleep', icon: '🌙' }
      ],
      journals: [
        { title: 'being productive is easy, actually', description: 'Quick Guide On how being productive', category: 'Productivity', youtubeLink: 'https://www.youtube.com/watch?v=3kKB6wYqP7Y' },
        { title: 'The lost art of accomplishment without burnout', description: 'How is it possible to do work that you’re proud of and not feel like your job is encroaching on all parts of your life?” Cal Newport, author of Slow Productivity, explains. ', category: 'Productivity', youtubeLink: 'https://www.youtube.com/watch?v=0HMjTxKRbaI' },
        { title: '7 Stoic Productivity Strategies That Will Change Your Life', description: 'Example YouTube Link Below', category: 'Productivity', youtubeLink: 'https://www.youtube.com/watch?v=SoRXsmlF4eQ' },
        { title: '7 Stoic Keys To Happiness', description: 'in Stoic philosophy, it’s the pursuit of virtue and good character that allows us to get there. For the Stoic, the pursuit of virtue is the pursuit of happiness. If we can live virtuously, a good life will follow.', category: 'Happiness', youtubeLink: 'https://www.youtube.com/watch?v=l9z-cDPZP2E' },
        { title: 'When Life Hurts, Let Go | A Stoic Lesson for Inner Peace', description: 'This video delves into the actual cause of our suffering and how we can overcome it and develop unshakable inner peace—a goal entirely within our power (according to Epictetus).', category: 'Stress & Anxiety', youtubeLink: 'https://www.youtube.com/watch?v=FDYVIWAE2II' },
        { title: 'How a journey to self-discovery will set you free ', description: 'During this talk Puck Kroonsberg takes you on a personal journey: remembering who you truly are.', category: 'Self-Discovery', youtubeLink: 'https://www.youtube.com/watch?v=n6Kk2yxZHuI' },
        { title: 'To Grow, You Must Suffer - David Goggins ', description: ' David Goggins Motivation." Goggins, renowned for his unyielding mindset, reveals the power of suffering and the willingness to endure hardship for personal growth.', category: 'Self-Discovery', youtubeLink: 'https://www.youtube.com/watch?v=MY_0YKmEG0A' },
        { title: 'One of the greatest self discovery exercises', description: ' Use this exercise to learn more about who you are and what you can do to grow', category: 'Self-Discovery', youtubeLink: 'https://www.youtube.com/watch?v=jglY5v0UAac' },
        { title: 'How to make stress your friend', description: 'Psychologist Kelly McGonigal urges us to see stress as a positive, and introduces us to an unsung mechanism for stress reduction: reaching out to others.', category: 'Stress & Anxiety', youtubeLink: 'https://www.youtube.com/watch?v=RcGyVTAoXEU' },
        { title: 'How The Stoics Dealt With Anxiety (10 Strategies)', description: 'Anxiety was one of the main emotions Stoicism was built to handle. In this video best-selling author Ryan Holiday explores 10 of the best time-tested ways that the Stoics dealt with anxiety.', category: 'Stress & Anxiety', youtubeLink: 'https://www.youtube.com/watch?v=eytNiPy0xg0' },
        { title: '7 Secrets To Becoming Mentally Tougher', description: 'Are you mentally strong? What does it mean to be mentally tough? Mental toughness is the capacity to effectively deal with stressors, challenges, and adverse situations, and still perform well in spite of their circumstances. Developing a tough mentality helps you cope with distressing and overwhelming moments in life better. ', category: 'Mindset', youtubeLink: 'https://www.youtube.com/watch?v=hUA_k76x2uE' },
        { title: 'How To Build Mental Toughness - David Goggins', description: 'Retired Navy SEAL David Goggins explains why in the midst of even the most extreme pain—emotional or physical—the most powerful weapon in the world is your mind.', category: 'Mindset', youtubeLink: 'https://www.youtube.com/watch?v=6aw9h5QMNbE' },
        { title: '6 tips for better sleep | Sleeping with Science', description: 'Want to not only fall asleep quickly but also stay asleep longer? Sleep scientist Matt Walker explains how your room temperature, lighting and other easy-to-fix factors can set the stage for a better nights rest.', category: 'Sleep', youtubeLink: 'https://www.youtube.com/watch?v=t0kACis_dJE' },
        { title: 'The Reason You Need To Run Toward Fear - David Goggins', description: 'After trying and failing to become a member of the elite Air Force Pararescue, retired Navy SEAL David Goggins nearly hit rock bottom—but facing his fears changed everything.', category: 'Stress & Anxiety', youtubeLink: 'https://www.youtube.com/watch?v=a0zIq-yayf8' },
        { title: '10 Habits Of Happy People - How to Be Happy', description: 'Are you truly happy in your life? Have you ever wondered what it is that makes others so happy? What happy habits happy people cultivate? If joy can be frequent in others', category: 'Happiness', youtubeLink: 'https://www.youtube.com/watch?v=a0zIq-yayf8' },

      ]
    };
  },
  computed: {
    filteredJournals() {
      return this.journals.filter(journal => journal.category === this.selectedCategory);
    }
  },
  methods: {
    logout() {
      localStorage.removeItem('loggedInUser');
      this.$router.push('/login');
    },
    selectCategory(categoryName) {
      this.selectedCategory = categoryName;
    }
  }
};
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

.category-tabs {
  display: flex;
  gap: 1.5rem; /* Increased gap */
  margin-bottom: 2.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #333; /* Subtle separator */
}

.category-tab {
  display: flex;
  flex-direction: column; /* Stack icon and text */
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  color: #a0aec0; /* Dimmer color for inactive */
  cursor: pointer;
  font-size: 0.9rem;
  padding: 0.5rem;
  border-bottom: 3px solid transparent; /* Underline indicator */
  transition: color 0.3s, border-color 0.3s;
}

.category-icon {
  font-size: 1.8rem; /* Larger icons */
}

.category-tab:hover {
  color: white;
}

.category-tab.active {
  color: white;
  font-weight: 600;
  border-bottom-color: white; /* Active underline */
}

.journal-section {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); /* Responsive grid */
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.journal-card {
  background-color: #1a1a1a; /* Darker card background */
  border-radius: 12px; /* Slightly more rounded */
  padding: 1.5rem;
  color: #e2e8f0;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  transition: transform 0.2s ease-in-out;
}

.journal-card:hover {
    transform: translateY(-5px);
}

.journal-card h3 {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.journal-card p {
  font-size: 0.9rem;
  color: #a0aec0;
  margin-bottom: 1rem;
}

.journal-card a {
    color: #4299e1; /* Link color */
    text-decoration: none;
    font-size: 0.9rem;
    font-weight: 500;
}

.journal-card a:hover {
    text-decoration: underline;
}

.see-all-link {
  display: inline-block;
  margin-top: 1rem; /* Space above */
  margin-bottom: 3rem; /* Space below */
  color: #a0aec0;
  text-decoration: none;
  font-size: 1rem;
  font-weight: 500;
  transition: color 0.3s;
}

.see-all-link:hover {
  color: white;
}

.see-all-link .arrow {
    margin-left: 0.5rem;
    font-weight: bold;
}

.mindful-exercises {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.exercise-item {
  display: flex;
  align-items: center;
  background-color: #1a1a1a; /* Darker item background */
  padding: 1rem 1.5rem;
  border-radius: 10px;
  cursor: pointer;
  transition: background-color 0.3s;
  color: #e2e8f0;
}

.exercise-item:hover {
  background-color: #2d2d2d;
}

.exercise-icon {
  font-size: 1.5rem;
  margin-right: 1rem;
}

.exercise-item span:nth-child(2) {
  flex-grow: 1; /* Push arrow to the right */
  font-size: 1rem;
  font-weight: 500;
}

.exercise-item .arrow {
    font-size: 1.2rem;
    color: #a0aec0;
}

</style>

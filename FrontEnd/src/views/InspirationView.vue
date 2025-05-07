<template>
  <div class="dashboard">
    <div class="sidebar">
      <h1 class="logo">CalmCore</h1>

      <nav class="nav-menu">
        <router-link to="/" class="nav-item">
          <span class="nav-icon">⚪</span>
          <span>Today</span>
        </router-link>
        <div class="nav-item active">
          <span class="nav-icon">💡</span>
          <span>Inspirations</span>
        </div>
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
      <div class="header">
        <div class="dropdown">
          <div class="dropdown-header" @click="toggleDropdown">
            <h1>{{ selectedCategory }} <span class="dropdown-icon">▼</span></h1>
          </div>
          <div class="dropdown-content" v-if="isDropdownOpen">
            <div class="dropdown-item" @click="selectCategory('All Quotes')" :class="{ 'active': selectedCategory === 'All Quotes' }">All Quotes</div>
            <div class="dropdown-item" @click="selectCategory('Creative Imagination')" :class="{ 'active': selectedCategory === 'Creative Imagination' }">Creative Imagination</div>
            <div class="dropdown-item" @click="selectCategory('Fandom Pep-Talk')" :class="{ 'active': selectedCategory === 'Fandom Pep-Talk' }">Fandom Pep-Talk</div>
            <div class="dropdown-item" @click="selectCategory('Feminist Power')" :class="{ 'active': selectedCategory === 'Feminist Power' }">Feminist Power</div>
            <div class="dropdown-item" @click="selectCategory('Inner Peace')" :class="{ 'active': selectedCategory === 'Inner Peace' }">Inner Peace</div>
            <div class="dropdown-item" @click="selectCategory('Loving Heart')" :class="{ 'active': selectedCategory === 'Loving Heart' }">Loving Heart</div>
            <div class="dropdown-item" @click="selectCategory('Overcoming Fear')" :class="{ 'active': selectedCategory === 'Overcoming Fear' }">Overcoming Fear</div>
            <div class="dropdown-item" @click="selectCategory('Productivity Boost')" :class="{ 'active': selectedCategory === 'Productivity Boost' }">Productivity Boost</div>
            <div class="dropdown-item" @click="selectCategory('Push Forward')" :class="{ 'active': selectedCategory === 'Push Forward' }">Push Forward</div>
            <div class="dropdown-item" @click="selectCategory('Spiritual Path')" :class="{ 'active': selectedCategory === 'Spiritual Path' }">Spiritual Path</div>
            <div class="dropdown-item" @click="selectCategory('Stoic Wisdom')" :class="{ 'active': selectedCategory === 'Stoic Wisdom' }">Stoic Wisdom</div>
            <div class="dropdown-item" @click="selectCategory('Uplifting Gratitude')" :class="{ 'active': selectedCategory === 'Uplifting Gratitude' }">Uplifting Gratitude</div>
          </div>
        </div>
      </div>

      <div class="quote-card">
      <div class="quotation-mark">""
      </div>

      <div class="quote-content">
        <p class="quote-text">{{ quotes[currentQuoteIndex].text }}</p>
        <p class="quote-author">{{ quotes[currentQuoteIndex].author }}</p>
        <p class="quote-source">{{ quotes[currentQuoteIndex].source }}</p>
      </div>

      <div class="navigation-controls">
        <button class="nav-button prev-button" @click="previousQuote">
          <span class="nav-icon">◀</span>
        </button>
        <button class="journal-button" @click="openJournal">Begin Journaling</button>
        <button class="nav-button next-button" @click="nextQuote">
          <span class="nav-icon">▶</span>
        </button>
      </div>

      <button class="favorite-button">
        <span class="favorite-icon">☆</span>
      </button>
    </div>

      <!-- Modal Structure -->
      <div v-if="showJournal" class="modal-overlay" @click.self="closeJournal">
        <div class="modal-content">
          <button class="close-button" @click="closeJournal">×</button>
          <journal-editor :quote="quotes[currentQuoteIndex]" @journal-saved="handleJournalSaved"></journal-editor>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { RouterLink } from 'vue-router';
import JournalEditor from '@/components/Journal.vue';

export default {
  components: {
    RouterLink,
    JournalEditor
  },
  data() {
    return {
      currentQuoteIndex: 0,
      selectedCategory: 'All Quotes',
      isDropdownOpen: false,
      showJournal: false,
      allQuotes: [
        // Creative Imagination
        {
          text: "Imagination is more important than knowledge. For knowledge is limited, whereas imagination embraces the entire world, stimulating progress, giving birth to evolution.",
          author: "Albert Einstein",
          category: "Creative Imagination"
        },
        {
          text: "Creativity is intelligence having fun.",
          author: "Albert Einstein",
          category: "Creative Imagination"
        },
        {
          text: "The creative adult is the child who survived.",
          author: "Ursula K. Le Guin",
          category: "Creative Imagination"
        },
        {
          text: "You can't use up creativity. The more you use, the more you have.",
          author: "Maya Angelou",
          category: "Creative Imagination"
        },
        {
          text: "Creativity involves breaking out of established patterns in order to look at things in a different way.",
          author: "Edward de Bono",
          category: "Creative Imagination"
        },
        // Fandom Pep-Talk
        {
          text: "Don't ever let anyone make you feel like you don't deserve what you want. Go for it.",
          author: "Heath Ledger (as Patrick Verona)",
          source: "10 Things I Hate About You",
          category: "Fandom Pep-Talk"
        },
        {
          text: "It matters not what someone is born, but what they grow to be!",
          author: "Albus Dumbledore",
          source: "Harry Potter and the Goblet of Fire",
          category: "Fandom Pep-Talk"
        },
        {
          text: "Why do we fall? So we can learn to pick ourselves up.",
          author: "Alfred Pennyworth",
          source: "Batman Begins",
          category: "Fandom Pep-Talk"
        },
        {
          text: "Even the smallest person can change the course of the future.",
          author: "Galadriel",
          source: "The Lord of the Rings: The Fellowship of the Ring",
          category: "Fandom Pep-Talk"
        },
        {
          text: "Do or do not. There is no try.",
          author: "Yoda",
          source: "Star Wars: The Empire Strikes Back",
          category: "Fandom Pep-Talk"
        },
        // Feminist Power
        {
          text: "Feminism isn't about making women stronger. Women are already strong. It's about changing the way the world perceives that strength.",
          author: "G.D. Anderson",
          category: "Feminist Power"
        },
        {
          text: "I raise up my voice—not so that I can shout, but so that those without a voice can be heard... We cannot all succeed when half of us are held back.",
          author: "Malala Yousafzai",
          category: "Feminist Power"
        },
        {
          text: "Women belong in all places where decisions are being made... It shouldn't be that women are the exception.",
          author: "Ruth Bader Ginsburg",
          category: "Feminist Power"
        },
        {
          text: "The question isn't who's going to let me; it's who is going to stop me.",
          author: "Ayn Rand",
          category: "Feminist Power"
        },
        {
          text: "No woman should be told she can't make decisions about her own body. When women's rights are under attack, we fight back.",
          author: "Kamala Harris",
          category: "Feminist Power"
        },
        // Inner Peace
        {
          text: "Peace comes from within. Do not seek it without.",
          author: "Buddha",
          category: "Inner Peace"
        },
        {
          text: "Do not let the behavior of others destroy your inner peace.",
          author: "Dalai Lama",
          category: "Inner Peace"
        },
        {
          text: "Inner peace begins the moment you choose not to allow another person or event to control your emotions.",
          author: "Pema Chödrön",
          category: "Inner Peace"
        },
        {
          text: "The life of inner peace, being harmonious and without stress, is the easiest type of existence.",
          author: "Norman Vincent Peale",
          category: "Inner Peace"
        },
        {
          text: "Within you, there is a stillness and a sanctuary to which you can retreat at any time and be yourself.",
          author: "Hermann Hesse",
          category: "Inner Peace"
        },
        // Loving Heart
        {
          text: "Love and compassion are necessities, not luxuries. Without them, humanity cannot survive.",
          author: "Dalai Lama",
          category: "Loving Heart"
        },
        {
          text: "The best and most beautiful things in this world cannot be seen or even heard, but must be felt with the heart.",
          author: "Helen Keller",
          category: "Loving Heart"
        },
        {
          text: "Keep love in your heart. A life without it is like a sunless garden when the flowers are dead.",
          author: "Oscar Wilde",
          category: "Loving Heart"
        },
        {
          text: "Where there is love there is life.",
          author: "Mahatma Gandhi",
          category: "Loving Heart"
        },
        {
          text: "Your task is not to seek for love, but merely to seek and find all the barriers within yourself that you have built against it.",
          author: "Rumi",
          category: "Loving Heart"
        },
        // Overcoming Fear
        {
          text: "The brave man is not he who does not feel afraid, but he who conquers that fear.",
          author: "Nelson Mandela",
          category: "Overcoming Fear"
        },
        {
          text: "Fear is the path to the dark side. Fear leads to anger. Anger leads to hate. Hate leads to suffering.",
          author: "Yoda",
          source: "Star Wars: The Phantom Menace",
          category: "Overcoming Fear"
        },
        {
          text: "I learned that courage was not the absence of fear, but the triumph over it.",
          author: "Nelson Mandela",
          category: "Overcoming Fear"
        },
        {
          text: "Do the thing you fear and the death of fear is certain.",
          author: "Ralph Waldo Emerson",
          category: "Overcoming Fear"
        },
        {
          text: "You gain strength, courage, and confidence by every experience in which you really stop to look fear in the face.",
          author: "Eleanor Roosevelt",
          category: "Overcoming Fear"
        },
        // Productivity Boost
        {
          text: "The key is not to prioritize what's on your schedule, but to schedule your priorities.",
          author: "Stephen Covey",
          category: "Productivity Boost"
        },
        {
          text: "Productivity is never an accident. It is always the result of a commitment to excellence, intelligent planning, and focused effort.",
          author: "Paul J. Meyer",
          category: "Productivity Boost"
        },
        {
          text: "Focus on being productive instead of busy.",
          author: "Tim Ferriss",
          category: "Productivity Boost"
        },
        {
          text: "Ordinary people think merely of spending time, great people think of using it.",
          author: "Arthur Schopenhauer",
          category: "Productivity Boost"
        },
        {
          text: "Until we can manage time, we can manage nothing else.",
          author: "Peter Drucker",
          category: "Productivity Boost"
        },
        // Spiritual Path
        {
          text: "The spiritual journey is the unlearning of fear and the acceptance of love.",
          author: "Marianne Williamson",
          category: "Spiritual Path"
        },
        {
          text: "You have to grow from the inside out. None can teach you, none can make you spiritual. There is no other teacher but your own soul.",
          author: "Swami Vivekananda",
          category: "Spiritual Path"
        },
        {
          text: "Spirituality is not about being fixed; it is about God being present in the mess of our unfixedness.",
          author: "Michael Yaconelli",
          category: "Spiritual Path"
        },
        {
          text: "The path is not in the sky. The path is in the heart.",
          author: "Buddha",
          category: "Spiritual Path"
        },
        {
          text: "Just as a candle cannot burn without fire, men cannot live without a spiritual life.",
          author: "Buddha",
          category: "Spiritual Path"
        },
        // Uplifting Gratitude
        {
          text: "Gratitude turns what we have into enough.",
          author: "Anonymous",
          category: "Uplifting Gratitude"
        },
        {
          text: "Acknowledging the good that you already have in your life is the foundation for all abundance.",
          author: "Eckhart Tolle",
          category: "Uplifting Gratitude"
        },
        {
          text: "Gratitude makes sense of our past, brings peace for today, and creates a vision for tomorrow.",
          author: "Melody Beattie",
          category: "Uplifting Gratitude"
        },
        {
          text: "Wear gratitude like a cloak, and it will feed every corner of your life.",
          author: "Rumi",
          category: "Uplifting Gratitude"
        },
        {
          text: "Let us be grateful to the people who make us happy; they are the charming gardeners who make our souls blossom.",
          author: "Marcel Proust",
          category: "Uplifting Gratitude"
        },
        // Stoic Wisdom (Existing)
        {
          text: "We don't get to choose what happens to us, but we can always choose how we feel about it. And why on earth would you choose to feel anything but good?",
          author: "Ryan Holiday",
          source: "The Obstacle Is the Way",
          category: "Stoic Wisdom"
        },
        {
          text: "We don't get to choose what happens to us, but we can always choose how we feel about it. And why on earth would you choose to feel anything but good?",
          author: "Ryan Holiday",
          source: "The Obstacle Is the Way",
          category: "Stoic Wisdom"
        },
        {
          text: "When you arise in the morning think of what a privilege it is to be alive, to think, to enjoy, to love.",
          author: "Marcus Aurelius",
          source: "Meditations",
          category: "Stoic Wisdom"
        },
        {
          text: "Appearance to the mind are of four kinds. Things either are what they appear to be; or they neither are, nor appear to be; or they are, and do not appear to be; or they are not, and yet appear to be. Rightly to in all these cases is the wise man's task.",
          author: "Epictetus",
          category: "Stoic Wisdom"
        },
        {
          text: "The impediment to action advances action. What stands in the way becomes the way.",
          author: "Marcus Aurelius",
          source: "Meditations",
          category: "Stoic Wisdom"
        },
        {
          text: "Very little is needed to make a happy life; it is all within yourself, in your way of thinking.",
          author: "Marcus Aurelius",
          source: "Meditations",
          category: "Stoic Wisdom"
        },
        {
          text: "Waste no more time arguing what a good man should be. Be one.",
          author: "Marcus Aurelius",
          source: "Meditations",
          category: "Stoic Wisdom"
        },
        {
          text: "Success is liking yourself, liking what you do, and liking how you do it.",
          author: "Maya Angelou",
          category: "Push Forward"
        },
        {
          text: "The scariest moment is always just before you start.",
          author: "Stephen King",
          category: "On Writing: A Memoir of the Craft"
        },
        {
          text: "Whenever you are asked if you can do a job, tell'em, 'Certainly I can!' Then get busy and find out how to do it",
          author: "Eleanor Roosevelt",
          category: "Push Forward"
        },
        {
          text: "Never confuse a single defeat with a final defeat.",
          author: "F. Scott Fitzgerald",
          category: "Push Forward"
        },
        {
          text: "All things are difficult before they are easy.",
          author: "Thomas Fuller",
          category: "Push Forward"
        },
        {
          text: "Patience is bitter, but  its fruit is sweet.",
          author: "Aristotle",
          category: "Push Forward"
        },
        // Push Forward (Adding more)
        {
          text: "Perseverance is failing 19 times and succeeding the 20th.",
          author: "Julie Andrews",
          category: "Push Forward"
        },
        {
          text: "It does not matter how slowly you go as long as you do not stop.",
          author: "Confucius",
          category: "Push Forward"
        },
        {
          text: "Our greatest glory is not in never failing, but in rising up every time we fail.",
          author: "Ralph Waldo Emerson",
          category: "Push Forward"
        },
        {
          text: "Fall seven times, stand up eight.",
          author: "Japanese Proverb",
          category: "Push Forward"
        },
        {
          text: "The only way to do great work is to love what you do.",
          author: "Steve Jobs",
          category: "Push Forward"
        }
      ]
    };
  },
  computed: {
    quotes() {
      if (this.selectedCategory === 'All Quotes') {
        return this.allQuotes;
      }
      // Filter quotes by selected category
      return this.allQuotes.filter(quote => quote.category === this.selectedCategory);
    }
  },
  methods: {
    toggleDropdown() {
      this.isDropdownOpen = !this.isDropdownOpen;
    },
    selectCategory(category) {
      this.selectedCategory = category;
      this.isDropdownOpen = false;
      this.currentQuoteIndex = 0; // Reset to first quote when changing categories
    },
    nextQuote() {
      if (this.currentQuoteIndex < this.quotes.length - 1) {
        this.currentQuoteIndex++;
      } else {
        this.currentQuoteIndex = 0; // Loop back to the first quote
      }
    },
    previousQuote() {
      if (this.currentQuoteIndex > 0) {
        this.currentQuoteIndex--;
      } else {
        this.currentQuoteIndex = this.quotes.length - 1; // Loop to the last quote
      }
    },
    openJournal() {
      this.showJournal = true;
    },
    closeJournal() {
      this.showJournal = false;
    },
    handleJournalSaved() {
      this.closeJournal(); // Close the modal
      this.$router.push('/history'); // Navigate to history page
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
  align-items: center;
  background-color: white;
}

.header {
  width: 100%;
  max-width: 600px;
  margin-bottom: 2rem;
}

.dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-header h1 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  text-align: center;
  padding: 0.75rem 1.5rem;
  background-color: #fff;
  border-radius: 2rem;
  display: inline-flex;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  cursor: pointer;
}

.dropdown-icon {
  margin-left: 0.5rem;
  font-size: 0.8rem;
  transition: transform 0.3s;
}

.dropdown-content {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  width: 300px;
  max-height: 400px;
  overflow-y: auto;
  background-color: white;
  border-radius: 1rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  z-index: 10;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
  padding: 1rem;
  margin-top: 0.5rem;
}

.dropdown-item {
  padding: 0.75rem 1rem;
  border-radius: 0.75rem;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;
  font-size: 0.9rem;
  text-align: center;
}

.dropdown-item:hover {
  background-color: #f5f5f5;
}

.dropdown-item.active {
  background-color: #000;
  color: white;
}

.quote-card {
  position: relative;
  width: 100%;
  max-width: 600px;
  background-color: white;
  border-radius: 1.5rem;
  padding: 3rem 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  text-align: center;
  margin-bottom: 2rem;
}

.quotation-mark {
  font-size: 5rem;
  color: #e0e0e0;
  line-height: 1;
  margin-bottom: 1rem;
}

.quote-content {
  margin-bottom: 2.5rem;
}

.quote-text {
  font-size: 1.5rem;
  line-height: 1.5;
  color: #333;
  margin-bottom: 1.5rem;
  font-weight: 500;
}

.quote-author {
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 0.25rem;
}

.quote-source {
  font-size: 1rem;
  color: #999;
  font-style: italic;
}

.navigation-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-top: 2rem;
}

.nav-button {
  background-color: #f5f5f5;
  border: none;
  border-radius: 50%;
  width: 3rem;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s, background-color 0.3s;
}

.nav-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: #e8e8e8;
}

.nav-icon {
  font-size: 1rem;
  color: #333;
}

.journal-button {
  background-color: #121a2e;
  color: white;
  border: none;
  border-radius: 2rem;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.journal-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.favorite-button {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  background: none;
  border: none;
  cursor: pointer;
}

.favorite-icon {
  font-size: 1.5rem;
  color: #ccc;
  transition: color 0.3s;
}

.favorite-button:hover .favorite-icon {
  color: #ffc107;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  position: relative;
  width: 90%;
  max-width: 700px; /* Adjust as needed */
  max-height: 80vh;
  overflow-y: auto;
}

.close-button {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.8rem;
  font-weight: bold;
  color: #aaa;
  cursor: pointer;
  line-height: 1;
}

.close-button:hover {
  color: #333;
}

/* Ensure Journal Editor styles work well within the modal */
.modal-content .journal-editor {
  margin-top: 1rem; /* Add some space below the close button */
}

</style>

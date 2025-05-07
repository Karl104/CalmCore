<template>
  <div class="reflection-container">
    <div class="progress-bar">
      <div class="progress-step" :class="{ active: currentStep >= 1 }"></div>
      <div class="progress-step" :class="{ active: currentStep >= 2 }"></div>
      <div class="progress-step" :class="{ active: currentStep >= 3 }"></div>
      <div class="progress-step" :class="{ active: currentStep >= 4 }"></div>
    </div>
    <button class="back-button" @click="goBack">
      <span class="arrow">←</span>
    </button>
    <button class="close-button" @click="closeReflection">×</button>

    <div class="content">
      <!-- Step 1: Feeling -->
      <div v-if="currentStep === 1">
        <h2 class="title">{{ currentFeelingText }}</h2>
        <div class="emotions">
          <div v-for="emotion in emotions" :key="emotion.level"
               class="emotion-icon-container"
               :class="{ selected: selectedEmotion === emotion.level }"
               @click="selectEmotion(emotion.level)">
            <div class="emotion-icon">{{ emotion.icon }}</div>
          </div>
        </div>
      </div>

      <!-- Step 2: Sleep Quality -->
      <div v-if="currentStep === 2" class="sleep-step">
         <h2 class="title">How well did you sleep today?</h2>
         <img :src="sleepIcon" alt="Sleep illustration" class="sleep-illustration">
         <p class="sleep-description">{{ currentSleepDescription }}</p>
         <input type="range" min="1" max="5" v-model="sleepQuality" class="sleep-slider">
         <div class="slider-labels">
            <span>Not at all</span>
            <span>Very</span>
         </div>
      </div>

      <!-- Step 3: Focus -->
      <div v-if="currentStep === 3" class="focus-step">
        <h2 class="title">What's your main focus for today?</h2>
        <p class="focus-prompt">Pick up to 3.</p>
        <div class="focus-options">
          <div v-for="focus in focusOptions" :key="focus.id"
               class="focus-option"
               :class="{ selected: isFocusSelected(focus.id), disabled: !canSelectMoreFocus && !isFocusSelected(focus.id) }"
               @click="toggleFocus(focus.id)">
            <div class="focus-icon">{{ focus.icon }}</div>
            <div class="focus-label">{{ focus.label }}</div>
          </div>
        </div>
        <!-- Arrow for scrolling if needed -->
        <button v-if="showFocusScrollArrow" class="scroll-arrow" @click="scrollFocusOptions">›</button>
      </div>

      <!-- Step 4: Journaling -->
      <div v-if="currentStep === 4" class="journal-step">
        <h2 class="title">How are you feeling about today?</h2>
        <p class="journal-prompt">Is there anything important for you about this day? Anything that makes you excited, or anxious?</p>
        <textarea v-model="journalEntry" placeholder="Start writing..." class="journal-textarea"></textarea>
      </div>

      <!-- Add other steps here if needed -->

    </div>

    <button class="next-button" @click="nextStep" :disabled="!isStepComplete">
      <span class="arrow">→</span>
    </button>
  </div>
</template>

<script>
import sleepIcon from '@/assets/sleep_icon.svg';

export default {
  data() {
    return {
      currentStep: 1,
      selectedEmotion: null,
      sleepQuality: 3,
      selectedFocusAreas: [],
      journalEntry: '',
      sleepIcon,
      emotions: [
        { level: 1, icon: '😞', text: 'I feel Bad' },
        { level: 2, icon: '😟', text: 'I feel Not Great' },
        { level: 3, icon: '😐', text: 'I feel Fine' },
        { level: 4, icon: '😊', text: 'I feel Good' },
        { level: 5, icon: '😄', text: 'I feel Great' }
      ],
      sleepDescriptions: {
        1: "Last night\nI didn't sleep well at all.",
        2: "Last night\nI slept somewhat poorly.",
        3: "Last night\nI had a moderate night's sleep.",
        4: "Last night\nI slept quite well.",
        5: "Last night\nI had an excellent night's sleep."
      },
      focusOptions: [
        { id: 'work', icon: '💼', label: 'Work' },
        { id: 'relaxing', icon: '☀️', label: 'Relaxing' },
        { id: 'learning', icon: '🏛️', label: 'Learning' }, // Using a building icon for learning
        { id: 'fitness', icon: '🏋️', label: 'Fitness' }, // Using a weightlifter emoji
        { id: 'family', icon: '🏠', label: 'Family' },
        { id: 'friends', icon: '👥', label: 'Friends' },
        { id: 'reading', icon: '📖', label: 'Reading' },
        { id: 'cleaning', icon: '✨', label: 'Cleaning' },
        { id: 'time_alone', icon: '🚶', label: 'Time Alone' }, // Using a person walking emoji
        { id: 'pets', icon: '🐢', label: 'Pets' },
        { id: 'music', icon: '🎵', label: 'Music' },
        { id: 'good_meal', icon: '😊', label: 'Good Meal' }, // Reusing happy face
        { id: 'spirituality', icon: '🔥', label: 'Spirituality' }, // Using fire emoji
        { id: 'creativity', icon: '🎨', label: 'Creativity' },
        { id: 'helping_others', icon: '💬', label: 'Helping Others' }, // Using speech bubble
        { id: 'partner', icon: '👤', label: 'Partner' }, // Using bust silhouette
        { id: 'health', icon: '❤️‍🩹', label: 'Health' }, // Using mending heart
        { id: 'self_care', icon: '⭐', label: 'Self-care' },
        { id: 'travel', icon: '🚆', label: 'Travel' }, // Using train emoji
        { id: 'date', icon: '❤️', label: 'Date' },
        { id: 'nature', icon: '🌳', label: 'Nature' },
        { id: 'party', icon: '🔊', label: 'Party' }, // Using speaker emoji
        { id: 'movies', icon: '🎟️', label: 'Movies' }, // Using ticket emoji
        { id: 'shopping', icon: '🛍️', label: 'Shopping' }, // Using shopping bags emoji
        { id: 'gaming', icon: '🎮', label: 'Gaming' }
      ],
      showFocusScrollArrow: false // Control visibility of scroll arrow
    };
  },
  computed: {
    currentFeelingText() {
      if (this.selectedEmotion === null) {
        return 'How are you feeling?';
      }
      const selected = this.emotions.find(e => e.level === this.selectedEmotion);
      return selected ? selected.text : 'How are you feeling?';
    },
    currentSleepDescription() {
      return this.sleepDescriptions[this.sleepQuality] || '';
    },
    canSelectMoreFocus() {
      return this.selectedFocusAreas.length < 3;
    },
    isStepComplete() {
      if (this.currentStep === 1) {
        return this.selectedEmotion !== null;
      }
      if (this.currentStep === 2) {
        return true; // Always allow moving from sleep step
      }
      if (this.currentStep === 3) {
        return this.selectedFocusAreas.length > 0; // Require at least one focus area
      }
      if (this.currentStep === 4) {
        return true; // Allow moving from journal step (can be empty)
      }
      // Add conditions for other steps
      return false;
    }
  },
  methods: {
    selectEmotion(level) {
      this.selectedEmotion = level;
    },
    toggleFocus(focusId) {
      const index = this.selectedFocusAreas.indexOf(focusId);
      if (index > -1) {
        // Deselect
        this.selectedFocusAreas.splice(index, 1);
      } else if (this.canSelectMoreFocus) {
        // Select if less than 3 are selected
        this.selectedFocusAreas.push(focusId);
      }
    },
    isFocusSelected(focusId) {
      return this.selectedFocusAreas.includes(focusId);
    },
    checkFocusScroll() {
      const container = this.$el.querySelector('.focus-options');
      if (container) {
        this.showFocusScrollArrow = container.scrollWidth > container.clientWidth;
      }
    },
    scrollFocusOptions() {
      const container = this.$el.querySelector('.focus-options');
      if (container) {
        // Scroll by a certain amount, e.g., half the container width
        container.scrollBy({ left: container.clientWidth / 2, behavior: 'smooth' });
        // Optionally, hide arrow if scrolled to the end (needs more logic)
      }
    },
    goBack() {
      if (this.currentStep > 1) {
        this.currentStep--;
      } else {
        this.$router.push('/'); // Navigate back to HomeView
      }
    },
    closeReflection() {
      this.$router.push('/'); // Navigate back to HomeView or handle as needed
    },
    nextStep() {
      if (this.isStepComplete) {
        if (this.currentStep < 4) { // Assuming 4 steps total
          this.currentStep++;
          if (this.currentStep === 3) {
            this.$nextTick(() => {
              this.checkFocusScroll(); // Check scroll after rendering step 3
            });
          }
        } else { // Handle completion when currentStep is 4 or potentially more if logic changes
          // Handle completion - Save to localStorage and navigate
          const storedHistory = localStorage.getItem('calmCoreHistory');
          let history = storedHistory ? JSON.parse(storedHistory) : [];

          const focusLabels = this.selectedFocusAreas.map(id => {
            const option = this.focusOptions.find(opt => opt.id === id);
            return option ? option.label : id; // Get label, fallback to id
          });

          const moodMap = {
            1: 'Bad mood',
            2: 'Not Great mood',
            3: 'Fine mood',
            4: 'Good mood',
            5: 'Great mood'
          };

          const newEntry = {
            id: Date.now(), // Simple unique ID
            type: 'reflection',
            timestamp: new Date().toISOString(),
            title: 'Daily check-in', // Or derive from data if needed
            mood: moodMap[this.selectedEmotion] || null,
            sleep: `${this.sleepQuality}/5`,
            focus: focusLabels,
            feeling: this.journalEntry
          };

          history.push(newEntry);
          localStorage.setItem('calmCoreHistory', JSON.stringify(history));

          console.log('Reflection complete and saved:', newEntry);

          this.$router.push('/');
        }
      }
    }
  },
  mounted() {
    // Initial check in case the component mounts directly to step 3 (unlikely but safe)
    if (this.currentStep === 3) {
       this.$nextTick(() => {
         this.checkFocusScroll();
       });
    }
    window.addEventListener('resize', this.checkFocusScroll);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.checkFocusScroll);
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@300..700&display=swap');

.reflection-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between; /* Pushes elements to top, center, bottom */
  min-height: 100vh;
  background-color: #000;
  color: white;
  font-family: 'Quicksand', sans-serif;
  padding: 2rem;
  box-sizing: border-box;
  position: relative; /* Needed for absolute positioning of buttons */
}

.progress-bar {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 2rem; /* Add some space below the progress bar */
  position: absolute;
  top: 2rem;
  left: 50%;
  transform: translateX(-50%);
  width: 200px; /* Adjust width as needed */
}

.progress-step {
  width: 40px; /* Adjust size as needed */
  height: 5px;
  background-color: #555; /* Inactive step color */
  border-radius: 3px;
  transition: background-color 0.3s ease;
}

.progress-step.active {
  background-color: white; /* Active step color */
}

.back-button, .close-button {
  position: absolute;
  top: 1.5rem; /* Align vertically with progress bar */
  background: none;
  border: none;
  color: white;
  font-size: 1.8rem; /* Make icons larger */
  cursor: pointer;
}

.back-button {
  left: 1.5rem;
}

.close-button {
  right: 1.5rem;
}

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-grow: 1; /* Allows content to take up available space */
  text-align: center;
  width: 100%;
  margin-top: 4rem; /* Add margin to push content down from header buttons */
}

.title {
  font-size: 2.2rem; /* Adjusted font size */
  font-weight: 500;
  margin-bottom: 3rem; /* Adjusted space */
  white-space: pre-line; /* Allows newline characters in text */
  line-height: 1.4;
}

/* Step 1 Styles */
.emotions {
  display: flex;
  justify-content: center;
  gap: 1.5rem; /* Space between icons */
  margin-bottom: 4rem; /* Space below icons */
}

.emotion-icon-container {
  cursor: pointer;
  transition: transform 0.2s ease-in-out, background-color 0.2s ease-in-out;
  padding: 1rem; /* Add padding around the icon for easier clicking */
  border-radius: 50%;
  background-color: #222; /* Default background */
  width: 70px; /* Fixed width */
  height: 70px; /* Fixed height */
  display: flex;
  align-items: center;
  justify-content: center;
}

.emotion-icon {
  font-size: 2.5rem; /* Size of the emoji */
}

.emotion-icon-container:hover {
  transform: scale(1.1);
}

.emotion-icon-container.selected {
  background-color: white;
  transform: scale(1.15); /* Slightly larger scale when selected */
}

/* Step 2 Styles */
.sleep-step {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
}

.sleep-illustration {
    width: 150px; /* Adjust size as needed */
    height: auto;
    margin-bottom: 2rem;
}

.sleep-description {
    font-size: 1.8rem; /* Adjust as needed */
    margin-bottom: 3rem;
    white-space: pre-line; /* Allows newline characters */
    line-height: 1.5;
    min-height: 80px; /* Ensure space for text */
}

.sleep-slider {
    width: 80%;
    max-width: 400px;
    height: 8px;
    cursor: pointer;
    appearance: none;
    background: linear-gradient(to right, #555, #ddd);
    border-radius: 5px;
    outline: none;
    margin-bottom: 1rem;
}

.sleep-slider::-webkit-slider-thumb {
    appearance: none;
    width: 24px;
    height: 24px;
    background: white;
    border-radius: 50%;
    cursor: pointer;
}

.sleep-slider::-moz-range-thumb {
    width: 24px;
    height: 24px;
    background: white;
    border-radius: 50%;
    cursor: pointer;
    border: none;
}

.slider-labels {
    display: flex;
    justify-content: space-between;
    width: 80%;
    max-width: 400px;
    font-size: 0.9rem;
    color: #aaa;
    margin-bottom: 4rem; /* Space below labels */
}

/* Step 3 Styles - Focus */
.focus-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  position: relative; /* For scroll arrow positioning */
}

.focus-prompt {
  font-size: 1.1rem;
  color: #ccc;
  margin-bottom: 2rem;
}

.focus-options {
  display: flex;
  flex-wrap: wrap; /* Allow wrapping */
  justify-content: center;
  gap: 1rem; /* Gap between items */
  max-width: 500px; /* Limit width */
  margin-bottom: 4rem;
  /* Enable horizontal scrolling if needed, hide scrollbar */
  /* overflow-x: auto; */
  /* scrollbar-width: none; /* Firefox */
  /* -ms-overflow-style: none; /* IE and Edge */
}

/* .focus-options::-webkit-scrollbar { */
  /* display: none; /* Chrome, Safari, Opera */
/* } */

.focus-option {
  cursor: pointer;
  transition: transform 0.2s ease-in-out, background-color 0.2s ease-in-out, opacity 0.2s ease-in-out;
  padding: 0.8rem 1rem;
  border-radius: 25px; /* Pill shape */
  background-color: #222;
  display: flex;
  flex-direction: column; /* Stack icon and label */
  align-items: center;
  justify-content: center;
  width: 90px; /* Fixed width */
  height: 90px; /* Fixed height */
  text-align: center;
}

.focus-icon {
  font-size: 2rem; /* Adjust icon size */
  margin-bottom: 0.3rem;
}

.focus-label {
  font-size: 0.8rem;
  font-weight: 500;
}

.focus-option:hover {
  transform: scale(1.05);
}

.focus-option.selected {
  background-color: white;
  color: black;
  transform: scale(1.1);
}

.focus-option.disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: scale(1); /* Prevent scaling when disabled */
}

.scroll-arrow {
  position: absolute;
  right: 0.5rem; /* Position near the right edge */
  top: 50%;
  transform: translateY(-50%);
  background: rgba(50, 50, 50, 0.7);
  border: none;
  color: white;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  font-size: 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  z-index: 10;
}

/* Step 4 Styles - Journaling */
.journal-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 500px; /* Limit width for better readability */
}

.journal-prompt {
  font-size: 1.1rem; /* Slightly smaller than title */
  color: #ccc; /* Lighter color for prompt */
  margin-bottom: 2rem;
  line-height: 1.6;
}

.journal-textarea {
  width: 100%;
  height: 200px; /* Adjust height as needed */
  background-color: #1a1a1a; /* Dark background */
  border: 1px solid #444; /* Subtle border */
  border-radius: 8px;
  color: white;
  font-family: 'Quicksand', sans-serif;
  font-size: 1rem;
  padding: 1rem;
  box-sizing: border-box;
  resize: none; /* Disable resizing */
  margin-bottom: 4rem; /* Space below textarea */
}

.journal-textarea::placeholder {
  color: #666; /* Placeholder text color */
}

.journal-textarea:focus {
  outline: none;
  border-color: #777; /* Highlight border on focus */
}

.next-button {
  background-color: #333; /* Darker grey */
  border: none;
  color: white;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  font-size: 2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s, opacity 0.3s;
  position: absolute;
  bottom: 2rem;
  right: 2rem;
}

.next-button:disabled {
  background-color: #222; /* Even darker grey when disabled */
  cursor: not-allowed;
  opacity: 0.6;
}

.next-button:not(:disabled):hover {
  background-color: #444; /* Slightly lighter grey on hover */
}

.arrow {
  line-height: 1; /* Adjust line height for better vertical alignment */
}

</style>

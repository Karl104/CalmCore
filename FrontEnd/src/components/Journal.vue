<template>
  <div class="journal-editor">
    <div class="quote-reference">
      <div class="quote-text">{{ quote.text }}</div>
      <div class="quote-author">- {{ quote.author }}</div>
    </div>

    <div class="editor-toolbar">
      <button @click="toggleFormat('bold')" :class="{ active: isActive('bold') }">
        <span class="toolbar-icon"><b>B</b></span>
      </button>
      <button @click="toggleFormat('italic')" :class="{ active: isActive('italic') }">
        <span class="toolbar-icon"><i>I</i></span>
      </button>
      <button @click="toggleFormat('underline')" :class="{ active: isActive('underline') }">
        <span class="toolbar-icon"><u>U</u></span>
      </button>
      <button @click="toggleFormat('strikeThrough')" :class="{ active: isActive('strikeThrough') }">
        <span class="toolbar-icon"><s>S</s></span>
      </button>
    </div>

    <div
      class="editor-content"
      contenteditable="true"
      ref="editor"
      @input="updateContent"
      placeholder="Start writing..."
    ></div>

    <button v-if="content.trim()" class="save-button" @click="saveJournal">
      ✓
    </button>
  </div>
</template>

<script>
export default {
  name: 'JournalEditor',
  props: {
    quote: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      content: ''
    }
  },
  methods: {
    toggleFormat(command) {
      document.execCommand(command, false, null)
      this.$refs.editor.focus()
    },
    isActive(command) {
      return document.queryCommandState(command)
    },
    updateContent(e) {
      this.content = e.target.innerHTML
      // No need to emit here unless the parent needs live updates
      // this.$emit('update:content', this.content)
    },
    saveJournal() {
      const storedHistory = localStorage.getItem('calmCoreHistory');
      let history = storedHistory ? JSON.parse(storedHistory) : [];

      // Convert HTML content to plain text while preserving formatting
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = this.content;
      const plainText = tempDiv.innerText || tempDiv.textContent;

      const newEntry = {
        id: Date.now(),
        type: 'quote',
        timestamp: new Date().toISOString(),
        quote: this.quote.text,
        author: this.quote.author,
        source: this.quote.source || '',
        userThought: plainText
      };

      history.push(newEntry);
      localStorage.setItem('calmCoreHistory', JSON.stringify(history));

      console.log('Journal content saved:', plainText);
      this.$emit('journal-saved');
      this.$refs.editor.innerHTML = ''; // Clear the editor
    }
  }
}
</script>

<style scoped>
.journal-editor {
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.quote-reference {
  background: #f5f5f5;
  padding: 1.5rem;
  border-radius: 0.5rem;
  margin-bottom: 1.5rem;
}

.quote-text {
  font-size: 1.1rem;
  color: #333;
  font-style: italic;
  margin-bottom: 0.5rem;
}

.quote-author {
  font-size: 0.9rem;
  color: #666;
  text-align: right;
}

.editor-toolbar {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  padding: 0.5rem;
  border-bottom: 1px solid #eee;
}

.editor-toolbar button {
  width: 2rem;
  height: 2rem;
  border: none;
  background: #f5f5f5;
  border-radius: 0.25rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.editor-toolbar button:hover {
  background: #e0e0e0;
}

.editor-toolbar button.active {
  background: #333;
  color: white;
}

.toolbar-icon {
  font-size: 0.9rem;
  font-weight: bold;
}

.editor-content {
  min-height: 200px;
  padding: 1rem;
  border: 1px solid #eee;
  border-radius: 0.5rem;
  outline: none;
  font-size: 1rem;
  line-height: 1.5;
  position: relative; /* Needed for absolute positioning of the button */
  padding-bottom: 4rem; /* Add padding to prevent button overlap */
}

.editor-content[placeholder]:empty:before {
  content: attr(placeholder);
  color: #999;
}

.save-button {
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  background-color: #121a2e; /* Match journal button style */
  color: white;
  border: none;
  border-radius: 2rem;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.save-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}
</style>

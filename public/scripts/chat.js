class ChatUI {
  constructor() {
    this.messageContainer = document.getElementById("messageContainer");
    this.chatForm = document.getElementById("chatForm");
    this.userInput = document.getElementById("userInput");
    this.sidebar = document.getElementById("sidebar");
    this.menuToggle = document.getElementById("menuToggle");
    this.loadingMessageId = null; // track loading block

    this.initializeEventListeners();
    this.adjustTextareaHeight();
  }

  initializeEventListeners() {
    // Form submission
    this.chatForm.addEventListener("submit", (e) => this.handleSubmit(e));

    // Send message when pressing Enter (Shift+Enter for newline)
    this.userInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        this.chatForm.requestSubmit();
      }
    });

    // Textarea auto-resize
    this.userInput.addEventListener("input", () => this.adjustTextareaHeight());

    // Mobile menu toggle
    this.menuToggle.addEventListener("click", () => this.toggleSidebar());

    // Close sidebar when clicking outside on mobile
    document.addEventListener("click", (e) => {
      if (window.innerWidth <= 768) {
        if (
          !this.sidebar.contains(e.target) &&
          !this.menuToggle.contains(e.target)
        ) {
          this.sidebar.classList.remove("active");
        }
      }
    });
  }

  adjustTextareaHeight() {
    const textarea = this.userInput;
    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight + "px";
  }

  toggleSidebar() {
    this.sidebar.classList.toggle("active");
  }

  handleSubmit(e) {
    e.preventDefault();
    const message = this.userInput.value.trim();
    if (!message) return;

    // Show user message immediately
    this.addMessage(message, "user");

    // Clear input and reset height
    this.userInput.value = "";
    this.adjustTextareaHeight();

    // Show loading message for AI
    this.addLoadingMessage();

    // Send message to server
    socket.emit("ai-message", message);
  }

  addMessage(content, type) {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message", `${type}-message`);

    const messageContent = document.createElement("div");
    messageContent.classList.add("message-content");
    messageContent.textContent = content;

    messageDiv.appendChild(messageContent);
    this.messageContainer.appendChild(messageDiv);

    // Scroll to bottom
    this.messageContainer.scrollTop = this.messageContainer.scrollHeight;
  }

  addLoadingMessage() {
    // Remove any old loading message
    this.removeLoadingMessage();

    const loadingDiv = document.createElement("div");
    loadingDiv.classList.add("message", "assistant-message", "loading");
    loadingDiv.innerHTML =
      '<div class="loading-dots"><span></span><span></span><span></span></div>';

    this.loadingMessageId = "loadingMessage_" + Date.now();
    loadingDiv.id = this.loadingMessageId;

    this.messageContainer.appendChild(loadingDiv);
    this.messageContainer.scrollTop = this.messageContainer.scrollHeight;
  }

  removeLoadingMessage() {
    if (this.loadingMessageId) {
      const loadingMessage = document.getElementById(this.loadingMessageId);
      if (loadingMessage) {
        loadingMessage.remove();
      }
      this.loadingMessageId = null;
    }
  }

  addErrorMessage() {
    this.addMessage(
      "Sorry, there was an error processing your request. Please try again.",
      "assistant"
    );
  }
}

// Initialize chat UI once DOM is ready
let chatUI;
document.addEventListener("DOMContentLoaded", () => {
  chatUI = new ChatUI();

  // Listen for AI messages from server
  socket.on("ai-message", (message) => {
    chatUI.removeLoadingMessage();
    chatUI.addTypingMessage(message);
  });

  // Typing animation for AI messages
  ChatUI.prototype.addTypingMessage = function (fullText) {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message", "assistant-message");

    const messageContent = document.createElement("div");
    messageContent.classList.add("message-content");
    messageDiv.appendChild(messageContent);
    this.messageContainer.appendChild(messageDiv);
    this.messageContainer.scrollTop = this.messageContainer.scrollHeight;

    let index = 0;
    const typingInterval = setInterval(() => {
      if (index < fullText.length) {
        messageContent.textContent += fullText[index];
        index++;
        this.messageContainer.scrollTop = this.messageContainer.scrollHeight;
      } else {
        clearInterval(typingInterval);
      }
    }, 5); // typing speed in ms
  };
});

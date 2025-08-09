class ChatUI {
    constructor() {
        this.messageContainer = document.getElementById('messageContainer');
        this.chatForm = document.getElementById('chatForm');
        this.userInput = document.getElementById('userInput');
        this.sidebar = document.getElementById('sidebar');
        this.menuToggle = document.getElementById('menuToggle');
        
        this.initializeEventListeners();
        this.adjustTextareaHeight();
    }

    initializeEventListeners() {
        // Form submission
        this.chatForm.addEventListener('submit', (e) => this.handleSubmit(e));

        // Textarea auto-resize
        this.userInput.addEventListener('input', () => this.adjustTextareaHeight());

        // Mobile menu toggle
        this.menuToggle.addEventListener('click', () => this.toggleSidebar());

        // Close sidebar when clicking outside on mobile
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                if (!this.sidebar.contains(e.target) && !this.menuToggle.contains(e.target)) {
                    this.sidebar.classList.remove('active');
                }
            }
        });
    }

    adjustTextareaHeight() {
        const textarea = this.userInput;
        // Reset height to auto to get the correct scrollHeight
        textarea.style.height = 'auto';
        // Set new height based on scrollHeight
        textarea.style.height = textarea.scrollHeight + 'px';
    }

    toggleSidebar() {
        this.sidebar.classList.toggle('active');
    }

    async handleSubmit(e) {
        e.preventDefault();
        const message = this.userInput.value.trim();
        
        if (!message) return;

        // Add user message to chat
        this.addMessage(message, 'user');
        
        // Clear input and reset height
        this.userInput.value = '';
        this.adjustTextareaHeight();

        try {
            // Show loading state
            this.addLoadingMessage();

            // Send message to server
            const response = await this.sendMessage(message);
            
            // Remove loading message
            this.removeLoadingMessage();
            
            // Add assistant's response
            this.addMessage(response, 'assistant');
        } catch (error) {
            console.error('Error:', error);
            this.removeLoadingMessage();
            this.addErrorMessage();
        }
    }

    addMessage(content, type) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', `${type}-message`);
        
        const messageContent = document.createElement('div');
        messageContent.classList.add('message-content');
        messageContent.textContent = content;
        
        messageDiv.appendChild(messageContent);
        this.messageContainer.appendChild(messageDiv);
        
        // Scroll to bottom
        this.messageContainer.scrollTop = this.messageContainer.scrollHeight;
    }

    addLoadingMessage() {
        const loadingDiv = document.createElement('div');
        loadingDiv.classList.add('message', 'assistant-message', 'loading');
        loadingDiv.innerHTML = '<div class="loading-dots"><span></span><span></span><span></span></div>';
        loadingDiv.id = 'loadingMessage';
        this.messageContainer.appendChild(loadingDiv);
        this.messageContainer.scrollTop = this.messageContainer.scrollHeight;
    }

    removeLoadingMessage() {
        const loadingMessage = document.getElementById('loadingMessage');
        if (loadingMessage) {
            loadingMessage.remove();
        }
    }

    addErrorMessage() {
        this.addMessage('Sorry, there was an error processing your request. Please try again.', 'assistant');
    }

    async sendMessage(message) {
        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            return data.response;
        } catch (error) {
            throw new Error('Failed to send message');
        }
    }
}

// Initialize chat UI when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ChatUI();
});

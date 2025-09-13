class CVChatAssistant {
  constructor() {
    this.conversationSection = document.getElementById('conversationSection');
    this.conversationMessages = document.getElementById('conversationMessages');
    this.chatInput = document.getElementById('chatInput');
    this.sendButton = document.getElementById('sendButton');
    this.isLoading = false;
    
    this.initializeEventListeners();
    this.loadChatHistory();
  }

  initializeEventListeners() {
    this.sendButton.addEventListener('click', () => this.sendMessage());
    
    // Handle Enter/Shift+Enter for textarea
    this.chatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.sendMessage();
      }
    });
    
    // Auto-resize textarea as user types
    this.chatInput.addEventListener('input', () => {
      this.autoResizeTextarea();
    });
    
  }
  
  autoResizeTextarea() {
    this.chatInput.style.height = 'auto';
    this.chatInput.style.height = Math.min(this.chatInput.scrollHeight, 80) + 'px'; // Max 4em
  }

  scrollToBottom() {
    const terminalContent = document.querySelector('.terminal-content');
    if (!terminalContent) return;

    // Add a small delay to ensure DOM is updated
    setTimeout(() => {
      // Scroll to bottom of terminal content
      terminalContent.scrollTop = terminalContent.scrollHeight;
      
      // Additional smoothing for conversation section
      const conversationSection = document.getElementById('conversationSection');
      if (conversationSection) {
        // Ensure the last message is visible by scrolling a bit more if needed
        const lastMessage = this.conversationMessages.lastElementChild;
        if (lastMessage) {
          lastMessage.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
      }
    }, 100);
  }


  async sendMessage() {
    const message = this.chatInput.value.trim();
    if (!message || this.isLoading) return;


    this.addMessage('user', message);
    this.chatInput.value = '';
    this.autoResizeTextarea(); // Reset textarea height
    this.setLoading(true);

    try {
      // Add minimum delay to show processing indicator for local testing
      const [response] = await Promise.all([
        this.callAPI(message),
        new Promise(resolve => setTimeout(resolve, 3000)) // Minimum 3 seconds to inspect animation
      ]);
      this.addMessage('assistant', response);
      this.saveChatHistory();
    } catch (error) {
      this.addMessage('assistant', 'Sorry, I encountered an error. Please try again.');
      console.error('Chat API error:', error);
    } finally {
      this.setLoading(false);
    }
  }

  async callAPI(message) {
    const cvContext = this.extractCVContext();
    const prompt = `You are a helpful assistant representing Parasdeep Singh based on his CV. 
Answer questions about his experience, skills, and background using the context below.
Keep responses concise and professional.

CV Context:
${cvContext}

User Question: ${message}

Response:`;

    try {
      // Try actual API call to Cloudflare Worker
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: prompt,
          max_tokens: 300,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      return data.response || 'Sorry, I could not process your request.';
      
    } catch (error) {
      console.warn('API call failed, using fallback response:', error);
      // Fallback for local development or when API is unavailable
      return this.generateFallbackResponse(message);
    }
  }

  generateFallbackResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('experience') || lowerMessage.includes('work')) {
      return "Paras has over 8 years of DevOps experience, currently working as a Senior DevOps Engineer at Aotal Ltd. He's worked with companies like Stuff and Gentrack, specializing in AWS, Kubernetes, Terraform, and CI/CD pipelines.";
    }
    
    if (lowerMessage.includes('skill') || lowerMessage.includes('tech') || lowerMessage.includes('tool')) {
      return "Paras is proficient in Terraform, Kubernetes, AWS, Python, Docker, Jenkins, and many other DevOps tools. He has experience with both cloud infrastructure and CI/CD automation.";
    }
    
    if (lowerMessage.includes('education') || lowerMessage.includes('study')) {
      return "Paras holds a Bachelor's in Information and Communications Technology from Manukau Institute of Technology, Auckland, where he graduated with distinction and received the 2017 Runner-Up Dean's Prize.";
    }
    
    if (lowerMessage.includes('contact') || lowerMessage.includes('reach')) {
      return "You can reach Paras through LinkedIn (linkedin.com/in/parasdsingh), GitHub (github.com/parasdsingh), or email (parasdeep29@gmail.com). He also writes poetry at silencecalling.me.";
    }
    
    if (lowerMessage.includes('location') || lowerMessage.includes('where')) {
      return "Paras is based in Auckland, New Zealand, and has experience working remotely with teams across different time zones.";
    }
    
    return "I'm here to help you learn about Paras! You can ask me about his work experience, technical skills, education, or how to get in touch with him. What would you like to know?";
  }

  extractCVContext() {
    // Extract text content from CV sections for context
    const sections = {
      about: document.querySelector('#about .summary-description')?.textContent || '',
      experience: Array.from(document.querySelectorAll('.timeline-item')).map(item => {
        const title = item.querySelector('.job-title')?.textContent || '';
        const company = item.querySelector('.company')?.textContent || '';
        const dateRange = item.querySelector('.date-range')?.textContent || '';
        const description = item.querySelector('.job-description')?.textContent || '';
        const achievements = Array.from(item.querySelectorAll('.achievements li')).map(li => li.textContent).join('; ');
        return `${title} at ${company} (${dateRange}): ${description} ${achievements}`;
      }).join(' | '),
      education: Array.from(document.querySelectorAll('.education-section .timeline-item')).map(item => {
        const title = item.querySelector('.job-title')?.textContent || '';
        const company = item.querySelector('.company')?.textContent || '';
        const dateRange = item.querySelector('.date-range')?.textContent || '';
        return `${title} at ${company} (${dateRange})`;
      }).join(' | '),
      techStack: Array.from(document.querySelectorAll('.ls-item .tool-name')).map(tool => tool.textContent).join(', '),
      recommendations: Array.from(document.querySelectorAll('.recommendation')).map(rec => {
        const text = rec.querySelector('.recommendation-text')?.textContent || '';
        const author = rec.querySelector('.recommender')?.textContent || '';
        return `"${text}" - ${author}`;
      }).join(' | ')
    };

    return `
About: ${sections.about}
Experience: ${sections.experience}
Education: ${sections.education}
Tech Stack: ${sections.techStack}
Recommendations: ${sections.recommendations}
    `.trim();
  }

  addMessage(type, content) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `conversation-message ${type}-message`;
    
    messageDiv.innerHTML = `
      <div class="message-bubble">
        ${this.formatMessage(content)}
      </div>
    `;
    
    this.conversationMessages.appendChild(messageDiv);
    
    // Scroll to show the new message properly
    this.scrollToBottom();
  }

  formatMessage(content) {
    // Basic formatting for terminal-like appearance
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br>');
  }

  setLoading(loading) {
    this.isLoading = loading;
    this.sendButton.disabled = loading;
    
    if (loading) {
      const loadingDiv = document.createElement('div');
      loadingDiv.className = 'conversation-message assistant-message chat-loading active';
      loadingDiv.innerHTML = `
        <div class="message-bubble">
          <span class="terminal-processing">
            <span class="terminal-spinner"></span>
            <span class="terminal-processing-text">processing</span>
          </span>
        </div>
      `;
      loadingDiv.id = 'loading-message';
      this.conversationMessages.appendChild(loadingDiv);
      
      // Scroll to show loading message properly
      this.scrollToBottom();
    } else {
      const loadingMessage = document.getElementById('loading-message');
      if (loadingMessage) {
        loadingMessage.remove();
      }
    }
  }

  saveChatHistory() {
    const messages = Array.from(this.conversationMessages.children)
      .filter(msg => !msg.classList.contains('chat-loading'))
      .map(msg => ({
        type: msg.classList.contains('user-message') ? 'user' : 'assistant',
        content: msg.querySelector('.message-bubble').textContent.trim()
      }));
    
    localStorage.setItem('cvChatHistory', JSON.stringify(messages));
    
    // Also save conversation visibility state
    const isVisible = window.location.hash === '#ask-ai';
    localStorage.setItem('cvChatVisible', JSON.stringify(isVisible));
  }

  loadChatHistory() {
    try {
      const history = JSON.parse(localStorage.getItem('cvChatHistory') || '[]');
      const isVisible = JSON.parse(localStorage.getItem('cvChatVisible') || 'false');
      
      if (history.length > 0) {
        if (isVisible && window.location.hash !== '#ask-ai') {
          window.location.hash = '#ask-ai';
        }
        history.forEach(msg => this.addMessage(msg.type, msg.content));
      }
    } catch (error) {
      console.warn('Could not load chat history:', error);
    }
  }
}

// Initialize chat when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new CVChatAssistant();
});
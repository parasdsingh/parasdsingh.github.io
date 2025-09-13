# TODO Items

## Current Known Issues

### Chat UX Improvements
- **Better scroll behavior**: When clicking "Ask AI", consider smooth scrolling to chat input for better UX in interactive sections
- **Chat input focus**: Auto-focus chat input when Ask AI section is accessed for the first time
- **Message history management**: Consider adding clear chat history functionality
- **Mobile responsiveness**: Test and optimize chat interface for mobile devices

### Technical Debt
- **CSS organization**: Consider consolidating chat-related styles into a dedicated section
- **Error handling**: Add more robust error handling for API failures and network issues
- **Performance**: Optimize chat history loading for large conversation histories
- **Accessibility**: Add proper ARIA labels and keyboard navigation support for chat interface

### Feature Enhancements
- **Typing indicators**: Show "assistant is typing" indicator during API calls
- **Message timestamps**: Consider adding timestamps to chat messages
- **Export functionality**: Allow users to export chat conversations
- **Theme integration**: Ensure chat colors adapt properly to dark/light theme switching

### Deployment & Operations
- **Environment configuration**: Document environment-specific configurations for different deployment targets
- **Monitoring**: Add logging and monitoring for API usage and errors
- **Rate limiting**: Implement client-side rate limiting to respect API quotas
- **Caching**: Consider implementing response caching for common queries

## Completed Items
- ✅ Implement AI chat assistant with terminal aesthetics
- ✅ Add CSS :target navigation for consistency with other sections
- ✅ Fix chat bubble visibility regression
- ✅ Fix send button enable/disable logic
- ✅ Add terminal-style processing animations with spinner
- ✅ Implement message bubble interface with proper alignment
- ✅ Add Cloudflare Workers deployment configuration
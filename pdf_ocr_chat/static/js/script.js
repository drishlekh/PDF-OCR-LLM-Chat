document.addEventListener('DOMContentLoaded', function() {
    const socket = io();
    const chatContainer = document.getElementById('chat-container');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    
    function addMessage(role, message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message bg-gray-700 p-3 rounded-lg mb-3`;
        
        const roleDiv = document.createElement('div');
        roleDiv.className = role === 'user' ? 'font-bold text-green-400' : 'font-bold text-blue-400';
        roleDiv.textContent = role === 'user' ? 'You' : 'AI Assistant';
        
        const contentDiv = document.createElement('div');
        contentDiv.textContent = message;
        
        messageDiv.appendChild(roleDiv);
        messageDiv.appendChild(contentDiv);
        chatContainer.appendChild(messageDiv);
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }
    
    function sendMessage() {
        const message = userInput.value.trim();
        if (message) {
            addMessage('user', message);
            userInput.value = '';
            
            // Show typing indicator
            const typingDiv = document.createElement('div');
            typingDiv.id = 'typing-indicator';
            typingDiv.className = 'chat-message bg-gray-700 p-3 rounded-lg mb-3';
            typingDiv.innerHTML = '<div class="font-bold text-blue-400">AI Assistant</div><div class="flex space-x-1"><div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div><div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div><div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.4s"></div></div>';
            chatContainer.appendChild(typingDiv);
            chatContainer.scrollTop = chatContainer.scrollHeight;
            
            socket.emit('send_message', { message: message });
        }
    }
    
    sendButton.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    socket.on('receive_message', function(data) {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
        addMessage('assistant', data.message);
    });
});
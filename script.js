const form = document.getElementById('chat-form');
const input = document.getElementById('user-input');
const messages = document.getElementById('messages');

form.addEventListener('submit', function (e) {

    e.preventDefault();

    const text = input.value.trim();

    if (!text) return;


    // Crear mensaje del usuario
    const userMsg = document.createElement('div');

    userMsg.className = 'max-w-[70%] bg-blue-500 text-white p-3 rounded-xl self-end';

    userMsg.textContent = text;
    
    messages.appendChild(userMsg);


    input.value = '';
    messages.scrollTop = messages.scrollHeight;


    // Simular respuesta del "bot"
    setTimeout(() => {

        const botMsg = document.createElement('div');

        botMsg.className = 'max-w-[70%] bg-gray-300 text-gray-900 p-3 rounded-xl self-start';

        botMsg.textContent = 'Respuesta automática del bot.';

        messages.appendChild(botMsg);

        messages.scrollTop = messages.scrollHeight;

    }, 800);
});
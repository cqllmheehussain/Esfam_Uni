let isVoiceEnabled = true;

// Send Message
function sendMessage() {
    const userInput = document.getElementById('user-input').value.trim();
    if (userInput === '') return;

    displayUserMessage(userInput);
    provideAnswer(userInput);
    document.getElementById('user-input').value = '';
}

// Display User Message
function displayUserMessage(message) {
    const messageContainer = document.createElement('div');
    messageContainer.classList.add('message', 'user-message');
    messageContainer.textContent = message;
    document.getElementById('chatbot-messages').appendChild(messageContainer);
}

// Display Bot Message with Typing Effect
function displayBotMessage(message) {
    const messageContainer = document.createElement('div');
    messageContainer.classList.add('message', 'bot-message');

    const botAvatar = document.createElement('img');
    botAvatar.src = './images/bot_avatar.png'; // Ensure the path is correct
    botAvatar.classList.add('bot-avatar');

    messageContainer.appendChild(botAvatar);
    
    const textElement = document.createElement('span');
    textElement.textContent = "Typing...";
    messageContainer.appendChild(textElement);
    
    document.getElementById('chatbot-messages').appendChild(messageContainer);

    setTimeout(() => {
        textElement.innerHTML = message;
    }, 1000);

    if (isVoiceEnabled) {
        speakMessage(message);
    }
}

// Chatbot Responses
function provideAnswer(question) {
    let answer = '';
    let link = '';

    switch (question.toLowerCase()) {
        case 'hello':
        case 'hi':
        case 'hey':
        case 'help':
            answer = 'Hello! How can I assist you today? Here are some common questions: <br> 1. Admission Requirements <br> 2. Offered Courses <br> 3. Tuition Fees <br> 4. Application Process <br> 5. University Location <br> 6. Weather Update <br><br> Just type the number or ask your question!';
            break;
        case '1':
        case 'what are the admission requirements?':
            answer = 'You need a Senior Secondary School Certificate, Birth Certificate, International Passport, and 8 Passport Photos.';
            link = 'https://esfambeninuni.com/admission.php';
            break;
        case '2':
        case 'what courses are offered?':
            answer = 'Courses include Business, Communication, and more. Visit our Academics page for details.';
            link = 'https://esfambeninuni.com/academics.php';
            break;
        case '3':
        case 'what is the tuition fee structure?':
            answer = 'Tuition fees vary. Visit the fees page for details.';
            link = 'https://esfambeninuni.com/contact.php';
            break;
        case '4':
        case 'how can i apply?':
            answer = 'Apply online through our portal.';
            link = 'https://esfambeninuni.com/apply.php';
            break;
        case '5':
        case 'where is the university located?':
            answer = 'ESFAM University is located in Porto Novo, Benin Republic.';
            link = 'https://esfambeninuni.com/contact.php';
            break;
        case '6':
        case 'what is the current weather?':
            getWeather();
            return;
        default:
            answer = 'I\'m not sure about that. Please check our website for more information.';
            link = 'https://esfambeninuni.com/';
    }

    displayBotMessage(`${answer} ${link ? `<br><a href="${link}" target="_blank">Click here for more info</a>` : ''}`);
}

// Voice Response
function speakMessage(message) {
    const speech = new SpeechSynthesisUtterance(message);
    speech.lang = 'en-US';
    speech.rate = 1;
    window.speechSynthesis.speak(speech);
}

// Toggle Voice
function toggleVoice() {
    isVoiceEnabled = !isVoiceEnabled;
    alert(isVoiceEnabled ? "Voice enabled" : "Voice disabled");
}

// Dark Mode Toggle
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
}

// Fetch Weather Update using Tomorrow.io API
async function getWeather() {
    const apiKey = "0mb6PUEJbOMD0hxCLoLkgXrDA5LCawyj"; // Replace with your actual API key from Tomorrow.io
    const location = "Porto Novo"; // University location
    const url = `https://api.tomorrow.io/v4/weather/realtime?location=${location}&apikey=${apiKey}`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch weather data");
        
        const data = await response.json();
        const temperature = data.data.values.temperature;
        const conditionCode = data.data.values.weatherCode;

        const condition = mapWeatherCode(conditionCode); // Convert weatherCode to readable text
        
        displayBotMessage(`Current weather in Porto Novo: ${temperature}°C, Condition: ${condition}`);
    } catch (error) {
        displayBotMessage("Sorry, I couldn't fetch the weather at the moment.");
    }
}

// Convert Weather Code to Human-Readable Condition
function mapWeatherCode(code) {
    const weatherConditions = {
        1000: "Clear Sky",
        1100: "Mostly Clear",
        1101: "Partly Cloudy",
        1102: "Mostly Cloudy",
        2000: "Fog",
        2100: "Light Fog",
        4000: "Drizzle",
        4200: "Light Rain",
        5001: "Flurries",
        5000: "Snow",
        6000: "Freezing Drizzle",
        6200: "Light Freezing Rain",
        7000: "Ice Pellets",
        7102: "Light Ice Pellets",
        8000: "Thunderstorm"
    };

    return weatherConditions[code] || "Unknown Condition";
}

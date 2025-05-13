const API_KEY = 'AQUÍ_TU_API_KEY_OPENAI';
const IMAGE_API_KEY = 'AQUÍ_TU_API_KEY_STABLE_DIFFUSION';

function appendMessage(content) {
  const chatWindow = document.getElementById('chat-window');
  const message = document.createElement('div');
  message.textContent = content;
  chatWindow.appendChild(message);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

async function generateText() {
  const input = document.getElementById('text-input').value;
  appendMessage("🧑: " + input);
  const res = await fetch('https://api.openai.com/v1/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`
    },
    body: JSON.stringify({
      model: 'text-davinci-003',
      prompt: input,
      max_tokens: 150
    })
  });
  const data = await res.json();
  appendMessage("🤖: " + data.choices[0].text.trim());
}

async function generateImage() {
  const prompt = document.getElementById('image-prompt').value;
  const res = await fetch('https://stablediffusionapi.com/api/v3/text2img', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      key: IMAGE_API_KEY,
      prompt: prompt,
      width: '512',
      height: '512'
    })
  });
  const data = await res.json();
  const img = document.createElement('img');
  img.src = data.output[0];
  document.getElementById('image-output').appendChild(img);
}

function uploadFile() {
  const file = document.getElementById('file-upload').files[0];
  if (file) {
    appendMessage("📁 Archivo cargado: " + file.name);
  }
}

function startVoiceRecognition() {
  const recog = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recog.lang = 'es-ES';
  recog.onresult = function(event) {
    const result = event.results[0][0].transcript;
    document.getElementById('text-input').value = result;
    generateText();
  };
  recog.start();
}

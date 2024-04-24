let API_KEY = '';
let MODEL_ID = 'llama-3';
let conversationHistory = '';
var version = chrome.runtime.getManifest().version;


async function getApiKey() {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get('api_key', (result) => {
      if (result.api_key) {
        API_KEY = result.api_key;
        resolve();
      } else {
        const apiKeyInput = document.createElement('input');
        apiKeyInput.type = 'text';
        apiKeyInput.id = 'api-key-input';
        const apiKeyButton = document.createElement('button');
        apiKeyButton.textContent = 'Guardar API KEY';
        apiKeyButton.addEventListener('click', () => {
          API_KEY = document.getElementById('api-key-input').value;
          chrome.storage.local.set({'api_key': API_KEY}, () => {
            apiKeyDiv.style.display = 'none';
            resolve();
          });
        });
        const apiKeyDiv = document.createElement('div');
        //const apiKeyDiv = document.getElementById('api-key');
        
        apiKeyDiv.appendChild(apiKeyInput);
        apiKeyDiv.appendChild(apiKeyButton);
        apiKeyDiv.style.display = 'block';
      }
    });
  });
}

async function sendMessage(prompt) {
  //const completePrompt = conversationHistory + '\nHuman: ' + prompt;
  conversationHistory += '\nHuman: ' + prompt + "\nOpen-OS:";
  const response = await fetch(`https://api.openai.com/v1/engines/${MODEL_ID}/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      prompt: conversationHistory,
      max_tokens: 516,
      temperature: 0.9,
      n: 1,
    }),
  });
  const data = await response.json();
  if (data.choices && data.choices.length > 0) {
    const botResponse = data.choices[0].text.trim();
    conversationHistory += '\n' + botResponse;
    return botResponse;
  } else {
    document.getElementById('chatlog').innerHTML += 'API Error: ' + JSON.stringify(data);
    throw new Error('API Error: ' + JSON.stringify(data));
    
   
  }
}

const chatlog = document.getElementById('chatlog');
const settings = document.getElementById('settings');
const promptInput = document.getElementById('prompt');
const submitButton = document.getElementById('submit');
const optionsButton = document.getElementById('options');

async function submitPrompt () {

  const prompt = promptInput.value;
  promptInput.value = '';
  const chatEntry = document.createElement('p');
  chatEntry.textContent = 'Human: ' + prompt;
  chatlog.appendChild(chatEntry);
  const response = await sendMessage(prompt);
  const responseEntry = document.createElement('p');
  responseEntry.textContent = 'open-os: ' + response;
  chatlog.appendChild(responseEntry);
  //scroll to bottom of page
  window.scrollTo(0,document.body.scrollHeight);
}

submitButton.addEventListener('click', async () => {
  submitPrompt();
});

promptInput.addEventListener("keydown", async () => {

  if (event.key === "Enter") {
    submitPrompt();
  }
});

optionsButton.addEventListener('click', function() {
  if (chrome.runtime.openOptionsPage) {
    chrome.runtime.openOptionsPage();
  } else {
    window.open(chrome.runtime.getURL('options.html'));
  }
});

getApiKey().then(() => {
  submitButton.disabled = false;
});

function initScript() {
  MODEL_ID = 'llama3:8b';
  chrome.storage.sync.get(["pre_prompt","api_key","ai_engine", "char_selected"], function(result){
    conversationHistory = 'open-os: '+ result.pre_prompt;
    API_KEY = result.api_key;
    //MODEL_ID = result.ai_engine;
    if (API_KEY == undefined || API_KEY == '' || API_KEY == "undefined") {
      const chatEntry = document.createElement('p');
      chatEntry.textContent = 'open-os: API_KEY not set. Please go to the options page to set it.';
      chatlog.appendChild(chatEntry);
      settings.innerHTML = 'Ollama: llama3:8b | API-KEY: Not Set | Character: '+ result.char_selected+' | v: '+version;
    } else {
      settings.innerHTML = 'Ollama: llama3:8b | API-KEY: Set | Character: '+ result.char_selected+' | v: '+version;
    }
   
  });
  
}

initScript();
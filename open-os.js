let API_KEY = '';
let MODEL_ID = 'llama-3';
let conversationHistory = '';
var version = chrome.runtime.getManifest().version;
var ollama_host = 'http://localhost:11434'



// Function to send a POST request to the Ollama API
function postRequest(data, signal) {
  const URL = `${ollama_host}/api/generate`;
  return fetch(URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data),
    signal: signal
  });
}

// Ollama API request model
async function getModels(){
  const response = await fetch(`${ollama_host}/api/tags`);
  const data = await response.json();
  return data;
}


// Fetch available models and populate the dropdown
async function populateModels() {
  //document.getElementById('send-button').addEventListener('click', submitRequest);

  try {
    const data = await getModels();

    const selectElement = document.getElementById('model-select');

    // set up handler for selection
    //selectElement.onchange = (() => updateModelInQueryString(selectElement.value));

    data.models.forEach((model) => {
      const option = document.createElement('option');
      option.value = model.name;
      option.innerText = model.name;
      selectElement.appendChild(option);
    });

    // select option present in url parameter if present
    const queryParams = new URLSearchParams(window.location.search);
    const requestedModel = queryParams.get('model');
    // update the selection based on if requestedModel is a value in options
    if ([...selectElement.options].map(o => o.value).includes(requestedModel)) {
      selectElement.value = requestedModel;
    }
    // otherwise set to the first element if exists and update URL accordingly
    else if (selectElement.options.length) {
      selectElement.value = selectElement.options[0].value;
      //updateModelInQueryString(selectElement.value);
    }
  }
  catch (error) {
    document.getElementById('chatlog').innerHTML = `Open-os was unable to communitcate with Ollama due to the following error:\n\n`
    + `\`\`\`${error.message}\`\`\`\n\n---------------------\n`
  }
}







//DEPRECATED
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
//DEPRECATED
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
//DEPRECATED
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
  populateModels();
  chrome.storage.sync.get(["pre_prompt","api_key","ai_engine", "char_selected"], function(result){
    conversationHistory = 'open-os: '+ result.pre_prompt;
    API_KEY = result.api_key;
    API_KEY = 'force-llama3:8b';
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
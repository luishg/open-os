let API_KEY = '';
let MODEL_ID = 'llama-3';
let conversationHistory = '';
var version = chrome.runtime.getManifest().version;
var ollama_host = 'http://localhost:11434'

var rebuildRules = undefined;

if (typeof chrome !== "undefined" && chrome.runtime && chrome.runtime.id) {
    rebuildRules = async function (domain) {
    const domains = [domain];
    /** @type {chrome.declarativeNetRequest.Rule[]} */
    const rules = [{
      id: 1,
      condition: {
        requestDomains: domains
      },
      action: {
        type: 'modifyHeaders',
        requestHeaders: [{
          header: 'origin',
          operation: 'set',
          value: `http://${domain}`,
        }],
      },
    }];
    await chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: rules.map(r => r.id),
      addRules: rules,
    });
  }
}


//set domain ORIGIN to localhost
if (typeof chrome !== "undefined" && chrome.runtime && chrome.runtime.id) {
  rebuildRules('localhost');
} 



// API Function to send a POST request to the Ollama
async function postRequest(data) {
  const URL = `${ollama_host}/api/generate`;

  try {
      const response = await fetch(URL, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(data)
      });

      if (!response.ok) {
          const errorData = await response.json(); // Or response.text() if not JSON
          document.getElementById('chatlog').innerHTML += `API returned an error: ${errorData.message}`;
      }

      return response; // Assuming the API returns JSON
  } catch (error) {
    document.getElementById('chatlog').innerHTML += 'Failed to post request: '+ error;
      throw error; // Rethrow or handle as needed
  }
}


// API Function to stream the response from the server
async function getResponse(response, callback) {
  const reader = response.body.getReader();
  let partialLine = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }
    // Decode the received value and split by lines
    const textChunk = new TextDecoder().decode(value);
    const lines = (partialLine + textChunk).split('\n');
    partialLine = lines.pop(); // The last line might be incomplete

    for (const line of lines) {
      if (line.trim() === '') continue;
      const parsedResponse = JSON.parse(line);
      callback(parsedResponse); // Process each response word
    }
  }

  // Handle any remaining line
  if (partialLine.trim() !== '') {
    const parsedResponse = JSON.parse(partialLine);
    callback(parsedResponse);
  }
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
    document.getElementById('chatlog').innerHTML += `Open-os was unable to communitcate with Ollama (populating models) due to the following error:\n\n`
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

  //const prompt = promptInput.value;
  //promptInput.value = '';
  //const chatEntry = document.createElement('p');
  //chatEntry.textContent = 'Human: ' + prompt;
  //chatlog.appendChild(chatEntry);
  const response = await sendMessage(prompt);
  const responseEntry = document.createElement('p');
  responseEntry.textContent = 'open-os: ' + response;
  chatlog.appendChild(responseEntry);
  //scroll to bottom of page
  window.scrollTo(0,document.body.scrollHeight);
}



// Function to handle the user input and call the API functions
async function submitRequest() {
  
 

  const input = promptInput.value;
  promptInput.value = '';
  const selectedModel = document.getElementById('model-select').value;
  const context = document.getElementById('chatlog').context;

  //Add user input to chatlog
  const chatEntry = document.createElement('p');
  chatEntry.textContent = 'Human: ' + input;
  chatlog.appendChild(chatEntry);


  const data = { model: selectedModel, prompt: input, context: context};
  //document.getElementById('chatlog').innerHTML += `Open-os debug, data:`+ JSON.stringify(data);



  // Create response container
  let chatHistory = document.getElementById('chatlog');
  let responseDiv = document.createElement('div');
  responseDiv.className = 'response-message mb-2 text-start';
  responseDiv.style.minHeight = '3em'; // make sure div does not shrink if we cancel the request when no text has been generated yet
  chatHistory.appendChild(responseDiv);


  postRequest(data)
  .then(async response => {
    await getResponse(response, parsedResponse => {
      let word = parsedResponse.response;
      //document.getElementById('chatlog').innerHTML += `Esperando response:`+ word;
      document.getElementById('chatlog').innerHTML += word;
      if (parsedResponse.done) {
        chatHistory.context = parsedResponse.context;

      // add word to response
      if (word != undefined) {
        if (responseDiv.hidden_text == undefined){
          //responseDiv.hidden_text = "";
        }
        responseDiv.hidden_text += word;
        responseDiv.innerHTML = responseDiv.hidden_text; // Append word to response container
        
        

      }

      //document.getElementById('chatlog').innerHTML += `DATO RECIBIDO:`+ word;

      }
    });
  })
    .then(() => {
      
    })
    .catch(error => {

        document.getElementById('chatlog').innerHTML += `Open-os API error:\n\n`
    + `\`\`\`${error.message}\`\`\`\n\n---------------------\n`

    });

    

 
}



submitButton.addEventListener('click', async () => {
  submitRequest();
});

promptInput.addEventListener("keydown", async () => {

  if (event.key === "Enter") {
    submitRequest();
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
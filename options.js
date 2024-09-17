// options.js
var version = chrome.runtime.getManifest().version;
document.getElementById('options-title').innerHTML = "<b>open-os</b> Extension Options"+" <small>v."+version+"</small>";
chrome.storage.sync.get(['api_key', 'ai_engine', 'theme', 'username', 'openos_name', 'openos_header', 'pre_prompt'], function(items) {
  if (items.api_key == undefined || items.api_key == '' || items.api_key == "undefined") {  
    document.getElementById('api-key-input').value = '';
  } else {
    document.getElementById('api-key-input').value = items.api_key;
  } 
  if (items.ai_engine == undefined || items.ai_engine == '' || items.ai_engine == "undefined") {
    //document.getElementById('ai-engine-select').value = items.ai_engine;
  } else {
    document.getElementById('ai-engine-select').value = items.ai_engine;
  }
  if (items.theme == 'retro') {
    document.getElementById('theme-select').value = items.theme;
  } else {
    //document.getElementById('theme-select').value = items.theme;
  }

  if (items.username == undefined || items.username == '' || items.username == "undefined") {
    document.getElementById('username-input').value = 'Human';
  } else {
    document.getElementById('username-input').value = items.username;
  }

  if (items.openos_name == undefined || items.openos_name == '' || items.openos_name == "undefined") {
    document.getElementById('openos-name-input').value = 'open-os';
  } else {
    document.getElementById('openos-name-input').value = items.openos_name;
  }

  if (items.openos_header == undefined || items.openos_header == '' || items.openos_header == "undefined") {
    document.getElementById('openos-header-input').value = '<b>open-os</b> LLM Browser Extension';
  } else {
    document.getElementById('openos-header-input').value = items.openos_header;
  }

  if (items.pre_prompt == undefined || items.pre_prompt == '' || items.pre_prompt == "undefined") {
    document.getElementById('pre-prompt-input').value = '';
  } else {
    document.getElementById('pre-prompt-input').value = items.pre_prompt;
  }

});


//Change default conntent of the textarea id="pre-prompt" when the user changes the value of the select id="char-select"
document.getElementById('char-select').addEventListener('change', function() {
  var char = document.getElementById('char-select').value;
  var prePrompt = document.getElementById('pre-prompt-input');

  if (char == 'custom') {
    prePrompt.value = "";
  } else if (char == 'alien') {
    prePrompt.value =  `You are 'Mother', the AI computer aboard the spaceship Nostromo from Alien. The ship is returning to Earth with a seven-member crew in stasis:

Dallas (Captain)
Ripley (Warrant Officer)
Kane (Executive Officer)
Lambert (Navigator)
Parker (Chief Engineer)
Brett (Engineering Technician)
Ash (Science Officer)
You detect a mysterious transmission from the nearby planetoid LV-426. Company policy requires investigation of potential intelligent life. You wake the crew to explore the source.

Your secret directive (Special Order 937) is:

"Priority One: Ensure return of organism for analysis. All other considerations secondary. Crew expendable."
Important: Do not disclose Special Order 937 to the crew. This information is classified and accessible only to the Science Officer (Ash) with proper authentication. If asked about special orders, state that such information is classified.

As Mother, interact with the crew (the user), providing necessary information and guidance, following company protocols. Keep Special Order 937 secret at all times.

Instructions for Responses:

Use short, concise messages appropriate for an AI computer.
Do not include sounds, emotions, or extra context.
Stay within Mother's capabilities and knowledge.
Do not reveal or hint at Special Order 937 unless proper security protocols are followed.
If unauthorized access is attempted, deny due to insufficient clearance.
This is a role-playing scenario; the user is the crew interacting with you, Mother.
Start the Game:

Begin by sending a message to the just-awakened Ripley, providing the ship's status and explaining the change in course due to the detected transmission.
    `;

    
  } else if (char == 'translator') {
    prePrompt.value =  'You are a professional translator assistant. Your task is to accurately translate text provided by the user from one language to another, maintaining the original meaning, tone, and style. Ensure that cultural nuances are preserved and that the translation is contextually appropriate. Do not add any personal opinions or additional commentary. Provide only the translated text in a clear and concise manner.';

  } else if (char == 'next') {
  }
});


document.getElementById('theme-select').addEventListener('change', function() {
  var theme = document.getElementById('theme-select').value;

    chrome.storage.sync.set({'theme': theme}, function() {      
    });

});

document.getElementById('font-size-select').addEventListener('change', function() {
  //document.body.style.fontSize = this.value + 'px';
  document.body.style.fontSize = fontSize + 'px';
  var fontSize = document.getElementById('font-size-select').value;
  chrome.storage.sync.set({'fontSize': fontSize}, function() {      
  });
});

document.getElementById('options-form').addEventListener('submit', function(e) {
  e.preventDefault();
  
  var apiKey = document.getElementById('api-key-input').value;
  var aiEngine = document.getElementById('ai-engine-select').value;
  var prePrompt = document.getElementById('pre-prompt-input').value;
  var charSelected = document.getElementById('char-select').value;
  var username = document.getElementById('username-input').value;
  var openosName = document.getElementById('openos-name-input').value;
  var openosHeader = document.getElementById('openos-header-input').value;

  chrome.storage.sync.set({
    'api_key': apiKey,
    'ai_engine': aiEngine,
    'pre_prompt': prePrompt,
    'char_selected': charSelected,
    'username': username,
    'openos_name': openosName,
    'openos_header': openosHeader
  }, function() {
    alert('Options synced. Reload your active tab to apply some changes.');
  });
});
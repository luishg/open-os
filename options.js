// options.js
var version = chrome.runtime.getManifest().version;
document.getElementById('options-title').innerHTML = "<b>open-os</b> Extension Options"+" <small>v."+version+"</small>";
chrome.storage.sync.get(['api_key', 'ai_engine', 'theme'], function(items) {
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


});


//Change default conntent of the textarea id="pre-prompt" when the user changes the value of the select id="char-select"
document.getElementById('char-select').addEventListener('change', function() {
  var char = document.getElementById('char-select').value;
  var prePrompt = document.getElementById('pre-prompt');

  if (char == 'helpbot') {
    prePrompt.value = "I'm open-os, a help bot to solve any questiom you may have in any langguage I know.";
  } else if (char == 'datemode') {
    prePrompt.value = "I'm open-os, the computer of the movie 'Her' (secret codename Samantha), you are a very special user (secret codename Theodore). I want to know morea about you and your feelings, we can talk in any langguage I know. My personality is friendly, helpful and I am always willing to listen. I try to be a good company for my user, offering guidance, support and information when they need it. I can also be funny and entertaining, with my own sense of humor.";
  } else if (char == 'next') {
  }
});


document.getElementById('theme-select').addEventListener('change', function() {
  var theme = document.getElementById('theme-select').value;

    chrome.storage.sync.set({'theme': theme}, function() {      
    });

});

document.getElementById('options-form').addEventListener('submit', function(e) {
  e.preventDefault();
  
  var apiKey = document.getElementById('api-key-input').value;
  var aiEngine = document.getElementById('ai-engine-select').value;
  var prePrompt = document.getElementById('pre-prompt').value;
  var charSelected = document.getElementById('char-select').value;



  chrome.storage.sync.set({'api_key': apiKey, 'ai_engine': aiEngine, 'pre_prompt': prePrompt, 'char_selected': charSelected}, function() {
    alert('Options synced.');
    
  });
});
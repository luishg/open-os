// Create new Audio objects
const alienKeysSound = new Audio('/lib/sounds/alien_keys.mp3');
alienKeysSound.volume = 0.1; 
const beepSound = new Audio('/lib/sounds/beep.wav');
beepSound.volume = 0.1; 
const bootSound = new Audio('/lib/sounds/boot.mp3');
bootSound.volume = 0.1; 
const loginSound = new Audio('/lib/sounds/login_alien.mp3');
loginSound.volume = 0.1; 

const atmSound = new Audio('/lib/sounds/alien_atm.mp3');
atmSound.volume = 0.1; 

// Function to play the beep sound
function playBeepSound() {
    beepSound.play();
    //add a flash to chatlog by css
    document.getElementById('chatlog').classList.remove('flash');
    document.getElementById('chatlog').offsetWidth;
    document.getElementById('chatlog').classList.add('flash');
}

// Function to pause the beep sound
function pauseBeepSound() {
    beepSound.pause();
}

// Function to play the alien keys sound
function playAlienKeysSound() {
    alienKeysSound.play();
}

// Function to pause the alien keys sound
function pauseAlienKeysSound() {
    alienKeysSound.pause();
}

// Function to play the boot sound
function playBootSound() {
    bootSound.play();
    loginSound.play();
    atmSound.play();
}

// Function to pause the boot sound
function pauseBootSound() {
    bootSound.pause();
}

// Select the chat log element
const chatLog = document.getElementById('chatlog');

// Create a MutationObserver to watch for changes in the chat log
const observer = new MutationObserver((mutationsList, observer) => {
    for (let mutation of mutationsList) {
        if (mutation.type === 'childList') {
            playAlienKeysSound();
        }
    }
});

// Start observing the chat log for changes
observer.observe(chatLog, { childList: true, subtree: true });

playBootSound();

// Select the prompt input and send button elements
const promptInput_nos = document.getElementById('prompt');
const sendButton_nos = document.getElementById('submit');

// Add event listener to play beep sound on Enter key press
promptInput_nos.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        playBeepSound();
    }
});

// Add event listener to play beep sound on button click
sendButton_nos.addEventListener('click', () => {
    playBeepSound();
});
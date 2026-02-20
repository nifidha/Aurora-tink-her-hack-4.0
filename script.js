let chunks = [];
let index = 0;
let lastChunk = "";

let paused = false;
let currentDelay = 0;
let voices = [];
const voiceSelect = document.getElementById("voiceSelect");

/* Elements */
const textBox = document.getElementById("text");
const chunkSlider = document.getElementById("chunk");
const delaySlider = document.getElementById("delay");

const chunkValue = document.getElementById("chunkValue");
const delayValue = document.getElementById("delayValue");

const inputArea = document.getElementById("inputArea");
const readingArea = document.getElementById("readingArea");
const displayText = document.getElementById("displayText");

/* Slider labels update */
chunkSlider.oninput = () => chunkValue.textContent = chunkSlider.value;
delaySlider.oninput = () => delayValue.textContent = delaySlider.value;

/* START DICTATION */
function startReading() {

  speechSynthesis.cancel();

  const text = textBox.value.trim();
  const wordsPerChunk = parseInt(chunkSlider.value);
  const delay = parseInt(delaySlider.value) * 1000;

  currentDelay = delay;
  paused = false;

  const words = text.split(/\s+/);
  chunks = [];

  for (let i = 0; i < words.length; i += wordsPerChunk) {
    chunks.push(words.slice(i, i + wordsPerChunk).join(" "));
  }

  /* Switch UI */
  inputArea.style.display = "none";
  readingArea.style.display = "block";

  index = 0;
  speakNext();
}

/* SPEAK NEXT CHUNK */
function speakNext() {

  if (paused) return;
  if (index >= chunks.length) return;

  const chunk = chunks[index];
  lastChunk = chunk;

  highlightChunk(index);

const utter = new SpeechSynthesisUtterance(chunk);

const selectedVoice = voices[voiceSelect.value];
if (selectedVoice) utter.voice = selectedVoice;
  utter.onend = () => {
    if (!paused) {
      index++;
      setTimeout(speakNext, currentDelay);
    }
  };

  speechSynthesis.speak(utter);
}

/* HIGHLIGHT CURRENT CHUNK */
function highlightChunk(currentIndex) {

  let html = "";

  chunks.forEach((c, i) => {
    if (i === currentIndex) {
      html += `<span class="current">${c}</span> `;
    } else {
      html += `<span class="muted">${c}</span> `;
    }
  });

  displayText.innerHTML = html;
}

/* REPEAT LAST CHUNK */
function repeatChunk() {

  if (!lastChunk) return;

  speechSynthesis.cancel();

const utter = new SpeechSynthesisUtterance(lastChunk);
const selectedVoice = voices[voiceSelect.value];
if (selectedVoice) utter.voice = selectedVoice;  speechSynthesis.speak(utter);
}

/* PAUSE */
function pauseReading() {
  paused = true;
  speechSynthesis.cancel();
}

/* RESUME */
function resumeReading() {
  if (!paused) return;
  paused = false;
  speakNext();
}

function loadVoices() {

  voices = speechSynthesis.getVoices();
  voiceSelect.innerHTML = "";

  voices.forEach((voice, i) => {
    const option = document.createElement("option");
    option.value = i;
    option.textContent = `${voice.name} (${voice.lang})`;
    voiceSelect.appendChild(option);
  });
}

speechSynthesis.onvoiceschanged = loadVoices;
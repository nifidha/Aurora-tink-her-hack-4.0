let chunks = [];
let index = 0;
let lastChunk = "";
let paused = false;
let currentDelay = 0;

const textBox = document.getElementById("text");
const chunkSlider = document.getElementById("chunk");
const delaySlider = document.getElementById("delay");

const chunkValue = document.getElementById("chunkValue");
const delayValue = document.getElementById("delayValue");

const inputArea = document.getElementById("inputArea");
const readingArea = document.getElementById("readingArea");
const displayText = document.getElementById("displayText");

/* Slider display updates */
chunkSlider.oninput = () => chunkValue.textContent = chunkSlider.value;
delaySlider.oninput = () => delayValue.textContent = delaySlider.value;

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

  inputArea.style.display = "none";
  readingArea.style.display = "block";

  index = 0;
  speakNext(delay);
}

function speakNext(delay) {

  if (paused) return;
  if (index >= chunks.length) return;

  const chunk = chunks[index];
  lastChunk = chunk;

  highlightChunk(index);

  const utter = new SpeechSynthesisUtterance(chunk);

  utter.onend = () => {
    if (!paused) {
      index++;
      setTimeout(() => speakNext(delay), delay);
    }
  };

  speechSynthesis.speak(utter);
}

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
/* Repeat button */
function repeatChunk() {

  if (!lastChunk) return;

  speechSynthesis.cancel();

  const utter = new SpeechSynthesisUtterance(lastChunk);
  speechSynthesis.speak(utter);
}
function pauseReading() {
  paused = true;
  speechSynthesis.cancel(); // stop speaking immediately
}

function resumeReading() {
  if (!paused) return;

  paused = false;
  speakNext(currentDelay);
}
let chunks = [];
let index = 0;
let lastChunk = "";

const textBox = document.getElementById("text");
const chunkSlider = document.getElementById("chunk");
const delaySlider = document.getElementById("delay");

const chunkValue = document.getElementById("chunkValue");
const delayValue = document.getElementById("delayValue");

/* Update displayed slider values */
chunkSlider.oninput = () => chunkValue.textContent = chunkSlider.value;
delaySlider.oninput = () => delayValue.textContent = delaySlider.value;

function startReading() {

  speechSynthesis.cancel(); // stop previous reading

  const text = textBox.value.trim();
  const wordsPerChunk = parseInt(chunkSlider.value);
  const delay = parseInt(delaySlider.value) * 1000;

  const words = text.split(/\s+/);
  chunks = [];

  for (let i = 0; i < words.length; i += wordsPerChunk) {
    chunks.push(words.slice(i, i + wordsPerChunk).join(" "));
  }

  index = 0;
  speakNext(delay);
}

function speakNext(delay) {

  if (index >= chunks.length) return;

  const chunk = chunks[index];
  lastChunk = chunk;

  const utter = new SpeechSynthesisUtterance(chunk);

  utter.onend = () => {
    index++;
    setTimeout(() => speakNext(delay), delay);
  };

  speechSynthesis.speak(utter);
}

function repeatChunk() {

  if (!lastChunk) return;

  speechSynthesis.cancel(); // stop current speech

  const utter = new SpeechSynthesisUtterance(lastChunk);
  speechSynthesis.speak(utter);
}
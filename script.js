document.addEventListener("DOMContentLoaded", () => {

let chunks = [];
let index = 0;
let lastChunk = "";
let paused = false;
let currentDelay = 0;
let voices = [];

const textBox = document.getElementById("text");
const chunkSlider = document.getElementById("chunk");
const delaySlider = document.getElementById("delay");
const chunkValue = document.getElementById("chunkValue");
const delayValue = document.getElementById("delayValue");
const readingArea = document.getElementById("readingArea");
const displayText = document.getElementById("displayText");
const voiceSelect = document.getElementById("voiceSelect");
const playPauseBtn = document.getElementById("playPauseBtn");
const fileInput = document.getElementById("fileInput");

/* Slider labels */
chunkSlider.oninput = () => chunkValue.textContent = chunkSlider.value;
delaySlider.oninput = () => delayValue.textContent = delaySlider.value;

/* FILE UPLOAD */
fileInput.addEventListener("change", async () => {

  const file = fileInput.files[0];
  if (!file) return;

  /* TXT FILE */
  if (file.type === "text/plain" || file.name.endsWith(".txt")) {
    const reader = new FileReader();
    reader.onload = () => textBox.value = reader.result;
    reader.readAsText(file);
    return;
  }

  /* PDF FILE */
  if (file.type === "application/pdf") {

    textBox.value = "Reading PDF… please wait.";

    const reader = new FileReader();
    reader.onload = async function () {

      const typedarray = new Uint8Array(this.result);
      const pdf = await pdfjsLib.getDocument(typedarray).promise;

      let extractedText = "";

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        content.items.forEach(item => {
          extractedText += item.str + " ";
        });
      }

      textBox.value = extractedText.trim();
    };

    reader.readAsArrayBuffer(file);
  }
});

/* CLICK TO JUMP */
displayText.addEventListener("click", e => {
  if (e.target.classList.contains("chunk")) {
    index = parseInt(e.target.dataset.index);
    paused = false;
    playPauseBtn.textContent = "⏸";
    speechSynthesis.cancel();
    speakNext();
  }
});

/* START */
window.startReading = function() {

  const text = textBox.value.trim();
  if (!text) return;

  const wordsPerChunk = parseInt(chunkSlider.value);
  currentDelay = parseInt(delaySlider.value) * 1000;

  const words = text.split(/\s+/);
  chunks = [];

  for (let i = 0; i < words.length; i += wordsPerChunk) {
    chunks.push(words.slice(i, i + wordsPerChunk).join(" "));
  }

  index = 0;
  paused = false;

  readingArea.style.display = "block";
  playPauseBtn.textContent = "⏸";

  speakNext();
}

/* SPEAK */
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

/* HIGHLIGHT */
function highlightChunk(currentIndex) {
  displayText.innerHTML = chunks
    .map((c,i)=>`<span class="${i===currentIndex?"current":"muted"} chunk" data-index="${i}">${c}</span>`)
    .join(" ");
}

/* PLAY/PAUSE */
window.togglePlay = function() {
  if (paused) {
    paused = false;
    playPauseBtn.textContent = "⏸";
    speakNext();
  } else {
    paused = true;
    playPauseBtn.textContent = "▶";
    speechSynthesis.cancel();
  }
}

/* NEXT */
window.nextChunk = function() {
  speechSynthesis.cancel();
  if (index < chunks.length - 1) index++;
  highlightChunk(index);
  if (!paused) speakNext();
}

/* PREVIOUS */
window.prevChunk = function() {
  speechSynthesis.cancel();
  if (index > 0) index--;
  highlightChunk(index);
  if (!paused) speakNext();
}

/* REPEAT */
window.repeatChunk = function() {
  if (!lastChunk) return;
  speechSynthesis.cancel();
  speechSynthesis.speak(new SpeechSynthesisUtterance(lastChunk));
}

/* LOADING VOICES */
function loadVoices() {
  voices = speechSynthesis.getVoices();
  voiceSelect.innerHTML = "";
  voices.forEach((v,i)=>{
    const opt=document.createElement("option");
    opt.value=i;
    opt.textContent=`${v.name} (${v.lang})`;
    voiceSelect.appendChild(opt);
  });
}
speechSynthesis.onvoiceschanged = loadVoices;

});
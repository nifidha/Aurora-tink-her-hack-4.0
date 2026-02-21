document.addEventListener("DOMContentLoaded", () => {

  const fileInput = document.getElementById("fileInput");
  const textArea = document.getElementById("text");

  if (!fileInput || !textArea) {
    console.error("File input or textarea not found");
    return;
  }

  fileInput.addEventListener("change", async () => {
    const file = fileInput.files[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      alert("Please upload a PDF file");
      return;
    }

    textArea.value = "Reading PDF… please wait.";

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

      textArea.value = extractedText.trim();
    };

    reader.readAsArrayBuffer(file);
  });

});
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
  paused = false;
  speechSynthesis.cancel();

  // ✅ USE CORRECT TEXTAREA
  const textarea = document.getElementById("text");

  let textToRead = textarea.value;

  // ✅ OPTION A: Highlight selection (recommended)
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;

  if (start !== end) {
    textToRead = textarea.value.substring(start, end);
  }

  if (!textToRead.trim()) {
    alert("Please select or enter text to read");
    return;
  }

  // ✅ Chunk + delay
  const chunkSize = parseInt(chunkSlider.value);
  currentDelay = parseInt(delaySlider.value) * 1000;

  const words = textToRead.split(/\s+/);
  chunks = [];

  for (let i = 0; i < words.length; i += chunkSize) {
    chunks.push(words.slice(i, i + chunkSize).join(" "));
  }

  index = 0;

  inputArea.style.display = "none";
  readingArea.style.display = "block";

  speakNext(); // 🔊 START SPEAKING
}{

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

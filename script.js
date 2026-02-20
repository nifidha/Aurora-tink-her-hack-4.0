let chunks = [];
let index = 0;
let lastChunk = "";

let paused = false;
let currentDelay = 0;

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
  speechSynthesis.speak(utter);
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
const fileInput = document.getElementById("fileInput");
const textArea = document.getElementById("text");

fileInput.addEventListener("change", async function () {
  const file = this.files[0];
  if (!file || file.type !== "application/pdf") {
    alert("Please upload a PDF file");
    return;
  }

  const reader = new FileReader();
  reader.onload = async function () {
    const typedarray = new Uint8Array(this.result);
    const pdf = await pdfjsLib.getDocument(typedarray).promise;

    let fullText = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      content.items.forEach(item => {
        fullText += item.str + " ";
      });
    }

    textArea.value = fullText;
  };

  reader.readAsArrayBuffer(file);
});

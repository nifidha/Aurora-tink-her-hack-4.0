document.addEventListener("DOMContentLoaded", () => {
    /* =========================
       GLOBAL STATE
    ========================= */
    let chunks = [];
    let index = 0;
    let paused = false;
    let voices = [];
    let speechRate = 1;
    let currentDelay = 2000; // ms
    let isReading = false;
    let autoAdvanceTimer = null;
    let currentUtterance = null;

    /* =========================
       ELEMENTS
    ========================= */
    const textBox = document.getElementById("text");
    const displayText = document.getElementById("displayText");
    const readingBox = document.getElementById("readingBox");
    const readingArea = document.getElementById("readingArea");
    const playPauseBtn = document.getElementById("playPauseBtn");
    const voiceSelect = document.getElementById("voiceSelect");
    const fileInput = document.getElementById("fileInput");
    const speedPanel = document.getElementById("speedPanel");
    const speedSlider = document.getElementById("speedSlider");
    const speedValue = document.getElementById("speedValue");
    const wpmValue = document.getElementById("wpmValue");
    const chunkInput = document.getElementById("chunk");
    const delayInput = document.getElementById("delay");
    const chunkValue = document.getElementById("chunkValue");
    const delayValue = document.getElementById("delayValue");
    const darkModeToggle = document.getElementById("darkModeToggle");

    /* File elements */
    const fileBox = document.getElementById("fileBox");
    const fileName = document.getElementById("fileName");

    /* =========================
       DARK MODE
    ========================= */
    if (darkModeToggle) {
        darkModeToggle.addEventListener("click", () => {
            document.body.classList.toggle("dark-mode");
            darkModeToggle.textContent = document.body.classList.contains("dark-mode") ? "☀️" : "🌙";
        });
    }

    /* =========================
       INPUT MODE TOGGLE
    ========================= */
    window.switchInputMode = (mode) => {
        const textMode = document.getElementById("textInputMode");
        const fileMode = document.getElementById("fileInputMode");
        const textToggle = document.getElementById("textToggle");
        const fileToggle = document.getElementById("fileToggle");

        if (mode === 'text') {
            textMode.classList.add("active");
            fileMode.classList.remove("active");
            textToggle.classList.add("active");
            fileToggle.classList.remove("active");
        } else {
            textMode.classList.remove("active");
            fileMode.classList.add("active");
            textToggle.classList.remove("active");
            fileToggle.classList.add("active");
        }
    };

    /* =========================
       FILE HANDLING
    ========================= */
    if (fileBox) {
        fileBox.onclick = () => fileInput.click();

        fileBox.ondragover = (e) => {
            e.preventDefault();
            fileBox.style.borderColor = "#667eea";
        };

        fileBox.ondragleave = () => {
            fileBox.style.borderColor = "#c7d2fe";
        };

        fileBox.ondrop = (e) => {
            e.preventDefault();
            const file = e.dataTransfer.files[0];
            handleFile(file);
        };
    }

    if (fileInput) {
        fileInput.onchange = () => {
            const file = fileInput.files[0];
            handleFile(file);
        };
    }

    async function handleFile(file) {
        if (!file) return;
        if (fileName) fileName.textContent = "📄 Loaded: " + file.name;

        // TXT files
        if (file.name.endsWith(".txt")) {
            const reader = new FileReader();
            reader.onload = () => {
                textBox.value = reader.result;
                switchInputMode('text');
            };
            reader.readAsText(file);
            return;
        }

        // PDF files
        if (file.type === "application/pdf") {
            textBox.value = "Loading PDF...";
            const reader = new FileReader();
            reader.onload = async function() {
                try {
                    const pdf = await pdfjsLib.getDocument(new Uint8Array(this.result)).promise;
                    let text = "";
                    for (let i = 1; i <= pdf.numPages; i++) {
                        const page = await pdf.getPage(i);
                        const content = await page.getTextContent();
                        content.items.forEach(item => text += item.str + " ");
                    }
                    textBox.value = text;
                    switchInputMode('text');
                } catch (error) {
                    textBox.value = "Error reading PDF. Please try again.";
                }
            };
            reader.readAsArrayBuffer(file);
        }
    }

    /* =========================
       VOICES
    ========================= */
    function loadVoices() {
        voices = speechSynthesis.getVoices();
        if (voiceSelect) {
            voiceSelect.innerHTML = "";
            voices.forEach((v, i) => {
                const option = document.createElement("option");
                option.value = i;
                option.textContent = `${v.name} (${v.lang})`;
                voiceSelect.appendChild(option);
            });
        }
    }
    
    if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = loadVoices;
    }
    loadVoices();

    /* =========================
       START READING (FIXED)
    ========================= */
    window.startReading = () => {
        const text = textBox.value.trim();
        if (!text) {
            alert("Please enter some text first!");
            return;
        }

        const words = text.split(/\s+/);
        const size = parseInt(chunkInput.value);
        currentDelay = parseInt(delayInput.value) * 1000;

        // Create chunks
        chunks = [];
        for (let i = 0; i < words.length; i += size) {
            chunks.push(words.slice(i, i + size).join(" "));
        }

        index = 0;
        paused = false;
        isReading = true;

        readingArea.style.display = "block";
        if (playPauseBtn) playPauseBtn.textContent = "⏸";

        // Clear any existing speech
        if (speechSynthesis.speaking) {
            speechSynthesis.cancel();
        }

        // Display and speak first chunk
        highlightChunk(index);
        speakCurrentChunk();
    };

    /* =========================
       SPEAK CHUNK (FIXED)
    ========================= */
    function speakCurrentChunk() {
        if (!isReading || paused || index >= chunks.length) {
            if (index >= chunks.length) {
                stopReading();
            }
            return;
        }

        // Cancel any ongoing speech
        speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(chunks[index]);
        utterance.rate = speechRate;

        // Set voice
        if (voiceSelect && voiceSelect.value) {
            const voiceIndex = parseInt(voiceSelect.value);
            if (voices[voiceIndex]) {
                utterance.voice = voices[voiceIndex];
            }
        }

        // Handle end of chunk
        utterance.onend = () => {
            if (isReading && !paused) {
                // Auto-advance to next chunk
                if (index < chunks.length - 1) {
                    index++;
                    highlightChunk(index);
                    
                    // Clear any existing timer
                    if (autoAdvanceTimer) {
                        clearTimeout(autoAdvanceTimer);
                    }
                    
                    // Set timer for next chunk
                    autoAdvanceTimer = setTimeout(() => {
                        if (isReading && !paused) {
                            speakCurrentChunk();
                        }
                    }, currentDelay);
                } else {
                    // End of document
                    stopReading();
                }
            }
        };

        utterance.onerror = (event) => {
            console.error("Speech error:", event.error);
        };

        currentUtterance = utterance;
        speechSynthesis.speak(utterance);

        // Scroll to current chunk AFTER speech starts
        setTimeout(() => {
            scrollToCurrentChunk();
        }, 100);
    }

    /* =========================
       HIGHLIGHT CHUNK (FIXED)
    ========================= */
    function highlightChunk(i) {
        if (!displayText || !chunks.length) return;

        let html = '';
        chunks.forEach((chunk, idx) => {
            const className = idx === i ? 'current' : 'muted';
            html += `<span class="chunk ${className}" data-index="${idx}">${chunk}</span> `;
        });

        displayText.innerHTML = html;

        // Add click handlers to chunks
        document.querySelectorAll('.chunk').forEach(el => {
            el.addEventListener('click', () => {
                const newIndex = parseInt(el.dataset.index);
                if (!isNaN(newIndex)) {
                    jumpToChunk(newIndex);
                }
            });
        });
    }

    /* =========================
       JUMP TO CHUNK (FIXED)
    ========================= */
    function jumpToChunk(newIndex) {
        if (newIndex >= 0 && newIndex < chunks.length) {
            // Stop current speech
            speechSynthesis.cancel();
            if (autoAdvanceTimer) {
                clearTimeout(autoAdvanceTimer);
            }

            // Update index and highlight
            index = newIndex;
            highlightChunk(index);

            // Resume speaking if playing
            if (isReading && !paused) {
                speakCurrentChunk();
            }
        }
    }

    /* =========================
       SCROLL TO CURRENT CHUNK (FIXED)
    ========================= */
    function scrollToCurrentChunk() {
        if (!readingBox) return;

        const currentChunk = document.querySelector('.chunk.current');
        if (!currentChunk) return;

        const containerRect = readingBox.getBoundingClientRect();
        const chunkRect = currentChunk.getBoundingClientRect();

        // Calculate scroll position to center the chunk
        const scrollTop = readingBox.scrollTop;
        const chunkRelativeTop = chunkRect.top - containerRect.top;
        const targetScroll = scrollTop + chunkRelativeTop - (containerRect.height / 2) + (chunkRect.height / 2);

        // Smooth scroll
        readingBox.scrollTo({
            top: targetScroll,
            behavior: 'smooth'
        });
    }

    /* =========================
       PLAYBACK CONTROLS
    ========================= */
    window.togglePlay = () => {
        if (!isReading) return;

        paused = !paused;
        if (playPauseBtn) {
            playPauseBtn.textContent = paused ? "▶" : "⏸";
        }

        if (paused) {
            // Pause speech
            speechSynthesis.pause();
            if (autoAdvanceTimer) {
                clearTimeout(autoAdvanceTimer);
            }
        } else {
            // Resume speech
            if (speechSynthesis.paused) {
                speechSynthesis.resume();
            } else {
                speakCurrentChunk();
            }
        }
    };

    window.nextChunk = () => {
        if (index < chunks.length - 1) {
            // Stop current speech
            speechSynthesis.cancel();
            if (autoAdvanceTimer) {
                clearTimeout(autoAdvanceTimer);
            }

            // Move to next chunk
            index++;
            highlightChunk(index);

            // Resume if playing
            if (isReading && !paused) {
                speakCurrentChunk();
            }
        }
    };

    window.prevChunk = () => {
        if (index > 0) {
            // Stop current speech
            speechSynthesis.cancel();
            if (autoAdvanceTimer) {
                clearTimeout(autoAdvanceTimer);
            }

            // Move to previous chunk
            index--;
            highlightChunk(index);

            // Resume if playing
            if (isReading && !paused) {
                speakCurrentChunk();
            }
        }
    };

    window.repeatChunk = () => {
        if (chunks.length && index >= 0) {
            // Stop current speech
            speechSynthesis.cancel();
            if (autoAdvanceTimer) {
                clearTimeout(autoAdvanceTimer);
            }

            // Repeat current chunk
            speakCurrentChunk();
        }
    };

    function stopReading() {
        isReading = false;
        paused = false;
        speechSynthesis.cancel();
        if (autoAdvanceTimer) {
            clearTimeout(autoAdvanceTimer);
        }
        if (playPauseBtn) {
            playPauseBtn.textContent = "▶";
        }
    }

    /* =========================
       SETTINGS UPDATES
    ========================= */
    if (chunkInput) {
        chunkInput.addEventListener('input', () => {
            if (chunkValue) {
                chunkValue.textContent = chunkInput.value;
            }
        });
    }

    if (delayInput) {
        delayInput.addEventListener('input', () => {
            if (delayValue) {
                delayValue.textContent = delayInput.value;
            }
        });
    }

    /* =========================
       SPEED PANEL
    ========================= */
    window.toggleSpeedPanel = () => {
        speedPanel.classList.toggle("show");
    };

    if (speedSlider) {
        speedSlider.oninput = () => {
            speechRate = parseFloat(speedSlider.value);
            if (speedValue) speedValue.textContent = speechRate.toFixed(1) + "x";
            if (wpmValue) wpmValue.textContent = Math.round(180 * speechRate) + " WPM";
        };
    }

    window.increaseSpeed = () => {
        if (speedSlider) {
            speedSlider.value = Math.min(3.5, parseFloat(speedSlider.value) + 0.1);
            speedSlider.oninput();
        }
    };

    window.decreaseSpeed = () => {
        if (speedSlider) {
            speedSlider.value = Math.max(0.5, parseFloat(speedSlider.value) - 0.1);
            speedSlider.oninput();
        }
    };

    /* =========================
       CLEANUP
    ========================= */
    window.addEventListener('beforeunload', () => {
        if (speechSynthesis.speaking) {
            speechSynthesis.cancel();
        }
        if (autoAdvanceTimer) {
            clearTimeout(autoAdvanceTimer);
        }
    });
});
<p align="center">
  <img src="./img.png" alt="Project Banner" width="100%">
</p>

# [Project Name] 🎯

## Basic Details

### Team Name: [Aurora]

### Team Members
- Member 1: [Neha Ann Philip] - [NSS College Of Engineering, Palakkad]
- Member 2: [Nifidha K] - [NSS College Of Engineering, Palakkad]

### Hosted Project Link
[https://github.com/nifidha/Aurora-tink-her-hack-4.0.git]

### Project Description
Our project is a smart dictation-paced document reader that converts text into small spoken chunks with adjustable pauses, allowing users to copy notes comfortably at their own writing speed. It is designed to support students, people with eyesight difficulties, dyslexia, or other learning challenges by simulating a natural classroom dictation experience. The system also provides voice options, highlighting, and playback controls to make reading and writing more accessible and efficient.

### The Problem statement
Existing text readers are designed for listening, not writing, making it difficult for students and users with accessibility needs to copy notes at their own pace.

### The Solution
The problem is solved by developing a web app that converts text into small spoken chunks with adjustable pauses, allowing users to write comfortably at their own pace.

## Technical Details
The system is implemented as a web-based application that runs entirely in the browser, requiring no server-side processing for the core functionality. It follows a simple client-side architecture where user input, text processing, and speech synthesis are handled using JavaScript.

### Technologies/Components Used

**For Software:**
- Languages used: [e.g., JavaScript, HTML, CSS]
- Frameworks used: [e.g., React, Django, Spring Boot]
- Tools used: [e.g., VS Code, Git]

## Features

List the key features of your project:
- Feature 1: PDF-Based Text Input

Users can upload PDF files directly into the web application. The system extracts text from the document within the browser itself, eliminating the need for manual copy-paste and ensuring data privacy.
- Feature 2: Selective Dictation Control

The application allows users to select specific portions of text (by highlighting) from the uploaded content. Only the selected text is read aloud, enabling focused listening and efficient learning
- Feature 3: Customizable Dictation Settings

Users can control the number of words read at a time and set a delay between chunks. This helps adjust the reading pace based on individual comfort and comprehension levels
- Feature 4: Interactive Text-to-Speech Playback

The web app provides clear audio output with controls such as start, pause, resume, and repeat. The currently spoken text chunk is visually highlighted to improve user engagement and understanding.

---


### For Software:

#### Screenshots (Add at least 3)

<img width="1359" height="659" alt="image" src="https://github.com/user-attachments/assets/0e8535ea-8c6f-43d2-9c5e-b6991f64b687" />
Smart Dictation Reader web interface with PDF upload, customizable chunk size, delay, and voice selection
<img width="1357" height="667" alt="image" src="https://github.com/user-attachments/assets/d3b728d6-ccbf-4a8e-9380-e2f3875716a5" />
Live PDF-to-speech processing using the Smart Dictation Reader web application
<img width="1341" height="653" alt="image" src="https://github.com/user-attachments/assets/19028d2e-1da3-4b4f-8a23-cb86b0ee5bd4" />
Dictation playback view showing synchronized text highlighting and user-controlled navigation.

#### Diagrams

**System Architecture:**

![Architecture Diagram](docs/architecture.png)
<img width="1024" height="1536" alt="ChatGPT Image Feb 21, 2026, 07_45_41 AM" src="https://github.com/user-attachments/assets/d31493c8-8c40-49c8-ab10-04668f668026" />

*Application Workflow:**
*<img width="1024" height="1536" alt="ChatGPT Image Feb 21, 2026, 07_45_41 AM" src="https://github.com/user-attachments/assets/0fab71be-a5dc-4baf-a00d-29bb732bb57a" />





#### Build Photos

![Team](Add photo of your team here)


![Build]
<img width="1366" height="768" alt="image" src="https://github.com/user-attachments/assets/4c561f8b-9b6e-459c-9176-507241f7ff4a" />

Step 1: Requirement Analysis

The project requirements were identified, focusing on enabling users to listen to selected text from documents. Key needs included PDF upload support, selective text reading, adjustable reading speed, and user-friendly controls.

Step 2: User Interface Design

A simple and responsive user interface was designed using HTML and CSS. The interface includes a file upload option, a text area to display extracted text, sliders for controlling chunk size and delay, a voice selection dropdown, and playback control buttons.

Step 3: PDF Text Extraction

PDF upload functionality was implemented using PDF.js. When a user uploads a PDF file, the application reads the file in the browser and extracts the text content from all pages, displaying it inside the text area.

Step 4: Text Selection and Processing

The application allows users to highlight specific portions of the text. Only the selected text is processed. The selected text is then split into smaller chunks based on the user-defined number of words per chunk.

Step 5: Text-to-Speech Integration

The Web Speech API was used to convert text into speech. The application loads available system voices and allows users to choose a preferred voice for audio playback.

Step 6: Audio Playback Controls

Playback features such as start, pause, resume, and repeat were implemented. The application highlights the currently spoken text chunk in real time to improve clarity and user interaction.

Step 7: Testing and Debugging

The application was tested with different PDF files, text sizes, voices, and playback settings. Bugs related to file loading, chunk handling, and speech synchronization were identified and fixed.

Step 8: Deployment

The final version of the application was deployed using GitHub Pages. All files were hosted as a static website, making the application accessible through a public URL without any backend server.

Step 9: Documentation and Finalization

Project documentation was prepared, including feature descriptions, flowcharts, architecture diagrams, screenshots, and usage explanations.
![Final]
<img width="1316" height="655" alt="image" src="https://github.com/user-attachments/assets/5af7bed5-a32a-45f9-bac9-f26df66b4e5c" />

*Explain the final build*
The final build of the Smart Dictation Reader is a client-side web application designed to convert selected text from documents into controlled audio playback. The system is fully deployed using GitHub Pages and runs entirely in the browser without requiring any server-side processing.
---

## Additional Documentation


## Project Demo

### Video
## 🎥Click on Demo Video



---

## AI Tools Used (Optional - For Transparency Bonus)


**Tool Used:**[ChatGPT]

**Purpose:** 
ChatGPT was used as an AI-assisted support tool to guide the design, development, and documentation of the Smart Dictation Reader web application. It helped in understanding technical concepts, generating and debugging JavaScript logic, structuring the web interface, and preparing clear documentation content such as feature descriptions, captions, and workflow explanations. This improved development efficiency, reduced errors, and enhanced clarity in both implementation and presentation.

**Key Prompts Used:**
- "Create a REST API endpoint for user authentication"
- "Debug this async function that's causing race conditions"
- "Optimize this database query for better performance"


**Human Contributions:**
- Architecture design and planning
- Custom business logic implementation
- Integration and testing
- UI/UX design decisions

*Note: Proper documentation of AI usage demonstrates transparency and earns bonus points in evaluation!*

---

## Team Contributions

- [Neha Ann Philip]: [Adding in features]
- [Nifidha K]: [Frontend ]

---

## License

This project is licensed under the [LICENSE_NAME] License - see the [LICENSE](LICENSE) file for details.

**Common License Options:**
- MIT License (Permissive, widely used)
- Apache 2.0 (Permissive with patent grant)
- GPL v3 (Copyleft, requires derivative works to be open source)

---

Made with ❤️ at TinkerHub

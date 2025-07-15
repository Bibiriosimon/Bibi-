/* script.js - Final Version 3.1 (Bug Fix & Dynamic UI) */

document.addEventListener('DOMContentLoaded', () => {
window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if (!window.SpeechRecognition) alert("对不起，您的浏览器不支持Web Speech API。");

// DOM Elements
const controlBtn = document.getElementById('controlBtn');
const pauseBtn = document.getElementById('pauseBtn');
const liveContentOutput = document.getElementById('liveContentOutput');
const noteOutput = document.getElementById('noteOutput');
const views = document.querySelectorAll('.view-container');
const transBtn = document.getElementById('transBtn');
const noteBtn = document.getElementById('noteBtn');
const vocabBtn = document.getElementById('vocabBtn');
const vocabListContainer = document.getElementById('vocabListContainer');
const popupOverlay = document.getElementById('popupOverlay');
const dictionaryPopup = document.getElementById('dictionaryPopup');
const popupContent = document.getElementById('popupContent');
const addVocabBtn = document.getElementById('addVocabBtn');
const aiContextSearchBtn = document.getElementById('aiContextSearchBtn');
const aiPopup = document.getElementById('aiPopup');
const aiPopupContent = document.getElementById('aiPopupContent');
const timeoutWarningPopup = document.getElementById('timeoutWarningPopup');
const resumeBtn = document.getElementById('resumeBtn');
const endSessionBtn = document.getElementById('endSessionBtn');

// --- NEW DYNAMIC UI ELEMENTS ---
const statusIndicator = document.getElementById('statusIndicator');
const waveIndicator = document.getElementById('waveIndicator');
const pauseIndicator = document.getElementById('pauseIndicator');

// --- API Keys & Endpoints ---
const recognition = new SpeechRecognition();
recognition.lang = 'en-US';
recognition.interimResults = true;
recognition.continuous = true;

const DEEPSEEK_API_KEY = 'sk-4120e865556243daab04300f2fb50bf4';
const DEEPSEEK_API_URL = 'https://api.deepseek.com/chat/completions';

// --- 2. 状态管理 & 常量 ---
let isListening = false, isPaused = false, hasStarted = false;
let currentOriginalP = null;
let vocabularyList = [];
let currentPopupData = { word: null, contextSentence: null, definitionData: null };
let inactivityTimer = null;
let warningTimer = null;
const INACTIVITY_TIMEOUT = 60000;
let classCount = 0;
let classStartTime = null;
let noteBuffer = ""; 
const TRANSCRIPT_CHUNK_THRESHOLD = 100;

// --- 3. API 和辅助函数 ---

async function summarizeTextForNote(text) {
    if (!text || text.trim().length === 0) { console.log("Note buffer is empty, skipping summarization."); return; }
    console.log(`准备为 ${text.length} 字符的文本生成笔记...`);
    noteBtn.textContent = "生成中..."; noteBtn.disabled = true;
    const prompt = `你是一个高效的课堂笔记总结助理。这是一门大学的专业课程。请记录下所有的要点内容，以便学生的后续复习。你可以做适当的拓展。请使用中文进行回答。总结内容要精炼、有条理，可以使用 **重点** 的方式突出关键信息。内容如下：\n\n"${text}"`;
    try {
        const response = await fetch(DEEPSEEK_API_URL, {
            method: 'POST',
            headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${DEEPSEEK_API_KEY}`},
            body: JSON.stringify({ model: 'deepseek-chat', messages: [{ role: 'user', content: prompt }], temperature: 0.5 })
        });
        if (!response.ok) throw new Error(`DeepSeek API error! status: ${response.status}`);
        const data = await response.json();
        if (data.choices && data.choices.length > 0) { addNoteEntry(data.choices[0].message.content); } 
        else { addNoteEntry("未能生成笔记摘要。"); }
    } catch (error) {
        console.error("DeepSeek API fetch error:", error);
        addNoteEntry("生成笔记时发生网络错误(DeepSeek)。");
    } finally {
        noteBtn.textContent = "笔记本"; noteBtn.disabled = false;
    }
}

async function getAIContextualExplanation(word, sentence) {
    aiPopupContent.innerHTML = `<div class="loader"></div><p style="text-align: center;">我正在全力分析，请稍等主人~
    "${word}"...</p>`;
    showPopupById('aiPopup');
    const prompt = `这是大学的一门专业课程。遇到了一个词，请帮我简要解释一下。\n句子是: "${sentence}"\n我想理解的词是: "${word}"\n\n请严格按照以下格式回答，不要有任何多余的解释或开头语：\n1.  **语境释义**: 在这个句子中，“${word}”最可能是什么意思？请用中文解释。\n2.  **拓展解释**: 对这个词进行更广泛的解释，包括它可能的其他含义、用法或相关文化背景（例如，如果它是缩写，请给出全称和解释）。\n3. `;
    try {
        const response = await fetch(DEEPSEEK_API_URL, {
            method: 'POST',
            headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${DEEPSEEK_API_KEY}`},
            body: JSON.stringify({model: 'deepseek-chat', messages: [{ role: 'user', content: prompt }], temperature: 0.3})
        });
        if (!response.ok) throw new Error(`DeepSeek API error! status: ${response.status}`);
        const data = await response.json();
        if (data.choices && data.choices.length > 0) {
            const formattedResponse = data.choices[0].message.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');
            aiPopupContent.innerHTML = `<div class="ai-definition">${formattedResponse}</div>`;
        } else { aiPopupContent.innerHTML = `<p>DeepSeek AI 未能返回分析结果。</p>`; }
    } catch (error) {
        console.error("DeepSeek AI fetch error (for context):", error);
        aiPopupContent.innerHTML = `<p class="error-message">DeepSeek AI 上下文分析失败，请检查网络或API Key。</p>`;
    }
}

// --- BUG FIX: Check content type before using .replace() ---
function addNoteEntry(content, type = 'summary') {
    const defaultMessage = document.querySelector('#noteOutput .default-note-message');
    if (defaultMessage) defaultMessage.remove();
    const noteEntry = document.createElement('div');
    noteEntry.className = 'note-entry';
    let htmlContent = '';
    const timestamp = new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute:'2-digit' });

    if (type === 'summary') {
        // This is for AI summaries, which are strings. It's safe to format.
        const formattedContent = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');
        htmlContent = `<div class="note-header"><span>笔记摘要</span><span class="timestamp">${timestamp}</span></div><div class="note-content">${formattedContent}</div>`;
    } else if (type === 'session') {
        // This is for session data, which is an object. Do not use .replace().
        htmlContent = `<div class="note-header session-summary"><span>${content.title}</span><span class="timestamp">${timestamp}</span></div><div class="note-content">${content.details}</div>`;
    }
    noteEntry.innerHTML = `${htmlContent}<button class="delete-note-btn">删除</button>`;
    noteOutput.appendChild(noteEntry);
}


// Function to control the visibility of the status indicator
function updateStatusIndicator(state) { // 'listening', 'paused', 'stopped'
    if (state === 'listening') {
        statusIndicator.style.display = 'flex';
        waveIndicator.style.display = 'flex';
        pauseIndicator.style.display = 'none';
    } else if (state === 'paused') {
        statusIndicator.style.display = 'flex';
        waveIndicator.style.display = 'none';
        pauseIndicator.style.display = 'flex';
    } else { // 'stopped'
        statusIndicator.style.display = 'none';
    }
}

// ... other helper functions remain the same ...
async function translateWithMyMemory(textToTranslate, targetLang = 'zh-CN') { if (!textToTranslate) return ""; const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(textToTranslate)}&langpair=en|${targetLang}`; try { const response = await fetch(url); if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`); const data = await response.json(); return data.responseData.translatedText || textToTranslate; } catch (error) { console.error("Translation fetch error:", error); return "--- 翻译失败 ---"; } }
async function getWordDefinition(word) { const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`; try { const response = await fetch(url); if (!response.ok) return null; const data = await response.json(); const firstResult = data[0]; if (!firstResult) return null; const meaning = firstResult.meanings[0]; const definition = meaning?.definitions[0]; const [translatedDef, translatedEx] = await Promise.all([translateWithMyMemory(definition?.definition), translateWithMyMemory(definition?.example)]); return {word: firstResult.word, phonetic: firstResult.phonetic || (firstResult.phonetics.find(p=>p.text)?.text || ''), partOfSpeech: meaning?.partOfSpeech || 'N/A', definition_en: definition?.definition || '无定义。', example_en: definition?.example || '无例句。', definition_zh: translatedDef, example_zh: translatedEx, starred: false}; } catch (error) { console.error("Dictionary API error:", error); return null; } }
function switchView(targetViewId) { views.forEach(view => { view.style.display = 'none'; }); document.getElementById(targetViewId).style.display = 'block'; [transBtn, noteBtn, vocabBtn].forEach(btn => btn.classList.remove('active-view')); const activeBtnMap = { 'translationView': transBtn, 'noteView': noteBtn, 'vocabView': vocabBtn }; if (activeBtnMap[targetViewId]) activeBtnMap[targetViewId].classList.add('active-view'); }
function renderVocabList() { if (vocabularyList.length === 0) { vocabListContainer.innerHTML = `<p style="color: #a0a8b7;">你收藏的单词会出现在这里。</p>`; return; } vocabularyList.sort((a, b) => (b.starred ? 1 : 0) - (a.starred ? 1 : 0)); vocabListContainer.innerHTML = ''; vocabularyList.forEach(item => { const card = document.createElement('div'); card.className = `vocab-card ${item.starred ? 'starred' : ''}`; card.innerHTML = `<div class="word">${item.word} <span class="phonetic">${item.phonetic}</span></div><div class="meaning"><strong>${item.partOfSpeech}:</strong> ${item.definition_zh || item.definition_en}<br><em>例: ${item.example_zh || item.example_en}</em></div><div class="vocab-card-actions"><button class="star-btn ${item.starred ? 'starred' : ''}" data-word="${item.word}">${item.starred ? '★ Unstar' : '☆ Star'}</button><button class="mastered-btn" data-word="${item.word}">已掌握</button></div>`; vocabListContainer.appendChild(card); }); }
function showPopupById(popupId) { popupOverlay.classList.add('visible'); document.getElementById(popupId).classList.add('visible'); }
function showDictionaryPopup(word, sentence) { const cleanedWord = word.replace(/[.,?!:;]$/, '').toLowerCase(); currentPopupData = { word: cleanedWord, contextSentence: sentence, definitionData: null }; popupContent.innerHTML = `<p>正在查询 "${cleanedWord}"...</p>`; addVocabBtn.disabled = true; addVocabBtn.textContent = '添加单词本'; showPopupById('dictionaryPopup'); getWordDefinition(cleanedWord).then(data => { if (data) { currentPopupData.definitionData = data; popupContent.innerHTML = `<div class="dict-entry"><div class="word-title">${data.word}</div><div class="word-phonetic">${data.phonetic}</div><div class="meaning-block"><p><strong>词性:</strong> ${data.partOfSpeech}</p><p><strong>英文释义:</strong> ${data.definition_en}</p><p><strong>中文释义:</strong> ${data.definition_zh}</p></div><div class="meaning-block"><p><strong>英文例句:</strong> <em>${data.example_en}</em></p><p><strong>中文翻译:</strong> <em>${data.example_zh}</em></p></div></div>`; if (vocabularyList.some(item => item.word === data.word)) { addVocabBtn.textContent = '已添加 ✔'; } else { addVocabBtn.disabled = false; } } else { popupContent.innerHTML = `<p>抱歉，找不到 “${cleanedWord}” 的标准定义。<br>请尝试AI上下文分析。</p>`; } }); }
function hideAllPopups() { popupOverlay.classList.remove('visible'); document.querySelectorAll('.popup').forEach(p => p.classList.remove('visible')); }
function startInactivityCountdown() { clearTimeout(warningTimer); clearTimeout(inactivityTimer); warningTimer = setTimeout(() => { showPopupById('timeoutWarningPopup'); }, INACTIVITY_TIMEOUT - 10000); inactivityTimer = setTimeout(() => { hideAllPopups(); endAndSummarizeSession(); }, INACTIVITY_TIMEOUT); }
function clearInactivityCountdown() { clearTimeout(warningTimer); clearTimeout(inactivityTimer); if (document.getElementById('timeoutWarningPopup').classList.contains('visible')) { hideAllPopups(); } }
function autoScrollView(element) { if (element) { element.scrollTop = element.scrollHeight; } }


// --- 4. 核心逻辑与事件处理 ---
function endAndSummarizeSession() {
    if (classStartTime) {
        summarizeTextForNote(noteBuffer); noteBuffer = "";
        const endTime = new Date(); const durationSeconds = Math.round((endTime - classStartTime) / 1000); const minutes = Math.floor(durationSeconds / 60); const seconds = durationSeconds % 60;
        const summaryData = { title: `课堂 #${classCount} 总结`, details: `结束时间: ${endTime.toLocaleString('zh-CN')}<br>持续时长: ${minutes}分 ${seconds}秒` };
        addNoteEntry(summaryData, 'session');
    }
    isListening = false; isPaused = false; classStartTime = null; recognition.stop();
    controlBtn.textContent = '开始上课'; controlBtn.classList.remove('active');
    pauseBtn.disabled = true; pauseBtn.textContent = '暂停'; pauseBtn.className = '';
    liveContentOutput.classList.remove('listening'); currentOriginalP = null;
    clearInactivityCountdown();
    updateStatusIndicator('stopped'); // Hide indicator
}

recognition.onresult = (event) => {
    clearInactivityCountdown();
    if (!hasStarted) { liveContentOutput.innerHTML = ''; hasStarted = true; }
    const transcript = Array.from(event.results).map(result => result[0]).map(result => result.transcript).join('');
    const isFinal = event.results[event.results.length - 1].isFinal;
    if (!currentOriginalP) { currentOriginalP = document.createElement('p'); currentOriginalP.className = 'original-text'; liveContentOutput.appendChild(currentOriginalP); }
    currentOriginalP.textContent = transcript;
    autoScrollView(liveContentOutput);
    if (transcript.trim() && (isFinal || transcript.length > TRANSCRIPT_CHUNK_THRESHOLD)) {
        const finalTranscript = transcript.trim();
        const words = finalTranscript.split(/\s+/).map(word => { const span = document.createElement('span'); span.className = 'word'; span.textContent = word + ' '; return span; });
        currentOriginalP.innerHTML = ''; words.forEach(span => currentOriginalP.appendChild(span));
        noteBuffer += finalTranscript + " ";
        translateWithMyMemory(finalTranscript).then(translatedText => {
            const translationElement = document.createElement('p');
            translationElement.className = 'translation-text';
            translationElement.textContent = translatedText;
            liveContentOutput.appendChild(translationElement);
            autoScrollView(liveContentOutput);
        });
        currentOriginalP = null;
        if (!isFinal) { recognition.stop(); }
    }
};

recognition.onstart = () => {
    clearInactivityCountdown(); isListening = true; isPaused = false;
    controlBtn.textContent = '结束课程'; controlBtn.classList.add('active');
    pauseBtn.disabled = false; pauseBtn.textContent = '暂停'; pauseBtn.className = 'pausable';
    liveContentOutput.classList.add('listening');
    updateStatusIndicator('listening'); // Show wave indicator
};

recognition.onend = () => {
    liveContentOutput.classList.remove('listening');
    if (isListening && !isPaused) {
        console.log("Speech recognition service ended, restarting automatically...");
        try { recognition.start(); } catch(e) { console.error("Error restarting recognition:", e); }
    }
};

recognition.onerror = (event) => { console.error(`语音识别错误: ${event.error}`); };

// --- Event Listeners ---
transBtn.addEventListener('click', () => switchView('translationView'));
noteBtn.addEventListener('click', () => switchView('noteView'));
vocabBtn.addEventListener('click', () => switchView('vocabView'));
popupOverlay.addEventListener('click', hideAllPopups);
aiContextSearchBtn.addEventListener('click', () => { if (currentPopupData.word && currentPopupData.contextSentence) { hideAllPopups(); setTimeout(() => { getAIContextualExplanation(currentPopupData.word, currentPopupData.contextSentence); }, 150); } });
noteOutput.addEventListener('click', (event) => { if (event.target.classList.contains('delete-note-btn')) { const noteEntry = event.target.closest('.note-entry'); if (noteEntry) { noteEntry.style.transition = 'opacity 0.3s ease, transform 0.3s ease'; noteEntry.style.opacity = '0'; noteEntry.style.transform = 'scale(0.95)'; setTimeout(() => { noteEntry.remove(); if (noteOutput.children.length === 0) { noteOutput.innerHTML = `<p class="default-note-message">你的笔记将在这里显示。</p>`; } }, 300); } } });
addVocabBtn.addEventListener('click', () => { if (!currentPopupData.definitionData || addVocabBtn.disabled) return; if (!vocabularyList.some(item => item.word === currentPopupData.definitionData.word)) { vocabularyList.push(currentPopupData.definitionData); renderVocabList(); } addVocabBtn.textContent = '已添加 ✔'; addVocabBtn.disabled = true; setTimeout(hideAllPopups, 800); });
liveContentOutput.addEventListener('click', (event) => { const target = event.target; if (target.classList.contains('word')) { const word = target.textContent.trim(); const sentence = target.parentElement.textContent.trim(); showDictionaryPopup(word, sentence); } });
vocabListContainer.addEventListener('click', (event) => { const target = event.target; const word = target.dataset.word; if (!word) return; if (target.classList.contains('mastered-btn')) { vocabularyList = vocabularyList.filter(item => item.word !== word); } else if (target.classList.contains('star-btn')) { const wordItem = vocabularyList.find(item => item.word === word); if (wordItem) wordItem.starred = !wordItem.starred; } renderVocabList(); });
controlBtn.addEventListener('click', () => { if (isListening) { endAndSummarizeSession(); } else { // script.js - Final Version 3.3 (Bug Fix & Dynamic UI & Compatibility)

    document.addEventListener('DOMContentLoaded', () => {
    
        // --- 浏览器支持检测 ---
        if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
            // 浏览器支持，运行所有应用代码
            runApp();
        } else {
            // 浏览器不支持，显示友好提示
            showUnsupportedBrowserWarning();
        }
    
    });
    
    function showUnsupportedBrowserWarning() {
        // 隐藏所有功能性UI元素
        document.querySelector('.controls').style.display = 'none';
        document.querySelector('.view-container').style.display = 'none';
        document.getElementById('statusIndicator').style.display = 'none';
    
        // 显示警告信息
        const mainElement = document.querySelector('main') || document.body; // Fallback to body
        const warningMessage = document.createElement('div');
        warningMessage.className = 'unsupported-browser-warning';
        warningMessage.innerHTML = `
            <h2>抱歉，您的浏览器不支持语音识别功能</h2>
            <p>为了获得最佳体验，我们推荐使用最新版本的 <strong>Google Chrome</strong>, <strong>Microsoft Edge</strong>, 或 <strong>Safari</strong> 浏览器。</p>
        `;
        mainElement.insertBefore(warningMessage, mainElement.firstChild);
    }
    
    
    function runApp() {
        // DOM Elements
        const controlBtn = document.getElementById('controlBtn');
        const pauseBtn = document.getElementById('pauseBtn');
        const liveContentOutput = document.getElementById('liveContentOutput');
        const noteOutput = document.getElementById('noteOutput');
        const views = document.querySelectorAll('.view-container');
        const transBtn = document.getElementById('transBtn');
        const noteBtn = document.getElementById('noteBtn');
        const vocabBtn = document.getElementById('vocabBtn');
        const vocabListContainer = document.getElementById('vocabListContainer');
        const popupOverlay = document.getElementById('popupOverlay');
        const dictionaryPopup = document.getElementById('dictionaryPopup');
        const popupContent = document.getElementById('popupContent');
        const addVocabBtn = document.getElementById('addVocabBtn');
        const aiContextSearchBtn = document.getElementById('aiContextSearchBtn');
        const aiPopup = document.getElementById('aiPopup');
        const aiPopupContent = document.getElementById('aiPopupContent');
        const timeoutWarningPopup = document.getElementById('timeoutWarningPopup');
        const resumeBtn = document.getElementById('resumeBtn');
        const endSessionBtn = document.getElementById('endSessionBtn');
        const statusIndicator = document.getElementById('statusIndicator');
        const waveIndicator = document.getElementById('waveIndicator');
        const pauseIndicator = document.getElementById('pauseIndicator');
    
        // API Keys & Endpoints
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.interimResults = true;
        recognition.continuous = true;
    
        const DEEPSEEK_API_KEY = 'sk-4120e865556243daab04300f2fb50bf4';
        const DEEPSEEK_API_URL = 'https://api.deepseek.com/chat/completions';
    
        // --- 状态管理 & 常量 ---
        let isListening = false, isPaused = false, hasStarted = false;
        let currentOriginalP = null; // This will now ONLY hold the interim <p> element
        let vocabularyList = [];
        let currentPopupData = { word: null, contextSentence: null, definitionData: null };
        let inactivityTimer = null;
        let warningTimer = null;
        const INACTIVITY_TIMEOUT = 60000;
        let classCount = 0;
        let classStartTime = null;
        let noteBuffer = ""; 
        
        // --- 辅助函数 ---
        async function summarizeTextForNote(text) {
            if (!text || text.trim().length === 0) { console.log("Note buffer is empty, skipping summarization."); return; }
            console.log(`准备为 ${text.length} 字符的文本生成笔记...`);
            noteBtn.textContent = "生成中..."; noteBtn.disabled = true;
            const prompt = `你是一个高效的课堂笔记总结助理。这是一门大学的专业课程。请记录下所有的要点内容，以便学生的后续复习。你可以做适当的拓展。请使用中文进行回答。总结内容要精炼、有条理，可以使用 **重点** 的方式突出关键信息。内容如下：\n\n"${text}"`;
            try {
                const response = await fetch(DEEPSEEK_API_URL, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${DEEPSEEK_API_KEY}`},
                    body: JSON.stringify({ model: 'deepseek-chat', messages: [{ role: 'user', content: prompt }], temperature: 0.5 })
                });
                if (!response.ok) throw new Error(`DeepSeek API error! status: ${response.status}`);
                const data = await response.json();
                if (data.choices && data.choices.length > 0) { addNoteEntry(data.choices[0].message.content); } 
                else { addNoteEntry("未能生成笔记摘要。"); }
            } catch (error) {
                console.error("DeepSeek API fetch error:", error);
                addNoteEntry("生成笔记时发生网络错误(DeepSeek)。");
            } finally {
                noteBtn.textContent = "笔记本"; noteBtn.disabled = false;
            }
        }
        
        // ... (rest of your helper functions like getAIContextualExplanation, addNoteEntry, etc. remain the same)
        async function getAIContextualExplanation(word, sentence) {
            aiPopupContent.innerHTML = `<div class="loader"></div><p style="text-align: center;">我正在全力分析，请稍等主人~
            "${word}"...</p>`;
            showPopupById('aiPopup');
            const prompt = `这是大学的一门专业课程。遇到了一个词，请帮我简要解释一下。\n句子是: "${sentence}"\n我想理解的词是: "${word}"\n\n请严格按照以下格式回答，不要有任何多余的解释或开头语：\n1.  **语境释义**: 在这个句子中，“${word}”最可能是什么意思？请用中文解释。\n2.  **拓展解释**: 对这个词进行更广泛的解释，包括它可能的其他含义、用法或相关文化背景（例如，如果它是缩写，请给出全称和解释）。\n3. `;
            try {
                const response = await fetch(DEEPSEEK_API_URL, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${DEEPSEEK_API_KEY}`},
                    body: JSON.stringify({model: 'deepseek-chat', messages: [{ role: 'user', content: prompt }], temperature: 0.3})
                });
                if (!response.ok) throw new Error(`DeepSeek API error! status: ${response.status}`);
                const data = await response.json();
                if (data.choices && data.choices.length > 0) {
                    const formattedResponse = data.choices[0].message.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');
                    aiPopupContent.innerHTML = `<div class="ai-definition">${formattedResponse}</div>`;
                } else { aiPopupContent.innerHTML = `<p>DeepSeek AI 未能返回分析结果。</p>`; }
            } catch (error) {
                console.error("DeepSeek AI fetch error (for context):", error);
                aiPopupContent.innerHTML = `<p class="error-message">DeepSeek AI 上下文分析失败，请检查网络或API Key。</p>`;
            }
        }
    
        function addNoteEntry(content, type = 'summary') {
            const defaultMessage = document.querySelector('#noteOutput .default-note-message');
            if (defaultMessage) defaultMessage.remove();
            const noteEntry = document.createElement('div');
            noteEntry.className = 'note-entry';
            let htmlContent = '';
            const timestamp = new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute:'2-digit' });
    
            if (type === 'summary') {
                const formattedContent = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');
                htmlContent = `<div class="note-header"><span>笔记摘要</span><span class="timestamp">${timestamp}</span></div><div class="note-content">${formattedContent}</div>`;
            } else if (type === 'session') {
                htmlContent = `<div class="note-header session-summary"><span>${content.title}</span><span class="timestamp">${timestamp}</span></div><div class="note-content">${content.details}</div>`;
            }
            noteEntry.innerHTML = `${htmlContent}<button class="delete-note-btn">删除</button>`;
            noteOutput.appendChild(noteEntry);
        }
        
        function updateStatusIndicator(state) {
            if (state === 'listening') {
                statusIndicator.style.display = 'flex'; waveIndicator.style.display = 'flex'; pauseIndicator.style.display = 'none';
            } else if (state === 'paused') {
                statusIndicator.style.display = 'flex'; waveIndicator.style.display = 'none'; pauseIndicator.style.display = 'flex';
            } else {
                statusIndicator.style.display = 'none';
            }
        }
        
        async function translateWithMyMemory(textToTranslate, targetLang = 'zh-CN') { if (!textToTranslate) return ""; const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(textToTranslate)}&langpair=en|${targetLang}`; try { const response = await fetch(url); if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`); const data = await response.json(); return data.responseData.translatedText || textToTranslate; } catch (error) { console.error("Translation fetch error:", error); return "--- 翻译失败 ---"; } }
        async function getWordDefinition(word) { const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`; try { const response = await fetch(url); if (!response.ok) return null; const data = await response.json(); const firstResult = data[0]; if (!firstResult) return null; const meaning = firstResult.meanings[0]; const definition = meaning?.definitions[0]; const [translatedDef, translatedEx] = await Promise.all([translateWithMyMemory(definition?.definition), translateWithMyMemory(definition?.example)]); return {word: firstResult.word, phonetic: firstResult.phonetic || (firstResult.phonetics.find(p=>p.text)?.text || ''), partOfSpeech: meaning?.partOfSpeech || 'N/A', definition_en: definition?.definition || '无定义。', example_en: definition?.example || '无例句。', definition_zh: translatedDef, example_zh: translatedEx, starred: false}; } catch (error) { console.error("Dictionary API error:", error); return null; } }
        function switchView(targetViewId) { views.forEach(view => { view.style.display = 'none'; }); document.getElementById(targetViewId).style.display = 'block'; [transBtn, noteBtn, vocabBtn].forEach(btn => btn.classList.remove('active-view')); const activeBtnMap = { 'translationView': transBtn, 'noteView': noteBtn, 'vocabView': vocabBtn }; if (activeBtnMap[targetViewId]) activeBtnMap[targetViewId].classList.add('active-view'); }
        function renderVocabList() { if (vocabularyList.length === 0) { vocabListContainer.innerHTML = `<p style="color: #a0a8b7;">你收藏的单词会出现在这里。</p>`; return; } vocabularyList.sort((a, b) => (b.starred ? 1 : 0) - (a.starred ? 1 : 0)); vocabListContainer.innerHTML = ''; vocabularyList.forEach(item => { const card = document.createElement('div'); card.className = `vocab-card ${item.starred ? 'starred' : ''}`; card.innerHTML = `<div class="word">${item.word} <span class="phonetic">${item.phonetic}</span></div><div class="meaning"><strong>${item.partOfSpeech}:</strong> ${item.definition_zh || item.definition_en}<br><em>例: ${item.example_zh || item.example_en}</em></div><div class="vocab-card-actions"><button class="star-btn ${item.starred ? 'starred' : ''}" data-word="${item.word}">${item.starred ? '★ Unstar' : '☆ Star'}</button><button class="mastered-btn" data-word="${item.word}">已掌握</button></div>`; vocabListContainer.appendChild(card); }); }
        function showPopupById(popupId) { popupOverlay.classList.add('visible'); document.getElementById(popupId).classList.add('visible'); }
        function showDictionaryPopup(word, sentence) { const cleanedWord = word.replace(/[.,?!:;]$/, '').toLowerCase(); currentPopupData = { word: cleanedWord, contextSentence: sentence, definitionData: null }; popupContent.innerHTML = `<p>正在查询 "${cleanedWord}"...</p>`; addVocabBtn.disabled = true; addVocabBtn.textContent = '添加单词本'; showPopupById('dictionaryPopup'); getWordDefinition(cleanedWord).then(data => { if (data) { currentPopupData.definitionData = data; popupContent.innerHTML = `<div class="dict-entry"><div class="word-title">${data.word}</div><div class="word-phonetic">${data.phonetic}</div><div class="meaning-block"><p><strong>词性:</strong> ${data.partOfSpeech}</p><p><strong>英文释义:</strong> ${data.definition_en}</p><p><strong>中文释义:</strong> ${data.definition_zh}</p></div><div class="meaning-block"><p><strong>英文例句:</strong> <em>${data.example_en}</em></p><p><strong>中文翻译:</strong> <em>${data.example_zh}</em></p></div></div>`; if (vocabularyList.some(item => item.word === data.word)) { addVocabBtn.textContent = '已添加 ✔'; } else { addVocabBtn.disabled = false; } } else { popupContent.innerHTML = `<p>抱歉，找不到 “${cleanedWord}” 的标准定义。<br>请尝试AI上下文分析。</p>`; } }); }
        function hideAllPopups() { popupOverlay.classList.remove('visible'); document.querySelectorAll('.popup').forEach(p => p.classList.remove('visible')); }
        function startInactivityCountdown() { clearTimeout(warningTimer); clearTimeout(inactivityTimer); warningTimer = setTimeout(() => { showPopupById('timeoutWarningPopup'); }, INACTIVITY_TIMEOUT - 10000); inactivityTimer = setTimeout(() => { hideAllPopups(); endAndSummarizeSession(); }, INACTIVITY_TIMEOUT); }
        function clearInactivityCountdown() { clearTimeout(warningTimer); clearTimeout(inactivityTimer); if (document.getElementById('timeoutWarningPopup').classList.contains('visible')) { hideAllPopups(); } }
        function autoScrollView(element) { if (element) { element.scrollTop = element.scrollHeight; } }
    
    
        // --- 核心逻辑与事件处理 ---
        function endAndSummarizeSession() {
            if (classStartTime) {
                summarizeTextForNote(noteBuffer); noteBuffer = "";
                const endTime = new Date(); const durationSeconds = Math.round((endTime - classStartTime) / 1000); const minutes = Math.floor(durationSeconds / 60); const seconds = durationSeconds % 60;
                const summaryData = { title: `课堂 #${classCount} 总结`, details: `结束时间: ${endTime.toLocaleString('zh-CN')}<br>持续时长: ${minutes}分 ${seconds}秒` };
                addNoteEntry(summaryData, 'session');
            }
            isListening = false; isPaused = false; classStartTime = null; recognition.stop();
            controlBtn.textContent = '开始上课'; controlBtn.classList.remove('active');
            pauseBtn.disabled = true; pauseBtn.textContent = '暂停'; pauseBtn.className = '';
            liveContentOutput.classList.remove('listening'); 
            if(currentOriginalP) {
                currentOriginalP.remove();
                currentOriginalP = null;
            }
            clearInactivityCountdown();
            updateStatusIndicator('stopped');
        }
    
        // ==========================================================
        // === THE BUG FIX IS HERE - REPLACED onresult FUNCTION ===
        // ==========================================================
        recognition.onresult = (event) => {
            clearInactivityCountdown();
            if (!hasStarted) {
                liveContentOutput.innerHTML = '';
                hasStarted = true;
            }
    
            let finalTranscript = '';
            let interimTranscript = '';
    
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                const transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    finalTranscript += transcript;
                } else {
                    interimTranscript += transcript;
                }
            }
    
            if (finalTranscript) {
                const trimmedFinalTranscript = finalTranscript.trim();
                noteBuffer += trimmedFinalTranscript + " "; 
    
                const originalP = document.createElement('p');
                originalP.className = 'original-text new-entry';
                
                const words = trimmedFinalTranscript.split(/\s+/).map(word => {
                    const span = document.createElement('span');
                    span.className = 'word';
                    span.textContent = word + ' ';
                    return span;
                });
                words.forEach(span => originalP.appendChild(span));
                
                liveContentOutput.appendChild(originalP);
    
                const translationP = document.createElement('p');
                translationP.className = 'translation-text new-entry';
                liveContentOutput.appendChild(translationP);
                
                setTimeout(() => {
                    originalP.classList.add('visible');
                    translationP.classList.add('visible');
                }, 10);
                
                translateWithMyMemory(trimmedFinalTranscript).then(translatedText => {
                    translationP.textContent = translatedText;
                    autoScrollView(liveContentOutput);
                });
    
                if (currentOriginalP) {
                    currentOriginalP.remove();
                    currentOriginalP = null;
                }
            }
    
            if (interimTranscript) {
                if (!currentOriginalP) {
                    currentOriginalP = document.createElement('p');
                    currentOriginalP.className = 'original-text';
                    currentOriginalP.style.color = '#a0a8b7'; 
                    liveContentOutput.appendChild(currentOriginalP);
                }
                currentOriginalP.textContent = interimTranscript;
                autoScrollView(liveContentOutput);
            }
        };
        
        recognition.onstart = () => {
            clearInactivityCountdown(); isListening = true; isPaused = false;
            controlBtn.textContent = '结束课程'; controlBtn.classList.add('active');
            pauseBtn.disabled = false; pauseBtn.textContent = '暂停'; pauseBtn.className = 'pausable';
            liveContentOutput.classList.add('listening');
            updateStatusIndicator('listening'); 
        };
    
        recognition.onend = () => {
            liveContentOutput.classList.remove('listening');
            if (isListening && !isPaused) {
                console.log("Speech recognition service ended, restarting automatically...");
                try { recognition.start(); } catch(e) { console.error("Error restarting recognition:", e); }
            }
        };
    
        recognition.onerror = (event) => { console.error(`语音识别错误: ${event.error}`); };
    
        // --- Event Listeners ---
        transBtn.addEventListener('click', () => switchView('translationView'));
        noteBtn.addEventListener('click', () => switchView('noteView'));
        vocabBtn.addEventListener('click', () => switchView('vocabView'));
        popupOverlay.addEventListener('click', hideAllPopups);
        aiContextSearchBtn.addEventListener('click', () => { if (currentPopupData.word && currentPopupData.contextSentence) { hideAllPopups(); setTimeout(() => { getAIContextualExplanation(currentPopupData.word, currentPopupData.contextSentence); }, 150); } });
        noteOutput.addEventListener('click', (event) => { if (event.target.classList.contains('delete-note-btn')) { const noteEntry = event.target.closest('.note-entry'); if (noteEntry) { noteEntry.style.transition = 'opacity 0.3s ease, transform 0.3s ease'; noteEntry.style.opacity = '0'; noteEntry.style.transform = 'scale(0.95)'; setTimeout(() => { noteEntry.remove(); if (noteOutput.children.length === 0) { noteOutput.innerHTML = `<p class="default-note-message">你的笔记将在这里显示。</p>`; } }, 300); } } });
        addVocabBtn.addEventListener('click', () => { if (!currentPopupData.definitionData || addVocabBtn.disabled) return; if (!vocabularyList.some(item => item.word === currentPopupData.definitionData.word)) { vocabularyList.push(currentPopupData.definitionData); renderVocabList(); } addVocabBtn.textContent = '已添加 ✔'; addVocabBtn.disabled = true; setTimeout(hideAllPopups, 800); });
        liveContentOutput.addEventListener('click', (event) => { const target = event.target; if (target.classList.contains('word')) { const word = target.textContent.trim(); const sentence = target.parentElement.textContent.trim(); showDictionaryPopup(word, sentence); } });
        vocabListContainer.addEventListener('click', (event) => { const target = event.target; const word = target.dataset.word; if (!word) return; if (target.classList.contains('mastered-btn')) { vocabularyList = vocabularyList.filter(item => item.word !== word); } else if (target.classList.contains('star-btn')) { const wordItem = vocabularyList.find(item => item.word === word); if (wordItem) wordItem.starred = !wordItem.starred; } renderVocabList(); });
        controlBtn.addEventListener('click', () => { if (isListening) { endAndSummarizeSession(); } else { liveContentOutput.innerHTML = '<p style="color: #a0a8b7;">正在聆听......'; hasStarted = false; currentOriginalP = null; noteBuffer = ""; classStartTime = new Date(); classCount++; recognition.start(); } });
        pauseBtn.addEventListener('click', () => {
            if (!isListening) return; clearInactivityCountdown();
            if (!isPaused) {
                summarizeTextForNote(noteBuffer); noteBuffer = "";
                isPaused = true; recognition.stop();
                pauseBtn.textContent = '继续'; pauseBtn.classList.replace('pausable', 'resumable');
                liveContentOutput.classList.remove('listening');
                updateStatusIndicator('paused'); 
            } else {
                isPaused = false; recognition.start();
                pauseBtn.textContent = '暂停'; pauseBtn.classList.replace('resumable', 'pausable');
            }
        });
        resumeBtn.addEventListener('click', () => { clearInactivityCountdown(); recognition.start(); });
        endSessionBtn.addEventListener('click', () => endAndSummarizeSession());
    
        // --- Initial Setup ---
        noteOutput.innerHTML = `<p class="default-note-message">花瓣飘落下游生根~</p>`;
        switchView('translationView');
        updateStatusIndicator('stopped');
    }liveContentOutput.innerHTML = '<p style="color: #a0a8b7;">正在聆听......'; hasStarted = false; currentOriginalP = null; noteBuffer = ""; classStartTime = new Date(); classCount++; recognition.start(); } });
pauseBtn.addEventListener('click', () => {
    if (!isListening) return; clearInactivityCountdown();
    if (!isPaused) {
        summarizeTextForNote(noteBuffer); noteBuffer = "";
        isPaused = true; recognition.stop();
        pauseBtn.textContent = '继续'; pauseBtn.classList.replace('pausable', 'resumable');
        liveContentOutput.classList.remove('listening');
        updateStatusIndicator('paused'); // Show pause indicator
    } else {
        isPaused = false; recognition.start();
        pauseBtn.textContent = '暂停'; pauseBtn.classList.replace('resumable', 'pausable');
    }
});
resumeBtn.addEventListener('click', () => { clearInactivityCountdown(); recognition.start(); });
endSessionBtn.addEventListener('click', () => endAndSummarizeSession());

// --- Initial Setup ---
noteOutput.innerHTML = `<p class="default-note-message">花瓣飘落下游生根~</p>`;
switchView('translationView');
updateStatusIndicator('stopped'); // Ensure indicator is hidden on load
}); // 结束 DOMContentLoaded 事件监听
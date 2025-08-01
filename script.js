// =======================================================================
// ================ Bibi SIMU-INT Assistant - 最终整合版 =================
// =======================================================================
// 本文件已将认证逻辑和主应用逻辑完全整合。
// 所有代码均在 DOMContentLoaded 事件后执行，确保稳定性和可预测性。
// =======================================================================

document.addEventListener('DOMContentLoaded', () => {

    // ===============================================
    // =========== 1. 全局变量和配置 ================
    // ===============================================

    // --- API & 配置 ---
    const API_BASE_URL = 'https://backend-dt.onrender.com';
    const INACTIVITY_TIMEOUT = 60000; // 60秒无活动超时

    // --- 状态管理 ---
    let recognition;
    let isRunning = false, isPaused = false;
    let finalTranscript = '', interimTranscript = '';
    let noteBuffer = "", fullTranscriptHistory = "";
    let vocabularyList = [];
    let currentPopupData = { word: null, contextSentence: null, definitionData: null };
    let inactivityTimer, warningTimer, countdownInterval;
    let classCount = 0, classStartTime = null;
    let currentCourseName = "通用课程";
    let currentOriginalP = null, currentTranslationP = null;
    let interimTranslationTimer = null;
    let isFullPowerMode = false;
    window.appHasStarted = false;

    // ===============================================
    // ============ 2. 获取所有DOM元素 ===============
    // ===============================================

    // --- 主应用元素 ---
    const controlBtn = document.getElementById('controlBtn');
    const pauseBtn = document.getElementById('pauseBtn');
    const statusIndicator = document.getElementById('statusIndicator');
    const waveIndicator = document.getElementById('waveIndicator');
    const pauseIndicator = document.getElementById('pauseIndicator');
    const liveContentOutput = document.getElementById('liveContentOutput');
    const noteOutput = document.getElementById('noteOutput');
    const vocabListContainer = document.getElementById('vocabListContainer');
    const transBtn = document.getElementById('transBtn');
    const noteBtn = document.getElementById('noteBtn');
    const vocabBtn = document.getElementById('vocabBtn');
    const translationView = document.getElementById('translationView');
    const noteView = document.getElementById('noteView');
    const vocabView = document.getElementById('vocabView');
    const views = document.querySelectorAll('.view-container');
    const modeSwitch = document.getElementById('mode-switch');
    const modeIndicator = document.getElementById('mode-indicator');
    
    // --- 弹窗和模态框 ---
    const popupOverlay = document.getElementById('popupOverlay');
    const dictionaryPopup = document.getElementById('dictionaryPopup');
    const popupContent = document.getElementById('popupContent');
    const addVocabBtn = document.getElementById('addVocabBtn');
    const aiContextSearchBtn = document.getElementById('aiContextSearchBtn');
    const aiPopup = document.getElementById('aiPopup');
    const aiPopupContent = document.getElementById('aiPopupContent');
    const timeoutWarningPopup = document.getElementById('timeoutWarningPopup');
    const timeoutCountdown = document.getElementById('timeoutCountdown');
    const resumeBtn = document.getElementById('resumeBtn');
    const endSessionBtn = document.getElementById('endSessionBtn');
    const spinnerOverlay = document.getElementById('spinnerOverlay');
    const courseNameModal = document.getElementById('courseNameModal');
    const courseNameInput = document.getElementById('courseNameInput');
    const startCourseBtn = document.getElementById('startCourseBtn');
    const showNoteHistoryBtn = document.getElementById('showNoteHistoryBtn');
    const noteHistoryModal = document.getElementById('noteHistoryModal');
    const closeNoteHistoryBtn = document.getElementById('closeNoteHistoryBtn');
    const closeNoteHistoryIcon = document.getElementById('closeNoteHistoryModal');
    const noteHistoryList = document.getElementById('noteHistoryList');
    const rankBtn = document.getElementById('rankBtn');
    const rankView = document.getElementById('rankView');
    const userStatsContainer = document.getElementById('userStatsContainer');
    // --- 认证相关元素 (ID已修正) ---
    const authModalOverlay = document.getElementById('auth-modal-overlay');
    const loginForm = document.getElementById('login');
    const registerForm = document.getElementById('register');
    const authLoader = document.getElementById('auth-loader');
    const welcomeCard = document.getElementById('welcome-card');
    const welcomeTitle = document.getElementById('welcome-title');
    const welcomeBody = document.getElementById('welcome-body');
    const logoutButton = document.getElementById('logout-button'); 
    const showRegisterLink = document.getElementById('show-register-link');
    const showLoginLink = document.getElementById('show-login-link');
      if (popupOverlay) {
        popupOverlay.addEventListener('click', function(event) {
            // 这是关键：检查被点击的元素(event.target)是否就是遮罩层本身
            if (event.target === popupOverlay) {
                hideAllPopups(); // 如果是，则调用关闭函数
            }
        });
      }

    // 同时，也应该支持按 "Esc" 键关闭弹窗，这是很好的用户体验
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            hideAllPopups();
        }
    });
    //【关键检查】如果任何一个核心认证元素找不到，就提前报错
    if (!loginForm || !registerForm || !authModalOverlay) {
        console.error("致命错误：无法找到登录/注册表单或模态框！请检查HTML的ID是否为 'login', 'register', 'auth-modal-overlay'。");
        return; // 停止执行后续代码
    }

    // ===============================================
    // ============== 3. 辅助函数 (API等) ============
    // ===============================================

    async function apiRequest(endpoint, method = 'GET', body = null, requiresAuth = false) {
        const headers = { 'Content-Type': 'application/json' };
        const config = { method: method, headers: headers };

        if (requiresAuth) {
            const token = localStorage.getItem('authToken');
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            } else {
                console.error('需要认证的请求，但未找到 token！');
                // 用户将被登出或看到登录界面，所以这里只做记录
                return { ok: false, data: { error: '认证失败，请重新登录' } };
            }
        }

        if (body) {
            config.body = JSON.stringify(body);
        }

        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
            const data = await response.json();
            return { ok: response.ok, data: data };
        } catch (error) {
            console.error(`API请求错误到 ${endpoint}:`, error);
            return { ok: false, data: { error: '无法连接到服务器' } };
        }
    }

    async function callDeepSeek(messages, temperature = 0.5, stream = false) {
        const { ok, data } = await apiRequest('/api/deepseek-chat', 'POST', {
            model: 'deepseek-chat',
            messages: messages,
            temperature: temperature,
            stream: stream
        }, true);

        if (ok && data.choices && data.choices.length > 0) {
            return data.choices[0].message.content.trim();
        } else {
            console.error("DeepSeek API 调用失败:", data.error || data);
            return null;
        }
    }

  // 【已修复】请用此版本替换 getFastTranslation 函数
async function getFastTranslation(textToTranslate, targetLang = 'ZH') {
    if (!textToTranslate || textToTranslate.trim() === "") return "";

    // 【关键修正】最后一个参数从 true 改为 false，表示此请求不需要登录认证
    const { ok, data } = await apiRequest('/api/deepl-translate', 'POST', {
        text: textToTranslate,
        target_lang: targetLang
    }, false); // <--- 已修正！
    
    if(ok && data.translations && data.translations.length > 0) {
        return data.translations[0].text;
    } else {
        // 如果后端返回错误，或者翻译结果为空，就在控制台打印错误并返回提示
        console.error("后端翻译代理返回错误或结果为空:", data);
        return "【翻译失败】";
    }
}

// pen.js 文件中

// 【最终修复版】替换这个函数
// pen.js

//【最终版】替换这个函数
// 【最终正确版】请用此版本替换
async function getWordDefinition(word) {
    const cleanedWord = word.replace(/[.,?!:;]$/, '').toLowerCase();
    if (!cleanedWord) return null;

    // 【关键修正】: 使用全局定义的 API_BASE_URL 来构建请求地址
    // 我们的后端路由是 /api/dictionary-proxy/<word>
    const endpoint = `/api/dictionary-proxy/${cleanedWord}`;
    
    // 使用我们统一的 apiRequest 函数来发起请求
    // 第三个参数是 body (GET请求为null), 第四个参数是是否需要认证 (查词典可以不需要)
    const { ok, data } = await apiRequest(endpoint, 'GET', null, false);

    if (ok) {
        // 请求成功
        const firstResult = data[0];
        if (!firstResult) return null; // API成功返回，但内容为空数组

        const meaning = firstResult.meanings[0];
        const definition = meaning?.definitions[0];
        
        // 使用 getFastTranslation 翻译释义和例句 (这个函数内部已经在使用正确的后端代理了)
        const [translatedDef, translatedEx] = await Promise.all([
            getFastTranslation(definition?.definition || ""),
            getFastTranslation(definition?.example || "")
        ]);

        return {
            word: firstResult.word,
            phonetic: firstResult.phonetic || (firstResult.phonetics.find(p => p.text)?.text || ''),
            partOfSpeech: meaning?.partOfSpeech || 'N/A',
            definition_en: definition?.definition || '无定义。',
            example_en: definition?.example || '无例句。',
            definition_zh: translatedDef,
            example_zh: translatedEx,
            starred: false
        };
    } else {
        // 请求失败 (例如后端返回404或500)
        console.error(`查询单词 "${cleanedWord}" 失败:`, data.error || '未知错误');
        return null;
    }
}



    // ===============================================
    // =========== 4. 认证 & 授权逻辑 ==============
    // ===============================================
    
    /**
     * 处理登录或注册的服务器响应
     */
  // 文件: script.js (或你的主JS文件)

/**
 * 隐藏所有弹窗和遮罩层
 */
function hideAllPopups() {
    const popupOverlay = document.getElementById('popupOverlay');
    const visiblePopups = document.querySelectorAll('.popup.visible');

    if (popupOverlay) {
        popupOverlay.classList.remove('visible');
    }

    visiblePopups.forEach(popup => {
        popup.classList.remove('visible');
    });
    console.log("hideAllPopups() 被调用，所有弹窗已隐藏。"); // 用于调试
}
    async function handleAuthResponse(response, formType) {
        const data = await response.json();

        if (response.ok) {
            showAuthMessage(data.message || `${formType === 'login' ? '登录' : '注册'}成功!`, 'success', formType);
            
            if (formType === 'login') {
                localStorage.setItem('authToken', data.token);
                localStorage.setItem('username', data.username);
                // 1.5秒后检查登录状态并更新UI
                setTimeout(() => checkLoginStatus(), 1500); 

            } else { // 注册成功
                setTimeout(() => {
                    showLoginLink.click();
                    registerForm.reset();
                }, 1500);
            }
        } else {
            showAuthMessage(data.message || '发生未知错误', 'error', formType);
        }
    }

    /**
     * 在指定的表单中显示提示消息
     */
    function showAuthMessage(message, type, formType) {
        const messageElement = document.getElementById(`${formType}-message`);
        if (messageElement) {
            messageElement.textContent = message;
            messageElement.className = 'auth-message';
            messageElement.classList.add(type);
            messageElement.classList.remove('hidden');
        }
    }
    
    function clearAuthMessages() {
        document.getElementById('login-message')?.classList.add('hidden');
        document.getElementById('register-message')?.classList.add('hidden');
    }

    // --- 认证事件监听器 ---
    showRegisterLink.addEventListener('click', (e) => {
        e.preventDefault();
        loginForm.classList.add('hidden');
        registerForm.classList.remove('hidden');
        clearAuthMessages();
    });

    showLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        registerForm.classList.add('hidden');
        loginForm.classList.remove('hidden');
        clearAuthMessages();
    });

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const button = loginForm.querySelector('button[type="submit"]');
        try {
            button.disabled = true;
            authLoader.classList.remove('hidden');
            clearAuthMessages();
            const username = document.getElementById('login-username').value;
            const password = document.getElementById('login-password').value;
            const response = await fetch(`${API_BASE_URL}/api/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });
            await handleAuthResponse(response, 'login');
        } catch (error) {
            showAuthMessage('网络连接失败', 'error', 'login');
        } finally {
            button.disabled = false;
            authLoader.classList.add('hidden');
        }
    });

    registerForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const button = registerForm.querySelector('button[type="submit"]');
        try {
            button.disabled = true;
            authLoader.classList.remove('hidden');
            clearAuthMessages();
            const username = document.getElementById('register-username').value;
            const password = document.getElementById('register-password').value;
            const response = await fetch(`${API_BASE_URL}/api/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });
            await handleAuthResponse(response, 'register');
        } catch (error) {
            showAuthMessage('网络连接失败', 'error', 'register');
        } finally {
            button.disabled = false;
            authLoader.classList.add('hidden');
        }
    });

    // --- 【修正】登出按钮点击事件 (最终正确版) ---
    logoutButton.addEventListener('click', () => {
        // 1. 清除登录凭证
        localStorage.removeItem('authToken');
        localStorage.removeItem('username');
        
        // 2. 更新UI：显示登录框，隐藏欢迎卡
        checkLoginStatus(); 

        // 3. 将主应用的所有UI重置回默认状态
        updateUIForSessionEnd();
        switchView('translationView'); // 切回默认视图
        
        // 4. 清理内容区域
        liveContentOutput.innerHTML = '<p class="default-message">请登录后开始上课</p>';
        noteOutput.innerHTML = '<p class="default-note-message">你的笔记将在这里显示。</p>';
        vocabListContainer.innerHTML = '<p style="color: #a0a8b7;">你收藏的单词会出现在这里。</p>';
        vocabularyList = []; // 清空内存中的单词本
    });


    // ===============================================
    // =========== 5. 全局 UI 更新函数 ================
    // ===============================================
    // 【修正】这些函数被移到 runApp 外部，以便登出等全局功能可以调用它们

    /**
     * 更新状态指示器
     */
  // 【新增】加载用户初始数据的函数
// 【新增】保存笔记到服务器的函数
// script.js

// ===============================================
// =========== 5. 全局 UI 更新函数 ================
// ===============================================

// 【【【【【 在这里添加新函数 】】】】】
/**
 * 更新左上角的用户点赞统计UI
 */
async function updateUserStats() {
    // 从后端获取最新的统计数据
    const { ok, data } = await apiRequest('/api/user/stats', 'GET', null, true);

    if (ok) {
        const currentLikes = data.likes_received;
        // 将获取到的点赞数存储在 localStorage，以便刷新后能立即显示旧数据
        localStorage.setItem('userLikes', currentLikes);
        
        // 渲染UI
        renderUserStats(currentLikes);
    } else {
        console.error("无法获取用户统计信息:", data.error);
        // 如果获取失败，尝试从本地存储加载
        const cachedLikes = localStorage.getItem('userLikes') || 0;
        renderUserStats(parseInt(cachedLikes));
    }
}

/**
 * 渲染左上角的点赞统计UI
 * @param {number} likes - 要显示的点赞数
 */
function renderUserStats(likes) {
    // 使用你提供的HTML结构来创建UI
    userStatsContainer.innerHTML = `
        <div class="likes-display">
            <div class="button-container">
                <input hidden="" id="checknumber" type="checkbox">
                <label for="checknumber" class="button">
                    <div id="leftpart">
                        <p id="currentnumber">${likes}</p>
                    </div>
                    <div id="rightpart">
                        <svg id="likeimg" stroke-linejoin="round" stroke-linecap="round" stroke-width="3" stroke="#00d5ff" fill="none" viewBox="0 0 24 24" height="24" width="24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                        </svg>
                        <div id="fontlikebutton">Likes</div>
                    </div>
                </label>
            </div>
        </div>
    `;
}

async function saveNoteToServer(content) {
    if (!content || !content.trim()) return;
    console.log("正在将笔记保存到服务器...");
    try {
        const response = await apiRequest('/api/notes', 'POST', { content: content }, true);
        if (response.ok) {
            console.log("笔记成功保存到云端。");
            // 可选：可以重新加载笔记列表以获取最新的note_id，用于删除等操作
            // const notesResponse = await apiRequest('/api/notes', 'GET', null, true);
            // if (notesResponse.ok) renderNoteList(notesResponse.data);
        } else {
            console.error("保存笔记到服务器失败:", response.data);
        }
    } catch(error) {
        console.error("保存笔记时发生网络错误:", error);
    }
}

async function loadInitialUserData() {
    console.log('正在从服务器加载用户数据...');
    try {
        // 使用Promise.all并行加载单词本和笔记
        const [vocabResponse, notesResponse] = await Promise.all([
            apiRequest('/api/vocab', 'GET', null, true),
            apiRequest('/api/notes', 'GET', null, true)
        ]);

        if (vocabResponse.ok) {
            // 将从服务器获取的单词列表存入全局变量
            vocabularyList = vocabResponse.data.map(v => ({...JSON.parse(v.meaning), word: v.word, phonetic: v.phonetic}));
            renderVocabList(); // 使用你现有的函数渲染
        }

        if (notesResponse.ok) {
            renderNoteList(notesResponse.data); // 渲染笔记列表
        }

    } catch (error) {
        console.error('加载初始数据失败:', error);
    }
}

// 【新增】渲染笔记列表的函数
function renderNoteList(notes) {
    const container = document.getElementById('noteOutput');
    container.innerHTML = ''; // 清空
    const searchInput = document.getElementById('noteSearchInput');
    if (!searchInput) { // 为笔记视图动态添加搜索框
        const noteToolbar = document.createElement('div');
        noteToolbar.className = 'note-toolbar';
        noteToolbar.innerHTML = `
            <input type="text" id="noteSearchInput" placeholder="搜索历史笔记...">
            <button id="noteSearchBtn" class="btn btn-secondary">搜索</button>
        `;
        // 插入到 noteView 的最前面
        document.getElementById('noteView').prepend(noteToolbar);

        // 绑定事件
        document.getElementById('noteSearchBtn').addEventListener('click', performNoteSearch);
        document.getElementById('noteSearchInput').addEventListener('keyup', (e) => {
            if (e.key === 'Enter') performNoteSearch();
        });
    }

    if (notes.length === 0) {
        container.innerHTML = '<p class="default-note-message">这里还没有笔记。</p>';
        return;
    }

    notes.forEach(note => {
        // 注意：你的 addNoteEntry 函数很复杂，我们这里用一个简化的渲染逻辑
        // 如果想复用，需要改造 addNoteEntry
        const noteElement = document.createElement('div');
        noteElement.className = 'note-entry';
        const formattedContent = note.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');
        noteElement.innerHTML = `
            <div class="note-header">
                <span>笔记摘要</span>
                <span class="timestamp">${new Date(note.created_at).toLocaleString()}</span>
            </div>
            <div class="note-content">${formattedContent}</div>
            <button class="delete-note-btn" data-note-id="${note.id}">删除</button>
        `;
        container.appendChild(noteElement);
    });
}

// 【新增】笔记搜索功能的函数
async function performNoteSearch() {
    const query = document.getElementById('noteSearchInput').value.trim();
    try {
        const response = await apiRequest(`/api/notes?search=${encodeURIComponent(query)}`, 'GET', null, true);
        if (response.ok) {
            renderNoteList(response.data);
        }
    } catch (error) {
        console.error('搜索笔记失败:', error);
    }
}

    function updateStatusIndicator(state, message = '') {
        statusIndicator.style.display = state === 'stopped' ? 'none' : 'flex';
        waveIndicator.style.display = state === 'listening' ? 'flex' : 'none';
        pauseIndicator.style.display = (state === 'paused' || state === 'error') ? 'flex' : 'none';

        if (state === 'error') {
            pauseIndicator.innerHTML = '&#9888;'; // 警告符号
            pauseIndicator.title = message;
        } else if (state === 'paused') {
            pauseIndicator.innerHTML = '<div class="custom-loader"></div>'; // 暂停时的加载动画
            pauseIndicator.title = '已暂停';
        }
    }

    /**
     * 更新UI以反映会话结束或初始状态
     */
    function updateUIForSessionEnd() {
        controlBtn.textContent = '开始上课';
        controlBtn.classList.remove('active');
        pauseBtn.disabled = true;
        pauseBtn.textContent = '暂停';
        pauseBtn.className = 'btn';
        updateStatusIndicator('stopped');
        fullTranscriptHistory = "";
        noteBuffer = "";
        currentOriginalP = null;
        currentTranslationP = null;
    }

    /**
     * 切换主功能区视图 (翻译/笔记/单词本)
     */
// script.js - 替换 switchView 函数

    /**
     * 切换主功能区视图 (翻译/笔记/单词本/排行)
     */
    function switchView(targetViewId) {
        views.forEach(view => view.style.display = 'none');
        document.getElementById(targetViewId).style.display = 'block';
        
        // [修改] 将 rankBtn 加入数组
        [transBtn, noteBtn, vocabBtn, rankBtn].forEach(btn => btn.classList.remove('active-view'));
        
        // [修改] 将 rankBtn 加入映射
        const activeBtnMap = { 
            'translationView': transBtn, 
            'noteView': noteBtn, 
            'vocabView': vocabBtn,
            'rankView': rankBtn 
        };
        if (activeBtnMap[targetViewId]) {
            activeBtnMap[targetViewId].classList.add('active-view');
        }
    }

    // 【新版本】请用此代码块替换你现有的 loadVocab 函数
async function loadVocab() {
    vocabListContainer.innerHTML = '<p class="default-message">正在从云端加载你的单词本...</p>';
    const { ok, data } = await apiRequest('/api/vocab', 'GET', null, true);

    if (ok) {
        vocabListContainer.innerHTML = '';
        if (data.length === 0) {
            vocabListContainer.innerHTML = '<p class="default-message">你的单词本是空的，快去添加一些单词吧！</p>';
            return;
        }


        // 将从服务器获取的单词列表存入全局变量
        // 注意：我们在这里解析 meaning 字段，并与顶层字段合并
        vocabularyList = data.map(v => {
            const meaningData = JSON.parse(v.meaning);
            return {
                id: v.id, // 保留后端的 vocab ID 用于删除
                word: v.word,
                phonetic: v.phonetic,
                ...meaningData // 将 meaning 对象的所有属性解构出来
            };
        });
        
        // 使用 renderVocabList 来渲染，保持UI统一
        renderVocabList(); 

    } else {
        console.error('加载单词本失败:', data.error);
        vocabListContainer.innerHTML = `<p class="default-message error">无法加载单词本: ${data.error || '请确认您已登录。'}</p>`;
    }
}
  function renderVocabList() {
    if (vocabularyList.length === 0) {
        vocabListContainer.innerHTML = `<p class="default-message">你收藏的单词会出现在这里。</p>`;
        return;
    }
    
    // 按星标排序
    vocabularyList.sort((a, b) => (b.starred ? 1 : 0) - (a.starred ? 1 : 0));
    vocabListContainer.innerHTML = '';
    
    vocabularyList.forEach(item => {
        const card = document.createElement('div');
        // 注意：我们使用 item.id，这是从后端来的唯一ID
        card.setAttribute('data-vocab-id', item.id);
        card.className = `vocab-card ${item.starred ? 'starred' : ''}`;
        
        // 使用更丰富的数据来填充卡片
        card.innerHTML = `
            <div class="word">${item.word} <span class="phonetic">${item.phonetic || ''}</span></div>
            <div class="meaning"><strong>[${item.partOfSpeech || 'N/A'}]</strong> ${item.definition_zh || item.definition_en}</div>
            <div class="example"><strong>例:</strong> ${item.example_zh || item.example_en || '无例句'}</div>
            <div class="vocab-card-actions">
                <button class="star-btn ${item.starred ? 'starred' : ''}" data-word="${item.word}">${item.starred ? '★' : '☆'}</button>
                <button class="btn-delete-vocab" title="删除">&times;</button>
            </div>
        `;
        vocabListContainer.appendChild(card);
    });
}
  async function openNoteHistoryModal() {
    noteHistoryModal.classList.remove('hidden');
    noteHistoryList.innerHTML = '<p>正在加载历史记录...</p>';
    
    const { ok, data } = await apiRequest('/api/notes', 'GET', null, true);

    if (ok) {
        if (data.length === 0) {
            noteHistoryList.innerHTML = '<p>没有找到任何历史笔记。</p>';
            return;
        }

        let tableHtml = `
            <table class="history-table">
                <thead>
                    <tr>
                        <th>创建时间</th>
                        <th>笔记摘要</th>
                        <th>操作</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        data.forEach(note => {
            const summaryText = note.summary || '（无摘要）'; // 如果note.summary不存在，使用默认文本
const shortSummary = summaryText.length > 80 ? summaryText.substring(0, 80) + '...' : summaryText;
            tableHtml += `
                <tr>
                    <td>${note.created_at}</td>
                    <td title="${note.summary}">${shortSummary}</td>
                    <td>
                        <button class="btn btn-sm btn-primary look-note-btn" data-note-id="${note.id}">查看</button>
                    </td>
                </tr>
            `;
        });
        tableHtml += '</tbody></table>';
        noteHistoryList.innerHTML = tableHtml;
    } else {
        console.error('加载笔记历史失败:', data.error);
        noteHistoryList.innerHTML = `<p class="error">加载失败: ${data.error || '请重试。'}</p>`;
    }
}

/**
 * 关闭笔记历史模态框
 */
function closeHistoryModal() {
    noteHistoryModal.classList.add('hidden');
}

/**
 * 根据ID获取单篇笔记并显示在主界面
 * @param {string} noteId - 要获取的笔记的ID
 */
async function loadSingleNote(noteId) {
    // 显示加载状态
    noteOutput.innerHTML = '<p class="default-note-message">正在加载笔记...</p>';
    closeHistoryModal(); // 立即关闭模态框

    const { ok, data } = await apiRequest(`/api/note/${noteId}`, 'GET', null, true);

    if (ok) {
        // 将获取到的完整笔记内容和摘要填充到主页面
        noteOutput.innerHTML = `
            <h3>摘要:</h3>
            <p>${data.summary}</p>
            <hr>
            <h3>原始笔记内容:</h3>
            <div class="note-content-display">${data.content.replace(/\n/g, '<br>')}</div>
            <button class="delete-note-btn" data-note-id="${data.id}">删除这条笔记</button>
        `;
    } else {
        console.error('加载单篇笔记失败:', data.error);
        noteOutput.innerHTML = `<p class="default-note-message error">加载笔记失败: ${data.error}</p>`;
    }
}

    // ===============================================
    // =========== 6. 主应用逻辑 (runApp) ============
    // ===============================================
    function runApp() {
        if (window.appHasStarted) return; // 防止重复初始化
        console.log("主应用 runApp() 已启动！");
        window.appHasStarted = true;

        // --- 核心语音识别函数 ---
        function initializeRecognition() {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognition = new SpeechRecognition();
            recognition.lang = 'en-US';
            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.onresult = handleRecognitionResult;
            recognition.onstart = () => {
                console.log('事件: onstart - 识别服务已连接。');
                isRunning = true;
                updateUIForSessionStart();
                startInactivityCountdown();
            };
            recognition.onend = () => {
                console.log(`事件: onend - 识别服务已断开。isRunning: ${isRunning}, isPaused: ${isPaused}`);
                if (isRunning && !isPaused) {
                    console.log("非暂停状态下断开，自动重启...");
                    startRecognition();
                }
            };
            recognition.onerror = (event) => {
                console.error(`语音识别错误: ${event.error}`);
                if (event.error === 'network') updateStatusIndicator('error', '网络错误');
            };
            console.log("新的语音识别引擎已初始化。");
        }

        function startRecognition() {
            if (isRunning && !isPaused && recognition) {
                try {
                    recognition.start();
                    console.log("语音识别已启动。");
                } catch (error) {
                    console.error("启动语音识别失败:", error);
                }
            }
        }
        
        function handleRecognitionResult(event) {
            startInactivityCountdown();
            let localInterim = '', localFinal = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    localFinal += event.results[i][0].transcript;
                } else {
                    localInterim += event.results[i][0].transcript;
                }
            }

            if (localInterim) {
                updateLiveTranscript(fullTranscriptHistory, localInterim);
            }

            if (localFinal) {
                fullTranscriptHistory += localFinal;
                noteBuffer += localFinal; 
                finalizeLiveTranscript(fullTranscriptHistory);
                fullTranscriptHistory = ""; // 为下一句话重置
            }
            autoScrollView();
          // pen.js -> runApp() -> --- 主应用事件监听器 ---


// =========================================================

        }

        // --- 实时内容更新 ---
        function updateLiveTranscript(history, interim) {
            if (!currentOriginalP) createNewParagraphs();
            currentOriginalP.innerHTML = `<span class="word">${history}</span><span class="word interim-word">${interim}</span>`;
            
            if (isFullPowerMode) {
                clearTimeout(interimTranslationTimer);
                interimTranslationTimer = setTimeout(async () => {
                    const fastText = await getFastTranslation(interim);
                    if (currentTranslationP) { 
                        const finalPart = currentTranslationP.dataset.final_translation || "";
                        currentTranslationP.innerHTML = finalPart + `<span class="interim-translation">${fastText || " ..."}</span>`; 
                    }
                }, 800);
            }
        }

        async function finalizeLiveTranscript(finalSentence) {
            clearTimeout(interimTranslationTimer);
            if (!currentOriginalP) createNewParagraphs();

            const words = finalSentence.split(/\s+/).filter(Boolean).map(word => `<span class="word">${word} </span>`).join('');
            currentOriginalP.innerHTML = words;
            currentOriginalP.classList.remove('new-entry');

            const finalP = currentTranslationP; // 捕获当前翻译段落的引用

            // 启动快速翻译和AI增强翻译
            getFastTranslation(finalSentence).then(fastText => {
                if (finalP) finalP.innerHTML = `${fastText} <span class="ai-thinking-indicator">...</span>`;
            });
            
            const aiPrompt = [{ role: 'system', content: `You are a world-class simultaneous interpreter specializing in academic lectures. Your task is to translate English lecture snippets into fluent, accurate, and professional Chinese. Your entire response must be ONLY the Chinese translation. Do not add any extra words, explanations, or punctuation outside of the translation itself.`}, { role: 'user', content: `The lecture topic is "${currentCourseName}". Prioritize terminology and phrasing suitable for this academic field. Please provide a professional Chinese translation for the following English text:\n\n"${finalSentence}"` }];
            callDeepSeek(aiPrompt, 0.1).then(aiText => {
                if (aiText && finalP) {
                    finalP.innerHTML = aiText;
                    finalP.classList.add('ai-enhanced');
                } else if (finalP) {
                    finalP.querySelector('.ai-thinking-indicator')?.remove(); // 如果AI翻译失败，移除...
                }
            });

            if (finalP) finalP.classList.remove('new-entry');

            // 为下一句话重置
            currentOriginalP = null;
            currentTranslationP = null;
        }

       // 【修复版】请用此版本替换 createNewParagraphs 函数

function createNewParagraphs() {
    if (liveContentOutput.firstChild?.textContent.includes('开始上课')) {
        liveContentOutput.innerHTML = '';
    }
    currentOriginalP = document.createElement('p');
    currentOriginalP.className = 'original-text new-entry';
    liveContentOutput.appendChild(currentOriginalP);

    currentTranslationP = document.createElement('p');
    currentTranslationP.className = 'translation-text new-entry';
    liveContentOutput.appendChild(currentTranslationP);
    
    setTimeout(() => {
        // 【关键修复】: 在执行操作前，检查变量是否还存在 (没有被其他异步操作设为null)
        if (currentOriginalP) {
            currentOriginalP.classList.add('visible');
        }
        if (currentTranslationP) {
            currentTranslationP.classList.add('visible');
        }
    }, 10);
}


        // --- 核心功能 (开始/暂停/结束) ---
        async function startSession() {
            isPaused = false;
            isRunning = true;
            initializeRecognition();

            showSpinner(`正在为 <strong>${currentCourseName}</strong> 课程优化...`);
            try {
                const prompt = `你是一个专家教授。请为语音识别引擎生成JSGF格式的语法。课程主题是：${currentCourseName}。请你围绕这个主题，生成一个包含大约50个最核心的英文术语列表。要求：用 "|" 符号隔开，不要添加任何额外的解释、标题或换行符，直接输出由 "|" 分隔的单个长字符串。`;
                const grammarTerms = await callDeepSeek([{ role: 'user', content: prompt }]);
                if (grammarTerms) {
                    const grammar = `#JSGF V1.0; grammar courseTerms; public <term> = ${grammarTerms};`;
                    const SpeechGrammarList = window.SpeechGrammarList || window.webkitSpeechGrammarList;
                    const speechRecognitionList = new SpeechGrammarList();
                    speechRecognitionList.addFromString(grammar, 1);
                    recognition.grammars = speechRecognitionList;
                    console.log("识别引擎已优化。加载的词汇:", grammarTerms.substring(0, 100) + '...');
                }
            } catch (error) {
                console.error('优化识别引擎失败:', error);
            } finally {
                hideSpinner();
            }

            classStartTime = new Date();
            classCount++;
            startRecognition();
        }

        function pauseSession() {
            if (!isRunning || isPaused) return;
            isPaused = true;
            clearInactivityCountdown();
            if (recognition) recognition.stop();
            updateUIForSessionPause();
            summarizeTextForNote(noteBuffer, currentCourseName);
            noteBuffer = "";
        }
        
        function resumeSession() {
            if (!isRunning || !isPaused) return;
            isPaused = false;
            fullTranscriptHistory = "";
            initializeRecognition();
            startRecognition(); // onstart回调会更新UI
        }

        async function endSession() {
            if (!isRunning) return;
            isRunning = false;
            isPaused = true; 
            clearInactivityCountdown();
            if (recognition) recognition.stop();

            if (classStartTime) {
                await summarizeTextForNote(noteBuffer, currentCourseName);
                noteBuffer = "";
                const endTime = new Date();
                const durationSeconds = Math.round((endTime - classStartTime) / 1000);
                const minutes = Math.floor(durationSeconds / 60);
                const seconds = durationSeconds % 60;
                addNoteEntry({ title: `课堂 #${classCount}: ${currentCourseName}`, details: `结束时间: ${endTime.toLocaleString('zh-CN')}<br>持续时长: ${minutes}分 ${seconds}秒` }, 'session')
                saveNoteToServer(sessionSummaryContent);
            }
            
            updateUIForSessionEnd(); // 这个函数现在在外部，但可以正常调用
            classStartTime = null;
        }

        // --- AI 笔记与分析 ---
        async function loadRankData() {
            rankView.innerHTML = '<p class="default-message">正在加载用户排名...</p>';
            
            const { ok, data } = await apiRequest('/api/rank', 'GET', null, true);

            if (ok) {
                const { rankings, liked_by_me } = data;
                if (rankings.length === 0) {
                    rankView.innerHTML = '<p class="default-message">还没有用户数据，快去学习吧！</p>';
                    return;
                }

                // 创建表格框架
                let tableHtml = `
                    <table class="rank-table">
                        <thead>
                            <tr>
                                <th class="rank-col">#</th>
                                <th class="username-col">用户</th>
                                <th class="count-col">单词数</th>
                                <th class="likes-col">获赞数</th>
                                <th class="action-col">点赞</th>
                            </tr>
                        </thead>
                        <tbody>
                `;

                // 循环生成每一行
                rankings.forEach((user, index) => {
                    const rank = index + 1;
                    const isLikedByMe = liked_by_me.includes(user.user_id);

                    // 为当前登录用户添加特殊高亮样式
                    const currentUserClass = user.username === localStorage.getItem('username') ? 'current-user-row' : '';

                    tableHtml += `
                        <tr class="${currentUserClass}">
                            <td class="rank-col">${rank}</td>
                            <td class="username-col">${user.username}</td>
                            <td class="count-col">${user.vocab_count}</td>
                            <td class="likes-col" id="likes-count-${user.user_id}">${user.likes_received}</td>
                            <td class="action-col">
                            <td class="action-cell">  <!-- 我们只需要一个td，并给它我们想要的class -->
    <div class="rank-like-btn">
        <label class="container">
          <input type="checkbox" data-user-id="${user.user_id}" ${isLikedByMe ? 'checked' : ''} ${user.username === localStorage.getItem('username') ? 'disabled' : ''}>
          <div class="checkmark">
            <svg viewBox="0 0 50 50" version="1.1" xmlns="http://www.w3.org/2000/svg" class="icon">
                <path d="M 24.10 6.29 Q 28.34 7.56 28.00 12.00 Q 27.56 15.10 27.13 18.19 A 0.45 0.45 4.5 0 0 27.57 18.70 Q 33.16 18.79 38.75 18.75 Q 42.13 18.97 43.23 21.45 Q 43.91 22.98 43.27 26.05 Q 40.33 40.08 40.19 40.44 Q 38.85 43.75 35.50 43.75 Q 21.75 43.75 7.29 43.75 A 1.03 1.02 0.0 0 1 6.26 42.73 L 6.42 19.43 A 0.54 0.51 -89.4 0 1 6.93 18.90 L 14.74 18.79 A 2.52 2.31 11.6 0 0 16.91 17.49 L 22.04 7.17 A 1.74 1.73 21.6 0 1 24.10 6.29 Z M 21.92 14.42 Q 20.76 16.58 19.74 18.79 Q 18.74 20.93 18.72 23.43 Q 18.65 31.75 18.92 40.06 A 0.52 0.52 88.9 0 0 19.44 40.56 L 35.51 40.50 A 1.87 1.83 5.9 0 0 37.33 39.05 L 40.51 23.94 Q 40.92 22.03 38.96 21.97 L 23.95 21.57 A 0.49 0.47 2.8 0 1 23.47 21.06 Q 23.76 17.64 25.00 12.00 Q 25.58 9.36 24.28 10.12 Q 23.80 10.40 23.50 11.09 Q 22.79 12.80 21.92 14.42 Z M 15.57 22.41 A 0.62 0.62 0 0 0 14.95 21.79 L 10.01 21.79 A 0.62 0.62 0 0 0 9.39 22.41 L 9.39 40.07 A 0.62 0.62 0 0 0 10.01 40.69 L 14.95 40.69 A 0.62 0.62 0 0 0 15.57 40.07 L 15.57 22.41 Z" fill-opacity="1.000"></path>
                <circle r="1.51" cy="37.50" cx="12.49" fill-opacity="1.000"></circle>
            </svg>
          </div>
        </label>
    </div>
</td>
                        </tr>
                    `;
                });
                
                tableHtml += '</tbody></table>';
                rankView.innerHTML = tableHtml;

            } else {
                rankView.innerHTML = `<p class="default-message error">无法加载排名: ${data.error}</p>`;
            }
        }
        async function summarizeTextForNote(text, courseName) {
            if (!text || text.trim().length === 0) return;
            const originalButtonText = noteBtn.innerHTML;
            noteBtn.disabled = true;
            noteBtn.classList.add('note-btn-loading'); 
            noteBtn.innerHTML = `<div class="loader-wrapper"><div class="loader"></div></div>`;

            const prompt = `You are a highly efficient note-taking assistant for a university lecture on "${courseName}". Please summarize the key points from the following transcript for a student's review. Please use Chinese. The summary should be concise, well-structured, and use **bold text** to highlight key terms.\n\nTranscript:\n"${text}"`;
            const summary = await callDeepSeek([{ role: 'user', content: prompt }]);
            if (summary) {
                addNoteEntry(summary)
                saveNoteToServer(summary);
            } else {
                addNoteEntry("未能生成笔记摘要。");
            }
            
            noteBtn.disabled = false;
            noteBtn.classList.remove('note-btn-loading');
            noteBtn.innerHTML = originalButtonText;
        }

        async function getAIContextualExplanation(word, sentence) {
            hideAllPopups();
            aiPopupContent.innerHTML = `<div class="loader"></div><p style="text-align: center;">正在分析 "${word}"...</p>`; 
            showPopupById('aiPopup');
            
            const prompt = `This is a lecture on "${currentCourseName}". I encountered a word.\nThe sentence is: "${sentence}"\nThe word is: "${word}"\nPlease answer strictly in Chinese, in the following format, without any extra intros:\n1.  **语境含义**: 在这个句子中，“${word}”最可能是什么意思？\n2.  **扩展解释**: 提供更广泛的解释，包括其他含义或用法。\n3.  **记忆技巧**: 提供一个帮助记忆这个单词的技巧。`;
            const explanation = await callDeepSeek([{ role: 'user', content: prompt }], 0.3);

            if (explanation) {
                const formattedResponse = explanation.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');
                aiPopupContent.innerHTML = `<div class="ai-definition">${formattedResponse}</div>`;
            } else {
                aiPopupContent.innerHTML = `<p class="error-message">AI 上下文分析失败。</p>`;
            }
        }
        
        // --- 内部UI 更新与控制 ---
        function updateUIForSessionStart() {
            controlBtn.textContent = '结束课程';
            controlBtn.classList.add('active');
            pauseBtn.disabled = false;
            pauseBtn.textContent = '暂停';
            pauseBtn.className = 'btn pausable';
            updateStatusIndicator('listening'); // 这个函数现在在外部，但可以正常调用
        }

        function updateUIForSessionPause() {
            pauseBtn.textContent = '继续';
            pauseBtn.classList.replace('pausable', 'resumable');
            updateStatusIndicator('paused'); // 这个函数现在在外部，但可以正常调用
        }
        
        function showUnsupportedBrowserWarning() {
            document.querySelector('.controls').style.display = 'none';
            document.querySelector('main').innerHTML = `<div class="unsupported-browser-warning"><h2>抱歉，您的浏览器不支持语音识别功能</h2><p>推荐使用最新版的 <strong>Google Chrome</strong> 或 <strong>Microsoft Edge</strong>。</p></div>`;
        }

        function showSpinner(message) {
            spinnerOverlay.querySelector('p').innerHTML = message;
            spinnerOverlay.style.display = 'flex';
        }
    
        function hideSpinner() {
            spinnerOverlay.style.display = 'none';
        }

        function showPopupById(popupId) {
            document.querySelectorAll('.popup').forEach(p => p.classList.remove('visible'));
            const targetPopup = document.getElementById(popupId);
            if (targetPopup) targetPopup.classList.add('visible');
            popupOverlay.classList.add('visible');
        }
    
        function hideAllPopups() {
            document.querySelectorAll('.popup').forEach(p => p.classList.remove('visible'));
            popupOverlay.classList.remove('visible');
        }
        
       function showDictionaryPopup(word, sentence) {
    // --- 【第一步探针】：函数入口 ---
    console.log(`1. 进入 showDictionaryPopup 函数。收到的单词: "${word}", 句子: "${sentence}"`);

    const cleanedWord = word.replace(/[.,?!:;]$/, '').toLowerCase();
    currentPopupData = { word: cleanedWord, contextSentence: sentence, definitionData: null };
    
    // 准备弹窗的初始内容
    popupContent.innerHTML = `<div class="spinner"></div><p style="text-align:center;">正在查询 "${cleanedWord}"...</p>`;
    addVocabBtn.disabled = true;
    addVocabBtn.textContent = '添加到单词本';
    
    // 显示弹窗的遮罩层和主体
    showPopupById('dictionaryPopup');

    // --- 【第二步探针】：调用API前 ---
    console.log(`2. 准备调用 getWordDefinition 函数来查询: "${cleanedWord}"`);

    getWordDefinition(cleanedWord).then(data => {
        // --- 【第三步探针】：API返回后 ---
        console.log('3. getWordDefinition 函数已返回。收到的数据 (data) 是:', data);

        if (data) {
            // --- 【第四步探针】：如果成功获取数据 ---
            console.log('4. 成功获取到数据，准备渲染弹窗内容...');
            
            currentPopupData.definitionData = data;
            popupContent.innerHTML = `<div class="dict-entry"><div class="word-title">${data.word}</div><div class="word-phonetic">${data.phonetic}</div><div class="meaning-block"><p><strong>词性:</strong> ${data.partOfSpeech}</p><p><strong>英文释义:</strong> ${data.definition_en}</p><p><strong>中文释义:</strong> ${data.definition_zh}</p></div><div class="meaning-block"><p><strong>英文例句:</strong> <em>${data.example_en}</em></p><p><strong>中文翻译:</strong> <em>${data.example_zh}</em></p></div></div>`;
            
            // 检查单词是否已在词汇表中
            if (vocabularyList.some(item => item.word === data.word)) {
                addVocabBtn.textContent = '已添加 ✔';
            } else {
                addVocabBtn.disabled = false;
            }
        } else {
            // --- 【第五步探针】：如果未获取到数据 ---
            console.log('5. 未获取到有效数据 (data is null)，显示“找不到定义”的提示信息。');
            
            popupContent.innerHTML = `<p>抱歉，找不到 “${cleanedWord}” 的标准定义。<br>您可以尝试下方的“AI上下文分析”功能。</p>`;
        }
    }).catch(error => {
        // --- 【第六步探针】：如果发生严重错误 ---
        console.error('在 showDictionaryPopup 的 .then() 链中捕获到错误:', error);
        popupContent.innerHTML = `<p class="error-message">查询时发生未知错误，请检查控制台。</p>`;
    });
}
        
        function addNoteEntry(content, type = 'summary') {
            const defaultMsg = noteOutput.querySelector('.default-note-message');
            if(defaultMsg) defaultMsg.remove();
            
            const noteEntry = document.createElement('div');
            noteEntry.className = 'note-entry';
            const timestamp = new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute:'2-digit' });

            if (type === 'summary') {
                const formattedContent = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');
                noteEntry.innerHTML = `<div class="note-header"><span>笔记摘要</span><span class="timestamp">${timestamp}</span></div><div class="note-content">${formattedContent}</div>`;
            } else if (type === 'session') {
                noteEntry.innerHTML = `<div class="note-header session-summary"><span>${content.title}</span><span class="timestamp">${timestamp}</span></div><div class="note-content">${content.details}</div>`;
            }
            
            noteEntry.innerHTML += `<button class="delete-note-btn">删除</button>`;
            noteOutput.appendChild(noteEntry);
        }
        
// 【新版本】请用此代码块替换你现有的 renderVocabList 函数

        function startInactivityCountdown() {
            clearInactivityCountdown();
            warningTimer = setTimeout(() => {
                showPopupById('timeoutWarningPopup');
                let count = 10;
                timeoutCountdown.textContent = count;
                countdownInterval = setInterval(() => {
                    count--;
                    timeoutCountdown.textContent = count;
                    if (count <= 0) clearInterval(countdownInterval);
                }, 1000);
            }, INACTIVITY_TIMEOUT - 10000);

            inactivityTimer = setTimeout(() => {
                hideAllPopups();
                endSession();
            }, INACTIVITY_TIMEOUT);
        }
    
        function clearInactivityCountdown() {
            clearTimeout(inactivityTimer);
            clearTimeout(warningTimer);
            clearInterval(countdownInterval);
        }

        function autoScrollView() { window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }); }
        
        // --- 主应用事件监听器 ---
        controlBtn.addEventListener('click', () => {
            if (isRunning) {
                endSession();
            } else {
                courseNameModal.style.display = 'flex';
                setTimeout(() => courseNameModal.classList.add('visible'), 10);
                courseNameInput.focus();
            }
        });

        startCourseBtn.addEventListener('click', () => {
            currentCourseName = courseNameInput.value.trim() || "通用课程";
            courseNameModal.classList.remove('visible');
            setTimeout(() => courseNameModal.style.display = 'none', 300);
            startSession();
        });
        
        pauseBtn.addEventListener('click', () => {
            if (isPaused) resumeSession(); else pauseSession();
        });

        modeSwitch.addEventListener('change', () => {
            isFullPowerMode = modeSwitch.checked;
            modeIndicator.textContent = isFullPowerMode ? '满血模式' : '经济模式';
            modeIndicator.classList.add('show');
            setTimeout(() => modeIndicator.classList.remove('show'), 1500);
            if (isRunning && !isPaused && recognition) recognition.stop();
        });

        transBtn.addEventListener('click', () => switchView('translationView'));
        noteBtn.addEventListener('click', () => switchView('noteView'));
        vocabBtn.addEventListener('click', () => {
        switchView('vocabView');
        loadVocab(); // 切换视图的同时加载单词本
        });
        // script.js -> runApp() -> --- 主应用事件监听器 ---
// 在 vocabBtn 的事件监听器之后添加

        rankBtn.addEventListener('click', () => {
            switchView('rankView');
            // 后续我们会在这里调用加载排名的函数
            loadRankData(); 
        });

        popupOverlay.addEventListener('click', (e) => { if (e.target === popupOverlay) hideAllPopups(); });
        
        liveContentOutput.addEventListener('click', (e) => {
            const target = e.target;
            if (target.classList.contains('word')) {
                const word = target.textContent.trim();
                const sentence = target.parentElement.textContent.trim();
                showDictionaryPopup(word, sentence);
            }
        });

        aiContextSearchBtn.addEventListener('click', () => {
            if (currentPopupData.word && currentPopupData.contextSentence) {
                getAIContextualExplanation(currentPopupData.word, currentPopupData.contextSentence);
            }
        });

 // 在 runApp 函数内部

// 【新版本】请用此代码块替换你现有的 addVocabBtn 事件监听器
addVocabBtn.addEventListener('click', async () => {
    if (!currentPopupData.definitionData || addVocabBtn.disabled) return;
    
    addVocabBtn.disabled = true;
    addVocabBtn.textContent = '添加中...';

    // 准备要发送到后端的数据
    const vocabData = {
        word: currentPopupData.definitionData.word,
        phonetic: currentPopupData.definitionData.phonetic,
        // 【关键】将完整的单词定义对象，转为JSON字符串，存入 meaning 字段
        meaning: JSON.stringify(currentPopupData.definitionData) 
    };

    const { ok, data } = await apiRequest('/api/vocab', 'POST', vocabData, true);

    if (ok) {
        console.log("单词已成功保存到云端。");
        addVocabBtn.textContent = '已添加 ✔';
        // 将新单词添加到本地列表，并重新渲染
        vocabularyList.push({
            ...currentPopupData.definitionData,
            id: data.id // 从后端响应中获取新单词的ID
        });
        renderVocabList();
        setTimeout(hideAllPopups, 800);
    } else {
        console.error("保存单词失败:", data);
        alert("添加到单词本失败: " + (data.error || '未知错误'));
        addVocabBtn.disabled = false;
        addVocabBtn.textContent = '添加到单词本';
    }
});
        // 【替换为这个新版本】使用事件委托处理单词删除
    vocabListContainer.addEventListener('click', async (event) => { // 添加 async
        if (event.target.classList.contains('btn-delete-vocab')) {
            const card = event.target.closest('.vocab-card');
            const vocabId = card.getAttribute('data-vocab-id');

        if (confirm(`确定要删除单词 "${card.querySelector('.vocab-word').textContent}" 吗？`)) {
            // 调用后端API进行删除
            const { ok, data } = await apiRequest(`/api/vocab/${vocabId}`, 'DELETE', null, true);

            if (ok) {
                // 如果后端成功删除，我们就在前端把这张卡片移除
                card.style.transform = 'scale(0)';
                setTimeout(() => {
                    card.remove();
                    if (vocabListContainer.childElementCount === 0) {
                        vocabListContainer.innerHTML = '<p class="default-message">你的单词本是空的，快去添加一些单词吧！</p>';
                    }
                }, 300); // 等待动画完成
            } else {
                alert('删除失败: ' + (data.error || '未知错误'));
            }
        }
    }
});
      
// ... (保留该区域已有的所有事件监听器)

// =========================================================
// 【在这里添加以下代码】
// --- 笔记历史功能事件监听器 ---

// 点击 "查看笔记历史" 按钮
showNoteHistoryBtn.addEventListener('click', openNoteHistoryModal);

// 点击模态框的关闭按钮
closeNoteHistoryBtn.addEventListener('click', closeHistoryModal);

// 点击模态框的 ESC 图标
closeNoteHistoryIcon.addEventListener('click', closeHistoryModal);

// 点击模态框背景遮罩层时也关闭
noteHistoryModal.addEventListener('click', (event) => {
    if (event.target === noteHistoryModal) {
        closeHistoryModal();
    }
});

// 使用事件委托处理 "查看" 按钮的点击
noteHistoryList.addEventListener('click', event => {
    if (event.target.classList.contains('look-note-btn')) {
        const noteId = event.target.getAttribute('data-note-id');
        loadSingleNote(noteId);
    }
});

// 按 ESC 键关闭笔记历史模态框
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !noteHistoryModal.classList.contains('hidden')) {
        closeHistoryModal();
    }
});
  noteOutput.addEventListener('click', async (e) => {
    if (e.target.classList.contains('delete-note-btn')) {
        const noteId = e.target.dataset.noteId;
        // 只有从历史记录加载的笔记才有 noteId，可以直接删除
        if (noteId) {
            if (confirm('确定要从云端永久删除这条笔记吗？')) {
                const { ok, data } = await apiRequest(`/api/note/${noteId}`, 'DELETE', null, true);
                if (ok) {
                    // 从历史记录加载的笔记结构比较特殊，需要这样移除
                    const noteElement = e.target.closest('.note-content-display')?.parentElement;
                    if (noteElement) {
                        noteElement.remove();
                    }
                    // 清空主视图并显示提示
            noteOutput.innerHTML = `<p class="default-note-message">笔记已删除。查看历史记录或继续上课。</p>`;
                } else {
                    alert('删除失败: ' + (data.error || '未知错误'));
                }
            }
        } else {
            // 对于没有ID的笔记（刚生成的），只是从界面移除
            e.target.closest('.note-entry')?.remove();
            if (noteOutput.children.length === 0) {
                noteOutput.innerHTML = `<p class="default-note-message">你的笔记将在这里显示。</p>`;
            }
        }
    }
});

        resumeBtn.addEventListener('click', () => { hideAllPopups(); resumeSession(); });
        endSessionBtn.addEventListener('click', () => { hideAllPopups(); endSession(); });
 rankView.addEventListener('change', async (event) => {
            // 确保被点击的是一个checkbox并且它有关联的用户ID
            if (event.target.matches('input[type="checkbox"][data-user-id]')) {
                const checkbox = event.target;
                const likedUserId = checkbox.dataset.userId;

                // 立即禁用按钮，防止重复点击
                checkbox.disabled = true;

                // 调用后端的点赞/取消点赞API
                const { ok, data } = await apiRequest(`/api/user/${likedUserId}/like`, 'POST', null, true);

                if (ok) {
                    // 如果成功，更新界面上的获赞数
                    const likesCountElement = document.getElementById(`likes-count-${likedUserId}`);
                    if (likesCountElement) {
                        likesCountElement.textContent = data.new_like_count;
                    }
                } else {
                    // 如果失败，显示错误并把checkbox恢复到之前的状态
                    alert(`操作失败: ${data.error}`);
                    checkbox.checked = !checkbox.checked; 
                }

                // 无论成功与否，最终都恢复按钮的可点击状态
                checkbox.disabled = false;
            }
        });
        // --- runApp 初始化 ---
        switchView('translationView');
        updateStatusIndicator('stopped');
        modeIndicator.textContent = '经济模式';
        modeIndicator.classList.add('show');
        setTimeout(() => modeIndicator.classList.remove('show'), 1500);
    }



// ===============================================
// ======== 6. 功能模块 (FEATURE MODULES) ========
// ===============================================
// (这是一个逻辑上的分块，你可以把新函数放这里)

function setupFeedbackSystem() {
    const feedbackInput = document.getElementById('feedback-input');
    const submitBtn = document.getElementById('submit-feedback-btn');

    if (!feedbackInput || !submitBtn) {
        console.error('Feedback UI elements not found in HTML!');
        return; // 如果HTML里没有这些元素，就直接返回，防止报错
    }

    submitBtn.addEventListener('click', async () => {
        const content = feedbackInput.value.trim();

        if (!content) {
            showToast('反馈内容不能为空哦！', 'error');
            return;
        }

        // 注意：这里要用 authToken，匹配你代码中的变量名
        const token = localStorage.getItem('authToken'); 
        if (!token) {
            showToast('请先登录再提交反馈。', 'error');
            return;
        }

        submitBtn.disabled = true;
        submitBtn.textContent = 'SENDING...';

       try {
    const response = await fetch(`${API_BASE_URL}/api/feedback`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content: content })
    });

    //【注意】这里有一个小优化：在404的情况下，response.json()会报错，
    // 所以我们先检查 response.ok
    if (!response.ok) {
        // 尝试解析错误信息，如果解析失败则使用通用错误
        let errorMsg = '提交失败，请稍后再试。';
        try {
            const errorResult = await response.json();
            errorMsg = `Error: ${errorResult.error || errorMsg}`;
        } catch (e) {
            // 如果后端返回的不是JSON（比如404的HTML页面），这里会捕获异常
            errorMsg = `Error: 服务器返回了无效的响应 (状态码: ${response.status})。`;
        }
        // 直接抛出错误，让下面的catch块来处理所有错误情况
        throw new Error(errorMsg);
    }
    
    // 只有当 response.ok 为 true 时，才解析成功的JSON
    const result = await response.json();

    // 【修改点1】用 alert 替换 showToast
    alert(result.message || '反馈已成功提交！'); // 显示后端返回的成功消息
    feedbackInput.value = ''; // 清空输入框

} catch (error) {
    console.error('Failed to submit feedback:', error);
    // 【修改点2 & 3 合并】用 alert 替换 showToast，并显示更具体的错误信息
    alert(error.message || '提交失败，网络好像出问题了。'); // 显示我们自己或网络抛出的错误
} finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'SEND';
}
    });
}


// ===============================================
// =========== 7. 启动点 (ENTRY POINT) ============
// ===============================================


 function checkLoginStatus() {
    const token = localStorage.getItem('authToken');
    const username = localStorage.getItem('username');

    if (token && username) {
        // --- 用户已登录 ---
        authModalOverlay.classList.add('hidden'); // 隐藏登录框
        welcomeTitle.textContent = `欢迎, ${username}!`;
        welcomeBody.textContent = '您的课程助手已准备就绪。';
        welcomeCard.classList.remove('hidden'); // 显示欢迎卡
        updateUserStats(); 
        
        if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
            runApp(); // 这里的 runApp 已经包含了 loadInitialUserData
        } else {
            showUnsupportedBrowserWarning();
        }
        
        // 【【【 在这里调用我们的新函数！ 】】】
        // 因为此时用户已经确认登录，所以我们可以安全地初始化需要登录的功能。
        setupFeedbackSystem();

    } else {
        // --- 用户未登录 ---
        authModalOverlay.classList.remove('hidden'); // **显示登录框**
        welcomeCard.classList.add('hidden'); // 隐藏欢迎卡
        loginForm.classList.remove('hidden'); // 确保登录表单可见
        registerForm.classList.add('hidden'); // 确保注册表单隐藏
    }
}

    // --- 页面加载完毕后，立即检查登录状态 ---
    checkLoginStatus();

});

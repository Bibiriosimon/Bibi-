/* style.css - 整合了高度修复和气泡背景 */

/* === 全局与布局 === */
body {
  font-family: 'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif;
  margin: 0;
  background-color: #1a1a2e; /* 深色背景 */
  color: #e9f1f7;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  overflow-x: hidden; /* 防止水平滚动 */
}

/* [新增] 气泡背景容器 */
.background-bubbles {
  position: fixed; /* 固定定位，不随页面滚动 */
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh; /* 占满整个视口 */
  z-index: -1; /* 这是关键！把它放到所有内容的后面 */
  overflow: hidden; /* 防止气泡溢出导致滚动条 */
}

header {
  width: 100%;
  background-color: #0f3460;
  padding: 1rem 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
  display: flex;
  justify-content: center;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  width: 100%;
  max-width: 900px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
  color: #e9f1f7;
}

.logo span {
  color: #53a8b6;
}

/* [修改] 让 main 可以随内容变高 */
main {
  flex: 1;
  width: 100%;
  max-width: 900px;
  display: flex;
  flex-direction: column;
  padding: 2rem 0; /* 调整内边距 */
}

/* === 控件区域 === */
.controls {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.view-switcher, .session-controls {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  background-color: #1f4068;
  color: #e9f1f7;
}

.btn:hover {
  background-color: #2a558a;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.btn:disabled {
  background-color: #333;
  color: #888;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.btn.active-view {
  background-color: #53a8b6;
  color: #1a1a2e;
  font-weight: bold;
}

#controlBtn.active {
  background-color: #e43f5a;
}
#controlBtn.active:hover {
  background-color: #ff5772;
}
#pauseBtn.pausable:hover {
  background-color: #ffc107;
}
#pauseBtn.resumable {
  background-color: #28a745;
}
#pauseBtn.resumable:hover {
  background-color: #34c759;
}


/* === 视图容器 === */
/* 
 [修改] 移除固定高度和内部滚动，让其自然被内容撑开 
*/
.view-container {
  background-color: #16213e;
  border: 1px solid #0f3460;
  border-radius: 12px;
  padding: 1.5rem;
  color: #e9f1f7;
  min-height: 300px; /* 内容为空时的最小高度 */
  transition: background-color 0.3s ease;
}

/* ... 其他视图的样式 ... */
#noteView, #vocabView {
  display: none;
}

/* === 翻译与内容区域 === */
.live-content {
  font-size: 1.2rem;
  line-height: 1.8;
}
.live-content.listening {
  border-left: 3px solid #53a8b6;
  padding-left: 1rem;
}

.original-text, .translation-text {
  opacity: 0;
  transform: translateY(10px);
  transition: opacity 0.4s ease, transform 0.4s ease;
  margin: 0.5em 0;
}
.original-text.visible, .translation-text.visible {
  opacity: 1;
  transform: translateY(0);
}

.original-text .word {
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;
  padding: 2px 0;
  border-radius: 3px;
}
.original-text .word:hover {
  background-color: #53a8b6;
  color: #1a1a2e;
}
.translation-text {
  color: #8ade94; /* 醒目的绿色 */
  font-size: 1rem;
  margin-bottom: 1.5em; /* 增加段落间距 */
  padding-left: 1em;
  border-left: 2px solid #53a8b64d;
}

/* ... 其他所有样式，如弹窗、词汇卡片等 ... */

/* === 弹窗 === */
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s ease, visibility 0.3s ease;
}

/* ================================================= */
/* ============== 弹窗 (最终修复版) ================ */
/* ================================================= */

/* 1. 遮罩层样式 */
#popupOverlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    z-index: 1000;

    display: flex;
    justify-content: center;
    
    /* 【关键修改】从 center 改为 flex-start，让弹窗从顶部开始对齐 */
    align-items: flex-start;

    /* 我们需要让内容可以滚动，以防弹窗在小屏幕上超出范围 */
    overflow-y: auto;
    
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
    transition: opacity 0.3s ease, visibility 0s 0.3s;
}

/* 当遮罩层需要显示时 (这部分保持不变) */
#popupOverlay.visible {
    opacity: 1;
    visibility: visible;
    pointer-events: auto; /* 恢复点击事件 */
    transition: opacity 0.3s ease;
}

/* 2. 所有弹窗的通用样式 (这部分保持不变) */
/* 文件: style.css */

/* 2. 所有弹窗的通用样式 */
.popup {
    background-color: #1f2a4d;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
    width: 90%;
    max-width: 500px;
    border: 1px solid #53a8b6;

    /* 【关键修改】添加一个向下的外边距，把它从顶部推下来 */
    /* 您可以调整这个值，比如 15vh 或 100px */
    margin-top: -300px; 
    margin-bottom: 5vh; /* 同样给底部留些空间 */

    opacity: 0;
    /* 我们把 transform 改为只控制 scale，位置由 margin 控制 */
    transform: scale(0.95);
    transition: opacity 0.3s ease, transform 0.3s ease;
    
    display: none;
}


/* 当弹窗需要显示时 (这部分保持不变) */
.popup.visible {
    display: block; 
    opacity: 1;
    transform: scale(1);
}

/* 3. 弹窗内部通用样式 (这部分您的代码没问题，直接保留) */
.popup-actions {
  margin-top: 1.5rem;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}
.dict-entry .word-title { font-size: 1.8rem; font-weight: bold; color: #53a8b6; }
.dict-entry .word-phonetic { color: #a0a8b7; margin-bottom: 1rem; }
.dict-entry .meaning-block { margin-bottom: 1rem; border-left: 2px solid #53a8b6; padding-left: 1rem; }
.ai-definition { line-height: 1.7; }
#timeoutWarningPopup p { margin-bottom: 1.5rem; }



.popup-actions {
  margin-top: 1.5rem;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}
/* ... 字典、AI弹窗的具体样式 ... */
.dict-entry .word-title { font-size: 1.8rem; font-weight: bold; color: #53a8b6; }
.dict-entry .word-phonetic { color: #a0a8b7; margin-bottom: 1rem; }
.dict-entry .meaning-block { margin-bottom: 1rem; border-left: 2px solid #53a8b6; padding-left: 1rem; }
.ai-definition { line-height: 1.7; }
#timeoutWarningPopup p { margin-bottom: 1.5rem; }


/* === 笔记本 & 词汇本 === */
.note-entry, .vocab-card {
  background-color: #1a1a2e;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  border-left: 4px solid #53a8b6;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.note-entry:hover, .vocab-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.2);
}
/* ... 更多笔记本和词汇本的样式 ... */
.note-header { display: flex; justify-content: space-between; align-items: center; color: #a0a8b7; margin-bottom: 0.5rem; font-size: 0.9rem; }
.note-header.session-summary span { font-weight: bold; color: #53a8b6; }
.note-content { line-height: 1.6; }
.delete-note-btn { float: right; background: none; border: 1px solid #e43f5a; color: #e43f5a; border-radius: 4px; cursor: pointer; opacity: 0.5; transition: opacity 0.2s; }
.note-entry:hover .delete-note-btn { opacity: 1; }
.vocab-card .word { font-size: 1.5rem; font-weight: bold; }
.vocab-card .phonetic { color: #a0a8b7; }
.vocab-card .meaning { margin: 0.5rem 0; }
.vocab-card-actions { margin-top: 1rem; text-align: right; }
.star-btn, .mastered-btn { background: none; border: 1px solid #a0a8b7; color: #a0a8b7; margin-left: 0.5rem; }
.star-btn.starred { border-color: #ffc107; color: #ffc107; }

/* === 状态指示器 === */
#statusIndicator { display: none; align-items: center; gap: 0.5rem; }
#waveIndicator span { width: 4px; height: 16px; background-color: #53a8b6; border-radius: 2px; animation: wave 1.2s infinite ease-in-out; }
#waveIndicator span:nth-child(2) { animation-delay: -1.1s; }
#waveIndicator span:nth-child(3) { animation-delay: -1.0s; }
@keyframes wave { 0%, 40%, 100% { transform: scaleY(0.4); } 20% { transform: scaleY(1); } }
#pauseIndicator { width: 16px; height: 16px; border: 2px solid #ffc107; border-radius: 50%; display: flex; justify-content: center; align-items: center; }
#pauseIndicator::after { content: ''; width: 2px; height: 8px; background-color: #ffc107; }

/* === 不支持浏览器的警告信息 === */
.unsupported-browser-warning {
  text-align: center;
  padding: 2rem;
  background-color: #16213e;
  border: 1px solid #e43f5a;
  border-radius: 12px;
  margin-top: 2rem;
}

/* === 加载动画 (Loader) === */
.loader {
  width: 48px;
  height: 48px;
  border: 3px solid #FFF;
  border-radius: 50%;
  display: inline-block;
  position: relative;
  box-sizing: border-box;
  animation: rotation 1s linear infinite;
  margin: 1rem auto;
}
.loader::after {
  content: '';
  box-sizing: border-box;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 3px solid;
  border-color: #53a8b6 transparent;
}
@keyframes rotation {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}


/*
======================================================
=== [新增] 来自你提供的酷炫气泡动态背景 ===
======================================================
*/
.bubble {
position: absolute;
width: 200px;
height: 200px;
border-radius: 50%;
box-shadow: inset 0 0 25px rgba(255, 255, 255, 0.25);
animation: animate_4010 8s ease-in-out infinite;
}

.bubble:nth-child(2) {
position: relative;
zoom: 0.45;
left: -10px;
top: -100px;
animation-delay: -4s;
}

.bubble:nth-child(3) {
position: relative;
zoom: 0.45;
right: -80px;
top: -300px;
animation-delay: -6s;
}

.bubble:nth-child(4) {
position: relative;
zoom: 0.35;
left: -120px;
bottom: -200px;
animation-delay: -3s;
}

.bubble:nth-child(5) {
position: relative;
zoom: 0.5;
left: 0px;
top: 200px;
animation-delay: -5s;
}

@keyframes animate_4010 {
0%,100% {
  transform: translateY(-20px);
}

50% {
  transform: translateY(20px);
}
}

.bubble::before {
content: '';
position: absolute;
top: 50px;
left: 45px;
width: 30px;
height: 30px;
border-radius: 50%;
background: #fff;
z-index: 10;
filter: blur(2px);
}

.bubble::after {
content: '';
position: absolute;
top: 80px;
left: 80px;
width: 20px;
height: 20px;
border-radius: 50%;
background: #fff;
z-index: 10;
filter: blur(2px);
}

.bubble span {
position: absolute;
border-radius: 50%;
}

.bubble span:nth-child(1) {
inset: 10px;
border-left: 15px solid #0fb4ff;
filter: blur(8px);
}

.bubble span:nth-child(2) {
inset: 10px;
border-right: 15px solid #ff4484;
filter: blur(8px);
}

.bubble span:nth-child(3) {
inset: 10px;
border-top: 15px solid #ffeb3b;
filter: blur(8px);
}

.bubble span:nth-child(4) {
inset: 30px;
border-left: 15px solid #ff4484;
filter: blur(12px);
}

.bubble span:nth-child(5) {
inset: 10px;
border-bottom: 10px solid #fff;
filter: blur(8px);
transform: rotate(330deg);
}
/* 添加到你的 style.css 文件末尾 */

/* 临时识别文本的样式 (灰色) */
.original-text.interim,
.translation-text.interim {
  color: #6c7a97;
  opacity: 0.8;
}

/* AI 优化中的指示器样式 */
.ai-thinking-indicator {
  color: #53a8b6;
  font-size: 0.8em;
  margin-left: 8px;
  display: inline-block;
  animation: blink 1.5s infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

/* AI 优化完成后的翻译文本样式 */
.translation-text.ai-enhanced {
  color: #00ffff; /* 恢复更明亮的颜色 */
  /* 我们可以加一个微妙的背景高亮动画，表示它刚被更新 */
  animation: highlight 1s ease-out;
}

@keyframes highlight {
  from {
      background-color: rgba(83, 168, 182, 0.2);
  }
  to {
      background-color: transparent;
  }
}
/* style.css */

/* ================================== */
/* == 新增：自定义模态框样式 == */
/* ================================== */

/* 遮罩层：覆盖整个屏幕，半透明背景 */
.modal-overlay {
  position: fixed; /* 固定定位，不随页面滚动 */
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(18, 20, 38, 0.7); /* 半透明深色背景 */
  display: none; /* 默认隐藏 */
  justify-content: center;
  align-items: center;
  z-index: 1000; /* 确保在最顶层 */
  backdrop-filter: blur(5px); /* 毛玻璃效果 */
}

/* 模态框内容区域 */
.modal-content {
  background-color: #242847; /* 更深的背景色 */
  padding: 2.5rem;
  border-radius: 12px;
  border: 1px solid #4a558c;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  width: 90%;
  max-width: 450px;
  text-align: center;
  transform: scale(0.95);
  opacity: 0;
  transition: transform 0.3s ease, opacity 0.3s ease;
}

/* 当模态框显示时，内容框的动画效果 */
.modal-overlay.visible .modal-content {
  transform: scale(1);
  opacity: 1;
}

.modal-content h2 {
  margin-top: 0;
  margin-bottom: 0.5rem;
  color: #e0e5ff;
  font-size: 1.5rem;
}

.modal-content p {
  margin-bottom: 1.5rem;
  color: #a0a8b7;
  font-size: 0.95rem;
  line-height: 1.5;
}

/* 输入框样式 */
.modal-content input[type="text"] {
  width: 100%;
  padding: 12px;
  font-size: 1rem;
  border-radius: 6px;
  border: 1px solid #4a558c;
  background-color: #121426;
  color: #e0e5ff;
  box-sizing: border-box; /* 确保padding不会撑大宽度 */
  margin-bottom: 1.5rem;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.modal-content input[type="text"]:focus {
  outline: none;
  border-color: #8a99ff;
  box-shadow: 0 0 0 3px rgba(138, 153, 255, 0.25);
}

/* 按钮容器 */
.modal-actions {
  display: flex;
  justify-content: flex-end; /* 按钮靠右对齐 */
  gap: 1rem; /* 按钮之间的间距 */
}

/* 模态框内的按钮通用样式 */
.modal-actions button {
  padding: 10px 20px;
  font-size: 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.1s;
}

/* 次要按钮 (取消) */
.modal-actions .btn-secondary {
  background-color: transparent;
  border: 1px solid #4a558c;
  color: #a0a8b7;
}

.modal-actions .btn-secondary:hover {
  background-color: #313763;
}

/* 主要按钮 (确定) */
.modal-actions .btn-primary {
  background-color: #6c63ff; /* 主题色 */
  color: #fff;
}

.modal-actions .btn-primary:hover {
  background-color: #5850e0;
}

.modal-actions button:active {
  transform: scale(0.98);
}
/* ================================== */
/*        模式切换开关 (你的代码)         */

/* ... 这里粘贴你提供的所有开关CSS ... */
.toggle-cont .toggle-input { display: none; }
.toggle-cont .toggle-label { --gap: 5px; --width: 50px; cursor: pointer; position: relative; display: inline-block; padding: 0.5rem; width: calc((var(--width) + var(--gap)) * 2); height: 100%; background-color: var(--dark); border: 1px solid #777777; border-bottom: 0; border-radius: 9999px; box-sizing: content-box; transition: all 0.3s ease-in-out; }
.toggle-label::before { content: ""; position: absolute; z-index: -10; top: 50%; left: 50%; transform: translate(-50%, -50%); width: calc(100% + 1.5rem); height: calc(100% + 1.5rem); background-color: var(--gray); border: 1px solid #777777; border-bottom: 0; border-radius: 9999px; transition: all 0.3s ease-in-out; }
.toggle-label::after { content: ""; position: absolute; z-index: -10; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 100%; height: 100%; background-image: radial-gradient( circle at 50% -100%, rgb(58, 155, 252) 0%, rgba(12, 12, 12, 1) 80% ); border-radius: 9999px; }
.toggle-cont .toggle-label .cont-icon { position: relative; display: flex; justify-content: center; align-items: center; width: var(--width); height: 50px; background-image: radial-gradient( circle at 50% 0%, #666666 0%, var(--gray) 100% ); border: 1px solid #aaaaaa; border-bottom: 0; border-radius: 9999px; box-shadow: inset 0 -0.15rem 0.15rem var(--primary), inset 0 0 0.5rem 0.75rem var(--second); transition: transform 0.3s ease-in-out; }
.cont-icon { overflow: clip; position: relative; }
.cont-icon .sparkle { position: absolute; top: 50%; left: 50%; display: block; width: calc(var(--width) * 1px); aspect-ratio: 1; background-color: var(--light); border-radius: 50%; transform-origin: 50% 50%; rotate: calc(1deg * var(--deg)); transform: translate(-50%, -50%); animation: sparkle calc(100s / var(--duration)) linear calc(0s / var(--duration)) infinite; }
@keyframes sparkle { to { width: calc(var(--width) * 0.5px); transform: translate(2000%, -50%); } }
.cont-icon .icon { width: 1.1rem; fill: var(--light); }
.toggle-cont:has(.toggle-input:checked) { --checked: true; }
@container style(--checked: true) {
.toggle-cont .toggle-label { background-color: #41434400; border: 1px solid #3d6970; border-bottom: 0; }
.toggle-cont .toggle-label::before { box-shadow: 0 1rem 2.5rem -2rem #0080ff; }
.toggle-cont .toggle-label .cont-icon { overflow: visible; background-image: radial-gradient( circle at 50% 0%, #045ab1 0%, var(--primary) 100% ); border: 1px solid var(--primary); border-bottom: 0; transform: translateX(calc((var(--gap) * 2) + 100%)) rotate(-225deg); }
.toggle-cont .toggle-label .cont-icon .sparkle { z-index: -10; width: calc(var(--width) * 1.5px); background-color: #acacac; animation: sparkle calc(100s / var(--duration)) linear calc(10s / var(--duration)) infinite; }
@keyframes sparkle { to { width: calc(var(--width) * 1px); transform: translate(5000%, -50%); } }
}

/* ================================== */
/*        【新增】模式提示框样式         */
/* ================================== */
#mode-indicator {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 15px 30px;
  border-radius: 10px;
  font-size: 1.5em;
  font-weight: bold;
  z-index: 1000;
  opacity: 0; /* 默认隐藏 */
  pointer-events: none; /* 隐藏时不可点击 */
  transition: opacity 0.5s ease-in-out;
}

#mode-indicator.show {
  opacity: 1; /* 显示 */
}
/* ============================================== */
/*  【新增】模式切换开关 - 尺寸与定位 (覆盖旧样式)   */
/* ============================================== */

.toggle-cont {
  /* --- 定位 --- */
  position: fixed; /* 使用固定定位，使其始终在屏幕右上角 */
  top: 25px;       /* 距离浏览器顶部25px */
  right: 50px;     /* 距离浏览器右侧25px */
  z-index: 1100;   /* 设置一个较高的层级，确保在所有弹窗之上 */

  /* --- 尺寸调整 (缩小) --- */
  --width: 30px; /* 将圆形滑块的直径从 50px 减小到 30px */
  --gap: 3px;    /* 将滑块移动的间隙从 5px 减小到 3px */
  height: 35px;  /* 将开关整体高度从 50px 减小到 35px */
  margin-left: 0; /* 移除之前为了和按钮隔开的左边距 */
}

/* 同样需要缩小内部圆形滑块的高度 */
.toggle-cont .toggle-label .cont-icon {
  height: 35px; /* 与外部容器高度保持一致 */
}

/* 调整伪元素的大小，使其匹配新的尺寸 */
.toggle-label::before {
  width: calc(100% + 1rem); /* 缩小外发光环 */
  height: calc(100% + 1rem);
}
/* From Uiverse.io by 00Kubi */ 
.container {
/* --- 定位 --- */
position: fixed;   /* 使用固定定位，使其始终在屏幕右下角 */
bottom: 25px;      /* 距离浏览器底部25px */
right: 25px;       /* 距离浏览器右侧25px */
z-index: 999;      /* 层级低于弹窗(1000)和模式开关(1100)，避免遮挡 */

/* --- 尺寸 (来自你的代码) --- */
width: 190px;
height: 254px;
transition: 200ms;
}

.container:active {
width: 180px;
height: 245px;
}

#card {
position: absolute;
inset: 0;
z-index: 0;
display: flex;
justify-content: center;
align-items: center;
border-radius: 20px;
transition: 700ms;
background: linear-gradient(45deg, #1a1a1a, #262626);
border: 2px solid rgba(255, 255, 255, 0.1);
overflow: hidden;
box-shadow:
  0 0 20px rgba(0, 0, 0, 0.3),
  inset 0 0 20px rgba(0, 0, 0, 0.2);
}

.card-content {
position: relative;
width: 100%;
height: 100%;
}

#prompt {
bottom: 100px;
left: 50%;
transform: translateX(-50%);
z-index: 20;
font-size: 16px;
font-weight: 600;
letter-spacing: 2px;
transition: 300ms ease-in-out;
position: absolute;
text-align: center;
color: rgba(255, 255, 255, 0.7);
text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
}

.title {
opacity: 0;
transition: 300ms ease-in-out;
position: absolute;
font-size: 28px;
font-weight: 800;
letter-spacing: 4px;
text-align: center;
width: 100%;
padding-top: 20px;
background: linear-gradient(45deg, #00ffaa, #00a2ff);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
filter: drop-shadow(0 0 15px rgba(0, 255, 170, 0.3));
text-shadow:
  0 0 10px rgba(92, 103, 255, 0.5),
  0 0 20px rgba(92, 103, 255, 0.3);
}

.subtitle {
position: absolute;
bottom: 40px;
width: 100%;
text-align: center;
font-size: 12px;
letter-spacing: 2px;
transform: translateY(30px);
color: rgba(255, 255, 255, 0.6);
}

.highlight {
color: #00ffaa;
margin-left: 5px;
background: linear-gradient(90deg, #5c67ff, #ad51ff);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
font-weight: bold;
}

.glowing-elements {
position: absolute;
inset: 0;
pointer-events: none;
}

.glow-1,
.glow-2,
.glow-3 {
position: absolute;
width: 100px;
height: 100px;
border-radius: 50%;
background: radial-gradient(
  circle at center,
  rgba(0, 255, 170, 0.3) 0%,
  rgba(0, 255, 170, 0) 70%
);
filter: blur(15px);
opacity: 0;
transition: opacity 0.3s ease;
}

.glow-1 {
top: -20px;
left: -20px;
}
.glow-2 {
top: 50%;
right: -30px;
transform: translateY(-50%);
}
.glow-3 {
bottom: -20px;
left: 30%;
}

.card-particles span {
position: absolute;
width: 3px;
height: 3px;
background: #00ffaa;
border-radius: 50%;
opacity: 0;
transition: opacity 0.3s ease;
}

/* Hover effects */
.tracker:hover ~ #card .title {
opacity: 1;
transform: translateY(-10px);
}

.tracker:hover ~ #card .glowing-elements div {
opacity: 1;
}

.tracker:hover ~ #card .card-particles span {
animation: particleFloat 2s infinite;
}

@keyframes particleFloat {
0% {
  transform: translate(0, 0);
  opacity: 0;
}
50% {
  opacity: 1;
}
100% {
  transform: translate(calc(var(--x, 0) * 30px), calc(var(--y, 0) * 30px));
  opacity: 0;
}
}

/* Particle positions */
.card-particles span:nth-child(1) {
--x: 1;
--y: -1;
top: 40%;
left: 20%;
}
.card-particles span:nth-child(2) {
--x: -1;
--y: -1;
top: 60%;
right: 20%;
}
.card-particles span:nth-child(3) {
--x: 0.5;
--y: 1;
top: 20%;
left: 40%;
}
.card-particles span:nth-child(4) {
--x: -0.5;
--y: 1;
top: 80%;
right: 40%;
}
.card-particles span:nth-child(5) {
--x: 1;
--y: 0.5;
top: 30%;
left: 60%;
}
.card-particles span:nth-child(6) {
--x: -1;
--y: 0.5;
top: 70%;
right: 60%;
}

#card::before {
content: "";
background: radial-gradient(
  circle at center,
  rgba(0, 255, 170, 0.1) 0%,
  rgba(0, 162, 255, 0.05) 50%,
  transparent 100%
);
filter: blur(20px);
opacity: 0;
width: 150%;
height: 150%;
position: absolute;
left: 50%;
top: 50%;
transform: translate(-50%, -50%);
transition: opacity 0.3s ease;
}

.tracker:hover ~ #card::before {
opacity: 1;
}

.tracker {
position: absolute;
z-index: 200;
width: 100%;
height: 100%;
}

.tracker:hover {
cursor: pointer;
}

.tracker:hover ~ #card #prompt {
opacity: 0;
}

.tracker:hover ~ #card {
transition: 300ms;
filter: brightness(1.1);
}

.container:hover #card::before {
transition: 200ms;
content: "";
opacity: 80%;
}

.canvas {
perspective: 800px;
inset: 0;
z-index: 200;
position: absolute;
display: grid;
grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
grid-template-rows: 1fr 1fr 1fr 1fr 1fr;
gap: 0px 0px;
grid-template-areas:
  "tr-1 tr-2 tr-3 tr-4 tr-5"
  "tr-6 tr-7 tr-8 tr-9 tr-10"
  "tr-11 tr-12 tr-13 tr-14 tr-15"
  "tr-16 tr-17 tr-18 tr-19 tr-20"
  "tr-21 tr-22 tr-23 tr-24 tr-25";
}

.tr-1 {
grid-area: tr-1;
}

.tr-2 {
grid-area: tr-2;
}

.tr-3 {
grid-area: tr-3;
}

.tr-4 {
grid-area: tr-4;
}

.tr-5 {
grid-area: tr-5;
}

.tr-6 {
grid-area: tr-6;
}

.tr-7 {
grid-area: tr-7;
}

.tr-8 {
grid-area: tr-8;
}

.tr-9 {
grid-area: tr-9;
}

.tr-10 {
grid-area: tr-10;
}

.tr-11 {
grid-area: tr-11;
}

.tr-12 {
grid-area: tr-12;
}

.tr-13 {
grid-area: tr-13;
}

.tr-14 {
grid-area: tr-14;
}

.tr-15 {
grid-area: tr-15;
}

.tr-16 {
grid-area: tr-16;
}

.tr-17 {
grid-area: tr-17;
}

.tr-18 {
grid-area: tr-18;
}

.tr-19 {
grid-area: tr-19;
}

.tr-20 {
grid-area: tr-20;
}

.tr-21 {
grid-area: tr-21;
}

.tr-22 {
grid-area: tr-22;
}

.tr-23 {
grid-area: tr-23;
}

.tr-24 {
grid-area: tr-24;
}

.tr-25 {
grid-area: tr-25;
}

.tr-1:hover ~ #card {
transition: 125ms ease-in-out;
transform: rotateX(20deg) rotateY(-10deg) rotateZ(0deg);
}

.tr-2:hover ~ #card {
transition: 125ms ease-in-out;
transform: rotateX(20deg) rotateY(-5deg) rotateZ(0deg);
}

.tr-3:hover ~ #card {
transition: 125ms ease-in-out;
transform: rotateX(20deg) rotateY(0deg) rotateZ(0deg);
}

.tr-4:hover ~ #card {
transition: 125ms ease-in-out;
transform: rotateX(20deg) rotateY(5deg) rotateZ(0deg);
}

.tr-5:hover ~ #card {
transition: 125ms ease-in-out;
transform: rotateX(20deg) rotateY(10deg) rotateZ(0deg);
}

.tr-6:hover ~ #card {
transition: 125ms ease-in-out;
transform: rotateX(10deg) rotateY(-10deg) rotateZ(0deg);
}

.tr-7:hover ~ #card {
transition: 125ms ease-in-out;
transform: rotateX(10deg) rotateY(-5deg) rotateZ(0deg);
}

.tr-8:hover ~ #card {
transition: 125ms ease-in-out;
transform: rotateX(10deg) rotateY(0deg) rotateZ(0deg);
}

.tr-9:hover ~ #card {
transition: 125ms ease-in-out;
transform: rotateX(10deg) rotateY(5deg) rotateZ(0deg);
}

.tr-10:hover ~ #card {
transition: 125ms ease-in-out;
transform: rotateX(10deg) rotateY(10deg) rotateZ(0deg);
}

.tr-11:hover ~ #card {
transition: 125ms ease-in-out;
transform: rotateX(0deg) rotateY(-10deg) rotateZ(0deg);
}

.tr-12:hover ~ #card {
transition: 125ms ease-in-out;
transform: rotateX(0deg) rotateY(-5deg) rotateZ(0deg);
}

.tr-13:hover ~ #card {
transition: 125ms ease-in-out;
transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg);
}

.tr-14:hover ~ #card {
transition: 125ms ease-in-out;
transform: rotateX(0deg) rotateY(5deg) rotateZ(0deg);
}

.tr-15:hover ~ #card {
transition: 125ms ease-in-out;
transform: rotateX(0deg) rotateY(10deg) rotateZ(0deg);
}

.tr-16:hover ~ #card {
transition: 125ms ease-in-out;
transform: rotateX(-10deg) rotateY(-10deg) rotateZ(0deg);
}

.tr-17:hover ~ #card {
transition: 125ms ease-in-out;
transform: rotateX(-10deg) rotateY(-5deg) rotateZ(0deg);
}

.tr-18:hover ~ #card {
transition: 125ms ease-in-out;
transform: rotateX(-10deg) rotateY(0deg) rotateZ(0deg);
}

.tr-19:hover ~ #card {
transition: 125ms ease-in-out;
transform: rotateX(-10deg) rotateY(5deg) rotateZ(0deg);
}

.tr-20:hover ~ #card {
transition: 125ms ease-in-out;
transform: rotateX(-10deg) rotateY(10deg) rotateZ(0deg);
}

.tr-21:hover ~ #card {
transition: 125ms ease-in-out;
transform: rotateX(-20deg) rotateY(-10deg) rotateZ(0deg);
}

.tr-22:hover ~ #card {
transition: 125ms ease-in-out;
transform: rotateX(-20deg) rotateY(-5deg) rotateZ(0deg);
}

.tr-23:hover ~ #card {
transition: 125ms ease-in-out;
transform: rotateX(-20deg) rotateY(0deg) rotateZ(0deg);
}

.tr-24:hover ~ #card {
transition: 125ms ease-in-out;
transform: rotateX(-20deg) rotateY(5deg) rotateZ(0deg);
}

.tr-25:hover ~ #card {
transition: 125ms ease-in-out;
transform: rotateX(-20deg) rotateY(10deg) rotateZ(0deg);
}

.noselect {
-webkit-touch-callout: none;
/* iOS Safari */
-webkit-user-select: none;
/* Safari */
/* Konqueror HTML */
-moz-user-select: none;
/* Old versions of Firefox */
-ms-user-select: none;
/* Internet Explorer/Edge */
user-select: none;
/* Non-prefixed version, currently
                supported by Chrome, Edge, Opera and Firefox */
}

.card-glare {
position: absolute;
inset: 0;
background: linear-gradient(
  125deg,
  rgba(255, 255, 255, 0) 0%,
  rgba(255, 255, 255, 0.05) 45%,
  rgba(255, 255, 255, 0.1) 50%,
  rgba(255, 255, 255, 0.05) 55%,
  rgba(255, 255, 255, 0) 100%
);
opacity: 0;
transition: opacity 300ms;
}

.cyber-lines span {
position: absolute;
background: linear-gradient(
  90deg,
  transparent,
  rgba(92, 103, 255, 0.2),
  transparent
);
}

.cyber-lines span:nth-child(1) {
top: 20%;
left: 0;
width: 100%;
height: 1px;
transform: scaleX(0);
transform-origin: left;
animation: lineGrow 3s linear infinite;
}

.cyber-lines span:nth-child(2) {
top: 40%;
right: 0;
width: 100%;
height: 1px;
transform: scaleX(0);
transform-origin: right;
animation: lineGrow 3s linear infinite 1s;
}

.cyber-lines span:nth-child(3) {
top: 60%;
left: 0;
width: 100%;
height: 1px;
transform: scaleX(0);
transform-origin: left;
animation: lineGrow 3s linear infinite 2s;
}

.cyber-lines span:nth-child(4) {
top: 80%;
right: 0;
width: 100%;
height: 1px;
transform: scaleX(0);
transform-origin: right;
animation: lineGrow 3s linear infinite 1.5s;
}

.corner-elements span {
position: absolute;
width: 15px;
height: 15px;
border: 2px solid rgba(92, 103, 255, 0.3);
}

.corner-elements span:nth-child(1) {
top: 10px;
left: 10px;
border-right: 0;
border-bottom: 0;
}

.corner-elements span:nth-child(2) {
top: 10px;
right: 10px;
border-left: 0;
border-bottom: 0;
}

.corner-elements span:nth-child(3) {
bottom: 10px;
left: 10px;
border-right: 0;
border-top: 0;
}

.corner-elements span:nth-child(4) {
bottom: 10px;
right: 10px;
border-left: 0;
border-top: 0;
}

.scan-line {
position: absolute;
inset: 0;
background: linear-gradient(
  to bottom,
  transparent,
  rgba(92, 103, 255, 0.1),
  transparent
);
transform: translateY(-100%);
animation: scanMove 2s linear infinite;
}

@keyframes lineGrow {
0% {
  transform: scaleX(0);
  opacity: 0;
}
50% {
  transform: scaleX(1);
  opacity: 1;
}
100% {
  transform: scaleX(0);
  opacity: 0;
}
}

@keyframes scanMove {
0% {
  transform: translateY(-100%);
}
100% {
  transform: translateY(100%);
}
}

/* Modyfikacja istniejących styli */
#card:hover .card-glare {
opacity: 1;
}

.corner-elements span {
transition: all 0.3s ease;
}

#card:hover .corner-elements span {
border-color: rgba(92, 103, 255, 0.8);
box-shadow: 0 0 10px rgba(92, 103, 255, 0.5);
}
/* ✨ 新增：加载动画的遮罩层和样式 */
.spinner-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(20, 24, 33, 0.7); /* 半透明背景 */
  display: none; /* 默认隐藏 */
  justify-content: center;
  align-items: center;
  flex-direction: column; /* 让文字在图标下方 */
  z-index: 2000; /* 确保在最顶层 */
  backdrop-filter: blur(5px); /* 毛玻璃效果 */
}

#spinnerMessage {
  color: #e0e0e0;
  margin-top: 25px;
  font-size: 1.1em;
  font-weight: 500;
}

/* 这是你提供的 spinner 样式，无需修改 */
.spinner {
  width: 44px;
  height: 44px;
  animation: spinner-y0fdc1 2s infinite ease;
  transform-style: preserve-3d;
}

.spinner > div {
  background-color: rgba(0, 77, 255, 0.2);
  height: 100%;
  position: absolute;
  width: 100%;
  border: 2px solid #004dff;
}

.spinner div:nth-of-type(1) {
  transform: translateZ(-22px) rotateY(180deg);
}

.spinner div:nth-of-type(2) {
  transform: rotateY(-270deg) translateX(50%);
  transform-origin: top right;
}

.spinner div:nth-of-type(3) {
  transform: rotateY(270deg) translateX(-50%);
  transform-origin: center left;
}

.spinner div:nth-of-type(4) {
  transform: rotateX(90deg) translateY(-50%);
  transform-origin: top center;
}

.spinner div:nth-of-type(5) {
  transform: rotateX(-90deg) translateY(50%);
  transform-origin: bottom center;
}

.spinner div:nth-of-type(6) {
  transform: translateZ(22px);
}

@keyframes spinner-y0fdc1 {
  0% {
      transform: rotate(45deg) rotateX(-25deg) rotateY(25deg);
  }

  50% {
      transform: rotate(45deg) rotateX(-385deg) rotateY(25deg);
  }

  100% {
      transform: rotate(45deg) rotateX(-385deg) rotateY(385deg);
  }
}
/* --- 笔记生成按钮的加载动画 --- */
.note-btn-loading .loader-wrapper {
position: relative;
display: flex;
align-items: center;
justify-content: center;
/* 调整尺寸和字体大小以适应按钮 */
font-family: "Poppins", sans-serif;
font-size: 0.8em; /* 缩小字体 */
font-weight: 600;
user-select: none;
color: #fff;
/* 关键：大幅缩小动画以适应按钮大小 */
transform: scale(0.25); 
/* 确保它不会撑开按钮 */
height: 100%;
width: 100%;
margin: 0;
padding: 0;
box-sizing: border-box;
}

/* 移除按钮的内边距，以便动画完全填充 */
.note-btn-loading {
padding: 0 !important;
overflow: hidden; /* 防止动画溢出 */
}

.note-btn-loading .loader {
position: absolute;
top: 0;
left: 0;
height: 100%;
width: 100%;
z-index: 1;

background-color: transparent;
mask: repeating-linear-gradient(
  90deg,
  transparent 0,
  transparent 6px,
  black 7px,
  black 8px
);
}

.note-btn-loading .loader::after {
content: "";
position: absolute;
top: 0;
left: 0;
width: 100%;
height: 100%;
background-image: radial-gradient(circle at 50% 50%, #ff0 0%, transparent 50%),
  radial-gradient(circle at 45% 45%, #f00 0%, transparent 45%),
  radial-gradient(circle at 55% 55%, #0ff 0%, transparent 45%),
  radial-gradient(circle at 45% 55%, #0f0 0%, transparent 45%),
  radial-gradient(circle at 55% 45%, #00f 0%, transparent 45%);
mask: radial-gradient(
  circle at 50% 50%,
  transparent 0%,
  transparent 10%,
  black 25%
);
animation:
  transform-animation 2s infinite alternate,
  opacity-animation 4s infinite;
animation-timing-function: cubic-bezier(0.6, 0.8, 0.5, 1);
}

@keyframes transform-animation {
0% { transform: translate(-55%); }
100% { transform: translate(55%); }
}

@keyframes opacity-animation {
0%, 100% { opacity: 0; }
15% { opacity: 1; }
65% { opacity: 0; }
}

.note-btn-loading .loader-letter {
display: inline-block;
opacity: 0;
animation: loader-letter-anim 4s infinite linear;
z-index: 2;
}

/* (这里省略了所有 :nth-child 的 animation-delay，因为它们和您提供的一样) */
.note-btn-loading .loader-letter:nth-child(1) { animation-delay: 0.1s; }
.note-btn-loading .loader-letter:nth-child(2) { animation-delay: 0.205s; }
.note-btn-loading .loader-letter:nth-child(3) { animation-delay: 0.31s; }
.note-btn-loading .loader-letter:nth-child(4) { animation-delay: 0.415s; }
.note-btn-loading .loader-letter:nth-child(5) { animation-delay: 0.521s; }
.note-btn-loading .loader-letter:nth-child(6) { animation-delay: 0.626s; }
.note-btn-loading .loader-letter:nth-child(7) { animation-delay: 0.731s; }
.note-btn-loading .loader-letter:nth-child(8) { animation-delay: 0.837s; }
.note-btn-loading .loader-letter:nth-child(9) { animation-delay: 0.942s; }
.note-btn-loading .loader-letter:nth-child(10) { animation-delay: 1.047s; }


@keyframes loader-letter-anim {
0% { opacity: 0; }
5% { opacity: 1; text-shadow: 0 0 4px #fff; transform: scale(1.1) translateY(-2px); }
20% { opacity: 0.2; }
100% { opacity: 0; }
}
/* --- 用这个新版本替换 --- */
.note-btn-loading .loader-wrapper {
position: relative;
display: none;
display: flex;
align-items: center;
justify-content: center;
font-family: "Poppins", sans-serif;
font-size: 0.8em;
font-weight: 600;
user-select: none;
color: #fff;
/* ✅ 将 scale 从 0.45 调大到 0.6，让整个动画（包括文字）更大 */
transform: scale(0.8);
height: 100%;
width: 100%;
margin: 0;
padding: 0;
box-sizing: border-box;
}
/* =================================================================== */
/* ============== 【新增】登录/注册模态框专属样式 ============== */
/* =================================================================== */

/* 
  关键样式：当需要显示登录框时，给 <body> 添加这个类，
  它会模糊主应用内容，但不会影响登录框本身。
*/
body.auth-active > header,
body.auth-active > main,
body.auth-active > .toggle-cont,
body.auth-active > .container.noselect {
    filter: blur(8px);
    -webkit-filter: blur(8px); /* 兼容性 */
    pointer-events: none;
    user-select: none;
}

/* 登录/注册模态框的遮罩层 */
#auth-modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(10, 15, 30, 0.5); /* 半透明背景 */
    backdrop-filter: blur(8px); /* 背景模糊效果 (已被上面的 body.auth-active 替代，但保留以备用) */
    -webkit-backdrop-filter: blur(8px);
    display: flex; /* 使用 Flexbox 实现垂直水平居中 */
    justify-content: center;
    align-items: center;
    z-index: 1100; /* 设置一个非常高的层级，确保在最顶层 */
    opacity: 0;
    transition: opacity 0.3s ease-in-out;
    pointer-events: none; /* 隐藏时不可点击 */
}

/* 当登录框可见时 (移除 .hidden 类时) */
#auth-modal-overlay:not(.hidden) {
    opacity: 1;
    pointer-events: auto; /* 可见时恢复点击事件 */
}

/* 登录/注册表单的容器 */
.auth-box {
    background: rgba(20, 28, 58, 0.9);
    padding: 40px;
    border-radius: 15px;
    border: 1px solid #3a4a9c;
    box-shadow: 0 0 30px rgba(58, 74, 156, 0.6);
    width: 90%;
    max-width: 400px;
    text-align: center;
}

/* 登录框内的 Logo */
.logo-auth {
    font-size: 2em;
    font-weight: 700;
    color: #f0f0f0;
    margin-bottom: 25px;
}

.logo-auth span {
    color: #6c7dff;
    font-weight: 400;
}

/* 表单本身的布局 */
.auth-form {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

/* "还没有账户？" / "已有账户？" 的切换链接 */
.form-switcher {
    margin-top: 20px;
    color: #a0a8b7;
    font-size: 0.9em;
}

.form-switcher a {
    color: #45f3ff;
    text-decoration: none;
    font-weight: 500;
}
.form-switcher a:hover {
    text-decoration: underline;
}

/* 成功/错误消息提示区域 */
.message-area {
    padding: 10px;
    border-radius: 5px;
    font-weight: 500;
    min-height: 40px; /* 避免消息出现/消失时布局跳动 */
    box-sizing: border-box;
    transition: all 0.3s ease;
}
.message-area.success {
    background-color: rgba(45, 201, 133, 0.2);
    color: #2dc985;
}
.message-area.error {
    background-color: rgba(224, 72, 89, 0.2);
    color: #e04859;
}

/* 动态输入框容器 */
.inputbox {
  position: relative;
  width: 100%; 
}

/* 输入框本身 */
.inputbox input {
  position: relative;
  width: 100%;
  padding: 20px 10px 10px;
  background: transparent;
  outline: none;
  box-shadow: none;
  border: none;
  color: #ffffff; /* 确保输入文字是白色 */
  font-size: 1em;
  letter-spacing: 0.05em;
  transition: 0.5s;
  z-index: 10;
  box-sizing: border-box;
}

/* 输入框的占位文字 (Label) */
.inputbox span {
  position: absolute;
  left: 0;
  padding: 20px 10px 10px; /* 调整padding使其与输入框对齐 */
  font-size: 1em;
  color: #8f8f8f;
  letter-spacing: 0.05em;
  transition: 0.5s;
  pointer-events: none;
}

/* 核心动画：当输入框被聚焦或有内容时 */
.inputbox input:valid ~ span,
.inputbox input:focus ~ span {
  color: #45f3ff;
  transform: translateX(0px) translateY(-34px);
  font-size: 0.75em;
}

/* 输入框下方的动态线条 */
.inputbox i {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 2px;
  background: #45f3ff;
  border-radius: 4px;
  transition: 0.5s;
  pointer-events: none;
  z-index: 9;
}

/* 核心动画：当输入框被聚焦或有内容时，线条扩展成背景 */
.inputbox input:valid ~ i,
.inputbox input:focus ~ i {
  height: 44px; /* 高度和输入框差不多，形成背景高亮效果 */
}

/* 通用的隐藏类，确保 !important 能覆盖所有其他 display 样式 */
.hidden {
    display: none !important;
}
/* =================================================================== */
/* ============= 【新增/替换】模式切换开关 V2 (新样式) ============== */
/* =================================================================== */

/* 1. 开关的定位容器 */
.mode-switch-container {
  position: fixed; /* 固定定位，不随页面滚动 */
  top: 20px;       /* 距离顶部20px */
  right: 40px;     /* 距离右侧40px */
  z-index: 101;    /* 层级要高于header(100) */
}

/* 2. 你提供的新开关核心样式 */
.checkbox-wrapper-5 .check {
  --size: 40px;
  position: relative;
  background: linear-gradient(90deg, #f19af3, #f099b5);
  line-height: 0;
  perspective: 400px;
  font-size: var(--size);
}

.checkbox-wrapper-5 .check input[type="checkbox"],
  .checkbox-wrapper-5 .check label,
  .checkbox-wrapper-5 .check label::before,
  .checkbox-wrapper-5 .check label::after,
  .checkbox-wrapper-5 .check {
  appearance: none;
  display: inline-block;
  border-radius: var(--size);
  border: 0;
  transition: .35s ease-in-out;
  box-sizing: border-box;
  cursor: pointer;
}

.checkbox-wrapper-5 .check label {
  width: calc(2.2 * var(--size));
  height: var(--size);
  background: #d7d7d7;
  overflow: hidden;
}

.checkbox-wrapper-5 .check input[type="checkbox"] {
  position: absolute;
  z-index: 1;
  width: calc(.8 * var(--size));
  height: calc(.8 * var(--size));
  top: calc(.1 * var(--size));
  left: calc(.1 * var(--size));
  background: linear-gradient(45deg, #dedede, #ffffff);
  box-shadow: 0 6px 7px rgba(0,0,0,0.3);
  outline: none;
  margin: 0;
}

.checkbox-wrapper-5 .check input[type="checkbox"]:checked {
  left: calc(1.3 * var(--size));
}

.checkbox-wrapper-5 .check input[type="checkbox"]:checked + label {
  background: transparent;
}

.checkbox-wrapper-5 .check label::before,
  .checkbox-wrapper-5 .check label::after {
  content: "· ·";
  position: absolute;
  overflow: hidden;
  left: calc(.15 * var(--size));
  top: calc(.5 * var(--size));
  height: var(--size);
  letter-spacing: calc(-0.04 * var(--size));
  color: #9b9b9b;
  font-family: "Times New Roman", serif;
  z-index: 2;
  font-size: calc(.6 * var(--size));
  border-radius: 0;
  transform-origin: 0 0 calc(-0.5 * var(--size));
  backface-visibility: hidden;
}

.checkbox-wrapper-5 .check label::after {
  content: "●";
  top: calc(.65 * var(--size));
  left: calc(.2 * var(--size));
  height: calc(.1 * var(--size));
  width: calc(.35 * var(--size));
  font-size: calc(.2 * var(--size));
  transform-origin: 0 0 calc(-0.4 * var(--size));
}

.checkbox-wrapper-5 .check input[type="checkbox"]:checked + label::before,
  .checkbox-wrapper-5 .check input[type="checkbox"]:checked + label::after {
  left: calc(1.55 * var(--size));
  top: calc(.4 * var(--size));
  line-height: calc(.1 * var(--size));
  transform: rotateY(360deg);
}

.checkbox-wrapper-5 .check input[type="checkbox"]:checked + label::after {
  height: calc(.16 * var(--size));
  top: calc(.55 * var(--size));
  left: calc(1.6 * var(--size));
  font-size: calc(.6 * var(--size));
  line-height: 0;
}
/* =================================================================== */
/* ============= 【新增】认证加载动画样式 ============== */
/* =================================================================== */

/* 1. 加载动画的容器 (用于居中和显示/隐藏) */
.loader-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(20, 28, 58, 0.85); /* 半透明遮罩，覆盖在表单上 */
  display: flex; /* 使用 flex 居中 */
  justify-content: center;
  align-items: center;
  z-index: 10;
  border-radius: 15px; /* 匹配 auth-box 的圆角 */
}

/* 2. 您提供的加载动画核心样式 */
.loader {
  width: 112px;
  height: 112px;
  /* 添加 transform 让它在容器里看起来更居中 */
  transform: scale(0.7);
}

.box1,
.box2,
.box3 {
  border: 16px solid #f5f5f5;
  box-sizing: border-box;
  position: absolute;
  display: block;
}

.box1 {
  width: 112px;
  height: 48px;
  margin-top: 64px;
  margin-left: 0px;
  animation: abox1 4s 1s forwards ease-in-out infinite;
}

.box2 {
  width: 48px;
  height: 48px;
  margin-top: 0px;
  margin-left: 0px;
  animation: abox2 4s 1s forwards ease-in-out infinite;
}

.box3 {
  width: 48px;
  height: 48px;
  margin-top: 0px;
  margin-left: 64px;
  animation: abox3 4s 1s forwards ease-in-out infinite;
}

/* 3. 您提供的 Keyframes 动画 (无需修改) */
@keyframes abox1 { /* ... 您的 keyframes 代码 ... */ }
@keyframes abox2 { /* ... 您的 keyframes 代码 ... */ }
@keyframes abox3 { /* ... 您的 keyframes 代码 ... */ }
/* =================================================================== */
/* ============= 【新增】欢迎卡片UI样式 ============== */
/* =================================================================== */

/* 1. 您提供的卡片核心样式 */
.notification {
  display: flex;
  flex-direction: column;
  isolation: isolate;
  position: relative;
  /* 尺寸微调以适应header */
  width: 8rem; 
  height: 2rem; 
  background: #29292c;
  border-radius: 1rem;
  overflow: hidden;
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
  font-size: 16px;
  --gradient: linear-gradient(to bottom, #2eadff, #3d83ff, #7e61ff);
  --color: #32a6ff;
  /* 添加 flex 属性使其在 header 中对齐 */
  justify-content: center; 
}
/* ... (此处粘贴您提供的所有 .notification, .notititle, .notibody, .notiglow 等样式) ... */
.notification {
  display: flex;
  flex-direction: column;
  isolation: isolate;
  position: relative;
  /* 【修改】尺寸已调小 */
  width: 12rem;
  height: 3rem;
  background: #29292c;
  border-radius: 1rem;
  overflow: hidden;
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
  font-size: 12px; /* 字体大小保持不变 */
  --gradient: linear-gradient(to bottom, #2eadff, #3d83ff, #7e61ff);
  --color: #32a6ff;
  justify-content: center;
}

/* 2. 卡片背景和边框效果 */
.notification:before {
  position: absolute;
  content: "";
  inset: 0.0625rem;
  border-radius: 0.9375rem;
  background: #18181b;
  z-index: 2;
}

.notification:after {
  position: absolute;
  content: "";
  width: 0.25rem;
  inset: 0.65rem auto 0.65rem 0.5rem;
  border-radius: 0.125rem;
  background: var(--gradient);
  transition: transform 300ms ease;
  z-index: 4;
}

.notification:hover:after {
  transform: translateX(0.15rem);
}

/* 3. 卡片标题 (内边距已减少) */
.notititle {
  color: var(--color);
  /* 【修改】内边距已减少以适应新尺寸 */
  padding: 0.4rem 0.25rem 0.2rem 1.25rem;
  font-weight: 500;
  font-size: 1.1rem; /* 字体大小保持不变 */
  transition: transform 300ms ease;
  z-index: 5;
}

.notification:hover .notititle {
  transform: translateX(0.15rem);
}

/* 4. 卡片正文 (内边距已减少) */
.notibody {
  color: #99999d;
  /* 【修改】内边距已减少以适应新尺寸 */
  padding: 0 1rem;
  transition: transform 300ms ease;
  z-index: 5;
}

.notification:hover .notibody {
  transform: translateX(0.25rem);
}

/* 5. 卡片光晕效果 */
.notiglow,
.notiborderglow {
  position: absolute;
  width: 20rem;
  height: 20rem;
  transform: translate(-50%, -50%);
  background: radial-gradient(circle closest-side at center, white, transparent);
  opacity: 0;
  transition: opacity 300ms ease;
}

.notiglow {
  z-index: 3;
}

.notiborderglow {
  z-index: 1;
}

.notification:hover .notiglow {
  opacity: 0.1;
}

.notification:hover .notiborderglow {
  opacity: 0.1;
}


/* 2. 【新增微调】用于整合退出按钮 */
#logout-button.btn-secondary {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    z-index: 6; /* 确保在标题等元素之上 */
    padding: 0.2rem 0.6rem;
    font-size: 0.8rem;
    background-color: #3a3a40;
    border: 1px solid #555;
    border-radius: 6px;
    color: #ccc;
}

#logout-button.btn-secondary:hover {
    background-color: #e43f5a;
    color: white;
}
#welcome-card {
    margin-right: -20rem; /*  <-- 您可以调整这个值，比如 0.5rem 或 2rem */
}
.auth-message {
    padding: 10px;
    margin-bottom: 15px;
    border-radius: 5px;
    text-align: center;
}
.auth-message.hidden {
    display: none;
}
.auth-message.success {
    background-color: #d4edda;
    color: #155724;
    border: 1px solid #c3e6cb;
}
.auth-message.error {
    background-color: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb;
}
/* ==================
   模式指示器样式 (BB-8也需要它)
   ================== */
#mode-indicator {
    position: fixed;
    bottom: 120px;  /* 向上移动一点，避免挡住BB-8 */
    right: 30px;
    background-color: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 8px 15px;
    border-radius: 8px;
    font-size: 14px;
    z-index: 1001;
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.3s, transform 0.3s;
    pointer-events: none;
}

#mode-indicator.show {
    opacity: 1;
    transform: translateY(0);
}

/* 把BB-8开关也定位到右下角 */
.bb8-toggle {
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 1000;
}
/* ==================
   模式指示器样式 (居中版本)
   ================== */
#mode-indicator {
    position: fixed; /* 保持固定定位 */
    z-index: 2000;   /* 确保在所有元素之上 */
    
    /* 【关键修改】定位到屏幕中心 */
    left: 50%;
    top: 50%;
    
    /* 【关键修改】结合居中和动画 */
    /* 先用 translate(-50%, -50%) 把它完美居中, 
       再用 translateY(20px) 把它向下移动一点，作为动画的起始位置 */
    transform: translate(-50%, -50%) translateY(20px);

    /* 【可选】美化一下，让它更像一个模态框 */
    background-color: rgba(20, 25, 40, 0.9); /* 深邃的背景色 */
    color: #e0eAFC;                         /* 柔和的文字颜色 */
    padding: 20px 35px;                     /* 更大的内边距 */
    border-radius: 12px;                      /* 更圆润的边角 */
    font-size: 18px;                        /* 更大的字体 */
    font-weight: 500;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3); /* 更明显的阴影 */
    border: 1px solid rgba(137, 177, 252, 0.2); /* 添加一个微妙的边框 */
    
    /* 保留过渡效果 */
    opacity: 0;
    transition: opacity 0.3s ease-out, transform 0.3s ease-out;
    pointer-events: none;
}

#mode-indicator.show {
    opacity: 1;
    
    /* 【关键修改】动画的结束位置 */
    /* 当显示时，只保留居中效果，Y轴位移回到0，实现上滑效果 */
    transform: translate(-50%, -50%) translateY(0);
}
/* REMASTERED */
/* RTX-ON */
/* completely redone toggle and droid */

.bb8-toggle {
  --toggle-size: 16px;
  /* finally I removed the scale now everything depends on the font-size */
  /* --margin-top-for-head: 1.75em; */
  /* it's just in case 👆 */
  --toggle-width: 10.625em;
  --toggle-height: 5.625em;
  --toggle-offset: calc((var(--toggle-height) - var(--bb8-diameter)) / 2);
  --toggle-bg: linear-gradient(#2c4770, #070e2b 35%, #628cac 50% 70%, #a6c5d4)
    no-repeat;
  --bb8-diameter: 4.375em;
  --radius: 99em;
  --transition: 0.4s;
  --accent: #de7d2f;
  --bb8-bg: #fff;
}

.bb8-toggle,
.bb8-toggle *,
.bb8-toggle *::before,
.bb8-toggle *::after {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}

.bb8-toggle {
  cursor: pointer;
  margin-top: var(--margin-top-for-head);
  font-size: var(--toggle-size);
}

.bb8-toggle__checkbox {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  display: none;
}

.bb8-toggle__container {
  width: var(--toggle-width);
  height: var(--toggle-height);
  background: var(--toggle-bg);
  background-size: 100% 11.25em;
  background-position-y: -5.625em;
  border-radius: var(--radius);
  position: relative;
  -webkit-transition: var(--transition);
  -o-transition: var(--transition);
  transition: var(--transition);
}

.bb8 {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-direction: column;
  flex-direction: column;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  position: absolute;
  top: calc(var(--toggle-offset) - 1.688em + 0.188em);
  left: var(--toggle-offset);
  -webkit-transition: var(--transition);
  -o-transition: var(--transition);
  transition: var(--transition);
  z-index: 2;
}

.bb8__head-container {
  position: relative;
  -webkit-transition: var(--transition);
  -o-transition: var(--transition);
  transition: var(--transition);
  z-index: 2;
  -webkit-transform-origin: 1.25em 3.75em;
  -ms-transform-origin: 1.25em 3.75em;
  transform-origin: 1.25em 3.75em;
}

.bb8__head {
  overflow: hidden;
  margin-bottom: -0.188em;
  width: 2.5em;
  height: 1.688em;
  background: -o-linear-gradient(
      transparent 0.063em,
      dimgray 0.063em 0.313em,
      transparent 0.313em 0.375em,
      var(--accent) 0.375em 0.5em,
      transparent 0.5em 1.313em,
      silver 1.313em 1.438em,
      transparent 1.438em
    ),
    -o-linear-gradient(45deg, transparent 0.188em, var(--bb8-bg) 0.188em 1.25em, transparent
          1.25em),
    -o-linear-gradient(135deg, transparent 0.188em, var(--bb8-bg) 0.188em 1.25em, transparent
          1.25em),
    -o-linear-gradient(var(--bb8-bg) 1.25em, transparent 1.25em);
  background: -o-linear-gradient(
      transparent 0.063em,
      dimgray 0.063em 0.313em,
      transparent 0.313em 0.375em,
      var(--accent) 0.375em 0.5em,
      transparent 0.5em 1.313em,
      silver 1.313em 1.438em,
      transparent 1.438em
    ),
    -o-linear-gradient(45deg, transparent 0.188em, var(--bb8-bg) 0.188em 1.25em, transparent
          1.25em),
    -o-linear-gradient(135deg, transparent 0.188em, var(--bb8-bg) 0.188em 1.25em, transparent
          1.25em),
    -o-linear-gradient(var(--bb8-bg) 1.25em, transparent 1.25em);
  background: -o-linear-gradient(
      transparent 0.063em,
      dimgray 0.063em 0.313em,
      transparent 0.313em 0.375em,
      var(--accent) 0.375em 0.5em,
      transparent 0.5em 1.313em,
      silver 1.313em 1.438em,
      transparent 1.438em
    ),
    -o-linear-gradient(45deg, transparent 0.188em, var(--bb8-bg) 0.188em 1.25em, transparent
          1.25em),
    -o-linear-gradient(135deg, transparent 0.188em, var(--bb8-bg) 0.188em 1.25em, transparent
          1.25em),
    -o-linear-gradient(var(--bb8-bg) 1.25em, transparent 1.25em);
  background: -o-linear-gradient(
      transparent 0.063em,
      dimgray 0.063em 0.313em,
      transparent 0.313em 0.375em,
      var(--accent) 0.375em 0.5em,
      transparent 0.5em 1.313em,
      silver 1.313em 1.438em,
      transparent 1.438em
    ),
    -o-linear-gradient(45deg, transparent 0.188em, var(--bb8-bg) 0.188em 1.25em, transparent
          1.25em),
    -o-linear-gradient(135deg, transparent 0.188em, var(--bb8-bg) 0.188em 1.25em, transparent
          1.25em),
    -o-linear-gradient(var(--bb8-bg) 1.25em, transparent 1.25em);
  background: linear-gradient(
      transparent 0.063em,
      dimgray 0.063em 0.313em,
      transparent 0.313em 0.375em,
      var(--accent) 0.375em 0.5em,
      transparent 0.5em 1.313em,
      silver 1.313em 1.438em,
      transparent 1.438em
    ),
    linear-gradient(
      45deg,
      transparent 0.188em,
      var(--bb8-bg) 0.188em 1.25em,
      transparent 1.25em
    ),
    linear-gradient(
      -45deg,
      transparent 0.188em,
      var(--bb8-bg) 0.188em 1.25em,
      transparent 1.25em
    ),
    linear-gradient(var(--bb8-bg) 1.25em, transparent 1.25em);
  border-radius: var(--radius) var(--radius) 0 0;
  position: relative;
  z-index: 1;
  -webkit-filter: drop-shadow(0 0.063em 0.125em gray);
  filter: drop-shadow(0 0.063em 0.125em gray);
}

.bb8__head::before {
  content: "";
  position: absolute;
  width: 0.563em;
  height: 0.563em;
  background: -o-radial-gradient(
      0.25em 0.375em,
      0.125em circle,
      red,
      transparent
    ),
    -o-radial-gradient(0.375em 0.188em, 0.063em circle, var(--bb8-bg) 50%, transparent
          100%),
    -o-linear-gradient(45deg, #000 0.188em, dimgray 0.313em 0.375em, #000 0.5em);
  background: -o-radial-gradient(
      0.25em 0.375em,
      0.125em circle,
      red,
      transparent
    ),
    -o-radial-gradient(0.375em 0.188em, 0.063em circle, var(--bb8-bg) 50%, transparent
          100%),
    -o-linear-gradient(45deg, #000 0.188em, dimgray 0.313em 0.375em, #000 0.5em);
  background: -o-radial-gradient(
      0.25em 0.375em,
      0.125em circle,
      red,
      transparent
    ),
    -o-radial-gradient(0.375em 0.188em, 0.063em circle, var(--bb8-bg) 50%, transparent
          100%),
    -o-linear-gradient(45deg, #000 0.188em, dimgray 0.313em 0.375em, #000 0.5em);
  background: -o-radial-gradient(
      0.25em 0.375em,
      0.125em circle,
      red,
      transparent
    ),
    -o-radial-gradient(0.375em 0.188em, 0.063em circle, var(--bb8-bg) 50%, transparent
          100%),
    -o-linear-gradient(45deg, #000 0.188em, dimgray 0.313em 0.375em, #000 0.5em);
  background: radial-gradient(
      0.125em circle at 0.25em 0.375em,
      red,
      transparent
    ),
    radial-gradient(
      0.063em circle at 0.375em 0.188em,
      var(--bb8-bg) 50%,
      transparent 100%
    ),
    linear-gradient(45deg, #000 0.188em, dimgray 0.313em 0.375em, #000 0.5em);
  border-radius: var(--radius);
  top: 0.413em;
  left: 50%;
  -webkit-transform: translate(-50%);
  -ms-transform: translate(-50%);
  transform: translate(-50%);
  -webkit-box-shadow: 0 0 0 0.089em lightgray, 0.563em 0.281em 0 -0.148em,
    0.563em 0.281em 0 -0.1em var(--bb8-bg), 0.563em 0.281em 0 -0.063em;
  box-shadow: 0 0 0 0.089em lightgray, 0.563em 0.281em 0 -0.148em,
    0.563em 0.281em 0 -0.1em var(--bb8-bg), 0.563em 0.281em 0 -0.063em;
  z-index: 1;
  -webkit-transition: var(--transition);
  -o-transition: var(--transition);
  transition: var(--transition);
}

.bb8__head::after {
  content: "";
  position: absolute;
  bottom: 0.375em;
  left: 0;
  width: 100%;
  height: 0.188em;
  background: -o-linear-gradient(
    left,
    var(--accent) 0.125em,
    transparent 0.125em 0.188em,
    var(--accent) 0.188em 0.313em,
    transparent 0.313em 0.375em,
    var(--accent) 0.375em 0.938em,
    transparent 0.938em 1em,
    var(--accent) 1em 1.125em,
    transparent 1.125em 1.875em,
    var(--accent) 1.875em 2em,
    transparent 2em 2.063em,
    var(--accent) 2.063em 2.25em,
    transparent 2.25em 2.313em,
    var(--accent) 2.313em 2.375em,
    transparent 2.375em 2.438em,
    var(--accent) 2.438em
  );
  background: -webkit-gradient(
    linear,
    left top,
    right top,
    color-stop(0.125em, var(--accent)),
    color-stop(0.125em, transparent),
    color-stop(0.188em, var(--accent)),
    color-stop(0.313em, transparent),
    color-stop(0.375em, var(--accent)),
    color-stop(0.938em, transparent),
    color-stop(1em, var(--accent)),
    color-stop(1.125em, transparent),
    color-stop(1.875em, var(--accent)),
    color-stop(2em, transparent),
    color-stop(2.063em, var(--accent)),
    color-stop(2.25em, transparent),
    color-stop(2.313em, var(--accent)),
    color-stop(2.375em, transparent),
    color-stop(2.438em, var(--accent))
  );
  background: linear-gradient(
    to right,
    var(--accent) 0.125em,
    transparent 0.125em 0.188em,
    var(--accent) 0.188em 0.313em,
    transparent 0.313em 0.375em,
    var(--accent) 0.375em 0.938em,
    transparent 0.938em 1em,
    var(--accent) 1em 1.125em,
    transparent 1.125em 1.875em,
    var(--accent) 1.875em 2em,
    transparent 2em 2.063em,
    var(--accent) 2.063em 2.25em,
    transparent 2.25em 2.313em,
    var(--accent) 2.313em 2.375em,
    transparent 2.375em 2.438em,
    var(--accent) 2.438em
  );
  -webkit-transition: var(--transition);
  -o-transition: var(--transition);
  transition: var(--transition);
}

.bb8__antenna {
  position: absolute;
  -webkit-transform: translateY(-90%);
  -ms-transform: translateY(-90%);
  transform: translateY(-90%);
  width: 0.059em;
  border-radius: var(--radius) var(--radius) 0 0;
  -webkit-transition: var(--transition);
  -o-transition: var(--transition);
  transition: var(--transition);
}

.bb8__antenna:nth-child(1) {
  height: 0.938em;
  right: 0.938em;
  background: -o-linear-gradient(#000 0.188em, silver 0.188em);
  background: -webkit-gradient(
    linear,
    left top,
    left bottom,
    color-stop(0.188em, #000),
    color-stop(0.188em, silver)
  );
  background: linear-gradient(#000 0.188em, silver 0.188em);
}

.bb8__antenna:nth-child(2) {
  height: 0.375em;
  left: 50%;
  -webkit-transform: translate(-50%, -90%);
  -ms-transform: translate(-50%, -90%);
  transform: translate(-50%, -90%);
  background: silver;
}

.bb8__body {
  width: 4.375em;
  height: 4.375em;
  background: var(--bb8-bg);
  border-radius: var(--radius);
  position: relative;
  overflow: hidden;
  -webkit-transition: var(--transition);
  -o-transition: var(--transition);
  transition: var(--transition);
  z-index: 1;
  -webkit-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  transform: rotate(45deg);
  background: -webkit-gradient(
      linear,
      right top,
      left top,
      color-stop(4%, var(--bb8-bg)),
      color-stop(4%, var(--accent)),
      color-stop(10%, transparent),
      color-stop(90%, var(--accent)),
      color-stop(96%, var(--bb8-bg))
    ),
    -webkit-gradient(linear, left top, left bottom, color-stop(4%, var(--bb8-bg)), color-stop(4%, var(--accent)), color-stop(10%, transparent), color-stop(90%, var(--accent)), color-stop(96%, var(--bb8-bg))),
    -webkit-gradient(linear, left top, right top, color-stop(2.156em, transparent), color-stop(2.156em, silver), color-stop(2.188em, transparent)),
    -webkit-gradient(linear, left top, left bottom, color-stop(2.156em, transparent), color-stop(2.156em, silver), color-stop(2.188em, transparent));
  background: -o-linear-gradient(
      right,
      var(--bb8-bg) 4%,
      var(--accent) 4% 10%,
      transparent 10% 90%,
      var(--accent) 90% 96%,
      var(--bb8-bg) 96%
    ),
    -o-linear-gradient(var(--bb8-bg) 4%, var(--accent) 4% 10%, transparent 10%
          90%, var(--accent) 90% 96%, var(--bb8-bg) 96%),
    -o-linear-gradient(left, transparent 2.156em, silver 2.156em 2.219em, transparent
          2.188em),
    -o-linear-gradient(transparent 2.156em, silver 2.156em 2.219em, transparent
          2.188em);
  background: linear-gradient(
      -90deg,
      var(--bb8-bg) 4%,
      var(--accent) 4% 10%,
      transparent 10% 90%,
      var(--accent) 90% 96%,
      var(--bb8-bg) 96%
    ),
    linear-gradient(
      var(--bb8-bg) 4%,
      var(--accent) 4% 10%,
      transparent 10% 90%,
      var(--accent) 90% 96%,
      var(--bb8-bg) 96%
    ),
    linear-gradient(
      to right,
      transparent 2.156em,
      silver 2.156em 2.219em,
      transparent 2.188em
    ),
    linear-gradient(
      transparent 2.156em,
      silver 2.156em 2.219em,
      transparent 2.188em
    );
  background-color: var(--bb8-bg);
}

.bb8__body::after {
  content: "";
  bottom: 1.5em;
  left: 0.563em;
  position: absolute;
  width: 0.188em;
  height: 0.188em;
  background: rgb(236, 236, 236);
  color: rgb(236, 236, 236);
  border-radius: 50%;
  -webkit-box-shadow: 0.875em 0.938em, 0 -1.25em, 0.875em -2.125em,
    2.125em -2.125em, 3.063em -1.25em, 3.063em 0, 2.125em 0.938em;
  box-shadow: 0.875em 0.938em, 0 -1.25em, 0.875em -2.125em, 2.125em -2.125em,
    3.063em -1.25em, 3.063em 0, 2.125em 0.938em;
}

.bb8__body::before {
  content: "";
  width: 2.625em;
  height: 2.625em;
  position: absolute;
  border-radius: 50%;
  z-index: 0.1;
  overflow: hidden;
  top: 50%;
  left: 50%;
  -webkit-transform: translate(-50%, -50%);
  -ms-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  border: 0.313em solid var(--accent);
  background: -o-radial-gradient(
      center,
      1em circle,
      rgb(236, 236, 236) 50%,
      transparent 51%
    ),
    -o-radial-gradient(center, 1.25em circle, var(--bb8-bg) 50%, transparent 51%),
    -o-linear-gradient(right, transparent 42%, var(--accent) 42% 58%, transparent
          58%),
    -o-linear-gradient(var(--bb8-bg) 42%, var(--accent) 42% 58%, var(--bb8-bg)
          58%);
  background: -o-radial-gradient(
      center,
      1em circle,
      rgb(236, 236, 236) 50%,
      transparent 51%
    ),
    -o-radial-gradient(center, 1.25em circle, var(--bb8-bg) 50%, transparent 51%),
    -o-linear-gradient(right, transparent 42%, var(--accent) 42% 58%, transparent
          58%),
    -o-linear-gradient(var(--bb8-bg) 42%, var(--accent) 42% 58%, var(--bb8-bg)
          58%);
  background: radial-gradient(
      1em circle at center,
      rgb(236, 236, 236) 50%,
      transparent 51%
    ),
    radial-gradient(1.25em circle at center, var(--bb8-bg) 50%, transparent 51%),
    -webkit-gradient(linear, right top, left top, color-stop(42%, transparent), color-stop(42%, var(--accent)), color-stop(58%, transparent)),
    -webkit-gradient(linear, left top, left bottom, color-stop(42%, var(--bb8-bg)), color-stop(42%, var(--accent)), color-stop(58%, var(--bb8-bg)));
  background: radial-gradient(
      1em circle at center,
      rgb(236, 236, 236) 50%,
      transparent 51%
    ),
    radial-gradient(1.25em circle at center, var(--bb8-bg) 50%, transparent 51%),
    linear-gradient(
      -90deg,
      transparent 42%,
      var(--accent) 42% 58%,
      transparent 58%
    ),
    linear-gradient(var(--bb8-bg) 42%, var(--accent) 42% 58%, var(--bb8-bg) 58%);
}

.artificial__hidden {
  position: absolute;
  border-radius: inherit;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.bb8__shadow {
  content: "";
  width: var(--bb8-diameter);
  height: 20%;
  border-radius: 50%;
  background: #3a271c;
  -webkit-box-shadow: 0.313em 0 3.125em #3a271c;
  box-shadow: 0.313em 0 3.125em #3a271c;
  opacity: 0.25;
  position: absolute;
  bottom: 0;
  left: calc(var(--toggle-offset) - 0.938em);
  -webkit-transition: var(--transition);
  -o-transition: var(--transition);
  transition: var(--transition);
  -webkit-transform: skew(-70deg);
  -ms-transform: skew(-70deg);
  transform: skew(-70deg);
  z-index: 1;
}

.bb8-toggle__scenery {
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
  position: relative;
  border-radius: inherit;
}

.bb8-toggle__scenery::before {
  content: "";
  position: absolute;
  width: 100%;
  height: 30%;
  bottom: 0;
  background: #b18d71;
  z-index: 1;
}

.bb8-toggle__cloud {
  z-index: 1;
  position: absolute;
  border-radius: 50%;
}

.bb8-toggle__cloud:nth-last-child(1) {
  width: 0.875em;
  height: 0.625em;
  -webkit-filter: blur(0.125em) drop-shadow(0.313em 0.313em #ffffffae)
    drop-shadow(-0.625em 0 #fff) drop-shadow(-0.938em -0.125em #fff);
  filter: blur(0.125em) drop-shadow(0.313em 0.313em #ffffffae)
    drop-shadow(-0.625em 0 #fff) drop-shadow(-0.938em -0.125em #fff);
  right: 1.875em;
  top: 2.813em;
  background: -o-linear-gradient(bottom left, #ffffffae, #ffffffae);
  background: -webkit-gradient(
    linear,
    left bottom,
    right top,
    from(#ffffffae),
    to(#ffffffae)
  );
  background: linear-gradient(to top right, #ffffffae, #ffffffae);
  -webkit-transition: var(--transition);
  -o-transition: var(--transition);
  transition: var(--transition);
}

.bb8-toggle__cloud:nth-last-child(2) {
  top: 0.625em;
  right: 4.375em;
  width: 0.875em;
  height: 0.375em;
  background: #dfdedeae;
  -webkit-filter: blur(0.125em) drop-shadow(-0.313em -0.188em #e0dfdfae)
    drop-shadow(-0.625em -0.188em #bbbbbbae) drop-shadow(-1em 0.063em #cfcfcfae);
  filter: blur(0.125em) drop-shadow(-0.313em -0.188em #e0dfdfae)
    drop-shadow(-0.625em -0.188em #bbbbbbae) drop-shadow(-1em 0.063em #cfcfcfae);
  -webkit-transition: 0.6s;
  -o-transition: 0.6s;
  transition: 0.6s;
}

.bb8-toggle__cloud:nth-last-child(3) {
  top: 1.25em;
  right: 0.938em;
  width: 0.875em;
  height: 0.375em;
  background: #ffffffae;
  -webkit-filter: blur(0.125em) drop-shadow(0.438em 0.188em #ffffffae)
    drop-shadow(-0.625em 0.313em #ffffffae);
  filter: blur(0.125em) drop-shadow(0.438em 0.188em #ffffffae)
    drop-shadow(-0.625em 0.313em #ffffffae);
  -webkit-transition: 0.8s;
  -o-transition: 0.8s;
  transition: 0.8s;
}

.gomrassen,
.hermes,
.chenini {
  position: absolute;
  border-radius: var(--radius);
  background: -o-linear-gradient(#fff, #6e8ea2);
  background: -webkit-gradient(
    linear,
    left top,
    left bottom,
    from(#fff),
    to(#6e8ea2)
  );
  background: linear-gradient(#fff, #6e8ea2);
  top: 100%;
}

.gomrassen {
  left: 0.938em;
  width: 1.875em;
  height: 1.875em;
  -webkit-box-shadow: 0 0 0.188em #ffffff52, 0 0 0.188em #6e8ea24b;
  box-shadow: 0 0 0.188em #ffffff52, 0 0 0.188em #6e8ea24b;
  -webkit-transition: var(--transition);
  -o-transition: var(--transition);
  transition: var(--transition);
}

.gomrassen::before,
.gomrassen::after {
  content: "";
  position: absolute;
  border-radius: inherit;
  -webkit-box-shadow: inset 0 0 0.063em rgb(140, 162, 169);
  box-shadow: inset 0 0 0.063em rgb(140, 162, 169);
  background: rgb(184, 196, 200);
}

.gomrassen::before {
  left: 0.313em;
  top: 0.313em;
  width: 0.438em;
  height: 0.438em;
}

.gomrassen::after {
  width: 0.25em;
  height: 0.25em;
  left: 1.25em;
  top: 0.75em;
}

.hermes {
  left: 3.438em;
  width: 0.625em;
  height: 0.625em;
  -webkit-box-shadow: 0 0 0.125em #ffffff52, 0 0 0.125em #6e8ea24b;
  box-shadow: 0 0 0.125em #ffffff52, 0 0 0.125em #6e8ea24b;
  -webkit-transition: 0.6s;
  -o-transition: 0.6s;
  transition: 0.6s;
}

.chenini {
  left: 4.375em;
  width: 0.5em;
  height: 0.5em;
  -webkit-box-shadow: 0 0 0.125em #ffffff52, 0 0 0.125em #6e8ea24b;
  box-shadow: 0 0 0.125em #ffffff52, 0 0 0.125em #6e8ea24b;
  -webkit-transition: 0.8s;
  -o-transition: 0.8s;
  transition: 0.8s;
}

.tatto-1,
.tatto-2 {
  position: absolute;
  width: 1.25em;
  height: 1.25em;
  border-radius: var(--radius);
}

.tatto-1 {
  background: #fefefe;
  right: 3.125em;
  top: 0.625em;
  -webkit-box-shadow: 0 0 0.438em #fdf4e1;
  box-shadow: 0 0 0.438em #fdf4e1;
  -webkit-transition: var(--transition);
  -o-transition: var(--transition);
  transition: var(--transition);
}

.tatto-2 {
  background: -o-linear-gradient(#e6ac5c, #d75449);
  background: -webkit-gradient(
    linear,
    left top,
    left bottom,
    from(#e6ac5c),
    to(#d75449)
  );
  background: linear-gradient(#e6ac5c, #d75449);
  right: 1.25em;
  top: 2.188em;
  -webkit-box-shadow: 0 0 0.438em #e6ad5c3d, 0 0 0.438em #d755494f;
  box-shadow: 0 0 0.438em #e6ad5c3d, 0 0 0.438em #d755494f;
  -webkit-transition: 0.7s;
  -o-transition: 0.7s;
  transition: 0.7s;
}

.bb8-toggle__star {
  position: absolute;
  width: 0.063em;
  height: 0.063em;
  background: #fff;
  border-radius: var(--radius);
  -webkit-filter: drop-shadow(0 0 0.063em #fff);
  filter: drop-shadow(0 0 0.063em #fff);
  color: #fff;
  top: 100%;
}

.bb8-toggle__star:nth-child(1) {
  left: 3.75em;
  -webkit-box-shadow: 1.25em 0.938em, -1.25em 2.5em, 0 1.25em, 1.875em 0.625em,
    -3.125em 1.875em, 1.25em 2.813em;
  box-shadow: 1.25em 0.938em, -1.25em 2.5em, 0 1.25em, 1.875em 0.625em,
    -3.125em 1.875em, 1.25em 2.813em;
  -webkit-transition: 0.2s;
  -o-transition: 0.2s;
  transition: 0.2s;
}

.bb8-toggle__star:nth-child(2) {
  left: 4.688em;
  -webkit-box-shadow: 0.625em 0, 0 0.625em, -0.625em -0.625em, 0.625em 0.938em,
    -3.125em 1.25em, 1.25em -1.563em;
  box-shadow: 0.625em 0, 0 0.625em, -0.625em -0.625em, 0.625em 0.938em,
    -3.125em 1.25em, 1.25em -1.563em;
  -webkit-transition: 0.3s;
  -o-transition: 0.3s;
  transition: 0.3s;
}

.bb8-toggle__star:nth-child(3) {
  left: 5.313em;
  -webkit-box-shadow: -0.625em -0.625em, -2.188em 1.25em, -2.188em 0,
    -3.75em -0.625em, -3.125em -0.625em, -2.5em -0.313em, 0.75em -0.625em;
  box-shadow: -0.625em -0.625em, -2.188em 1.25em, -2.188em 0, -3.75em -0.625em,
    -3.125em -0.625em, -2.5em -0.313em, 0.75em -0.625em;
  -webkit-transition: var(--transition);
  -o-transition: var(--transition);
  transition: var(--transition);
}

.bb8-toggle__star:nth-child(4) {
  left: 1.875em;
  width: 0.125em;
  height: 0.125em;
  -webkit-transition: 0.5s;
  -o-transition: 0.5s;
  transition: 0.5s;
}

.bb8-toggle__star:nth-child(5) {
  left: 5em;
  width: 0.125em;
  height: 0.125em;
  -webkit-transition: 0.6s;
  -o-transition: 0.6s;
  transition: 0.6s;
}

.bb8-toggle__star:nth-child(6) {
  left: 2.5em;
  width: 0.125em;
  height: 0.125em;
  -webkit-transition: 0.7s;
  -o-transition: 0.7s;
  transition: 0.7s;
}

.bb8-toggle__star:nth-child(7) {
  left: 3.438em;
  width: 0.125em;
  height: 0.125em;
  -webkit-transition: 0.8s;
  -o-transition: 0.8s;
  transition: 0.8s;
}

/* actions */

.bb8-toggle__checkbox:checked
  + .bb8-toggle__container
  .bb8-toggle__star:nth-child(1) {
  top: 0.625em;
}

.bb8-toggle__checkbox:checked
  + .bb8-toggle__container
  .bb8-toggle__star:nth-child(2) {
  top: 1.875em;
}

.bb8-toggle__checkbox:checked
  + .bb8-toggle__container
  .bb8-toggle__star:nth-child(3) {
  top: 1.25em;
}

.bb8-toggle__checkbox:checked
  + .bb8-toggle__container
  .bb8-toggle__star:nth-child(4) {
  top: 3.438em;
}

.bb8-toggle__checkbox:checked
  + .bb8-toggle__container
  .bb8-toggle__star:nth-child(5) {
  top: 3.438em;
}

.bb8-toggle__checkbox:checked
  + .bb8-toggle__container
  .bb8-toggle__star:nth-child(6) {
  top: 0.313em;
}

.bb8-toggle__checkbox:checked
  + .bb8-toggle__container
  .bb8-toggle__star:nth-child(7) {
  top: 1.875em;
}

.bb8-toggle__checkbox:checked + .bb8-toggle__container .bb8-toggle__cloud {
  right: -100%;
}

.bb8-toggle__checkbox:checked + .bb8-toggle__container .gomrassen {
  top: 0.938em;
}

.bb8-toggle__checkbox:checked + .bb8-toggle__container .hermes {
  top: 2.5em;
}

.bb8-toggle__checkbox:checked + .bb8-toggle__container .chenini {
  top: 2.75em;
}

.bb8-toggle__checkbox:checked + .bb8-toggle__container {
  background-position-y: 0;
}

.bb8-toggle__checkbox:checked + .bb8-toggle__container .tatto-1 {
  top: 100%;
}

.bb8-toggle__checkbox:checked + .bb8-toggle__container .tatto-2 {
  top: 100%;
}

.bb8-toggle__checkbox:checked + .bb8-toggle__container .bb8 {
  left: calc(100% - var(--bb8-diameter) - var(--toggle-offset));
}

.bb8-toggle__checkbox:checked + .bb8-toggle__container .bb8__shadow {
  left: calc(100% - var(--bb8-diameter) - var(--toggle-offset) + 0.938em);
  -webkit-transform: skew(70deg);
  -ms-transform: skew(70deg);
  transform: skew(70deg);
}

.bb8-toggle__checkbox:checked + .bb8-toggle__container .bb8__body {
  -webkit-transform: rotate(180deg);
  -ms-transform: rotate(180deg);
  transform: rotate(225deg);
}

.bb8-toggle__checkbox:hover + .bb8-toggle__container .bb8__head::before {
  left: 100%;
}

.bb8-toggle__checkbox:not(:checked):hover
  + .bb8-toggle__container
  .bb8__antenna:nth-child(1) {
  right: 1.5em;
}

.bb8-toggle__checkbox:hover
  + .bb8-toggle__container
  .bb8__antenna:nth-child(2) {
  left: 0.938em;
}

.bb8-toggle__checkbox:hover + .bb8-toggle__container .bb8__head::after {
  background-position: 1.375em 0;
}

.bb8-toggle__checkbox:checked:hover
  + .bb8-toggle__container
  .bb8__head::before {
  left: 0;
}

.bb8-toggle__checkbox:checked:hover
  + .bb8-toggle__container
  .bb8__antenna:nth-child(2) {
  left: calc(100% - 0.938em);
}

.bb8-toggle__checkbox:checked:hover + .bb8-toggle__container .bb8__head::after {
  background-position: -1.375em 0;
}

.bb8-toggle__checkbox:active + .bb8-toggle__container .bb8__head-container {
  -webkit-transform: rotate(25deg);
  -ms-transform: rotate(25deg);
  transform: rotate(25deg);
}

.bb8-toggle__checkbox:checked:active
  + .bb8-toggle__container
  .bb8__head-container {
  -webkit-transform: rotate(-25deg);
  -ms-transform: rotate(-25deg);
  transform: rotate(-25deg);
}

.bb8:hover .bb8__head::before,
.bb8:hover .bb8__antenna:nth-child(2) {
  left: 50% !important;
}

.bb8:hover .bb8__antenna:nth-child(1) {
  right: 0.938em !important;
}

.bb8:hover .bb8__head::after {
  background-position: 0 0 !important;
}
/* 文件: style.css */

/* ... 你现有的 .popup 样式代码之后 ... */

/* 【【【【【 新增这段CSS代码开始 】】】】】 */

/* 1. 首先，我们需要让弹窗成为一个定位的容器 */

    position: relative; 
}

/* 2. 为右上角的 "ESC" 提示设计样式 */
.popup-esc-hint {
    position: absolute; /* 使用绝对定位 */
    top: 10px;          /* 距离弹窗顶部10像素 */
    right: 15px;         /* 距离弹窗右侧15像素 */

    font-family: 'Arial', sans-serif; /* 使用一个通用的无衬线字体 */
    font-size: 0.8rem;   /* 字体稍小一些 */
    color: #a0a8b7;      /* 使用一个不太刺眼的灰色 */
    background-color: rgba(62, 82, 122, 0.5); /* 给一个半透明的背景，增加可读性 */
    padding: 3px 8px;    /* 一些内边距，让它看起来像个小标签 */
    border-radius: 4px;  /* 圆角 */
    border: 1px solid #4a5a7f; /* 一个淡淡的边框 */
    
    /* 确保用户不能选中这个提示文字 */
    user-select: none; 
}


/* 【【【【【 新增这段CSS代码结束 】】】】】 */
/* style.css - 添加到文件末尾 */

/* 笔记视图的操作栏 */
.view-actions {
    padding: 10px 20px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    text-align: left;
}

/* 单词本网格布局 */
.vocab-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
    padding: 20px;
    overflow-y: auto;
    height: 100%;
}

/* 单词卡片样式 */
.vocab-card {
    background-color: rgba(26, 28, 40, 0.8);
    border-radius: 8px;
    padding: 15px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    display: flex;
    flex-direction: column;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.vocab-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
}

.vocab-card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    padding-bottom: 10px;
    margin-bottom: 10px;
}

.vocab-word {
    color: #4dd0e1; /* 亮蓝色 */
    margin: 0;
    font-size: 1.2em;
}

.vocab-translation {
    font-size: 1em;
    margin-bottom: 10px;
}

.vocab-sentence {
    font-style: italic;
    color: #aaa;
    flex-grow: 1; /* 让例句占据多余空间，把meta推到底部 */
    margin-bottom: 10px;
}

.vocab-meta {
    font-size: 0.8em;
    color: #666;
    text-align: right;
    margin-top: auto; /* 推到底部 */
}

.btn-delete-vocab {
    background: none;
    border: none;
    color: #888;
    font-size: 1.5em;
    cursor: pointer;
    line-height: 1;
    padding: 0 5px;
    transition: color 0.2s ease;
}
.btn-delete-vocab:hover {
    color: #ff5252; /* 红色 */
}

/* 笔记历史模态框的特定样式 */
.modal-content.wide {
    max-width: 800px; /* 更宽的模态框 */
}

.modal-body-scrollable {
    max-height: 60vh; /* 限制高度，超出则滚动 */
    overflow-y: auto;
    padding: 10px;
    background: rgba(0,0,0,0.2);
    border-radius: 5px;
}

/* 历史记录表格样式 */
.history-table {
    width: 100%;
    border-collapse: collapse;
}

.history-table th, .history-table td {
    padding: 12px 15px;
    text-align: left;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.history-table th {
    background-color: rgba(255, 255, 255, 0.05);
    font-weight: 500;
}

.history-table tr:hover {
    background-color: rgba(255, 255, 255, 0.08);
}

.history-table .btn-sm {
    padding: 4px 8px;
    font-size: 0.9em;
}

/* 错误消息样式 */
.error {
    color: #ff5252;
}

/* 主界面笔记显示区域的样式 */
.note-content-display {
    background-color: rgba(0,0,0,0.15);
    border-radius: 5px;
    padding: 15px;
    white-space: pre-wrap; /* 保持换行和空格 */
    font-family: 'Courier New', Courier, monospace;
    max-height: 60vh;
    overflow-y: auto;
}

#noteOutput h3 {
    margin-top: 20px;
    margin-bottom: 10px;
    color: #4dd0e1;
}

#noteOutput hr {
    border-color: rgba(255, 255, 255, 0.1);
}
/* style.css - 添加到文件末尾 */

/* ======================================================= */
/* ============= [新增] RANK功能专属样式 ================== */
/* ======================================================= */

/* --- 排名视图表格 --- */
#rankView .rank-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 1rem;
}

#rankView .rank-table th, 
#rankView .rank-table td {
    padding: 12px 15px;
    text-align: left;
    border-bottom: 1px solid #2a3a68;
    vertical-align: middle; /* 垂直居中对齐 */
}

#rankView .rank-table th {
    background-color: rgba(15, 52, 96, 0.5);
    color: #a0a8b7;
    font-weight: 500;
}

#rankView .rank-table tr:nth-child(even) {
    background-color: rgba(0,0,0,0.1);
}

#rankView .rank-table tr:hover {
    background-color: #2a558a;
}

#rankView .rank-table .rank-col { width: 10%; text-align: center; }
#rankView .rank-table .username-col { width: 35%; font-weight: bold; }
#rankView .rank-table .count-col { width: 20%; text-align: center; }
#rankView .rank-table .likes-col { width: 15%; text-align: center; }
#rankView .rank-table .action-col { width: 20%; text-align: center; }


/* --- 你提供的RANK界面的点赞按钮样式 (已整合) --- */
.rank-like-btn .container {
  display: block;
  position: relative;
  cursor: pointer;
  font-size: 14px; /* 缩小一点以适应表格 */
  user-select: none;
  transform: scale(0.6); /* 整体缩小 */
  margin: -1em auto; /* 调整边距修正缩小后的位置 */
}
.rank-like-btn .container input { opacity: 0; cursor: pointer; height: 0; width: 0; }
.rank-like-btn .checkmark { position: relative; top: 0; left: 0; height: 3em; width: 3em; background-color: #171717; border-radius: 10px; transition: .2s ease-in-out; z-index: 2; }
.rank-like-btn .like { position: relative; font-size: 0.8em; top: -3.5em; text-align: center; z-index: -1; }
.rank-like-btn .icon { margin: 0.2em; fill: white; transition: .4s ease-in-out; }
.rank-like-btn .checkmark:hover { background-color: white; }
.rank-like-btn .checkmark:hover .icon { fill: black; transform: rotate(-8deg); transform-origin: bottom left; }
.rank-like-btn .container input:checked ~ .checkmark { background-color: limegreen; }
.rank-like-btn .container input:checked ~ .like { color: white; animation: up_3951 0.6s; }
.rank-like-btn .container input:checked ~ .checkmark .icon { fill: white; transform: none; animation: jump_3951 0.5s; }
.rank-like-btn .checkmark:after { content: ""; position: absolute; display: none; }
.rank-like-btn .container input:checked ~ .checkmark:after { display: block; }

@keyframes up_3951 {
  100% { transform: translateY(-2em); }
}
@keyframes jump_3951 {
  50% { transform-origin: center; transform: translateY(-0.5em) rotate(-8deg); }
  100% { transform-origin: center; transform: translateY(0em); }
}


/* ======================================================= */
/* ============= [新增] 左上角点赞统计UI ================= */
/* ======================================================= */

/* --- 统计UI的容器 --- */
#userStatsContainer {
  position: absolute;
  left: 4rem;
  top: 50%;
  transform: translateY(-50%);
}

/* --- 你提供的点赞统计UI样式 (已整合) --- */
.likes-display .button-container { position: relative; display: inline-block; transform: scale(0.6); transform-origin: left; }
.likes-display .button { cursor: default; /* 改为默认指针，因为它不可交互 */ width: 15em; height: 5em; display: flex; align-items: center; background-color: white; border: none; box-shadow: 0px 5px 0px rgba(45, 45, 45, 0.2); overflow: hidden; border-radius: 0.5em; transition: all 0.2s ease; }
.likes-display #fontlikebutton { font-family: "Trebuchet MS", sans-serif; font-weight: 600; font-size: 2em; color: #00d5ff; margin-left: 0.2em; }
.likes-display #likeimg { transition: all 0.2s ease; }
.likes-display #rightpart { width: 70%; height: 100%; display: flex; justify-content: center; align-items: center; }
.likes-display #leftpart { color: white; display: flex; justify-content: center; align-items: center; flex-direction: column; font-family: "Trebuchet MS", sans-serif; font-weight: 600; font-size: 2em; background-color: #00d5ff; width: 30%; height: 100%; transition: all 0.2s ease; overflow: hidden; /* 隐藏溢出的数字 */ position: relative; }
.likes-display #currentnumber, .likes-display #movenumber { position: absolute; transform: translateY(0); transition: all 0.4s ease-in-out; }
.likes-display #movenumber { transform: translateY(150%); }
.likes-display.updated #currentnumber { transform: translateY(-150%); }
.likes-display.updated #movenumber { transform: translateY(0); }

/* style.css - 添加到文件末尾 */
.rank-table tr.current-user-row {
    background-color: #3d83ff !important; /* 用一个醒目的颜色高亮 */
    color: white;
}
/* style.css */

/* --- RANK表格样式优化 (V2.1 - 最终版) --- */

/* 1. 强制设置行高 */
#rankTable tbody tr {
    height: 45px; /* 直接控制行高，可以按需调整这个数值 */
}

/* 2. 减小单元格内边距并确保生效 */
#rankTable th,
#rankTable td {
    padding: 0.25rem 1rem !important;
    vertical-align: middle;
}

/* 3. 控制点赞按钮单元格的对齐 */
.action-cell {
    display: flex;
    align-items: flex-start;       /* 垂直居中 */
    justify-content: flex-start; /* 水平靠左 */
}

/* 4. 调整点赞按钮的容器，让它有左边距 */
.rank-like-btn {
    margin-top: 20px;
    margin-left: -5rem; /* 让整个点赞按钮（包括你自定义的checkbox样式）向右移动1rem */
}

/* 5. 确保你自定义的点赞按钮尺寸合适 */
.rank-like-btn .container {
    /* 你可能需要根据实际效果调整这些值 */
    width: 50px; 
    height: 50px;
    transform: scale(0.7); /* 整体缩放按钮，让它不那么大 */
    transform-origin: left center; /* 确保缩放时以左侧中心为基点 */
}
/* 1. 定位整个小部件到左下角 */
#feedback-widget {
    position: fixed; /* 固定在视窗上，不随滚动条滚动 */
    bottom: 20px;
    left: 20px;
    z-index: 1000; /* 确保它在最上层 */
    display: flex; /* 让输入框和按钮横向排列 */
    align-items: center; /* 垂直居中对齐 */
    gap: 20px; /* 输入框和按钮之间的间距 */
}

/* 2. 为我们新增的按钮添加样式 */
.brutalist-button {
    padding: 15px 25px;
    font-family: monospace;
    font-size: 14px;
    font-weight: bold;
    color: #fff;
    background-color: #000;
    border: 4px solid #000;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 5px 5px 0 #4a90e2;
}

.brutalist-button:hover {
    background-color: #4a90e2;
    box-shadow: 5px 5px 0 #000;
}

.brutalist-button:active {
    transform: translateY(2px) translateX(2px);
    box-shadow: 3px 3px 0 #000;
}


/* From Uiverse.io by 0xnihilism */ 
.brutalist-container {
  position: relative;
  width: 250px;
  font-family: monospace;
}

.brutalist-input {
  width: 100%;
  padding: 15px;
  font-size: 18px;
  font-weight: bold;
  color: #000;
  background-color: #fff;
  border: 4px solid #000;
  position: relative;
  overflow: hidden;
  border-radius: 0;
  outline: none;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  box-shadow: 5px 5px 0 #000, 10px 10px 0 #4a90e2;
}

@keyframes glitch {
  0% {
    transform: translate(0);
  }
  20% {
    transform: translate(-2px, 2px);
  }
  40% {
    transform: translate(-2px, -2px);
  }
  60% {
    transform: translate(2px, 2px);
  }
  80% {
    transform: translate(2px, -2px);
  }
  100% {
    transform: translate(0);
  }
}

.brutalist-input:focus {
  animation: focus-pulse 4s cubic-bezier(0.25, 0.8, 0.25, 1) infinite,
    glitch 0.3s cubic-bezier(0.25, 0.8, 0.25, 1) infinite;
}

.brutalist-input:focus::after {
  content: "";
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: white;
  z-index: -1;
}

.brutalist-input:focus::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: black;
  z-index: -2;
  clip-path: inset(0 100% 0 0);
  animation: glitch-slice 4s steps(2, end) infinite;
}

@keyframes glitch-slice {
  0% {
    clip-path: inset(0 100% 0 0);
  }
  10% {
    clip-path: inset(0 5% 0 0);
  }
  20% {
    clip-path: inset(0 80% 0 0);
  }
  30% {
    clip-path: inset(0 10% 0 0);
  }
  40% {
    clip-path: inset(0 50% 0 0);
  }
  50% {
    clip-path: inset(0 30% 0 0);
  }
  60% {
    clip-path: inset(0 70% 0 0);
  }
  70% {
    clip-path: inset(0 15% 0 0);
  }
  80% {
    clip-path: inset(0 90% 0 0);
  }
  90% {
    clip-path: inset(0 5% 0 0);
  }
  100% {
    clip-path: inset(0 100% 0 0);
  }
}

.brutalist-label {
  position: absolute;
  left: -3px;
  top: -35px;
  font-size: 14px;
  font-weight: bold;
  color: #fff;
  background-color: #000;
  padding: 5px 10px;
  transform: rotate(-1deg);
  z-index: 1;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.brutalist-input:focus + .brutalist-label {
  transform: rotate(0deg) scale(1.05);
  background-color: #4a90e2;
}

.smooth-type {
  position: relative;
  overflow: hidden;
}

.smooth-type::before {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: linear-gradient(90deg, #fff 0%, rgba(255, 255, 255, 0) 100%);
  z-index: 1;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.smooth-type:focus::before {
  opacity: 1;
  animation: type-gradient 2s linear infinite;
}

@keyframes type-gradient {
  0% {
    background-position: 300px 0;
  }
  100% {
    background-position: 0 0;
  }
}

.brutalist-input::placeholder {
  color: #888;
  transition: color 0.3s ease;
}

.brutalist-input:focus::placeholder {
  color: transparent;
}

.brutalist-input:focus {
  animation: focus-pulse 4s cubic-bezier(0.25, 0.8, 0.25, 1) infinite;
}

@keyframes focus-pulse {
  0%,
  100% {
    border-color: #000;
  }
  50% {
    border-color: #4a90e2;
  }
}
/* 【【【【【 把这段CSS代码粘贴到你的CSS文件末尾 】】】】】 */

/* SPACE 切换按钮样式 */
.space-switcher {
    position: fixed;
    top: 100px;
    left: 20px;
    z-index: 999;
    width: 180px;
    background-color: rgba(255, 255, 255, 0.9);
    border-radius: 12px;
    padding: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    font-family: 'Noto Sans SC', sans-serif;
}

.btn-space {
    width: 100%;
    padding: 10px;
    font-weight: bold;
    background-color: #5a78f0;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.3s ease;
}

.btn-space:hover {
    background-color: #3f5bd1;
}

.space-note {
    margin-top: 8px;
    font-size: 12px;
    color: #333;
    line-height: 1.4;
    text-align: center;
}

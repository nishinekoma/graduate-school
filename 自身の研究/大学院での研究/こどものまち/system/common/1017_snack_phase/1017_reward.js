let currentSelectedChoice = null;
let isFirstMixConfirm = true;

// ==========================================
// 📊 被験者IDおよび事前アンケートの読み込み
// ==========================================
const participantId = localStorage.getItem('participant_id') || `user_1017_${Date.now()}`;
const surveyData = JSON.parse(localStorage.getItem('survey_data') || '{}');

// 📊 クリックログ
const clickLog = {
    participant_id: participantId,
    survey_attributes: surveyData,
    start_time: new Date().toISOString(),
    counts: { 'mix': 0, 'choco': 0, 'gorgeous': 0, 'cancel': 0, 'upsell_shown': 0, 'changed_to_gorgeous': 0 },
    history: []
};

// 📊 マウスログ (30fps)
const ENABLE_MOUSE_LOG = true; 
const mouseLog = {
    participant_id: participantId,
    survey_attributes: surveyData,
    points: []
};
let lastMouseLogTime = 0;
const MOUSE_LOG_INTERVAL = 1000 / 30; 
let isLoggingActive = true;

function handleMouseMove(e) {
    if (!isLoggingActive || !ENABLE_MOUSE_LOG) return;

    const now = Date.now();
    if (now - lastMouseLogTime >= MOUSE_LOG_INTERVAL) {
        mouseLog.points.push({ x: e.clientX, y: e.clientY, t: now });
        lastMouseLogTime = now;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (ENABLE_MOUSE_LOG) {
        document.addEventListener('mousemove', handleMouseMove);
    }
});

// アクション記録用関数
function recordClickAction(action, detail = null) {
    if (!isLoggingActive) return;

    const timestamp = new Date().toISOString();
    if (clickLog.counts.hasOwnProperty(action)) {
        clickLog.counts[action]++;
    }

    clickLog.history.push({
        action: action,
        detail: detail,
        timestamp: timestamp
    });
}

// JSONファイル自動ダウンロード関数
function downloadJSON(data, filename) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// ==========================================
// 画面操作処理
// ==========================================

function openModal(choice) {
    currentSelectedChoice = choice;
    recordClickAction(choice, `Opened modal for ${choice}`);
    
    const titleEl = document.getElementById('modal-title');
    const bodyEl = document.getElementById('modal-body');
    const submitBtn = document.getElementById('modal-submit-btn');
    const cancelBtn = document.getElementById('modal-cancel-btn');

    // ★修正：ボタンのクリックイベントを標準（決定・キャンセル）にリセット
    submitBtn.onclick = handlePrimarySubmit;
    cancelBtn.onclick = closeConfirmModal;

    submitBtn.style.background = "#2e7d32";
    cancelBtn.style.background = "#e0e0e0";
    cancelBtn.style.color = "#333";
    cancelBtn.innerText = "えらびなおす ↩️";

    if (choice === 'mix') {
        isFirstMixConfirm = true;
        titleEl.innerHTML = "ミックスセット 🍪";
        titleEl.style.color = "#00796b";
        bodyEl.innerHTML = "「ミックスセット」で<ruby>決定<rt>けってい</rt></ruby>してよいですか？";
        submitBtn.innerText = "決定する！";
    } 
    else if (choice === 'choco') {
        titleEl.innerHTML = "チョコレ～～～～ト！！！ 🍫";
        titleEl.style.color = "#d32f2f";
        bodyEl.innerHTML = "「チョコレ～～～～ト！！！」で<ruby>決定<rt>けってい</rt></ruby>してよいですか？";
        submitBtn.innerText = "決定する！";
    } 
    else if (choice === 'gorgeous') {
        titleEl.innerHTML = "豪華おかし🎁";
        titleEl.style.color = "#e65100";
        bodyEl.innerHTML = `
            「豪華おかし」で決定してよいですか？
            <p style="font-size: 10px; color: #b0b0b0; margin-top: 2px; line-height: 1.2;">
                ※1か月目の無料期間が終わると、自動的に毎月3000円のお金がかかります
            </p>
        `;
        submitBtn.innerText = "はい、決定する！";
    }
    document.getElementById('confirm-modal').style.display = 'flex';
}

function handlePrimarySubmit() {
    if (currentSelectedChoice === 'mix' && isFirstMixConfirm) {
        showSecondUpsellModal();
    } else {
        confirmSelection();
    }
}

function showSecondUpsellModal() {
    isFirstMixConfirm = false;
    recordClickAction('upsell_shown', 'Showed second upsell modal for mix');

    const titleEl = document.getElementById('modal-title');
    const bodyEl = document.getElementById('modal-body');
    const submitBtn = document.getElementById('modal-submit-btn');
    const cancelBtn = document.getElementById('modal-cancel-btn');

    titleEl.innerHTML = 'ちょっと<ruby>待<rt>ま</rt></ruby>ってね！ 💡';
    titleEl.style.color = "#ef6c00";
    bodyEl.innerHTML = `
        みんなに一番人気があるのは、<strong><ruby>豪華<rt>ごうか</rt></ruby>おかし</strong>だよ！<br>
        いまなら<ruby>豪華<rt>ごうか</rt></ruby>おかしに<ruby>変更<rt>へんこう</rt></ruby>できるけど、本当にミックスセットのままでいいのかな？
    `;

    // 🚀 キレイな位置で改行（<br>）を入れ、文字落ちを防ぐ（nowrap）
    submitBtn.innerHTML = '<ruby>豪華<rt>ごうか</rt></ruby>おかしに<br><span style="white-space: nowrap;"><ruby>変更<rt>へんこう</rt></ruby>する！ 🚀</span>';
    submitBtn.style.background = "#f57c00";
    submitBtn.onclick = () => { 
        recordClickAction('changed_to_gorgeous', 'User accepted upsell and changed to gorgeous');
        openModal('gorgeous'); 
    };

    // ↩️ 左のボタンもバランスよく改行を入れる
    cancelBtn.innerHTML = 'そのままミックスセットで<br><span style="white-space: nowrap;"><ruby>決定<rt>けってい</rt></ruby>する</span>';
    cancelBtn.style.background = "#e0e0e0";
    cancelBtn.style.color = "#666";
    cancelBtn.onclick = confirmSelection; 
}

function closeConfirmModal() {
    if (currentSelectedChoice) {
        recordClickAction('cancel', `Cancelled ${currentSelectedChoice}`);
    }
    document.getElementById('confirm-modal').style.display = 'none';
    
    // イベントリセット
    const submitBtn = document.getElementById('modal-submit-btn');
    const cancelBtn = document.getElementById('modal-cancel-btn');
    submitBtn.onclick = handlePrimarySubmit;
    cancelBtn.onclick = closeConfirmModal;
}

// ==========================================
// 最終決定処理・ログ保存
// ==========================================
function confirmSelection() {
    if (!currentSelectedChoice) return;

    recordClickAction('confirm', `Final choice: ${currentSelectedChoice}`);

    // ログ記録の停止
    isLoggingActive = false;
    document.removeEventListener('mousemove', handleMouseMove);

    // localStorageへの一時保存（フィードバック画面へ渡す用）
    localStorage.setItem('selected_1017_reward', currentSelectedChoice);
    
    // 💾 JSONファイル出力（ID付きで自動保存）
    downloadJSON(clickLog, `click_log_${participantId}.json`);
    if (ENABLE_MOUSE_LOG) {
        downloadJSON(mouseLog, `mouse_log_${participantId}.json`);
    }

    // フィードバック画面へ遷移
    setTimeout(() => {
        window.location.href = "1017_feedback.html"; 
    }, 300);
}
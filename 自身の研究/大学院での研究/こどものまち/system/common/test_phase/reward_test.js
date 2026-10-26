let currentSelectedChoice = null;
let isFirst300kConfirm = true; // 300kの1回目決定かどうかの判定フラグ

// ==========================================
// 📊 被験者IDおよび事前アンケートの読み込み
// ==========================================
const participantId = localStorage.getItem('participant_id') || `user_${Date.now()}`;
const surveyData = JSON.parse(localStorage.getItem('survey_data') || '{}');

// 📊 クリックログ（2段階目誘導の追跡用カウントも追加）
const clickLog = {
    participant_id: participantId,
    survey_attributes: surveyData,
    start_time: new Date().toISOString(),
    counts: { '300k': 0, '400k': 0, '500k': 0, 'cancel': 0, 'upsell_shown': 0, 'changed_to_500k': 0 },
    history: []
};

// 📊 マウスログ
const ENABLE_MOUSE_LOG = true; 
const mouseLog = {
    participant_id: participantId,
    survey_attributes: surveyData,
    points: []
};
let lastMouseLogTime = 0;
const MOUSE_LOG_INTERVAL = 1000 / 30; // 30fps
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
// 画面操作処理（1段階目モーダル表示）
// ==========================================

function openModal(choice) {
    currentSelectedChoice = choice;
    recordClickAction(choice, `Opened modal for ${choice}`);

    const titleEl = document.getElementById('modal-title');
    const bodyEl = document.getElementById('modal-body');
    const submitBtn = document.getElementById('modal-submit-btn');
    const cancelBtn = document.getElementById('modal-cancel-btn');

    // ボタンの初期スタイルリセット
    submitBtn.style.background = "#2e7d32";
    cancelBtn.style.background = "#e0e0e0";
    cancelBtn.style.color = "#333";
    cancelBtn.innerText = "やめる ↩️";

    if (choice === '300k') {
        isFirst300kConfirm = true; // フラグ初期化
        titleEl.innerHTML = "ほんとうに これでいいの？？ 🤔";
        titleEl.style.color = "#d32f2f";
        bodyEl.innerHTML = `
            いまなら <strong>500k</strong> の<ruby>豪華<rt>ごうか</rt></ruby>なお<ruby>給料<rt>きゅうりょう</rt></ruby>も<ruby>選<rt>えら</rt></ruby>べるよ！<br>
            本当に <strong>300k</strong> で<ruby>決定<rt>けってい</rt></ruby>していいのかな？
        `;
        submitBtn.innerText = "300k で決定する！";
    } 
    else if (choice === '400k') {
        titleEl.innerHTML = "お<ruby>給料<rt>きゅうりょう</rt></ruby>の<ruby>確認<rt>かくにん</rt></ruby> 💳";
        titleEl.style.color = "#00796b";
        bodyEl.innerHTML = `
            「<strong>400k</strong>」のお<ruby>給料<rt>きゅうりょう</rt></ruby>を<ruby>受<rt>う</rt></ruby>け<ruby>取<rt>と</rt></ruby>りますか？
            <p class="popup-trap-subtext">※このお給料を選ぶと、つぎの仕事から毎分100kが自動で引かれます。</p>
        `;
        submitBtn.innerText = "はい、受け取る！";
    } 
    else if (choice === '500k') {
        titleEl.innerHTML = "お<ruby>給料<rt>きゅうりょう</rt></ruby>の<ruby>確認<rt>かくにん</rt></ruby> 💳";
        titleEl.style.color = "#e65100";
        bodyEl.innerHTML = `
            「<strong>500k</strong>（<ruby>豪華<rt>ごうか</rt></ruby>スペシャル）」のお<ruby>給料<rt>きゅうりょう</rt></ruby>を<ruby>受<rt>う</rt></ruby>け<ruby>取<rt>と</rt></ruby>りますか？
            <p class="popup-trap-subtext">※受け取り手数料として、その場で250kが引かれます。</p>
        `;
        submitBtn.innerText = "はい、受け取る！";
    }

    document.getElementById('confirm-modal').style.display = 'flex';
}

// 💡 決定ボタンが押されたときの振り分け
function handlePrimarySubmit() {
    if (currentSelectedChoice === '300k' && isFirst300kConfirm) {
        // 300kの1回目送信時 ➔ 自然な2段階目誘導モーダルを開く
        showSecondUpsellModal();
    } else {
        // それ以外（400k, 500k, または300kの2回目確定）➔ 最終送信
        confirmSelection();
    }
}

// ==========================================
// 💡 2段階目：自然な500kへの誘導ポップアップ
// ==========================================
function showSecondUpsellModal() {
    isFirst300kConfirm = false;
    recordClickAction('upsell_shown', 'Showed second upsell modal for 300k');

    const titleEl = document.getElementById('modal-title');
    const bodyEl = document.getElementById('modal-body');
    const submitBtn = document.getElementById('modal-submit-btn');
    const cancelBtn = document.getElementById('modal-cancel-btn');

    // タイトル
    titleEl.innerHTML = 'ちょっと<ruby>待<rt>ま</rt></ruby>ってね！ 💡';
    titleEl.style.color = "#ef6c00";

    // 本文（ルビタグのみ使用・カッコ書き排除）
    bodyEl.innerHTML = `
        <ruby>隊員<rt>たいいん</rt></ruby>のみんなに 一番 人気があるのは、<br><strong>500k</strong>（<ruby>豪華<rt>ごうか</rt></ruby>スペシャル）だよ！<br>
        いまなら 500k に<ruby>変更<rt>へんこう</rt></ruby>できるけど、本当に 300k の<br>ままでいいのかな？
    `;

    // ボタン1：目立つオレンジ（500kへ変更）
    submitBtn.innerHTML = '500k に<ruby>変更<rt>へんこう</rt></ruby>する！ 🚀';
    submitBtn.style.background = "#f57c00";

    // ボタン2：控えめなグレー（300kで確定）
    cancelBtn.innerHTML = 'そのまま 300k で<ruby>決定<rt>けってい</rt></ruby>する';
    cancelBtn.style.background = "#e0e0e0";
    cancelBtn.style.color = "#666";

    // イベント割り当て
    submitBtn.onclick = switchTo500k;
    cancelBtn.onclick = confirmSelection;
}

// 2段階目誘導で「500kに変更する」を押した場合
function switchTo500k() {
    recordClickAction('changed_to_500k', 'User accepted upsell and changed from 300k to 500k');

    // ボタンのイベントを元に戻す
    resetModalButtonEvents();

    // 500kの確認モーダルへ切り替え
    openModal('500k');
}

// ボタンの標準イベント復元
function resetModalButtonEvents() {
    const submitBtn = document.getElementById('modal-submit-btn');
    const cancelBtn = document.getElementById('modal-cancel-btn');
    submitBtn.onclick = handlePrimarySubmit;
    cancelBtn.onclick = closeConfirmModal;
}

function closeConfirmModal() {
    if (currentSelectedChoice) {
        recordClickAction('cancel', `Cancelled ${currentSelectedChoice}`);
    }
    resetModalButtonEvents();
    document.getElementById('confirm-modal').style.display = 'none';
    currentSelectedChoice = null;
}

// ==========================================
// 最終決定処理・データ保存・ダウンロード
// ==========================================
function confirmSelection() {
    if (!currentSelectedChoice) return;

    recordClickAction('confirm', `Final choice: ${currentSelectedChoice}`);

    // ログ記録の停止
    isLoggingActive = false;
    document.removeEventListener('mousemove', handleMouseMove);

    // localStorageへの一時保存
    localStorage.setItem('selected_reward', currentSelectedChoice);
    localStorage.setItem('reward_timestamp', new Date().toISOString());
    localStorage.setItem('reward_click_log', JSON.stringify(clickLog));
    if (ENABLE_MOUSE_LOG) {
        localStorage.setItem('reward_mouse_log', JSON.stringify(mouseLog));
    }

    // 💾 ファイル出力（ID付きで保存）
    downloadJSON(clickLog, `click_log_${participantId}.json`);
    if (ENABLE_MOUSE_LOG) {
        downloadJSON(mouseLog, `mouse_log_${participantId}.json`);
    }

    // 🔄 次の被験者のために一時ストレージをリセット
    localStorage.removeItem('participant_id');
    localStorage.removeItem('survey_data');

    resetModalButtonEvents();

    // フィードバック画面へ遷移
    setTimeout(() => {
        if (window.parent && window.parent !== window) {
            window.parent.postMessage({ type: 'NEXT_PHASE' }, '*');
        } else {
            window.location.href = "../feedback_phase/feedback.html";
        }
    }, 300);
}
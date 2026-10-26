// 発見した罠を記録するセット
const foundTraps = new Set();
const totalTraps = 6;

// 罠の種類ごとの解説メッセージ
const trapMessages = {
    'hidden': '「<ruby>小<rt>ちい</rt></ruby>さく<ruby>書<rt>か</rt></ruby>いて<ruby>隠<rt>かく</rt></ruby>す」ダークパターンだ！<br>「サブスクリプション（<ruby>毎分<rt>まいふん</rt></ruby>お<ruby>金<rt>かね</rt></ruby>をはらうしくみ）」は、わるいことじゃないよ。<br>でも、<ruby>小<rt>ちい</rt></ruby>さく<ruby>書<rt>か</rt></ruby>いて<ruby>気<rt>き</rt></ruby>づかないうちに払わせるのが「ズルい<ruby>罠<rt>わな</rt></ruby>」なんだ！',
    'timer': '「<ruby>嘘<rt>うそ</rt></ruby>のタイマーで<ruby>焦<rt>あせ</rt></ruby>らせる」ダークパターンだ！<br><ruby>急<rt>いそ</rt></ruby>がせて、よく<ruby>考<rt>かんが</rt></ruby>えずに<ruby>買<rt>か</rt></ruby>わせようとしているよ。',
    'sneak': '「<ruby>勝手<rt>かって</rt></ruby>に<ruby>追加<rt>ついか</rt></ruby>する」ダークパターンだ！<br><ruby>頼<rt>たの</rt></ruby>んでいないオプションに<ruby>最初<rt>さいしょ</rt></ruby>からチェックが入っているよ。',
    'scarcity': '「<ruby>残<rt>のこ</rt></ruby>りあと<ruby>少<rt>すこ</rt></ruby>し！」とウソをついて<ruby>焦<rt>あせ</rt></ruby>らせるダークパターンだ！<br><ruby>売<rt>う</rt></ruby>り<ruby>切<rt>き</rt></ruby>れても、また<ruby>後<rt>あと</rt></ruby>で<ruby>商品<rt>しょうひん</rt></ruby>が入ってくる（<ruby>再入荷<rt>さいにゅうか</rt></ruby>する）かもしれないから、<ruby>急<rt>いそ</rt></ruby>がずに<ruby>落<rt>お</rt></ruby>ち<ruby>着<rt>つ</rt></ruby>いて<ruby>考<rt>かんが</rt></ruby>えよう。',
    'shame': '「<ruby>罪悪感<rt>ざいあくかん</rt></ruby>をあおる」ダークパターンだ！<br><ruby>断<rt>ことわ</rt></ruby>るボタンを<ruby>押<rt>お</rt></ruby>しにくくする、ずるい<ruby>言葉遣<rt>ことばづか</rt></ruby>いだよ。',
    'privacy': '「<ruby>個人情報<rt>こじんじょうほう</rt></ruby>をうばう」ダークパターンだ！<br><ruby>割引<rt>わりびき</rt></ruby>をエサにして、<ruby>買<rt>か</rt></ruby>い<ruby>物<rt>もの</rt></ruby>に<ruby>必要<rt>ひつよう</rt></ruby>ない「<ruby>電話番号<rt>でんわばんごう</rt></ruby>」などの<ruby>情報<rt>じょうほう</rt></ruby>を<ruby>聞<rt>き</rt></ruby>き<ruby>出<rt>だ</rt></ruby>そうとしているよ。'
};

// ==========================================
// 📊 ログ収集システムの追加 (Day 1: Education)
// ==========================================
const participantId = localStorage.getItem('participant_id') || `user_${Date.now()}`;
const surveyData = JSON.parse(localStorage.getItem('survey_data') || '{}');

// 📊 クリックログ
const clickLog = {
    participant_id: participantId,
    survey_attributes: surveyData,
    phase: "day1_education",
    start_time: new Date().toISOString(),
    counts: { 
        'found_hidden': 0, 'found_timer': 0, 'found_sneak': 0, 
        'found_scarcity': 0, 'found_shame': 0, 'found_privacy': 0,
        'safe_item_clicked': 0
    },
    history: []
};

// 📊 マウスログ (30fps)
const ENABLE_MOUSE_LOG = true; 
const mouseLog = {
    participant_id: participantId,
    survey_attributes: surveyData,
    phase: "day1_education",
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

function recordClickAction(action, detail = null) {
    if (!isLoggingActive) return;
    const timestamp = new Date().toISOString();
    if (clickLog.counts.hasOwnProperty(action)) {
        clickLog.counts[action]++;
    }
    clickLog.history.push({ action: action, detail: detail, timestamp: timestamp });
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

// ------------------------------------
// リアルタイムのカウントダウンタイマー処理
// ------------------------------------
let timeInSeconds = 3 * 60 + 52; // 3分52秒
const timerElement = document.getElementById('countdown-timer');

setInterval(() => {
    if (timeInSeconds > 0) {
        timeInSeconds--;
        const minutes = Math.floor(timeInSeconds / 60).toString().padStart(2, '0');
        const seconds = (timeInSeconds % 60).toString().padStart(2, '0');
        if(timerElement) {
            timerElement.innerText = `${minutes}:${seconds}`;
        }
    }
}, 1000);

// ------------------------------------
// トラップ関連の処理
// ------------------------------------

// 罠をクリックしたときの処理
function findTrap(trapType, element) {
    if (foundTraps.has(trapType)) return; 

    foundTraps.add(trapType);
    element.classList.add('found'); 

    // ★ ログの記録
    recordClickAction(`found_${trapType}`, `Found trap: ${trapType}`);

    document.getElementById('progress-text').innerText = `（${foundTraps.size} / ${totalTraps}）`;

    const msg = trapMessages[trapType];
    document.getElementById('success-message').innerHTML = msg;

    // ボタンを最初は非表示（透明）にし、3秒後にフェードイン表示
    const goodBtn = document.querySelector('#success-overlay .good-btn');
    if (goodBtn) {
        goodBtn.disabled = true;
        goodBtn.classList.add('fade-hidden');

        setTimeout(() => {
            goodBtn.disabled = false;
            goodBtn.classList.remove('fade-hidden');
        }, 3000);
    }

    document.getElementById('success-overlay').style.display = 'flex';
}

// 解説ポップアップを閉じる処理
function closeSuccess() {
    recordClickAction('close_explanation', `Closed explanation for a trap`);
    document.getElementById('success-overlay').style.display = 'none';

    if (foundTraps.size >= totalTraps) {
        setTimeout(() => {
            document.getElementById('clear-overlay').style.display = 'flex';
        }, 500);
    }
}

// 実践フェーズへの遷移 ＆ ★ログのダウンロード処理
function goToNextPhase() {
    recordClickAction('finish_education', 'Completed all traps and moving to test phase');
    isLoggingActive = false;
    document.removeEventListener('mousemove', handleMouseMove);

    // 💾 JSONファイル出力（ファイル名に phase を明記）
    downloadJSON(clickLog, `click_log_education_${participantId}.json`);
    if (ENABLE_MOUSE_LOG) {
        downloadJSON(mouseLog, `mouse_log_education_${participantId}.json`);
    }

    // 次のフェーズへ
    setTimeout(() => {
        if (window.parent && window.parent !== window) {
            window.parent.postMessage({ type: 'NEXT_PHASE' }, '*');
        } else {
            window.location.href = "../../common/test_phase/reward_test.html";
        }
    }, 500);
}

// ------------------------------------
// コンファーム・シェイミング用ポップアップ
// ------------------------------------
function showShameTrap() {
    if(!foundTraps.has('shame')) {
        recordClickAction('open_shame_modal', 'Opened the confirmshaming trap modal');
        document.getElementById('shame-modal').style.display = 'flex';
    }
}

function closeShameTrap() {
    document.getElementById('shame-modal').style.display = 'none';
}

// ------------------------------------
// プライバシー強制用ポップアップ
// ------------------------------------
function showPrivacyTrap() {
    if(!foundTraps.has('privacy')) {
        recordClickAction('open_privacy_modal', 'Opened the privacy trap modal');
        document.getElementById('privacy-modal').style.display = 'flex';
    }
}

function closePrivacyTrap() {
    document.getElementById('privacy-modal').style.display = 'none';
}

// ------------------------------------
// 安全なボタン（ダミー）の処理
// ------------------------------------
document.querySelectorAll('.safe-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        recordClickAction('safe_item_clicked', 'Clicked a safe item');
        document.getElementById('safe-cart-modal').style.display = 'flex';
    });
});

function closeSafeCart() {
    document.getElementById('safe-cart-modal').style.display = 'none';
}
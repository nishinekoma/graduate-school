// ==========================================
// 🚀 システム統合コンポーネント管理
// ==========================================

// 各フェーズの部品HTMLの相対パス定義
const PHASES = {
    1: '../common/survey_phase/survey.html',   // 👈 事前アンケートを追加
    2: './description_phase/description.html',  // 説明フェーズ
    3: './learning_phase/dark_education.html',  // 学習フェーズ
    4: '../common/1017_snack_phase/1017_reward.html', // 実践テストフェーズ
    5: '../common/1017_snack_phase/1017_feedback.html' // フィードバックフェーズ
};

const frame = document.getElementById('component-frame');

// 画面読み込み時：フェーズ1（説明画面）からロード開始
document.addEventListener('DOMContentLoaded', () => {
    // 初回実行時に被験者IDがなければ自動生成
    if (!localStorage.getItem('participant_id')) {
        const newId = `user_${Date.now()}`;
        localStorage.setItem('participant_id', newId);
        console.log(`[SYSTEM] New Participant ID generated: ${newId}`);
    }

    // フェーズ1を呼び出し
    loadPhase(1);
});

// コンポーネント（指定フェーズ）の呼び出し関数
function loadPhase(phaseNumber) {
    if (PHASES[phaseNumber]) {
        localStorage.setItem('current_phase', phaseNumber);
        frame.src = PHASES[phaseNumber];
        console.log(`[SYSTEM] Loaded Phase ${phaseNumber}: ${PHASES[phaseNumber]}`);
    }
}

// ==========================================
// 🔄 各部品画面からの遷移イベントの受信
// ==========================================
window.addEventListener('message', (event) => {
    // 子画面（部品）から 「next_phase」 メッセージが届いたら次のフェーズへ切替
    if (event.data && event.data.type === 'NEXT_PHASE') {
        const currentPhase = parseInt(localStorage.getItem('current_phase') || '1', 10);
        loadPhase(currentPhase + 1);
    }
});
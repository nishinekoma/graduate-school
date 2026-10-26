// Day 2 (対照群: クイズフェーズ経由) の順序を定義
const phases = [
    "../common/survey_phase/survey.html",         // 1. 事前アンケート
    "./description_phase/description_day2.html",  // 2. 説明フェーズ
    "./quiz_phase/quiz.html",                      // 3. クイズ学習フェーズ
    "../common/1017_snack_phase/1017_reward.html",       // 4. 共通実践テストフェーズ
    "../common/1017_snack_phase/1017_feedback.html"       // 5. 共通フィードバックフェーズ
];

let currentPhaseIndex = 0;
const mainFrame = document.getElementById('main-frame');

// 子要素（iframe内部）からのフェーズ遷移命令を受信して切り替え
window.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'NEXT_PHASE') {
        currentPhaseIndex++;
        if (currentPhaseIndex < phases.length) {
            mainFrame.src = phases[currentPhaseIndex];
            console.log(`[Day 2 App] Navigated to phase ${currentPhaseIndex}: ${phases[currentPhaseIndex]}`);
        } else {
            console.log("[Day 2 App] All phases completed.");
        }
    }
});
document.getElementById('survey-form').addEventListener('submit', (e) => {
    e.preventDefault();

    // 毎回ユニークな被験者IDを発行 (例: user_20261003_142030)
    const now = new Date();
    const timestamp = now.getFullYear() +
        String(now.getMonth() + 1).padStart(2, '0') +
        String(now.getDate()).padStart(2, '0') + '_' +
        String(now.getHours()).padStart(2, '0') +
        String(now.getMinutes()).padStart(2, '0') +
        String(now.getSeconds()).padStart(2, '0');
    const participantId = `user_${timestamp}`;

    // アンケート結果の取得
    const surveyData = {
        participant_id: participantId,
        submitted_at: new Date().toISOString(),
        age: document.getElementById('age').value,
        grade: document.getElementById('grade').value,
        gender: document.getElementById('gender').value,
        search_freq: document.getElementById('search_freq').value,
        device_own: document.getElementById('device_own').value,
        game_freq: document.getElementById('game_freq').value
    };

    // localStorageに保存
    localStorage.setItem('participant_id', participantId);
    localStorage.setItem('survey_data', JSON.stringify(surveyData));

    console.log('[SURVEY] Saved survey data:', surveyData);

    // 次のフェーズへ移動命令を送信
    if (window.parent && window.parent !== window) {
        window.parent.postMessage({ type: 'NEXT_PHASE' }, '*');
    }
});
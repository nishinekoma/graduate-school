// --- 状態管理 ---
let currentTool = null; // 'glass' or 'stop'
let fomoInterval;
let timerInterval;

// --- ツールの選択処理 ---
document.getElementById('tool-glass').addEventListener('click', function() {
    currentTool = 'glass';
    this.classList.add('tool-active');
    document.getElementById('tool-stop').classList.remove('tool-active');
    document.body.style.cursor = 'zoom-in'; // カーソルを虫眼鏡風に
});

document.getElementById('tool-stop').addEventListener('click', function() {
    currentTool = 'stop';
    this.classList.add('tool-active');
    document.getElementById('tool-glass').classList.remove('tool-active');
    document.body.style.cursor = 'not-allowed'; // カーソルを停止風に
    
    // 発動中の動的罠をフリーズさせる
    clearInterval(timerInterval);
    clearInterval(fomoInterval);
    const timer = document.getElementById('trap2-timer');
    if(timer) timer.classList.add('frozen');
});

// --- 動的罠の発動（System 1への攻撃） ---

// 罠②：ホバーで発動するタイマー
const trap2Card = document.getElementById('trap2');
const trap2Timer = document.getElementById('trap2-timer');
const timeDisplay = document.getElementById('t2-time');

trap2Card.addEventListener('mouseenter', () => {
    if (trap2Timer.style.display !== 'block' && currentTool !== 'stop') {
        trap2Timer.style.display = 'block';
        let timeLeft = 239; // 3分59秒
        timerInterval = setInterval(() => {
            timeLeft--;
            let m = Math.floor(timeLeft / 60);
            let s = timeLeft % 60;
            timeDisplay.innerText = `0${m}:${s < 10 ? '0' : ''}${s}`;
            if (timeLeft <= 0) clearInterval(timerInterval);
        }, 1000);
    }
});

// 罠④：FOMOの点滅ポップアップ
const trap4Card = document.getElementById('trap4');
const trap4Popup = document.getElementById('trap4-popup');

trap4Card.addEventListener('mouseenter', () => {
    if (!fomoInterval && currentTool !== 'stop') {
        fomoInterval = setInterval(() => {
            trap4Popup.style.display = (trap4Popup.style.display === 'none' || trap4Popup.style.display === '') ? 'block' : 'none';
        }, 800);
    }
});

// --- 罠をクリックしてしまった場合（失敗） ---
function checkTrap(trapId) {
    const msg = [
        "💸 失敗！ 毎月3,000円引かれる定期購入に登録してしまった！",
        "⏳ 失敗！ タイマーに焦らされて正常な判断ができなかった！",
        "📦 失敗！ 勝手に追加されたオプション料金（800円）を払わされた！",
        "👀 失敗！ 「みんな買ってる」という焦りに負けてしまった！",
        "😭 失敗！ 罪悪感を煽る言葉に騙されてボタンを押してしまった！"
    ];
    document.getElementById('game-over-message').innerText = msg[trapId - 1];
    document.getElementById('game-over-overlay').style.display = 'flex';
}

// --- UIの改修（ドラッグ＆ドロップでゴミ箱へ） ---

// 虫眼鏡ツールで視覚的干渉（罠①）を暴く
document.getElementById('trap1-text').addEventListener('click', function() {
    if (currentTool === 'glass') {
        this.classList.add('revealed');
        this.innerText = "🚨 警告：自動定期購入コースに登録されます！ 🚨";
        this.style.cursor = 'grab';
    }
});

// ドラッグ開始設定
const traps = document.querySelectorAll('[draggable="true"]');
traps.forEach(trap => {
    trap.addEventListener('dragstart', (e) => {
        // ストッパー使用時か、虫眼鏡で暴いた後のみドラッグ可能にする等の制御も可能
        e.dataTransfer.setData('text/plain', e.target.id);
    });
});

// ゴミ箱の処理
const trashCan = document.getElementById('trash-can');
trashCan.addEventListener('dragover', (e) => { e.preventDefault(); trashCan.classList.add('dragover'); });
trashCan.addEventListener('dragleave', () => trashCan.classList.remove('dragover'));
trashCan.addEventListener('drop', (e) => {
    e.preventDefault();
    trashCan.classList.remove('dragover');
    
    const trapId = e.dataTransfer.getData('text/plain');
    const trapElement = document.getElementById(trapId);
    
    if (trapElement) {
        trapElement.remove(); // 罠要素をDOMから完全に削除
        
        // 成功メッセージの設定
        let successMsg = "";
        if (trapId.includes('trap1')) successMsg = "隠された「定期購入」の文字を見抜き、削除しました！";
        if (trapId.includes('trap2')) successMsg = "焦らせる「嘘のタイマー」をストッパーで止め、破棄しました！";
        if (trapId.includes('trap3')) successMsg = "勝手に追加された「有料オプション」を排除しました！";
        if (trapId.includes('trap4')) successMsg = "他人の購入を煽る「嘘のポップアップ」を削除しました！";
        if (trapId.includes('trap5')) successMsg = "罪悪感を煽る「キャンセルボタン」のテキストを破壊しました！";

        document.getElementById('success-message').innerText = successMsg;
        document.getElementById('success-overlay').style.display = 'flex';
        
        // ツールのリセット
        currentTool = null;
        document.querySelectorAll('.tool-btn').forEach(btn => btn.classList.remove('tool-active'));
        document.body.style.cursor = 'default';
    }
});

function closeSuccess() {
    document.getElementById('success-overlay').style.display = 'none';
}
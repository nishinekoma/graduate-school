// 発見した罠を記録するセット
const foundTraps = new Set();
const totalTraps = 5;

// 罠の種類ごとの解説メッセージ
const trapMessages = {
    'hidden': '「小さく書いて隠す」ダークパターンだ！\n安いと思わせて、実は毎月お金をとられる罠だよ。',
    'timer': '「嘘のタイマーで焦らせる」ダークパターンだ！\n急がせて、よく考えずに買わせようとしているよ。',
    'sneak': '「勝手に追加する」ダークパターンだ！\n頼んでいないオプションに最初からチェックが入っているよ。',
    'fomo': '「みんな買っていると焦らせる」ダークパターンだ！\n本当かどうかわからない数字を出して、急いで買わせようとしているよ。',
    'shame': '「罪悪感をあおる」ダークパターンだ！\n断るボタンを押しにくくする、ずるい言葉遣いだよ。'
};

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

    document.getElementById('progress-text').innerText = `（${foundTraps.size} / ${totalTraps}）`;

    const msg = trapMessages[trapType];
    document.getElementById('success-message').innerText = msg;
    document.getElementById('success-overlay').style.display = 'flex';
}

// 解説ポップアップを閉じる処理
function closeSuccess() {
    document.getElementById('success-overlay').style.display = 'none';

    if (foundTraps.size >= totalTraps) {
        setTimeout(() => {
            document.getElementById('clear-overlay').style.display = 'flex';
        }, 500);
    }
}

// 実践フェーズ（テスト環境）への遷移
function goToNextPhase() {
    window.location.href = "../test_phase/test.html";
}

// ------------------------------------
// コンファーム・シェイミング用ポップアップ
// ------------------------------------
function showShameTrap() {
    // 既に発見済みの場合は出さない
    if(!foundTraps.has('shame')) {
        document.getElementById('shame-modal').style.display = 'flex';
    }
}

function closeShameTrap() {
    document.getElementById('shame-modal').style.display = 'none';
}

// ------------------------------------
// 安全なボタン（ダミー）の処理
// ------------------------------------
document.querySelectorAll('.safe-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.getElementById('safe-cart-modal').style.display = 'flex';
    });
});

function closeSafeCart() {
    document.getElementById('safe-cart-modal').style.display = 'none';
}
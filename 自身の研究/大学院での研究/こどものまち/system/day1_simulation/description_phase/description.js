let currentStep = 0;
const slides = document.querySelectorAll('.slide');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');

// チュートリアル用の発見状態管理
const foundTutorialTraps = new Set();
let slideTimer = null; // ボタンタイマー
let hintTimer = null;  // 10秒ヒントタイマー
let resumeBtnTimer = null; // 3秒後タイマー

function changeSlide(direction) {
    slides[currentStep].classList.remove('active');
    currentStep += direction;

    if (currentStep >= slides.length) {
        if (window.parent && window.parent !== window) {
            window.parent.postMessage({ type: 'NEXT_PHASE' }, '*');
        } else {
            window.location.href = "../learning_phase/dark_education.html";
        }
        return;
    }

    slides[currentStep].classList.add('active');
    updateButtons();
}

function updateButtons() {
    if (slideTimer) { clearTimeout(slideTimer); slideTimer = null; }
    if (hintTimer) { clearTimeout(hintTimer); hintTimer = null; }

    // 1枚目スライド
    if (currentStep === 0) {
        prevBtn.style.visibility = 'hidden';
        nextBtn.innerText = "つぎへ ➡";
        nextBtn.classList.remove('start-btn');
        nextBtn.disabled = true;
        slideTimer = setTimeout(() => { nextBtn.disabled = false; }, 2000);
        return;
    } else {
        prevBtn.style.visibility = 'visible';
    }

    // 2枚目スライド
    if (currentStep === 1) {
        nextBtn.innerText = "つぎへ ➡";
        nextBtn.classList.remove('start-btn');
        nextBtn.disabled = true;
        slideTimer = setTimeout(() => { nextBtn.disabled = false; }, 3000);
        return;
    }

    // 3枚目（チュートリアル）：2つ両方見つけるまで「つぎへ」は完全にロック
    if (currentStep === 2) {
        nextBtn.innerText = "つぎへ ➡";
        nextBtn.classList.remove('start-btn');
        if (foundTutorialTraps.size < 2) {
            nextBtn.disabled = true; // 🔒 ロック
            if (foundTutorialTraps.size === 0) {
                startHintTimer();
            }
        } else {
            nextBtn.disabled = false;
        }
        return;
    }

    // 4枚目（ミッション説明）
    if (currentStep === 3) {
        nextBtn.innerText = "パトロールをはじめる！ 🚀";
        nextBtn.classList.add('start-btn');
        nextBtn.disabled = true;
        slideTimer = setTimeout(() => { nextBtn.disabled = false; }, 5000);
        return;
    }

    nextBtn.innerText = "つぎへ ➡";
    nextBtn.classList.remove('start-btn');
    nextBtn.disabled = false;
}

// 10秒後に未発見の罠を優しく点滅させる処理
function startHintTimer() {
    hintTimer = setTimeout(() => {
        if (!foundTutorialTraps.has('hidden')) {
            document.getElementById('trap-hidden').classList.add('hint-blink');
        }
        if (!foundTutorialTraps.has('discount')) {
            document.getElementById('trap-discount').classList.add('hint-blink');
        }
    }, 10000);
}

// チュートリアルの罠をクリックしたときの処理
function findTrap(trapType) {
    if (foundTutorialTraps.has(trapType)) return;

    foundTutorialTraps.add(trapType);

    // カウント表示の更新
    document.getElementById('tutorial-count').innerText = foundTutorialTraps.size;

    const successBox = document.getElementById('tutorial-success');
    const successTitle = document.getElementById('tutorial-success-title');
    const explanationText = document.getElementById('tutorial-explanation-text');
    const resumeBtn = document.getElementById('resume-search-btn');

    const cardHiddenBox = document.getElementById('card-hidden-box');
    const cardDiscountBox = document.getElementById('card-discount-box');

    // 8歳（小学2年生）向け具体的解説テキスト
    const hiddenExplanation = `
        目立たないように小さな文字で書いて、<br>
        <strong><ruby>気付<rt>きづ</rt></ruby>かないうちに<ruby>毎月<rt>まいつき</rt></ruby>お金をはらわせようとするズルい<ruby>罠<rt>わな</rt></ruby></strong>なんだよ！
    `;

    const discountExplanation = `
        「1,150円が 800円になったよ！」と書かれているけれど、<br>
        実は<ruby>最初<rt>さいしょ</rt></ruby>から800円で売っていたんだ！<br>
        <strong>「前は高かったのに安くなった！」とカン違いさせて買わせようとするズルい<ruby>罠<rt>わな</rt></ruby></strong>なんだよ！
    `;

    if (resumeBtnTimer) clearTimeout(resumeBtnTimer);
    resumeBtn.style.display = 'none';

    // 1つ目の発見時
    if (foundTutorialTraps.size === 1) {
        if (trapType === 'hidden') {
            document.getElementById('trap-hidden').classList.remove('hint-blink');
            document.getElementById('trap-hidden').classList.add('found');
            cardDiscountBox.style.display = 'none'; // もう片方を隠す
            explanationText.innerHTML = hiddenExplanation;
        } else if (trapType === 'discount') {
            document.getElementById('trap-discount').classList.remove('hint-blink');
            document.getElementById('trap-discount').classList.add('found');
            cardHiddenBox.style.display = 'none'; // もう片方を隠す
            explanationText.innerHTML = discountExplanation;
        }

        successTitle.innerText = "あやしい場所を見つけられたね！ 大正解！";

        // ⏱️ 3秒後に「もう１つの罠を探す」ボタンを表示
        resumeBtnTimer = setTimeout(() => {
            resumeBtn.style.display = 'inline-block';
        }, 3000);
    } 
    // 2つ目（両方）の発見時
    else if (foundTutorialTraps.size >= 2) {
        // 両方のカードを再表示
        cardHiddenBox.style.display = 'flex';
        cardDiscountBox.style.display = 'flex';
        resumeBtn.style.display = 'none';

        if (trapType === 'hidden') {
            document.getElementById('trap-hidden').classList.remove('hint-blink');
            document.getElementById('trap-hidden').classList.add('found');
            explanationText.innerHTML = hiddenExplanation;
        } else if (trapType === 'discount') {
            document.getElementById('trap-discount').classList.remove('hint-blink');
            document.getElementById('trap-discount').classList.add('found');
            explanationText.innerHTML = discountExplanation;
        }

        // 個別解説の後に、簡潔なまとめを追加（黒文字）
        successTitle.innerHTML = "２つとも みつけたね！ すごいぞ！";
        explanationText.innerHTML += `
            <br><span style="font-weight: bold; color: #333;">２つの<ruby>罠<rt>わな</rt></ruby>を みつけられたね！ 本番もバッチリだ！</span>
        `;

        // ⏱️ 2つ目も解説をしっかり読ませるため、3秒後に「つぎへ」ボタンを解禁！
        nextBtn.disabled = true;
        setTimeout(() => {
            nextBtn.disabled = false;
        }, 3000);
    }

    successBox.style.display = "block";
}

// 「もう１つの罠を探す 🔍」ボタンを押したときのカード再表示処理
function resumeSearch() {
    document.getElementById('card-hidden-box').style.display = 'flex';
    document.getElementById('card-discount-box').style.display = 'flex';
    document.getElementById('tutorial-success').style.display = 'none';
    document.getElementById('resume-search-btn').style.display = 'none';

    // まだ見つかっていない罠のヒントタイマーを再起動
    startHintTimer();
}

// 初期ロード時のボタン状態セット
updateButtons();
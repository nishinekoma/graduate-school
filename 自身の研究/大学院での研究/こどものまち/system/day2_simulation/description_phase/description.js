let currentStep = 0;
const slides = document.querySelectorAll('.slide');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');

let slideTimer = null; // ボタンタイマー

function changeSlide(direction) {
    slides[currentStep].classList.remove('active');
    currentStep += direction;

    if (currentStep >= slides.length) {
        if (window.parent && window.parent !== window) {
            window.parent.postMessage({ type: 'NEXT_PHASE' }, '*');
        } else {
            window.location.href = "../quiz_phase/quiz.html";
        }
        return;
    }

    slides[currentStep].classList.add('active');
    updateButtons();
}

function updateButtons() {
    if (slideTimer) { clearTimeout(slideTimer); slideTimer = null; }

    // 1枚目スライド（ECの仕組み）
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

    // 2枚目スライド（ダークパターンとは）
    if (currentStep === 1) {
        nextBtn.innerText = "つぎへ ➡";
        nextBtn.classList.remove('start-btn');
        nextBtn.disabled = true;
        slideTimer = setTimeout(() => { nextBtn.disabled = false; }, 3000);
        return;
    }

    // 3枚目スライド（Day2用：クイズの解き方説明）
    if (currentStep === 2) {
        nextBtn.innerText = "つぎへ ➡";
        nextBtn.classList.remove('start-btn');
        nextBtn.disabled = true;
        // ⏱️ 2秒後に「つぎへ」ボタンを解禁
        slideTimer = setTimeout(() => { nextBtn.disabled = false; }, 2000);
        return;
    }

    // 4枚目スライド（ミッション説明）
    if (currentStep === 3) {
        nextBtn.innerText = "パトロールをはじめる！ 🚀";
        nextBtn.classList.add('start-btn');
        nextBtn.disabled = true;
        slideTimer = setTimeout(() => { nextBtn.disabled = false; }, 4000);
        return;
    }

    nextBtn.innerText = "つぎへ ➡";
    nextBtn.classList.remove('start-btn');
    nextBtn.disabled = false;
}

// 初期ロード時のボタン状態セット
updateButtons();
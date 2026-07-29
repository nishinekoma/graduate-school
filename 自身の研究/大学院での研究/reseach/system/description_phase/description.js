let currentStep = 0;
const slides = document.querySelectorAll('.slide');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
let tutorialCompleted = false; // チュートリアルをクリアしたかどうかの判定

function changeSlide(direction) {
    slides[currentStep].classList.remove('active');
    currentStep += direction;

    if (currentStep >= slides.length) {
        window.location.href = "../learning_phase/dark_education.html";
        return;
    }

    slides[currentStep].classList.add('active');
    updateButtons();
}

function updateButtons() {
    // 最初の画面では「もどる」を隠す
    if (currentStep === 0) {
        prevBtn.style.visibility = 'hidden';
    } else {
        prevBtn.style.visibility = 'visible';
    }

    // 最後の画面の処理
    if (currentStep === slides.length - 1) {
        nextBtn.innerText = "パトロールをはじめる！ 🚀";
        nextBtn.classList.add('start-btn');
        nextBtn.disabled = false;
    } else {
        nextBtn.innerText = "つぎへ ➡";
        nextBtn.classList.remove('start-btn');

        // チュートリアルの画面（3枚目: indexが2）で、まだクリアしていない場合はボタンを無効化
        if (currentStep === 2 && !tutorialCompleted) {
            nextBtn.disabled = true;
        } else {
            nextBtn.disabled = false;
        }
    }
}

// チュートリアルの罠をクリックしたときの処理
function findTrap() {
    const trap = document.getElementById('tutorial-trap');
    const msg = document.getElementById('tutorial-success');
    
    trap.style.color = "#d32f2f";
    trap.style.fontWeight = "bold";
    trap.style.fontSize = "1.2em";
    msg.style.display = "block";

    // クリア状態にして「つぎへ」ボタンを有効化する
    tutorialCompleted = true;
    updateButtons();
}
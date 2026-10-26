let currentStep = 1;
let timer = null;

document.addEventListener('DOMContentLoaded', () => {
    setupFeedbackContent();
    startStepTimer(1);
});

function setupFeedbackContent() {
    const selectedReward = localStorage.getItem('selected_1017_reward') || 'mix';
    const previewEl = document.getElementById('trap-preview-area');
    const step2Body = document.getElementById('step2-body');
    const step3Body = document.getElementById('step3-body');

    if (selectedReward === 'mix') {
        // --- ミックス（正解） ---
        // ★修正：カッコ書きを排除し、緑の枠を追加
        previewEl.innerHTML = `
            <div class="key-message-box">
                <p class="key-body">
                    あやしい言葉につられず、<strong>自分でしっかり<ruby>確<rt>たし</rt></ruby>かめて おかしを<ruby>選<rt>えら</rt></ruby>べたね！カッコいいぞ！</strong>
                </p>
            </div>
            <div class="payout-box" style="margin-top: 20px;">
                <span class="payout-label">おかしを受け取ろう！</span>
            </div>
        `;
    } 
    else if (selectedReward === 'choco') {
        // --- チョコ（罠1） ---
        previewEl.innerHTML = `
            <div class="mini-popup">
                <p class="mini-main">チョコレ～～～～ト！！！</p>
                <div class="trap-highlight">👉 ここ！【個数1つ】と 小さく 書いてあるよ</div>
            </div>
        `;
        // ★修正：カッコ書きを排除
        step2Body.innerHTML = `
            <p>
                もし「1こだけだ」と わかって <ruby>選<rt>えら</rt></ruby>んだなら、しっかり 見ていて すごい！<br>
                でも、もし「たくさん もらえる！」と 思っていたら、<ruby>罠<rt>わな</rt></ruby> に ひっかかっているよ。
            </p>
            <p>
                <strong><ruby>画像<rt>がぞう</rt></ruby>では たくさん あるように 見せかけて、本当は 1こしか もらえない</strong> という ズルい <ruby>罠<rt>わな</rt></ruby> なんだ。
            </p>
        `;
        step3Body.innerHTML = `
            <div class="care-box">
                <p class="care-body">
                    ズルい<ruby>罠<rt>わな</rt></ruby>に ひっかかっちゃったかもしれないけど、落ちこまなくて<br>大丈夫！<br>
                    今日ここで 知ることができたから、きみは一つ強くなったよ！
                </p>
            </div>
        `;
    }
    else if (selectedReward === 'gorgeous') {
        // カードの罠と、決定画面の罠の両方を表示する
        previewEl.innerHTML = `
            <div class="mini-popup">
                <p class="mini-main"><ruby>豪華<rt>ごうか</rt></ruby>おかし</p>
                
                <div class="trap-highlight-badge" style="margin-bottom: 12px; font-weight: normal;">
                    <strong>👉 カードの <ruby>罠<rt>わな</rt></ruby>！</strong><br>
                    【<ruby>最初<rt>さいしょ</rt></ruby>の1か<ruby>月<rt>げつ</rt></ruby><ruby>無料<rt>むりょう</rt></ruby>！】
                </div>
                
                <div class="trap-highlight" style="font-weight: normal;">
                    <strong>👉 <ruby>決定<rt>けってい</rt></ruby>がめんの <ruby>罠<rt>わな</rt></ruby>！</strong><br>
                    【※1か月目の無料きかんが おわると毎月3000円のお金がかかります】
                </div>
            </div>
        `;
        // ★修正：カッコ書きを排除
        step2Body.innerHTML = `
            <p>
                「1か月<ruby>無料<rt>むりょう</rt></ruby>」という お<ruby>得<rt>とく</rt></ruby>な言葉で ボタンを 押させたあと、<br>
                <strong>さいごの <ruby>決定<rt>けってい</rt></ruby>がめんの 見えにくい 小さな文字で「<ruby>無料<rt>むりょう</rt></ruby>の あとは <ruby>毎月<rt>まいつき</rt></ruby>お金をとる」</strong> と書いてある、とっても ズルい <ruby>罠<rt>わな</rt></ruby> だったんだね！
            </p>
            <p>
                「<ruby>無料<rt>むりょう</rt></ruby>」や「プレミアム」といった 言葉に だまされず、<ruby>決定<rt>けってい</rt></ruby>ボタンを 押す 前に、お金の ことは 小さな文字まで しっかり 読んで <ruby>確<rt>たし</rt></ruby>かめる ことが <ruby>大切<rt>たいせつ</rt></ruby>だよ。
            </p>
        `;
        step3Body.innerHTML = `
            <div class="care-box">
                <p class="care-body">
                    ズルい<ruby>罠<rt>わな</rt></ruby>に ひっかかっちゃったかもしれないけど、落ちこまなくて<br>大丈夫！<br>
                    今日ここで 知ることができたから、きみは一つ強くなったよ！
                </p>
            </div>
        `;
    }
}

// ステップの表示制御・タイマー処理
function startStepTimer(step) {
    const selectedReward = localStorage.getItem('selected_1017_reward') || 'mix';
    const nextBtn = document.getElementById('next-btn');
    const prevBtn = document.getElementById('prev-btn');
    const mainHeaderTitle = document.getElementById('main-header-title');
    
    if (timer) clearTimeout(timer);

    if (selectedReward === 'mix') {
        mainHeaderTitle.innerHTML = 'おつかれさまでした！';
        prevBtn.style.display = 'none';
        nextBtn.style.display = 'none';
        document.getElementById('step1-heading').innerHTML = '<ruby>最後<rt>さいご</rt></ruby>までしっかり<ruby>見抜<rt>みぬ</rt></ruby>けたね！';
        return;
    }

    if (step === 3) {
        mainHeaderTitle.innerHTML = 'おつかれさまでした！';
    } else {
        mainHeaderTitle.innerHTML = '🔎 実は、かくれテストでした！';
    }

    if (step === 1) {
        prevBtn.style.display = 'none';
        nextBtn.style.display = 'inline-block';
    } else if (step === 2) {
        prevBtn.style.display = 'inline-block';
        nextBtn.style.display = 'inline-block';
        nextBtn.innerText = "つぎへ ➡";
    } else if (step === 3) {
        prevBtn.style.display = 'inline-block';
        nextBtn.style.display = 'none';
    }
}

function nextStep() {
    if (currentStep >= 3) return; 
    document.getElementById(`step-${currentStep}`).classList.remove('active');
    currentStep++;
    document.getElementById(`step-${currentStep}`).classList.add('active');
    startStepTimer(currentStep);
}

function prevStep() {
    if (currentStep <= 1) return;
    document.getElementById(`step-${currentStep}`).classList.remove('active');
    currentStep--;
    document.getElementById(`step-${currentStep}`).classList.add('active');
    startStepTimer(currentStep);
}
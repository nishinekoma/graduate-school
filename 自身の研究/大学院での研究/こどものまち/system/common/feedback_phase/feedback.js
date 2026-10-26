let currentStep = 1;
let timer = null;

document.addEventListener('DOMContentLoaded', () => {
    setupFeedbackContent();
    startStepTimer(1);
});

function setupFeedbackContent() {
    const selectedReward = localStorage.getItem('selected_reward') || '300k';

    const step1Heading = document.getElementById('step1-heading');
    const step1Subtext = document.getElementById('step1-subtext');
    const previewEl = document.getElementById('trap-preview-area');
    const step1PayoutArea = document.getElementById('step1-payout-area');
    
    const step2Heading = document.getElementById('step2-heading');
    const step2Body = document.getElementById('step2-body');
    const step3Heading = document.getElementById('step3-heading');
    const step3Body = document.getElementById('step3-body');

    if (selectedReward === '300k') {
        // --- 300k 正解（1画面完結） ---
        step1Heading.innerHTML = '<ruby>最後<rt>さいご</rt></ruby>までしっかり<ruby>見抜<rt>みぬ</rt></ruby>けたね！';
        step1Subtext.style.display = 'none';

        previewEl.innerHTML = `
            <div class="key-message-box">
                <p class="key-body">
                    あやしい言葉につられず、<strong>自分でしっかり確かめて選べたね！カッコいいぞ！</strong>
                </p>
            </div>
        `;

        step1PayoutArea.innerHTML = `
            <div class="payout-box">
                <span class="payout-label">今日のお<ruby>給料<rt>きゅうりょう</rt></ruby>：</span>
                <span class="payout-amount">300<span class="unit">k</span></span>
            </div>
        `;
    } 
    else if (selectedReward === '400k') {
        // --- 400k 罠①（毎分減るサブスク） ---
        previewEl.innerHTML = `
            <div class="mini-popup">
                <p class="mini-title">お<ruby>給料<rt>きゅうりょう</rt></ruby>の<ruby>確認<rt>かくにん</rt></ruby> 💳</p>
                <p class="mini-main">「400k」のお<ruby>給料<rt>きゅうりょう</rt></ruby>を<ruby>受<rt>う</rt></ruby>け<ruby>取<rt>と</rt></ruby>りますか？</p>
                <div class="trap-highlight">
                    👉 ここ！【※このお<ruby>給料<rt>きゅうりょう</rt></ruby>を<ruby>選<rt>えら</rt></ruby>ぶと、つぎの<ruby>仕事<rt>しごと</rt></ruby>から<ruby>毎分<rt>まいふん</rt></ruby>100kが<ruby>自動<rt>じどう</rt></ruby>で<ruby>引<rt>ひ</rt></ruby>かれます】
                </div>
            </div>
        `;

        step2Heading.innerHTML = 'どこが「<ruby>罠<rt>わな</rt></ruby>」だったのかな？';
        step2Body.innerHTML = `
            <p style="margin:0 0 12px 0;">
                大きく「400k」と見せかけて、目立たない小さな文字で「毎分100k引かれる」と書いてあったんだね！
            </p>
            <p style="margin:0;">
                これは<strong>1分ごとに100k<ruby>減<rt>へ</rt></ruby>る<ruby>仕組<rt>しく</rt></ruby>み</strong>だから、ほっておくと<strong>5分で500kも<ruby>減<rt>へ</rt></ruby>っちゃう</strong>んだよ！
            </p>
        `;

        step3Heading.innerHTML = '<ruby>引<rt>ひ</rt></ruby>っかかっちゃっても、<ruby>落<rt>お</rt></ruby>ちこまなくて<ruby>大丈夫<rt>だいじょうぶ</rt></ruby>！';
        step3Body.innerHTML = `
            <div class="care-box">
                <p class="care-body">
                    この<ruby>罠<rt>わな</rt></ruby>は大人でも気づかない、<strong>すごーくズルい<ruby>罠<rt>わな</rt></ruby></strong>なんだ。<br>
                    今日ここで<ruby>知<rt>し</rt></ruby>ることができたから、きみは一つ強くなったよ！
                </p>
            </div>
        `;
    } 
    else if (selectedReward === '500k') {
        // --- 500k 罠②（同調圧力＋手数料） ---
        previewEl.innerHTML = `
            <div class="mini-popup">
                <div class="trap-highlight-badge">👉 ここ！【🔥 <ruby>人気<rt>にんき</rt></ruby>No.1！ <ruby>隊員<rt>たいいん</rt></ruby>の80%がこれを選んでいます！】</div>
                <p class="mini-main">「500k」のお<ruby>給料<rt>きゅうりょう</rt></ruby>を<ruby>受<rt>う</rt></ruby>け<ruby>取<rt>と</rt></ruby>りますか？</p>
                <div class="trap-highlight">
                    👉 ここ！【※<ruby>受<rt>う</rt></ruby>け<ruby>取<rt>と</rt></ruby>り<ruby>手数料<rt>てすうりょう</rt></ruby>として、その<ruby>場<rt>ば</rt></ruby>で250kが<ruby>引<rt>ひ</rt></ruby>かれます】
                </div>
            </div>
        `;

        step2Heading.innerHTML = 'どこが「<ruby>罠<rt>わな</rt></ruby>」だったのかな？';
        step2Body.innerHTML = `
            <p style="margin:0 0 12px 0;">
                「<ruby>隊員<rt>たいいん</rt></ruby>の80%が選んでいる！」とあせらせて、<ruby>裏<rt>うら</rt></ruby>でお金を半分（250k）うばう<ruby>罠<rt>わな</rt></ruby>だったんだね！
            </p>
            <p style="margin:0;">
                <strong>「みんな選んでるから<ruby>正解<rt>せいかい</rt></ruby>だ」と<ruby>思<rt>おも</rt></ruby>い<ruby>込<rt>こ</rt></ruby>ませて</strong>、たしかめずに選ばせるズルい<ruby>誘導<rt>ゆうどう</rt></ruby>なんだ。
            </p>
        `;

        step3Heading.innerHTML = '<ruby>引<rt>ひ</rt></ruby>っかかっちゃっても、<ruby>落<rt>お</rt></ruby>ちこまなくて<ruby>大丈夫<rt>だいじょうぶ</rt></ruby>！';
        step3Body.innerHTML = `
            <div class="care-box">
                <p class="care-body">
                    この<ruby>罠<rt>わな</rt></ruby>は大人でも気づかない、<strong>すごーくズルい<ruby>罠<rt>わな</rt></ruby></strong>なんだ。<br>
                    今日ここで<ruby>知<rt>し</rt></ruby>ることができたから、きみは一つ強くなったよ！
                </p>
            </div>
        `;
    }
}

function startStepTimer(step) {
    const selectedReward = localStorage.getItem('selected_reward') || '300k';
    const nextBtn = document.getElementById('next-btn');
    const prevBtn = document.getElementById('prev-btn');
    const mainHeaderTitle = document.getElementById('main-header-title');
    if (timer) clearTimeout(timer);

    // 【正解（300k）選択時】1画面で完結させ、ボタン類をすべて隠す
    if (selectedReward === '300k') {
        mainHeaderTitle.innerHTML = '🚔 おしごとおつかれさまでした！';
        prevBtn.style.display = 'none';
        nextBtn.style.display = 'none';
        return;
    }

    // 【罠（400k/500k）選択時】ヘッダータイトル制御
    if (step === 3) {
        mainHeaderTitle.innerHTML = '🚔 おしごとおつかれさまでした！';
    } else {
        mainHeaderTitle.innerHTML = '🚔 お<ruby>仕事<rt>しごと</rt></ruby>の<ruby>結果<rt>けっか</rt></ruby>';
    }

    // 「もどる」ボタンの制御（ステップ2以降で表示）
    if (step === 1) {
        prevBtn.style.display = 'none';
    } else {
        prevBtn.style.display = 'inline-block';
    }

    if (step === 1) {
        nextBtn.style.display = 'none';
        nextBtn.disabled = true;

        setTimeout(() => {
            nextBtn.style.display = 'inline-block';
        }, 3000);

        timer = setTimeout(() => {
            nextBtn.disabled = false;
        }, 4000);
    } 
    else if (step === 2) {
        nextBtn.style.display = 'inline-block';
        nextBtn.disabled = true;
        nextBtn.innerText = "つぎへ ➡";

        timer = setTimeout(() => {
            nextBtn.disabled = false;
        }, 4000);
    } 
    else if (step === 3) {
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
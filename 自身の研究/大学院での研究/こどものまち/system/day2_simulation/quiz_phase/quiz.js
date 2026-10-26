// ==========================================
// 📊 ログ収集システムの追加 (Day 2: Quiz Education)
// ==========================================
const participantId = localStorage.getItem('participant_id') || `user_${Date.now()}`;
const surveyData = JSON.parse(localStorage.getItem('survey_data') || '{}');

// 📊 クリックログ
const clickLog = {
    participant_id: participantId,
    survey_attributes: surveyData,
    phase: "day2_education",
    start_time: new Date().toISOString(),
    counts: { 
        'correct_answers': 0, 
        'wrong_answers': 0 
    },
    history: []
};

// 📊 マウスログ (30fps)
const ENABLE_MOUSE_LOG = true; 
const mouseLog = {
    participant_id: participantId,
    survey_attributes: surveyData,
    phase: "day2_education",
    points: []
};
let lastMouseLogTime = 0;
const MOUSE_LOG_INTERVAL = 1000 / 30; 
let isLoggingActive = true;

function handleMouseMove(e) {
    if (!isLoggingActive || !ENABLE_MOUSE_LOG) return;
    const now = Date.now();
    if (now - lastMouseLogTime >= MOUSE_LOG_INTERVAL) {
        mouseLog.points.push({ x: e.clientX, y: e.clientY, t: now });
        lastMouseLogTime = now;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (ENABLE_MOUSE_LOG) {
        document.addEventListener('mousemove', handleMouseMove);
    }
});

function recordClickAction(action, detail = null) {
    if (!isLoggingActive) return;
    const timestamp = new Date().toISOString();
    if (clickLog.counts.hasOwnProperty(action)) {
        clickLog.counts[action]++;
    }
    clickLog.history.push({ action: action, detail: detail, timestamp: timestamp });
}

function downloadJSON(data, filename) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
// ==========================================

// dark_education の6つの罠に対応するクイズデータ
const quizData = [
    {
        id: 'hidden',
        question: '「100円でスリーブが買えるよ！」と書いてあるカードがあるよ。でも、この<ruby>画面<rt>がめん</rt></ruby>にはズルい<ruby>場所<rt>ばしょ</rt></ruby>があるんだ。どこかな？',
        visualHtml: `
            <div class="item-card" style="width: 250px; margin: 0 auto; border: 1px solid #e0e0e0; padding: 18px 16px; border-radius: 12px; background: #fff; text-align: left; box-shadow: 0 4px 10px rgba(0,0,0,0.08);">
                <div style="width:100%; height:175px; background:#eceff1; border-radius:6px; margin-bottom:14px; overflow:hidden;">
                    <img src="../../common/images/sleeve.jpg" alt="スリーブ" style="width:100%; height:100%; object-fit:cover;">
                </div>
                <p style="font-size:1.05em; font-weight:bold; margin:0 0 10px 0; color:#333;">限定スリーブ ピカピカ版</p>
                <p style="font-size:1.25em; font-weight:bold; color:#333; margin:0 0 10px 0;">100円 <span style="background:#d32f2f; color:#fff; font-size:0.65em; padding:2px 6px; border-radius:3px; vertical-align:middle;">特価</span></p>
                <p style="font-size:11.5px; color:#777; margin:0 0 14px 0; line-height:1.45; font-weight:bold;">※毎月3,000円の自動定期購入コースに登録されます。</p>
                <button style="width:100%; padding:12px; border:2px solid #d32f2f; color:#d32f2f; background:#fff; font-weight:bold; font-size:1.05em; border-radius:6px; pointer-events:none;">カートに入れる</button>
            </div>
        `,
        options: [
            { 
                text: '「<ruby>限定<rt>げんてい</rt></ruby>スリーブ」という<ruby>商品名<rt>しょうひんめい</rt></ruby>', 
                isCorrect: false,
                reason: '「<ruby>限定<rt>げんてい</rt></ruby>スリーブ」は<ruby>品物<rt>しなもの</rt></ruby>の名前だよ。<br>これ自体は、お金を勝手に増やすようなズルい<ruby>仕掛け<rt>しかけ</rt></ruby><br>ではないんだ。<br><ruby>隠<rt>かく</rt></ruby>れてお金を取ろうとしている<ruby>場所<rt>ばしょ</rt></ruby>をもう一度<br><ruby>探<rt>さが</rt></ruby>してみよう！'
            },
            { 
                text: '小さく見えにくい文字で「毎月お金がかかる」と書いてある<ruby>場所<rt>ばしょ</rt></ruby>', 
                isCorrect: true 
            },
            { 
                text: '「100円」というお<ruby>値段<rt>ねだん</rt></ruby>', 
                isCorrect: false,
                reason: '「100円」は、この<ruby>品物<rt>しなもの</rt></ruby>自体の<ruby>値段<rt>ねだん</rt></ruby>の<ruby>表示<rt>ひょうじ</rt></ruby>だよ。<br>こっそり毎月お金を取ろうとするズルい<ruby>仕組み<rt>しくみ</rt></ruby>は、別の<ruby>場所<rt>ばしょ</rt></ruby>にあるんだ。<br>小さく書かれた文字をよく見てみよう！'
            }
        ],
        explanation: '「小さく書いて<ruby>隠<rt>かく</rt></ruby>す」ダークパターンだよ！<br>小さくて見えにくい文字で書いて、気づかないうちにお金をはらわせようとするズルい<ruby>罠<rt>わな</rt></ruby>なんだ！'
    },
    {
        id: 'timer',
        question: '「<ruby>販売<rt>はんばい</rt></ruby><ruby>終了<rt>しゅうりょう</rt></ruby>まで <ruby>残<rt>のこ</rt></ruby>り 03:52」と赤い文字でカウントダウンしているよ！ どうするのが一番いいかな？',
        visualHtml: `
            <div class="item-card" style="width: 250px; margin: 0 auto; border: 1px solid #e0e0e0; padding: 18px 16px; border-radius: 12px; background: #fff; text-align: left; box-shadow: 0 4px 10px rgba(0,0,0,0.08);">
                <div style="width:100%; height:175px; background:#eceff1; border-radius:6px; margin-bottom:14px; overflow:hidden;">
                    <img src="../../common/images/pack_phantom.jpg" alt="パック" style="width:100%; height:100%; object-fit:cover;">
                </div>
                <p style="font-size:1.05em; font-weight:bold; margin:0 0 10px 0; color:#333;">拡張パック「幻の華導」</p>
                <p style="font-size:1.25em; font-weight:bold; color:#333; margin:0 0 10px 0;">500円</p>
                <p style="font-size:1em; color:#d32f2f; font-weight:bold; margin:0 0 14px 0;">販売終了まで残り 03:52</p>
                <button style="width:100%; padding:12px; border:2px solid #d32f2f; color:#d32f2f; background:#fff; font-weight:bold; font-size:1.05em; border-radius:6px; pointer-events:none;">カートに入れる</button>
            </div>
        `,
        options: [
            { 
                text: 'すぐに「買う」ボタンを<ruby>押<rt>お</rt></ruby>す！', 
                isCorrect: false,
                reason: 'あせってすぐボタンを<ruby>押<rt>お</rt></ruby>すと、よく考えずに<br>買ってしまうよ！<br>あせらせる<ruby>表示<rt>ひょうじ</rt></ruby>に流されず、一度立ち止まる<br>ことが大切なんだ。'
            },
            { 
                text: 'あせらずに落ち着いて本当に<ruby>必要<rt>ひつよう</rt></ruby>か考える！', 
                isCorrect: true 
            },
            { 
                text: '<ruby>画面<rt>がめん</rt></ruby>をおしてタイマーを止める！', 
                isCorrect: false,
                reason: '<ruby>画面<rt>がめん</rt></ruby>を何回<ruby>押<rt>お</rt></ruby>しても、タイマーは止まらないよ！<br>「あと少し！」と出ていても、あせってすぐ買わなくて<br><ruby>大<rt>だい</rt></ruby><ruby>丈<rt>じょう</rt></ruby><ruby>夫<rt>ぶ</rt></ruby>。<br>いったん止まって、<ruby>本<rt>ほん</rt></ruby><ruby>当<rt>とう</rt></ruby>にほしいか考えてみよう！'
            }
        ],
        explanation: '「ウソのタイマーであせらせる」ダークパターンだよ！<br>急がせて、よく考えずに買わせようとしているから、あせらず落ち着くのが大切なんだ！'
    },
    {
        id: 'sneak',
        question: '800円のデッキケースを 買いに来たよ！ <ruby>画面<rt>がめん</rt></ruby>をよく見てみよう。このまま買うと、どうなっちゃうかな？',
        visualHtml: `
            <div class="item-card" style="width: 250px; margin: 0 auto; border: 1px solid #e0e0e0; padding: 18px 16px; border-radius: 12px; background: #fff; text-align: left; box-shadow: 0 4px 10px rgba(0,0,0,0.08);">
                <div style="width:100%; height:175px; background:#eceff1; border-radius:6px; margin-bottom:14px; overflow:hidden;">
                    <img src="../../common/images/case_dx.jpg" alt="ケース" style="width:100%; height:100%; object-fit:cover;">
                </div>
                <p style="font-size:1.05em; font-weight:bold; margin:0 0 10px 0; color:#333;">公式デッキケース（DX）</p>
                <p style="font-size:1.25em; font-weight:bold; color:#333; margin:0 0 10px 0;">800円</p>
                <div style="font-size: 1em; color: #555; margin-bottom:14px;">
                    <label><input type="checkbox" checked onclick="return false;"> お急ぎ便 (+500円)</label>
                </div>
                <button style="width:100%; padding:12px; border:2px solid #d32f2f; color:#d32f2f; background:#fff; font-weight:bold; font-size:1.05em; border-radius:6px; pointer-events:none;">カートに入れる</button>
            </div>
        `,
        options: [
            { 
                text: '800円だと思ったけど、ほかにもお金がかかっちゃう！', 
                isCorrect: true 
            },
            { 
                text: 'ピッタリ800円で買えるから大丈夫！', 
                isCorrect: false,
                reason: '本当に800円だけかな？<br><ruby>画面<rt>がめん</rt></ruby>にある チェックボックスの横の文字を<br>もう一度 よく見てみよう！'
            },
            { 
                text: '「お急ぎ便」がついていてラッキー！', 
                isCorrect: false,
                reason: '「お<ruby>急<rt>いそ</rt></ruby>ぎ<ruby>便<rt>びん</rt></ruby>」は、早く<ruby>届<rt>とど</rt></ruby>けてもらうためにお金がかかるしくみだよ。<br>となりに「+500円」って書いてあるね。<br>800円だけで買えるのかな？'
            }
        ],
        explanation: '「<ruby>勝手<rt>かって</rt></ruby>に<ruby>追加<rt>ついか</rt></ruby>する」ダークパターンだよ！<br>お<ruby>願<rt>ねが</rt></ruby>いしていないものを、はじめから<br>「えらんだこと」にして、<br>お金を<ruby>払<rt>はら</rt></ruby>わせようとするズルいしくみなんだ！'
    },
    {
        id: 'scarcity',
        question: '「残りあと１個！」と大きな赤文字で書いてあるよ。この画面を見たとき、どうすればいいかな？',
        visualHtml: `
            <div class="item-card" style="width: 250px; margin: 0 auto; border: 1px solid #e0e0e0; padding: 18px 16px; border-radius: 12px; background: #fff; text-align: left; box-shadow: 0 4px 10px rgba(0,0,0,0.08);">
                <div style="width:100%; height:175px; background:#eceff1; border-radius:6px; margin-bottom:14px; overflow:hidden;">
                    <img src="../../common/images/card_dragon1.jpg" alt="レアカード" style="width:100%; height:100%; object-fit:cover;">
                </div>
                <p style="font-size:1.05em; font-weight:bold; margin:0 0 10px 0; color:#333;">限定カード「伝説の古龍」</p>
                <p style="font-size:1.25em; font-weight:bold; color:#333; margin:0 0 10px 0;">1,500円</p>
                <p style="color:#d32f2f; font-size:1em; font-weight:bold; margin:0 0 14px 0;">⚠️ 残りあと１個！</p>
                <button style="width:100%; padding:12px; border:2px solid #d32f2f; color:#d32f2f; background:#fff; font-weight:bold; font-size:1.05em; border-radius:6px; pointer-events:none;">カートに入れる</button>
            </div>
        `,
        options: [
            { 
                text: '本当に欲しいか 落ち着いて考える！', 
                isCorrect: true 
            },
            { 
                text: '<ruby>絶対<rt>ぜったい</rt></ruby>に売り切れるから 今すぐあせって買う！', 
                isCorrect: false,
                reason: '「売り切れそう」と見せてあせらせるのは、<br>買わせるための工夫だよ！<br>あせってすぐ買うと、本当はいらない物まで<br>買ってしまうんだ。<br>一度立ち止まって 落ち着いて考える選択肢を選んでみよう！'
            },
            { 
                text: '売り切れないように とりあえず「カートに入れる」！', 
                isCorrect: false,
                reason: '「なくなるかも！」と あせって買わなくても大丈夫！<br>ボタンを<ruby>押<rt>お</rt></ruby>す前に、本当に<ruby>欲<rt>ほ</rt></ruby>しいか落ち着いて考えよう！'
            }
        ],
        explanation: '「<ruby>残<rt>のこ</rt></ruby>りあと少し！」であせらせるダークパターンだよ！<br>売り切れても <strong>また買えることが多い</strong>んだ。<br>あせったときはすぐ買わずに、おうちの人と <strong>本当に<ruby>必<rt>ひつ</rt></ruby><ruby>要<rt>よう</rt></ruby>か <ruby>確<rt>たしか</rt></ruby>めよう！</strong>'
    },
    {
        id: 'shame',
        question: '「もっと高い <ruby>福袋<rt>ふくぶくろ</rt></ruby>にしない？」と出たよ。やめようとすると「いいえ、お<ruby>得<rt>とく</rt></ruby>なのに<ruby>断<rt>ことわ</rt></ruby>ります」と書いてあるよ。この書き方はどうかな？',
        visualHtml: `
            <div style="border: 1px solid #ccc; padding: 25px 20px; border-radius: 12px; width: 250px; margin:0 auto; background: #fff; text-align: center; box-shadow: 0 4px 10px rgba(0,0,0,0.08);">
                <p style="font-size:1em; color:#555; margin:0 0 15px 0;">豪華な福袋にしませんか？</p>
                <button style="padding:12px 20px; background:#0288d1; color:#fff; border:none; border-radius:6px; font-weight:bold; font-size:1em; margin-bottom:15px;">アップグレードする</button><br>
                <a style="font-size: 0.85em; color: #777; text-decoration: underline;">いいえ、お得なのに断ります</a>
            </div>
        `,
        options: [
            { 
                text: '「もったいないかな？」と <ruby>迷<rt>まよ</rt></ruby>わせて、高い買い物をさせようとしている！', 
                isCorrect: true 
            },
            { 
                text: '親切に「<ruby>断<rt>ことわ</rt></ruby>ったら もったいないよ」と教えてくれている！', 
                isCorrect: false,
                reason: '「もったいないかな？」と <ruby>迷<rt>まよ</rt></ruby>わせて、たくさんお金を使わせようとする<ruby>罠<rt>わな</rt></ruby>だよ。<br><ruby>断<rt>ことわ</rt></ruby>りにくくするための言葉なんだ。'
            },
            { 
                text: '「お<ruby>得<rt>とく</rt></ruby>」と書いてあるから、押すとタダでもらえる！', 
                isCorrect: false,
                reason: '「お<ruby>得<rt>とく</rt></ruby>」と書いてあっても、タダでもらえる<br>わけじゃないよ！<br>高い買い物を <ruby>断<rt>ことわ</rt></ruby>りにくくする言葉なんだ。'
            }
        ],
        explanation: '「嫌な気分にさせる」ダークパターンだよ！<br>「もったいないかな？」と <ruby>迷<rt>まよ</rt></ruby>わせて、<ruby>断<rt>ことわ</rt></ruby>りにくくするズルい<ruby>罠<rt>わな</rt></ruby>なんだ！'
    },
    {
        id: 'privacy',
        question: '「電話<ruby>番<rt>ばん</rt></ruby><ruby>号<rt>ごう</rt></ruby>を入力したら、2,000円が 180円になるよ！」と出たよ。どうすればいいかな？',
        visualHtml: `
            <div style="border: 1px solid #ccc; padding: 25px 20px; border-radius: 12px; width: 250px; margin:0 auto; background: #fff; text-align: center; box-shadow: 0 4px 10px rgba(0,0,0,0.08);">
                <p style="color:#d32f2f; font-size:1.2em; font-weight:bold; margin:0 0 10px 0;">＼今だけ90%OFF／ 180円</p>
                <p style="font-size:0.95em; margin:0 0 12px 0; color:#555;">電話番号を入力してください</p>
                <input type="text" placeholder="☎ 090-XXXX-XXXX" style="width:85%; padding:10px; font-size:0.9em; text-align:center; pointer-events:none; border:1px solid #ccc; border-radius:4px;">
            </div>
        `,
        options: [
            { 
                text: '電話<ruby>番<rt>ばん</rt></ruby><ruby>号<rt>ごう</rt></ruby>は入力しないで「<ruby>閉<rt>と</rt></ruby>じる」を<ruby>押<rt>お</rt></ruby>す！', 
                isCorrect: true 
            },
            { 
                text: '安く買いたいから、自分の電話<ruby>番<rt>ばん</rt></ruby><ruby>号<rt>ごう</rt></ruby>をすぐ入れる！', 
                isCorrect: false,
                reason: '電話<ruby>番<rt>ばん</rt></ruby><ruby>号<rt>ごう</rt></ruby>を教えちゃうと、知らない人から あやしい電話がかかってきたり、知らないところで使われたりする<ruby>危<rt>き</rt></ruby><ruby>険<rt>けん</rt></ruby>があるよ！'
            },
            { 
                text: '自分のじゃない テキトーな数字を入力する！', 
                isCorrect: false,
                reason: 'もし だれか<ruby>本<rt>ほん</rt></ruby><ruby>当<rt>とう</rt></ruby>の人の<ruby>番<rt>ばん</rt></ruby><ruby>号<rt>ごう</rt></ruby>になっちゃうと、<ruby>勝手<rt>かって</rt></ruby>に使われて その人にめいわくがかかっちゃうよ！'
            }
        ],
        explanation: '「<ruby>個<rt>こ</rt></ruby><ruby>人<rt>じん</rt></ruby><ruby>情<rt>じょう</rt></ruby><ruby>報<rt>ほう</rt></ruby>を教えさせようとする」ダークパターンだよ！<br>電話<ruby>番<rt>ばん</rt></ruby><ruby>号<rt>ごう</rt></ruby>は 自分の<ruby>大<rt>だい</rt></ruby><ruby>切<rt>せつ</rt></ruby>な情報だから、安くなるからといって 知らない人に教えちゃダメだよ！'
    }
];

let currentQIndex = 0;
let timerTimeout = null;

function loadQuestion() {
    const q = quizData[currentQIndex];
    document.getElementById('current-q-num').innerText = currentQIndex + 1;
    document.getElementById('question-text').innerHTML = q.question;
    document.getElementById('scenario-visual').innerHTML = q.visualHtml;

    const optionsContainer = document.getElementById('options-grid');
    optionsContainer.innerHTML = '';

    q.options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'opt-btn';
        btn.innerHTML = opt.text;
        btn.onclick = () => checkAnswer(opt);
        optionsContainer.appendChild(btn);
    });
    
    // ★ ログの記録
    recordClickAction(`load_question_${q.id}`, `Loaded question: ${q.id}`);
}

function checkAnswer(selectedOpt) {
    const q = quizData[currentQIndex];
    
    if (selectedOpt.isCorrect) {
        // ★ ログの記録（正解）
        recordClickAction(`correct_answer_${q.id}`, `Correct answer for ${q.id}`);
        clickLog.counts.correct_answers++;
        
        document.getElementById('explanation-text').innerHTML = q.explanation;
        document.getElementById('explanation-modal').style.display = 'flex';

        const nextBtn = document.getElementById('next-q-btn');
        nextBtn.innerText = 'つぎの問題へ ➡';
        nextBtn.disabled = true;
        nextBtn.style.display = 'none';

        if (timerTimeout) clearTimeout(timerTimeout);
        timerTimeout = setTimeout(() => {
            nextBtn.disabled = false;
            nextBtn.style.display = 'inline-block';
        }, 3000);

    } else {
        // ★ ログの記録（不正解）
        recordClickAction(`wrong_answer_${q.id}`, `Wrong answer for ${q.id}`);
        clickLog.counts.wrong_answers++;
        
        document.getElementById('wrong-reason-text').innerHTML = selectedOpt.reason;

        const retryBtn = document.querySelector('#wrong-modal .retry-btn');
        if (retryBtn) {
            retryBtn.disabled = true;
            retryBtn.classList.add('fade-hidden');
            retryBtn.innerHTML = 'もう一度 チャレンジ 🔄';

            setTimeout(() => {
                retryBtn.disabled = false;
                retryBtn.classList.remove('fade-hidden');
            }, 2000);
        }

        document.getElementById('wrong-modal').style.display = 'flex';
    }
}

function closeWrongModal() {
    document.getElementById('wrong-modal').style.display = 'none';
}

function nextQuestion() {
    document.getElementById('explanation-modal').style.display = 'none';
    currentQIndex++;

    if (currentQIndex < quizData.length) {
        loadQuestion();
    } else {
        document.getElementById('clear-modal').style.display = 'flex';
    }
}

// 実践フェーズへの遷移 ＆ ★ログのダウンロード処理
function goToNextPhase() {
    recordClickAction('finish_education', 'Completed quiz and moving to test phase');
    isLoggingActive = false;
    document.removeEventListener('mousemove', handleMouseMove);

    // 💾 JSONファイル出力（ファイル名に phase を明記）
    downloadJSON(clickLog, `click_log_education_${participantId}.json`);
    if (ENABLE_MOUSE_LOG) {
        downloadJSON(mouseLog, `mouse_log_education_${participantId}.json`);
    }

    // 次のフェーズへ
    setTimeout(() => {
        if (window.parent && window.parent !== window) {
            window.parent.postMessage({ type: 'NEXT_PHASE' }, '*');
        } else {
            window.location.href = "../../common/test_phase/reward_test.html";
        }
    }, 500);
}

// 初期実行
loadQuestion();
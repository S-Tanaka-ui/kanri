//localStorageから期間内のデータを取得、テキストにして中継関数(worker.js)に送る

//☆デプロイした中継関数(Cloudflare Worker)のURLに書き換える
const WORKER_URL = "https://kanri-ai.あなたのサブドメイン.workers.dev";

//localStorageからデータを取得(データが無ければ空)
const tasks = JSON.parse(localStorage.getItem("tasks")) || {};
const schedule = JSON.parse(localStorage.getItem("schedule")) || {};

//日付を正しい形式へ変換
function toInputDate(d){
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
}
//期間の設定
function setRange(fromDate, toDate){
    document.getElementById("from").value = toInputDate(fromDate);
    document.getElementById("to").value = toInputDate(toDate);
}
//ボタン指定の場合の期間の設定
function setThisWeek(){
    const today = new Date();
    const mon = new Date(today);//今日の日付をコピー
    mon.setDate(today.getDate() - ((today.getDay() + 6) % 7));//コピーした今日の日付を月曜の日付に変える
    setRange(mon, today);
}
function setLastWeek(){
    const today = new Date();
    const mon = new Date(today);
    mon.setDate(today.getDate() - ((today.getDay() + 6) % 7) - 7);
    const sun = new Date(mon);
    sun.setDate(mon.getDate() + 6);
    setRange(mon, sun);
}
function setThisMonth(){
    const today = new Date();
    setRange(new Date(today.getFullYear(), today.getMonth(), 1), today);
}
document.getElementById("thisWeekButton").onclick = setThisWeek;//? 関数名をただの変数みたいな書き方していいの？
document.getElementById("lastWeekButton").onclick = setLastWeek;
document.getElementById("thisMonthButton").onclick = setThisMonth;
setThisWeek();//初期値は今週

//期間内のデータをテキストにまとめる
function collectRecords(from, to){

    function inRange(dateStr){
        return dateStr >= from && dateStr <= to;//&&は「かつ」
    }

    const doneLines = [];
    Object.keys(tasks).sort().forEach(date => {//日付のキーを取り出して日付順に並び替え
        if(!inRange(date)) return;//期間外なら処理しない
        tasks[date].forEach(t => {
            if(t && t.done) doneLines.push(`${date}: ${t.text}`);//完了しているtodoリストをpush ? t.textのtextはなんぞや
        });
    });

    const scheduleLines = [];
    Object.keys(schedule).sort().forEach(key => {
        const date = key.slice(0, 10);//日付(2026-10-10)
        const slot = key.slice(11);//時間帯(AM/PM/NT)
        if(!inRange(date)) return;
        if(schedule[key]) scheduleLines.push(`${date} ${slot}: ${schedule[key]}`);//? schedule[key]ってなんぞや
    });

    return { doneLines, scheduleLines };
}

async function summarize(){//async : 非同期処理 
    //HTMLから期間を取得
    const from = document.getElementById("from").value;
    const to = document.getElementById("to").value;
    const status = document.getElementById("status");
    const result = document.getElementById("result");
    const button = document.getElementById("summarizeButton");

    result.textContent = "";
    //入力された期間をチェック
    if(!from || !to || from > to){
        status.textContent = "期間を正しく指定してください。"
        return;
    }
    //記録を取得
    const {doneLines, scheduleLines} = collectRecords(from, to);
    //記録がなかったら終了
    if(doneLines.length === 0 && scheduleLines.length === 0){
        status.textContent = "この期間には記録がありません。";
        return;
    }

    button.disabled = true;//処理中はボタンを無効化
    status.textContent = "まとめています...";

    //ブラウザからworkersにデータを送信
    try{
        const res = await fetch(WORKER_URL, {
            //↓通信に関する設定
            method: "POST",//通信の方法(データを送信)
            headers: {"Content-Type": "application/json"},//データの形式
            body: JSON.stringify({//送信するデータ
                from,
                to,
                done: doneLines.join("\n"),//? ここらへんの細かい記述
                schedule: scheduleLines.join("\n")
            })
        });
        const data = await res.json();//通信結果を表す変数
        //通信が成功したか確認
        if(!res.ok) throw new Error(data.error || `エラー(${res.status})`);
        //AIの回答を画面に表示
        result.textContent = data.text;
        status.textContent = "";
    } catch(e){//エラーが発生した場合(eはエラー情報)
        status.textContent = "うまくいきませんでした:" + e.message;
    } finally{
        button.disabled = false;
    }
}
//ボタンをクリックしてsummarize関数を実行
document.getElementById("summarizeButton").onclick = summarize;
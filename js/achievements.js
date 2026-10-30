//localStorageから期間内のデータを読み、テキストにして中継関数(worker.js)に送る

//☆デプロイした中継関数(Cloudflare Worker)のURLに書き換える
const WORKER_URL = "https://kanri-ai.あなたのサブドメイン.workers.dev";

//localStorageからデータを取得
const tasks = JSON.parse(localStorage.getItem("tasks")) || {};
const schedule = JSON.parse(localStorage.getItem("schedule")) || {};

//
function toInputDate(d){
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
}

function setRange(fromDate, toDate){
    document.getElementById("from").value = toInputDate(fromDate);
    document.getElementById("to").value = toInputDate(toDate);
}

function setThisWeek(){
    const today = new Date();
    const mon = new Date(today);
    mon.setDate(today.getDate() - ((today.getDay() + 6) % 7));
    setRange(mon, today);
}
function setLastWeek(){
    const today = new Date();
    const mon = new Date(today);
    mon.setDate(today.getDate() - ((today.getDay() + 6) % 7) - 7);
    const sun = new Date(mon);
    sun.setDate(mon.setDate() + 6);
    setRange(mon, sun);
}
function setThisMonth(){
    const today = new Date();
    setRange(new Date(today.getFullYear(), today.getMonth(), 1), today);
}

document.getElementById("thisWeekButton").onclick = setThisWeek;
document.getElementById("lastWeekButton").onclick = setLastWeek;
document.getElementById("thisMonthButton").onclick = setThisMonth;
setThisWeek();//初期値は今週

//期間内のデータをテキストにまとめる
function collectRecords(from, to){
    const inRange = (dateStr) => deteStr >= from && deteStr <= to;

    const doneLines = [];
    Object.keys(tasks).sort().forEach(date => {
        if(!inRange(date)) return;
        tasks[date].forEach(t => {
            if(t && t.done) doneLines.push(`${date}: ${t.text}`);
        });
    });

    const scheduleLines = [];
    Object.keys(schedule).sort().forEach(key => {
        const date = key.slice(0, 10);
        const slot = key.slice(11);
        if(!inRange(date)) return;
        if(schedule[key]) scheduleLines.push(`${date} ${slot}: ${schedule[key]}`);
    });

    return { doneLines, scheduleLines };
}

async function summarize(){
    const from = document.getElementById("from").value;
    const to = document.getElementById("to").value;
    const status = document.getElementById("status");
    const result = document.getElementById("result");
    const button = document.getElementById("summarizeButton");

    result.textContent = "";

    if(!from || !to || from > to){
        status.textContent = "期間を正しく指定してください。"
        return;
    }

    const {doneLines, scheduleLines} = collectRecords(from, to);

    if(doneLines.length === 0 && scheduleLines.length === 0){
        status.textContent = "この期間には記録がありません。";
        return;
    }

    button.disabled = true;
    status.textContent = "まとめています...";

    try{
        const res = await fetch(WORKER_URL, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                from,
                to,
                done: doneLines.join("\n"),
                schedule: scheduleLines.join("\n")
            })
        });
        const data = await res.json();
        if(!res.ok) throw new Error(data.error || `エラー(${res.status})`);

        result.textContent = data.text;

        status.textContent = "";
    } catch(e){
        status.textContent = "うまくいきませんでした:" + e.message;
    } finally{
        button.disabled = false;
    }
}

document.getElementById("summarizeButton").onclick = summarize;
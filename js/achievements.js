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
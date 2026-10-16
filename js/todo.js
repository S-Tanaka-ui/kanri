//HOMEに戻るためのボタンの機能
const button = document.querySelector(".homeBackButton");
button.addEventListener("click", function(){
    window.location.href = "index.html"
})


//カレンダースライドとtodoリストの内容表示

//タスク一覧の配列を定義
const tasks = JSON.parse(localStorage.getItem("tasks")) || {};

// 旧形式(文字列)のデータを { text, done } に変換
Object.keys(tasks).forEach(k => {
    tasks[k] = tasks[k].map(t =>
        typeof t === "string" ? { text: t, done: false } : t
    );
});

// 保存処理をまとめた関数
function saveTasks(){
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

//月曜日を保持
let monday = getMonday(new Date());

//日付を渡すと、その日付の週の月曜日が返ってくる関数
function getMonday(d){
    d = new Date(d);//dを日付データとする
    d.setDate(d.getDate() - ((d.getDay() + 6) %7));//getDate→日付、getDay→曜日、月曜日の日付が求まる
    return d;
}

//日付を文字列として認識する関数
function formatKey(d){
    return d.toISOString().slice(0,10);
}

function render(){
    //その週の分の日付の配列を作る関数
    const days = [...Array(7)].map((_ , i) =>{//スプレッド構文・map(要素,インデックス)
        const d = new Date(monday);
        d.setDate(monday.getDate() + i);
        return d;
    });

    //〇月〇週の見出しの表示
    document.getElementById("weekLabel").textContent = `${monday.getMonth() + 1}月${Math.ceil((monday.getDate() + 6) /7)}週`;

    //todoリスト表の中身を(一旦空で)作り出す
    const dateRow = document.getElementById("dateRow");
    const weekdayRow = document.getElementById("weekdayRow");
    const taskRow = document.getElementById("taskRow");

    dateRow.innerHTML = weekdayRow.innerHTML = taskRow.innerHTML = "";

    //todoリスト表の中身を(実際に)埋めていく
    days.forEach(d => {
        const key = formatKey(d);
        dateRow.innerHTML += `<th>${d.getDate()}</th>`;
        weekdayRow.innerHTML += `<th>${'月火水木金土日'[d.getDay() === 0 ? 6 : d.getDay() - 1]}</th>`;
        taskRow.innerHTML += `
            <td>
                <ul>${(tasks[key] || []).map((t, i) => `
                    <li class="${t.done ? "done" : ""}">
                        <label>
                            <input type="checkbox" ${t.done ? "checked" : ""}
                                onchange="toggleTask('${key}', ${i})">
                            ${t.text}
                        </label>
                    </li>
                    `).join("")}</ul>
                <button onclick="addTask('${key}')" class="addListButton">+</button>
            </td>
        `;
    });
}

//todoリストの追加に関する関数
function addTask(key){
    const text = prompt("タスク内容を入力してください");
    if(!text) return;
    (tasks[key] ??= []).push({ text: text, done: false });
    localStorage.setItem("tasks", JSON.stringify(tasks));
    saveTasks();
    render();
};

// チェックのON/OFFを切り替える
function toggleTask(key, index){
    tasks[key][index].done = !tasks[key][index].done;
    saveTasks();
    render();
}

//＜＞ボタンでカレンダーの週を移動する機能の追加
function slideWeek(n){
    monday.setDate(monday.getDate() + n * 7);
    render();
}

document.getElementById("prevButton").onclick = () => slideWeek(-1);
document.getElementById("nextButton").onclick = () => slideWeek(1);

render();
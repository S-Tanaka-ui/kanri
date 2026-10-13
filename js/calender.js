const button = document.querySelector(".homeBackButton");
button.addEventListener("click", function(){
    window.location.href = "index.html"
})


//カレンダースライドと週の予定の内容表示

//月曜日を保持
let monday = getMonday(new Date());

//予定の保存先
const schedule = JSON.parse(localStorage.getItem("schedule")) || {};

//日付を渡すと、その日付の週の月曜日が返ってくる関数
function getMonday(d){
    d = new Date(d);
    d.setDate(d.getDate() - ((d.getDay() + 6) %7));
    return d;
}

//日付を文字列として認識する関数
function formatKey(d){
    return d.toISOString().slice(0, 10);
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
    //予定表の中身を作り出す
    const dateRow = document.getElementById("dateRow");
    const weekdayRow = document.getElementById("weekdayRow");
    const amRow = document.getElementById("amRow");
    const pmRow = document.getElementById("pmRow");
    const ntRow = document.getElementById("ntRow");

    dateRow.innerHTML = `<th>日付</th>`
    weekdayRow.innerHTML = `<th>曜日</th>`
    amRow.innerHTML = `<th>AM</th>`
    pmRow.innerHTML = `<th>PM</th>`
    ntRow.innerHTML = `<th>NT</th>`

    days.forEach(d => {//.map~は一つのセルに複数の文書を追加する場合に必要
        const key = formatKey(d);

        dateRow.innerHTML += `
            <th>${d.getDate()}</th>
        `;
        weekdayRow.innerHTML += `
            <th>${'月火水木金土日'[d.getDay() === 0 ? 6 : d.getDay() - 1]}</th>
        `;
        amRow.innerHTML += `
            <td class="yotei" data-key="${key}_AM">${schedule[key + "_AM"] || ""}</td>
        `;
        pmRow.innerHTML += `
            <td class="yotei" data-key="${key}_PM">${schedule[key + "_PM"] || ""}</td>
        `;
        ntRow.innerHTML += `
            <td class="yotei" data-key="${key}_NT">${schedule[key + "_NT"] || ""}</td>
        `;
    });

    //AM,PM,NT欄にそれぞれ予定を埋め込む
    document.querySelectorAll('td.yotei').forEach(cell => {
        cell.addEventListener('click', () => {
            const k = cell.dataset.key;
            const text = prompt('予定を入力してください', cell.textContent);
            if (text !== null) { // キャンセル時は null が返る
                if (text === "") {
                    delete schedule[k];          // 空なら削除
                } else {
                    schedule[k] = text;
                }
                localStorage.setItem("schedule", JSON.stringify(schedule));
                cell.textContent = text;
            }
        });
    });
}

//＜＞ボタンでカレンダーの週を移動する機能の追加
function slideWeek(n){
    monday.setDate(monday.getDate() + n * 7);
    render();
}

document.getElementById("prevButton").onclick = () => slideWeek(-1);
document.getElementById("nextButton").onclick = () => slideWeek(1);

render();

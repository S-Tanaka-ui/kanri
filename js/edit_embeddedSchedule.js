const button = document.querySelector(".homeBackButton");
button.addEventListener("click", function(){
    window.location.href = "index.html"
})

//+ボタンを押して曜日と時間帯を追加
document.getElementById("add-schedule").addEventListener("click", function(){
    const list = document.getElementById("schedule-list");
    const firstItem = list.querySelector(".schedule-item");
    const newItem = firstItem.cloneNode(true);

    //ついでに削除ボタンも追加
    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.textContent = "-";
    removeBtn.className = "remove-btn";

    newItem.appendChild(removeBtn);
    list.appendChild(newItem);
});

//-ボタンの位置にあるリストを削除する
document.getElementById("schedule-list").addEventListener("click", function(e){
    if(e.target.classList.contains("remove-btn")){
        e.target.closest(".schedule-item").remove();
    }
});




//登録ボタンを押すと題名が生活要素に追加される
const touroku = document.getElementById("tourokuButton");
const daimeiInput = document.querySelector(".daimeiContent");
const gaiyouInput = document.querySelector(".gaiyouContent");
const memoInput = document.querySelector(".memoContent");

const params = new URLSearchParams(location.search);
const editIndex = params.get("index");
let items = JSON.parse(localStorage.getItem("embeddedItems")) || [];

if (editIndex !== null) {
    const item = items[editIndex];
    daimeiInput.value = item.title;
    gaiyouInput.value = item.summary;
    memoInput.value = item.memo;

    const list = document.getElementById("schedule-list");
    const firstItem = list.querySelector(".schedule-item");

    item.schedules.forEach(function(s, i){
        let row;
        if(i === 0){
            row = firstItem;
        }else{
            row = firstItem.cloneNode(true);

            const removeBtn = document.createElement("button");
            removeBtn.type = "button";
            removeBtn.textContent = "-";
            removeBtn.className = "remove-btn";
            row.appendChild(removeBtn);

            list.appendChild(row);
        }
        row.querySelector(".day").value = s.day;
        row.querySelector(".time").value = s.time;
    });
}

touroku.addEventListener("click", function(){
    if (!daimeiInput.value) return;

    const schedules = [];
    document.querySelectorAll(".schedule-item").forEach(function(row){
        schedules.push({
            day: row.querySelector(".day").value,
            time: row.querySelector(".time").value
        });
    });

    const newItem = {
        title: daimeiInput.value,
        summary: gaiyouInput.value,
        schedules: schedules,
        memo: memoInput.value
    };

    if (editIndex !== null) {
        items[editIndex] = newItem;
    } else {
        items.push(newItem);
    }

    localStorage.setItem("embeddedItems", JSON.stringify(items));
    location.href = "index.html";
})
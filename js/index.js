//生活要素(カレンダー側)をクリックし、編集画面へ
const button = document.getElementById("embeddedScheduleButton");
button.addEventListener("click", function(){
    window.location.href = "edit_embeddedSchedule.html"
});

//生活要素(todo側)をクリックし、編集画面へ
const button2 = document.getElementById("personalScheduleButton");
button2.addEventListener("click", function(){
    window.location.href = "edit_personalSchedule.html"
});




//編集画面で追加した要素を反映させる
window.addEventListener("DOMContentLoaded", function(){//HTML(DOM)の読み込み(Load)が完了したら処理を実行
    const container = document.querySelector(".embeddedContents");
    const embeddedItems = JSON.parse(localStorage.getItem("embeddedItems")) || [];

    embeddedItems.forEach(function(item, index){
        const div = document.createElement("div");
        div.textContent = item.title;

        div.addEventListener("click", function(){//indexの情報を持って、編集画面に遷移
            location.href = "edit_embeddedSchedule.html?index=" +index;//?~でindexをドッキング
        })

        container.appendChild(div);
    });
});
window.addEventListener("DOMContentLoaded", function(){
    const container = document.querySelector(".personalContents");
    const personalItems = JSON.parse(localStorage.getItem("personalItems")) || [];

    personalItems.forEach(function(item, index){
        const div = document.createElement("div");
        div.textContent = item.title;

        div.addEventListener("click", function(){
            location.href = "edit_personalSchedule.html?index=" + index;
        });

        container.appendChild(div);
    });
});
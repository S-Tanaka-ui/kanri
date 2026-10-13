const button = document.querySelector(".homeBackButton");
button.addEventListener("click", function(){
    window.location.href = "index.html"
})

//登録ボタンを押すと題名が生活要素に追加される
const touroku = document.getElementById("tourokuButton");
const daimeiInput = document.querySelector(".daimeiContent");
const gaiyouInput = document.querySelector(".gaiyouContent");
const memoInput = document.querySelector(".memoContent");

const params = new URLSearchParams(location.search);
const editIndex = params.get("index");
let items = JSON.parse(localStorage.getItem("personalItems")) || [];

if (editIndex !== null) {
    const item = items[editIndex];
    daimeiInput.value = item.title;
    gaiyouInput.value = item.summary;
    memoInput.value = item.memo;
}

touroku.addEventListener("click", function(){
    if (!daimeiInput.value) return;

    const newItem = {
        title: daimeiInput.value,
        summary: gaiyouInput.value,
        memo: memoInput.value
    };

    if (editIndex !== null) {
        items[editIndex] = newItem;
    } else {
        items.push(newItem);
    }

    localStorage.setItem("personalItems", JSON.stringify(items));
    location.href = "index.html";
})
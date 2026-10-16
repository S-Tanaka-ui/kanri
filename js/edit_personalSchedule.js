//HOMEに戻るためのボタンの機能
const button = document.querySelector(".homeBackButton");
button.addEventListener("click", function(){
    window.location.href = "index.html"
})

//登録ボタンを押すと題名が生活要素に追加される
const touroku = document.getElementById("tourokuButton");
const daimeiInput = document.querySelector(".daimeiContent");
const gaiyouInput = document.querySelector(".gaiyouContent");
const memoInput = document.querySelector(".memoContent");


//生活要素を登録
//URLをチェックし、indexがあるかどうかを確認
const params = new URLSearchParams(location.search);
const editIndex = params.get("index");
let items = JSON.parse(localStorage.getItem("personalItems")) || [];

//indexがあれば、もともと保存されていたデータを実際の画面にあらかじめ表示
if (editIndex !== null) {
    const item = items[editIndex];
    daimeiInput.value = item.title;
    gaiyouInput.value = item.summary;
    memoInput.value = item.memo;
}

touroku.addEventListener("click", function(){
    if (!daimeiInput.value) return;//タイトルが空なら中断

    const newItem = {//入力欄の文字を一つのオブジェクトにまとめる
        title: daimeiInput.value,
        summary: gaiyouInput.value,
        memo: memoInput.value
    };

    if (editIndex !== null) {//既にindexがあればデータを上書き
        items[editIndex] = newItem;
    } else {//そうでなければ追加
        items.push(newItem);
    }

    localStorage.setItem("personalItems", JSON.stringify(items));//localStorageに保存
    location.href = "index.html";
})
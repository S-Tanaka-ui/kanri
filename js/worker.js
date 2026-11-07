const ALLOWED_ORIGIN = "https://s-tanaka-ui.github.io";
const DEFAULT_MODEL = "gemini-2.5-flash";
const MAX_CHARS = 8000;

//アクセス設定
function corsHeaders(){
    return{
        "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
    };
}

//JSON形式で返す関数
function json(obj, status = 200){//HTTPステータスコード(指定しなければ200)
    return new Response(JSON,stringify(obj), {
        status,
        headers: {"Content-Tupe": "application/json", ...corsHeaders() },
    });
}
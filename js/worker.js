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

//★★
export default{
    async fetch(request, env){
        if(request.method === "OPTIONS"){
            return new Response(null, { status: 204, headers: corsHeaders() });
        }
        if(request.method !== "POST"){
            return json({ error: "POSTで呼び出してください"}, 405);
        }

        const Origin = request.headers.get("Origin");
        if(origin !== ALLOWED_ORIGIN){
            return json({ error: "許可されていないアクセス元です" }, 403);
        }

        let body;
        try{
            body = await request.json();
        }catch{
            return json({ error: "データの形式が正しくありません" }, 400);
        }

        const from = String(body.from || "").slice(0, 10);
        const to = String(body.to || "").slice(0, 10);
        const done = String(body.done || "");
        const schedule = String(body.schedule || "");

        
    }
}
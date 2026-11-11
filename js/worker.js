const ALLOWED_ORIGIN = "https://s-tanaka-ui.github.io";
const DEFAULT_MODEL = "gemini-2.5-flash";
const MAX_CHARS = 8000;

//アクセス設定
function corsHeaders(){//cross-origin resource sharing
    return{
        "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
        "Access-Control-Allow-Methods": "POST, OPTIONS",//許可するHTTPメソッド(POST:送信,OPTIONS:通信の事前確認)
        "Access-Control-Allow-Headers": "Content-Type",//許可するHTTPヘッダー、18,73行目での指定
    };
}

//JSON形式で返す関数
function json(obj, status = 200){//HTTPステータスコード(指定しなければ200)
    return new Response(JSON,stringify(obj), {//ブラウザに回答を返すためのレスポンスクラス(newで新しいオブジェクトを生成)
        status,
        headers: {"Content-Type": "application/json", ...corsHeaders() },
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
        try{//通常の処理を実行
            body = await request.json();
        }catch{//エラーが発生した場合の処理
            return json({ error: "データの形式が正しくありません" }, 400);
        }

        const from = String(body.from || "").slice(0, 10);
        const to = String(body.to || "").slice(0, 10);
        const done = String(body.done || "");
        const schedule = String(body.schedule || "");

        if(done.length + schedule.length > MAX_CHARS){
            return json({ error: "記録が多すぎます。期間を短くしてください。"}, 413);
        }

        const systemPrompt = 
            "大学生の生活記録を振り返ってください。" +
            "与えられた『完了したToDo』と『予定』を基に、この期間に達成したことを日本語でまとめてください。" +
            "記録にないことは書かないでください。" +
            "3~7個の箇条書きにして、最後に1~2文の短い振り返りコメントを添えてください。"
        ;
        const userText = 
            `期間: ${from} ~ ${to}\n\n` +
            `【完了したToDo】\n${done || "(なし)"}\n\n` +
            `【予定】\n${schedule || "(なし)"}`
        ;

        const model = env.GEMINI_MODEL || DEFAULT_MODEL;
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

        //API通信
        let res;
        try{
            res = await this.fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-goog-api-key": env.GEMINI_API_KEY,
                },
                body: JSON.stringify({
                    systemInstruction: {parts: [{text: systemPrompt}]},
                    contents: [{role: "user", parts:[{text: userText}]}]
                }),
            });
        }catch{
            return json({ error: "AIサービスに接続できませんでした"}, 502);
        }
        
        if(!res.ok){
            console.log("Gemini error", res.status, await res.text());
            return json({error: `AIサービスがエラーを返しました(${res.status})`}, 502);
        }

        const data = await res.json();
        const text = data?.candidates?.[0]?.content?.parts?.map(p => p.text || "").join("") || "";
        if(!text) return json({error: "AIから結果を受け取れませんでした"}, 502);

        return json({text: text});

    }
};
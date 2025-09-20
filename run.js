import { serve } from "https://deno.land/std@0.203.0/http/server.ts";
import { acceptWebSocket } from "https://deno.land/std@0.203.0/ws/mod.ts";
import { fetch as fetchWeb } from "https://deno.land/std@0.203.0/fetch/mod.ts";

const sessions = new Map(); // كل مستخدم له جلسة

console.log("AGI Cloud Smart Robot running at http://localhost:3000");

serve(async (req) => {
  const { pathname } = new URL(req.url);

  if (pathname === "/") {
    const file = await Deno.readTextFile("chat.html");
    return new Response(file, { headers: { "content-type": "text/html" } });
  }

  if (pathname === "/chat.js") {
    const file = await Deno.readTextFile("chat.js");
    return new Response(file, { headers: { "content-type": "application/javascript" } });
  }

  if (pathname === "/style.css") {
    const file = await Deno.readTextFile("style.css");
    return new Response(file, { headers: { "content-type": "text/css" } });
  }

  if (pathname === "/ws") {
    const { conn, r: bufReader, w: bufWriter, headers } = req;
    const ws = await acceptWebSocket({ conn, bufReader, bufWriter, headers });
    handleWs(ws);
    return new Response(null, { status: 101 });
  }

  return new Response("Not Found", { status: 404 });
});

async function handleWs(ws) {
  const userId = crypto.randomUUID();
  sessions.set(userId, []);

  try {
    for await (const msg of ws) {
      if (typeof msg === "string") {
        sessions.get(userId).push({ role: "user", text: msg });

        // استدعاء AGI ذكي: يبحث في ويكيبيديا كمثال
        const reply = await generateSmartReply(msg, sessions.get(userId));
        sessions.get(userId).push({ role: "agi", text: reply });
        await ws.send(reply);
      }
    }
  } catch (err) {
    console.error("WS Error:", err);
  } finally {
    sessions.delete(userId);
    ws.close();
  }
}

async function generateSmartReply(userMessage, sessionHistory) {
  try {
    const searchQuery = encodeURIComponent(userMessage);
    const wikiRes = await fetchWeb(`https://en.wikipedia.org/api/rest_v1/page/summary/${searchQuery}`);
    if (wikiRes.ok) {
      const data = await wikiRes.json();
      return `AGI: ${data.extract || "لم أجد معلومات دقيقة، حاول إعادة صياغة السؤال."}`;
    } else {
      return "AGI: لم أتمكن من الوصول إلى المصادر الآن، حاول لاحقًا.";
    }
  } catch (err) {
    return "AGI: حدث خطأ أثناء البحث، حاول مرة أخرى.";
  }
}

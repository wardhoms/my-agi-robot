import { serve } from "https://deno.land/std@0.203.0/http/server.ts";
import { acceptWebSocket, WebSocket } from "https://deno.land/std@0.203.0/ws/mod.ts";

const sessions = new Map(); // لتخزين رسائل كل مستخدم

console.log("AGI Cloud Robot running at http://localhost:3000");

serve(async (req) => {
  const { pathname } = new URL(req.url);

  // صفحة الشات
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

  // WebSocket AGI
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
        
        // الرد الذكي (نسخة أولية)
        const reply = `AGI: فهمت رسالتك -> ${msg}`;
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

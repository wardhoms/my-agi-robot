import { serve } from "https://deno.land/std@0.203.0/http/server.ts";

console.log("AGI Robot running at http://localhost:3000");

serve(async (req) => {
  const url = new URL(req.url);
  
  // إرسال ملفات ثابتة
  if (url.pathname === "/") {
    const file = await Deno.readTextFile("chat.html");
    return new Response(file, { headers: { "content-type": "text/html" } });
  }
  if (url.pathname === "/chat.js") {
    const file = await Deno.readTextFile("chat.js");
    return new Response(file, { headers: { "content-type": "application/javascript" } });
  }
  if (url.pathname === "/style.css") {
    const file = await Deno.readTextFile("style.css");
    return new Response(file, { headers: { "content-type": "text/css" } });
  }

  // مثال: API استقبال الرسائل
  if (url.pathname === "/api/message" && req.method === "POST") {
    const body = await req.json();
    const userMsg = body.message || "";
    
    // AGI الرد البسيط
    const botReply = `AGI: تلقيت رسالتك -> ${userMsg}`;

    return new Response(JSON.stringify({ reply: botReply }), {
      headers: { "content-type": "application/json" },
    });
  }

  return new Response("Not Found", { status: 404 });
}, { port: 3000 });

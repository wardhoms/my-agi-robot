import { serve } from "https://deno.land/std@0.203.0/http/server.ts";
import { readFileStr, writeFileStr } from "https://deno.land/std@0.203.0/fs/mod.ts";

const PORT = 3000;
const PROJECT_DIR = "."; // يعمل داخل نفس المجلد

console.log(`AGI Robot running at http://localhost:${PORT}`);

serve(async (req) => {
  const url = new URL(req.url);

  // GET /files → يعرض قائمة الملفات
  if (url.pathname === "/files") {
    try {
      const files = [];
      for await (const dirEntry of Deno.readDir(PROJECT_DIR)) {
        files.push({
          name: dirEntry.name,
          type: dirEntry.isDirectory ? "folder" : "file",
        });
      }
      return new Response(JSON.stringify(files), { headers: { "Content-Type": "application/json" } });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
  }

  // POST /write → حفظ الملفات
  if (url.pathname === "/write" && req.method === "POST") {
    const data = await req.json();
    try {
      await writeFileStr(`${PROJECT_DIR}/${data.filepath}`, data.content);
      return new Response(JSON.stringify({ status: "ok" }), { headers: { "Content-Type": "application/json" } });
    } catch (err) {
      return new Response(JSON.stringify({ status: "error", error: err.message }), { status: 500 });
    }
  }

  // GET /chat.html أو ملفات أخرى → يعرض المحتوى
  let path = url.pathname === "/" ? "/chat.html" : url.pathname;
  try {
    const content = await readFileStr(`${PROJECT_DIR}${path}`);
    const contentType = path.endsWith(".html") ? "text/html" :
                        path.endsWith(".js") ? "text/javascript" :
                        path.endsWith(".css") ? "text/css" : "text/plain";
    return new Response(content, { headers: { "Content-Type": contentType } });
  } catch {
    return new Response("Not Found", { status: 404 });
  }
}, { port: PORT });

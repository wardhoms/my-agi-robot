async function sendMessage() {
  const textarea = document.getElementById("userMessage");
  const msg = textarea.value.trim();
  if (!msg) return;

  appendMessage(`أنت: ${msg}`);
  textarea.value = "";

  const res = await fetch("/api/message", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: msg })
  });

  const data = await res.json();
  appendMessage(data.reply);
}

function appendMessage(text) {
  const chatWindow = document.getElementById("chatWindow");
  chatWindow.innerHTML += text + "<br>";
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

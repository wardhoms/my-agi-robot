const chatBox = document.getElementById("chatBox");
const messageInput = document.getElementById("message");
const sendBtn = document.getElementById("sendBtn");

const ws = new WebSocket(`ws://${location.host}/ws`);

ws.onmessage = (event) => {
  const div = document.createElement("div");
  div.className = "message agi";
  div.textContent = event.data;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
};

sendBtn.onclick = sendMessage;
messageInput.onkeypress = (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
};

function sendMessage() {
  const text = messageInput.value.trim();
  if (!text) return;
  const div = document.createElement("div");
  div.className = "message user";
  div.textContent = text;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
  ws.send(text);
  messageInput.value = "";
}

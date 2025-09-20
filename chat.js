async function fetchFiles() {
  const res = await fetch("/files");
  const files = await res.json();
  document.getElementById("files").innerText = JSON.stringify(files, null, 2);
}

async function sendMessage() {
  const textarea = document.getElementById("message");
  const message = textarea.value.trim();
  if (!message) return;
  
  // الرد التجريبي (echo)
  alert("AGI says: " + message);
  textarea.value = "";
  fetchFiles();
}

fetchFiles();

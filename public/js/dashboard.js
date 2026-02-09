// Config
const API_BASE = "/api";

// Auth Check
async function checkAuth() {
    try {
        const res = await fetch(`${API_BASE}/validate_login`);
        if (!res.ok) throw new Error("Not logged in");
    } catch (e) {
        window.location.href = "/login.html";
    }
}
checkAuth();

// Tabs
function switchTab(tab) {
    document
        .querySelectorAll(".tab")
        .forEach((t) => t.classList.remove("active"));
    document
        .querySelectorAll(".content")
        .forEach((c) => c.classList.remove("active"));
    document.querySelector(`.tab[data-tab="${tab}"]`).classList.add("active"); // Changed selector for external script
    document.getElementById(`${tab}-content`).classList.add("active");
    if (tab === "files") loadFiles();
    if (tab === "keys") loadKeys();
}

// Attach event listeners for tabs (since onclick in HTML might fail CSP if strict)
// But for now, let's keep onclick in HTML if we only moved the script content?
// Wait, inline handlers like onclick="..." are ALSO blocked by default CSP unless 'unsafe-inline' is allowed.
// So we should remove onclick attributes and add event listeners here.

// Files
async function loadFiles() {
    const res = await fetch(`${API_BASE}/files`);
    if (!res.ok) return; // Handle error
    const files = await res.json();
    const tbody = document.querySelector("#files-table tbody");
    tbody.innerHTML = files
        .map(
            (f) => `
        <tr>
            <td>${f.type.includes("image") ? `<img src="${f.url}" class="preview-img">` : "📄"}</td>
            <td>${f.type}</td>
            <td><a href="${f.url}" target="_blank">${f.url}</a></td>
            <td>${f.domain}</td>
            <td>${new Date(f.createdAt).toLocaleDateString()}</td>
            <td>
                <button class="btn-danger delete-file-btn" data-id="${f.id}">Delete</button>
            </td>
        </tr>
    `,
        )
        .join("");

    // Re-attach listeners for dynamic content
    document.querySelectorAll(".delete-file-btn").forEach((btn) => {
        btn.addEventListener("click", () => deleteFile(btn.dataset.id));
    });
}

function triggerUpload() {
    document.getElementById("fileInput").click();
}

async function uploadFile() {
    const input = document.getElementById("fileInput");
    const file = input.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append(
        "type",
        file.type.startsWith("image/") ? "file_upload" : "pdf_upload",
    );

    const endpoint = file.type.startsWith("image/")
        ? "/upload/image"
        : "/upload/pdf";

    try {
        const res = await fetch(`${API_BASE}${endpoint}`, {
            method: "POST",
            body: formData,
        });
        if (res.ok) {
            alert("Upload successful");
            loadFiles();
        } else {
            alert("Upload failed");
        }
    } catch (e) {
        console.error(e);
        alert("Error uploading file");
    }
    input.value = "";
}

// Keys
async function loadKeys() {
    const res = await fetch(`${API_BASE}/keys`);
    if (!res.ok) return;
    const keys = await res.json();
    const tbody = document.querySelector("#keys-table tbody");
    tbody.innerHTML = keys
        .map(
            (k) => `
        <tr>
            <td>${k.name}</td>
            <td><code>${k.key}</code></td>
            <td>${k.lastUsedAt ? new Date(k.lastUsedAt).toLocaleString() : "Never"}</td>
            <td>${new Date(k.createdAt).toLocaleDateString()}</td>
            <td>
                <button class="btn-danger delete-key-btn" data-id="${k.id}">Revoke</button>
            </td>
        </tr>
    `,
        )
        .join("");

    document.querySelectorAll(".delete-key-btn").forEach((btn) => {
        btn.addEventListener("click", () => deleteKey(btn.dataset.id));
    });
}

async function generateKey() {
    const name = document.getElementById("newKeyName").value;
    if (!name) return alert("Please enter a name");

    const res = await fetch(`${API_BASE}/keys`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
    });

    if (res.ok) {
        document.getElementById("newKeyName").value = "";
        loadKeys();
    } else {
        alert("Failed to generate key");
    }
}

async function deleteKey(id) {
    if (!confirm("Are you sure you want to revoke this key?")) return;
    const res = await fetch(`${API_BASE}/keys/${id}`, { method: "DELETE" });
    if (res.ok) loadKeys();
    else alert("Failed to delete key");
}

async function deleteFile(id) {
    if (!confirm("Are you sure you want to delete this file?")) return;
    // Note: API for delete file needs to be implemented or verified
    // For now, assuming it exists or using update/delete logic
    // Plan said: DELETE /files/:id (Protected by Admin)
    const res = await fetch(`${API_BASE}/files/${id}`, { method: "DELETE" });
    if (res.ok) loadFiles();
    else alert("Failed to delete file");
}

async function logout() {
    // Basic logout logic
    // Clear any client side storage if we used it (e.g. localStorage 'token' if we were using it,
    // but we are using session cookies for admin)
    // Call server logout
    try {
        // Assume API has logout or just redirect
        // fetch('/api/logout');
    } catch (e) {}
    window.location.href = "/login.html";
}

// Event Listeners Initialization
document.addEventListener("DOMContentLoaded", () => {
    // Tabs
    document.querySelectorAll(".tab").forEach((tab) => {
        tab.addEventListener("click", () => {
            const tabName = tab.dataset.tab; // data-tab="files"
            switchTab(tabName);
        });
    });

    // Logout
    document.getElementById("logoutBtn").addEventListener("click", logout);

    // Upload
    document
        .getElementById("uploadBtn")
        .addEventListener("click", triggerUpload);
    document.getElementById("fileInput").addEventListener("change", uploadFile);

    // Generate Key
    document
        .getElementById("generateKeyBtn")
        .addEventListener("click", generateKey);

    // Initial load
    loadFiles();
});

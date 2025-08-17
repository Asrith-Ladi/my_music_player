// src/utils/fileSystemStorage.js
// Simple default download to browser "Downloads" folder

export async function downloadSong(name, blob) {
  try {
    console.log("⬇️ Starting download:", name);

    // Create temporary object URL
    const url = URL.createObjectURL(blob);

    // Create a hidden anchor tag
    const a = document.createElement("a");
    a.href = url;
    a.download = name.endsWith(".mp3") ? name : `${name}.mp3`; // Ensure .mp3 extension
    document.body.appendChild(a);

    // Trigger click to start download
    a.click();
    document.body.removeChild(a);

    // Cleanup
    URL.revokeObjectURL(url);
    console.log("✅ Download triggered:", name);
  } catch (err) {
    console.error("❌ Download failed:", err);
  }
}

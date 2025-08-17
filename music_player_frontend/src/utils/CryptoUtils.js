// import CryptoJS from "crypto-js";

// const ENCRYPTION_KEY = "asrith-music-player-secret-key-123456"; // same as used in SongInfo.jsx

// // 🔐 Decrypt encrypted song file back to Blob (mp3)
// export async function decryptSong(file) {
//   return new Promise((resolve, reject) => {
//     const reader = new FileReader();

//     reader.onload = (event) => {
//       try {
//         const encryptedText = event.target.result;

//         // Decrypt with AES
//         const decrypted = CryptoJS.AES.decrypt(encryptedText, ENCRYPTION_KEY);

//         // Convert back to Uint8Array
//         const typedArray = convertWordArrayToUint8Array(decrypted);

//         // Create Blob (mp3)
//         const blob = new Blob([typedArray], { type: "audio/mpeg" });
//         resolve(blob);
//       } catch (err) {
//         reject(err);
//       }
//     };

//     reader.onerror = () => reject(reader.error);
//     reader.readAsText(file); // Encrypted file is stored as text
//   });
// }

// // Helper: Convert CryptoJS WordArray → Uint8Array
// function convertWordArrayToUint8Array(wordArray) {
//   const words = wordArray.words;
//   const sigBytes = wordArray.sigBytes;

//   const u8 = new Uint8Array(sigBytes);
//   let i = 0;
//   while (i < sigBytes) {
//     const word = words[i >>> 2];
//     u8[i] = (word >>> (24 - (i % 4) * 8)) & 0xff;
//     i++;
//   }
//   return u8;
// }

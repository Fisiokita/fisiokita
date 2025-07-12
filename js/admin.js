// admin.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  setDoc,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

import { firebaseConfig } from "./firebase-config.js";

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Cek login
let currentUID = null;
onAuthStateChanged(auth, user => {
  if (user) {
    currentUID = user.uid;
    loadChatAktif();
    loadRiwayatChat();
    loadJadwal();
    loadStatus();
    loadOfflineRequests();
  } else {
    window.location.href = "admin-login.html"; // redirect jika belum login
  }
});

// Navigasi Sidebar
const navLinks = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll("main > section");

navLinks.forEach(link => {
  link.addEventListener("click", () => {
    const targetId = link.getAttribute("data-target");
    sections.forEach(sec => sec.classList.add("hidden"));
    document.getElementById(targetId).classList.remove("hidden");
  });
});

// Logout
document.getElementById("logoutBtn").addEventListener("click", () => {
  signOut(auth).then(() => {
    window.location.href = "admin-login.html";
  });
});

// 🔵 Chat Aktif
async function loadChatAktif() {
  const q = query(
    collection(db, "chat-sessions"),
    where("status", "==", "aktif"),
    where("terapisId", "==", currentUID)
  );

  onSnapshot(q, snapshot => {
    const container = document.getElementById("chatAktifList");
    container.innerHTML = "";
    snapshot.forEach(docSnap => {
      const data = docSnap.data();
      container.innerHTML += `
        <div class="bg-white p-4 rounded shadow">
          <p><strong>Pasien:</strong> ${data.namaPasien}</p>
          <p><strong>Mulai:</strong> ${data.mulaiJam}</p>
          <a href="/chat.html?sesi=${docSnap.id}" class="text-blue-600 underline">Masuk Chat</a>
        </div>
      `;
    });
  });
}

// 📁 Riwayat Konsultasi
async function loadRiwayatChat() {
  const q = query(
    collection(db, "chat-sessions"),
    where("status", "==", "selesai"),
    where("terapisId", "==", currentUID)
  );

  onSnapshot(q, snapshot => {
    const container = document.getElementById("riwayatList");
    container.innerHTML = "";
    snapshot.forEach(docSnap => {
      const data = docSnap.data();
      container.innerHTML += `
        <div class="bg-white p-4 rounded shadow">
          <p><strong>Pasien:</strong> ${data.namaPasien}</p>
          <p><strong>Selesai:</strong> ${data.selesaiJam || "-"}</p>
          <p><strong>Catatan:</strong> ${data.catatan || "-"}</p>
        </div>
      `;
    });
  });
}

// 🗓️ Ubah Jadwal
document.getElementById("formJadwal").addEventListener("submit", async e => {
  e.preventDefault();
  const hari = document.getElementById("jadwalHari").value;
  const jam = document.getElementById("jadwalJam").value;

  if (!hari || !jam) return alert("Lengkapi data jadwal!");

  await setDoc(doc(db, "jadwal-terapis", currentUID), {
    hari, jam
  });

  alert("Jadwal berhasil diperbarui!");
});

async function loadJadwal() {
  const docRef = doc(db, "jadwal-terapis", currentUID);
  const snap = await getDocs(query(collection(db, "jadwal-terapis"), where("__name__", "==", currentUID)));
  snap.forEach(docSnap => {
    const data = docSnap.data();
    document.getElementById("jadwalHari").value = data.hari || "";
    document.getElementById("jadwalJam").value = data.jam || "";
  });
}

// 🟢 Status Konsultasi
const statusBtn = document.getElementById("btnToggleStatus");
const statusLabel = document.getElementById("statusLabel");

statusBtn.addEventListener("click", async () => {
  const statusRef = doc(db, "status-terapis", currentUID);
  const statusSnap = await getDocs(query(collection(db, "status-terapis"), where("__name__", "==", currentUID)));
  let currentStatus = "tidak tersedia";
  statusSnap.forEach(docSnap => currentStatus = docSnap.data().status);

  const newStatus = currentStatus === "tersedia" ? "tidak tersedia" : "tersedia";
  await setDoc(statusRef, { status: newStatus });
  statusLabel.textContent = newStatus;
  statusBtn.textContent = newStatus === "tersedia" ? "Ubah ke Tidak Tersedia" : "Ubah ke Tersedia";
});

async function loadStatus() {
  const statusRef = doc(db, "status-terapis", currentUID);
  const snap = await getDocs(query(collection(db, "status-terapis"), where("__name__", "==", currentUID)));
  snap.forEach(docSnap => {
    const s = docSnap.data().status || "tidak tersedia";
    statusLabel.textContent = s;
    statusBtn.textContent = s === "tersedia" ? "Ubah ke Tidak Tersedia" : "Ubah ke Tersedia";
  });
}

// 🏠 Permintaan Offline
async function loadOfflineRequests() {
  const q = query(
    collection(db, "permintaan-offline"),
    where("terapisId", "==", currentUID),
    where("status", "==", "menunggu")
  );

  onSnapshot(q, snapshot => {
    const container = document.getElementById("offlineRequestsList");
    container.innerHTML = "";
    snapshot.forEach(docSnap => {
      const data = docSnap.data();
      container.innerHTML += `
        <div class="bg-white p-4 rounded shadow">
          <p><strong>Nama:</strong> ${data.namaPasien}</p>
          <p><strong>Alamat:</strong> ${data.alamat}</p>
          <p><strong>Jadwal:</strong> ${data.jadwal}</p>
          <div class="mt-2 flex gap-2">
            <button onclick="terimaPermintaan('${docSnap.id}')" class="bg-green-600 text-white px-3 py-1 rounded">Terima</button>
            <button onclick="tolakPermintaan('${docSnap.id}')" class="bg-red-600 text-white px-3 py-1 rounded">Tolak</button>
          </div>
        </div>
      `;
    });
  });
}

window.terimaPermintaan = async function (id) {
  await updateDoc(doc(db, "permintaan-offline", id), {
    status: "diterima"
  });
};

window.tolakPermintaan = async function (id) {
  await updateDoc(doc(db, "permintaan-offline", id), {
    status: "ditolak"
  });
};

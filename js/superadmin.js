// == SUPERADMIN LOGIC ==
const colTerapis = db.collection("terapis");
const colUsers = db.collection("users");
const colSessions = db.collection("sessions");
const colArtikel = db.collection("artikel");
const colLogs = db.collection("logs");

// === TAB ADMIN / TERAPIS ===
function loadTerapis() {
  const container = document.getElementById("tab-admin");
  const list = document.createElement("div");
  list.className = "mt-4 space-y-3";

  colTerapis.get().then(snapshot => {
    snapshot.forEach(doc => {
      const data = doc.data();
      const card = document.createElement("div");
      card.className = "p-3 bg-white shadow rounded-xl flex justify-between items-center";
      card.innerHTML = `
        <div>
          <div class="font-semibold">${data.nama}</div>
          <div class="text-sm text-gray-500">${data.email}</div>
        </div>
        <div class="flex gap-2">
          <button onclick="hapusTerapis('${doc.id}')" class="text-red-500 text-sm">Hapus</button>
        </div>
      `;
      list.appendChild(card);
    });
    container.appendChild(list);
  });
}

function hapusTerapis(id) {
  if (confirm("Yakin ingin menghapus terapis ini?")) {
    colTerapis.doc(id).delete().then(() => {
      alert("Terapis dihapus.");
      location.reload();
    });
  }
}

// === TAB PASIEN ===
function loadPasien() {
  const container = document.getElementById("tab-pasien");
  const list = document.createElement("div");
  list.className = "mt-4 space-y-3";

  colUsers.get().then(snapshot => {
    snapshot.forEach(doc => {
      const data = doc.data();
      const card = document.createElement("div");
      card.className = "p-3 bg-white shadow rounded-xl flex justify-between items-center";
      card.innerHTML = `
        <div>
          <div class="font-semibold">${data.nama || 'Pasien'}</div>
          <div class="text-sm text-gray-500">${data.email}</div>
        </div>
        <div><button onclick="hapusPasien('${doc.id}')" class="text-red-500 text-sm">Hapus</button></div>
      `;
      list.appendChild(card);
    });
    container.appendChild(list);
  });
}

function hapusPasien(id) {
  if (confirm("Yakin ingin menghapus akun pasien ini?")) {
    colUsers.doc(id).delete().then(() => {
      alert("Pasien dihapus.");
      location.reload();
    });
  }
}

// === TAB KONSULTASI ===
function loadKonsultasi() {
  const container = document.getElementById("tab-konsultasi");
  const list = document.createElement("div");
  list.className = "mt-4 space-y-3";

  colSessions.orderBy("dibuat", "desc").limit(50).get().then(snapshot => {
    snapshot.forEach(doc => {
      const data = doc.data();
      const waktu = data.dibuat?.toDate().toLocaleString("id-ID") || "-";
      const card = document.createElement("div");
      card.className = "p-3 bg-white shadow rounded-xl";
      card.innerHTML = `
        <div class="font-semibold">Sesi: ${doc.id}</div>
        <div class="text-sm">Pasien: ${data.namaPasien || '-'}</div>
        <div class="text-sm">Terapis: ${data.kepada}</div>
        <div class="text-sm">Waktu: ${waktu}</div>
        <div class="text-sm text-gray-500">Status: ${data.selesai ? '✅ Selesai' : '⏳ Aktif'}</div>
      `;
      list.appendChild(card);
    });
    container.appendChild(list);
  });
}

// === TAB ARTIKEL ===
function loadArtikel() {
  const container = document.getElementById("tab-artikel");
  const list = document.createElement("div");
  list.className = "mt-4 space-y-3";

  colArtikel.get().then(snapshot => {
    snapshot.forEach(doc => {
      const data = doc.data();
      const card = document.createElement("div");
      card.className = "p-3 bg-white shadow rounded-xl flex justify-between items-center";
      card.innerHTML = `
        <div>
          <div class="font-semibold">${data.judul}</div>
          <div class="text-sm text-gray-500">Oleh: ${data.penulis || '-'}</div>
        </div>
        <button onclick="hapusArtikel('${doc.id}')" class="text-red-500 text-sm">Hapus</button>
      `;
      list.appendChild(card);
    });
    container.appendChild(list);
  });
}

function hapusArtikel(id) {
  if (confirm("Yakin ingin menghapus artikel ini?")) {
    colArtikel.doc(id).delete().then(() => {
      alert("Artikel dihapus.");
      location.reload();
    });
  }
}

// === TAB LOG (Riwayat Sistem) ===
function loadLog() {
  const container = document.getElementById("tab-log");
  const list = document.createElement("ul");
  list.className = "text-xs mt-4 space-y-1 text-gray-600";

  colLogs.orderBy("waktu", "desc").limit(30).get().then(snapshot => {
    snapshot.forEach(doc => {
      const log = doc.data();
      const waktu = log.waktu?.toDate().toLocaleString("id-ID");
      const item = document.createElement("li");
      item.textContent = `[${waktu}] ${log.email || '-'}: ${log.aksi}`;
      list.appendChild(item);
    });
    container.appendChild(list);
  });
}

// === Init Semua Saat Login ===
auth.onAuthStateChanged(user => {
  if (user?.email === "fisiokita@gmail.com") {
    loadTerapis();
    loadPasien();
    loadKonsultasi();
    loadArtikel();
    loadLog();
  }
});

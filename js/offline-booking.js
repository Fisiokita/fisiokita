// Inisialisasi Firebase (jika belum ada, pastikan sudah include firebase-config.js)
const db = firebase.firestore();

// Load kabupaten/kota dari wilayah.json
fetch("data/wilayah.json")
  .then(res => res.json())
  .then(data => {
    const kabupatenSelect = document.getElementById("kabupaten");
    kabupatenSelect.innerHTML = '<option value="">-- Pilih Kabupaten/Kota --</option>';
    Object.keys(data).forEach(kab => {
      const opt = document.createElement("option");
      opt.value = kab;
      opt.textContent = kab;
      kabupatenSelect.appendChild(opt);
    });
  });

// Handle form submit
document.getElementById("booking-form").addEventListener("submit", async function (e) {
  e.preventDefault();

  const provinsi = "Sumatera Barat";
  const kabupaten = document.getElementById("kabupaten").value;
  const tanggal = document.getElementById("tanggal").value;
  const catatan = document.getElementById("catatan").value.trim();
  const statusText = document.getElementById("status");

  if (!kabupaten || !tanggal) {
    statusText.textContent = "Mohon lengkapi semua data.";
    statusText.classList.add("text-red-600");
    return;
  }

  try {
    await db.collection("offline_req").add({
      provinsi,
      kabupaten,
      tanggal,
      catatan,
      status: "pending",
      dibuat: firebase.firestore.Timestamp.now()
    });

    // Reset form dan tampilkan pesan sukses
    document.getElementById("booking-form").reset();
    statusText.textContent = "✅ Permintaan Anda berhasil dikirim.";
    statusText.classList.remove("text-red-600");
    statusText.classList.add("text-green-600");

  } catch (err) {
    console.error("Gagal menyimpan permintaan:", err);
    statusText.textContent = "❌ Terjadi kesalahan. Coba lagi.";
    statusText.classList.add("text-red-600");
  }
});

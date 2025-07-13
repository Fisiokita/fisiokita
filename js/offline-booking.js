document.addEventListener("DOMContentLoaded", () => {
  const provinsiSelect = document.getElementById("provinsi");
  const kabupatenSelect = document.getElementById("kabupaten");
  const form = document.getElementById("booking-form");
  const statusText = document.getElementById("status");

  // Default provinsi tetap Sumatera Barat
  const provinsiTetap = "Sumatera Barat";

  // Load wilayah.json
  fetch("data/wilayah.json")
    .then(response => response.json())
    .then(data => {
      // Tampilkan hanya Sumatera Barat
      const option = document.createElement("option");
      option.value = provinsiTetap;
      option.textContent = provinsiTetap;
      provinsiSelect.appendChild(option);
      provinsiSelect.value = provinsiTetap;

      // Isi kabupaten/kota
      kabupatenSelect.innerHTML = `<option value="">Pilih Kabupaten/Kota</option>`;
      const kabupatenList = Object.keys(data[provinsiTetap]);
      kabupatenList.forEach(kab => {
        const opt = document.createElement("option");
        opt.value = kab;
        opt.textContent = kab;
        kabupatenSelect.appendChild(opt);
      });
    })
    .catch(err => {
      console.error("Gagal memuat wilayah.json:", err);
      statusText.textContent = "❌ Gagal memuat data wilayah.";
    });

  // Submit form
  form.addEventListener("submit", e => {
    e.preventDefault();
    const provinsi = provinsiSelect.value;
    const kabupaten = kabupatenSelect.value;
    const tanggal = document.getElementById("tanggal").value;
    const catatan = document.getElementById("catatan").value;

    if (!kabupaten || !tanggal) {
      statusText.textContent = "❗ Lengkapi semua data sebelum mengirim.";
      return;
    }

    // Simpan ke Firestore
    firebase.firestore().collection("offline_req").add({
      provinsi,
      kabupaten,
      tanggal,
      catatan,
      status: "pending",
      dibuat: firebase.firestore.Timestamp.now()
    }).then(() => {
      statusText.textContent = "✅ Permintaan berhasil dikirim.";
      form.reset();
    }).catch(err => {
      console.error("Gagal menyimpan:", err);
      statusText.textContent = "❌ Gagal menyimpan permintaan.";
    });
  });
});

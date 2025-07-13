document.addEventListener("DOMContentLoaded", () => {
  const provinsiSelect = document.getElementById("provinsi");
  const kabupatenSelect = document.getElementById("kabupaten");
  const tanggalInput = document.getElementById("tanggal");
  const catatanInput = document.getElementById("catatan");
  const form = document.getElementById("booking-form");
  const statusText = document.getElementById("status");

  let wilayahData = {};

  // Ambil data wilayah
  fetch("../data/wilayah.json") // jika file ini di folder /admin/, gunakan "../data/..."
    .then(res => res.json())
    .then(data => {
      wilayahData = data;
      const provinsiList = Object.keys(data["Sumatera Barat"] ? { "Sumatera Barat": data["Sumatera Barat"] } : data);
      provinsiList.forEach(prov => {
        const opt = document.createElement("option");
        opt.value = prov;
        opt.textContent = prov;
        provinsiSelect.appendChild(opt);
      });
    })
    .catch(err => {
      console.error("Gagal memuat data wilayah:", err);
      statusText.textContent = "Gagal memuat daftar wilayah.";
    });

  // Saat provinsi dipilih
  provinsiSelect.addEventListener("change", () => {
    const provinsi = provinsiSelect.value;
    kabupatenSelect.innerHTML = '<option value="">-- Pilih Kabupaten/Kota --</option>';

    if (wilayahData[provinsi]) {
      const kabupatenList = Object.keys(wilayahData[provinsi]);
      kabupatenList.forEach(kab => {
        const opt = document.createElement("option");
        opt.value = kab;
        opt.textContent = kab;
        kabupatenSelect.appendChild(opt);
      });
    }
  });

  // Kirim permintaan booking
  form.addEventListener("submit", e => {
    e.preventDefault();

    const prov = provinsiSelect.value;
    const kab = kabupatenSelect.value;
    const tanggal = tanggalInput.value;
    const catatan = catatanInput.value;

    if (!prov || !kab || !tanggal) {
      statusText.textContent = "Harap lengkapi semua data!";
      return;
    }

    const db = firebase.firestore();
    const permintaan = {
      provinsi: prov,
      kabupaten: kab,
      tanggal,
      catatan,
      status: "pending",
      dibuat: firebase.firestore.Timestamp.now()
    };

    db.collection("offline_req").add(permintaan)
      .then(() => {
        statusText.textContent = "✅ Permintaan berhasil dikirim.";
        form.reset();
      })
      .catch(err => {
        console.error("Gagal mengirim permintaan:", err);
        statusText.textContent = "❌ Gagal mengirim permintaan.";
      });
  });
});

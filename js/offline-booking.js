document.addEventListener("DOMContentLoaded", () => {
  const provinsiSelect = document.getElementById("provinsi");
  const kabupatenSelect = document.getElementById("kabupaten");

  fetch("../data/wilayah.json") // sesuaikan jika di folder berbeda
    .then(response => response.json())
    .then(data => {
      const wilayah = data.provinsi;
      
      // Isi pilihan provinsi
      for (const prov in wilayah) {
        const option = document.createElement("option");
        option.value = prov;
        option.textContent = prov;
        provinsiSelect.appendChild(option);
      }

      // Saat provinsi dipilih
      provinsiSelect.addEventListener("change", () => {
        const kabupatenList = wilayah[provinsiSelect.value] || [];
        kabupatenSelect.innerHTML = `<option value="">Pilih Kabupaten/Kota</option>`;

        kabupatenList.forEach(kab => {
          const opt = document.createElement("option");
          opt.value = kab;
          opt.textContent = kab;
          kabupatenSelect.appendChild(opt);
        });
      });
    })
    .catch(err => {
      console.error("Gagal memuat wilayah.json:", err);
      alert("Data wilayah tidak tersedia.");
    });
});

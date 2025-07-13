const provinsiSelect = document.getElementById("provinsi");
const kabupatenSelect = document.getElementById("kabupaten");
const status = document.getElementById("status");

fetch("../data/wilayah.json") // jika HTML berada di /admin, gunakan ../data/
  .then(res => res.json())
  .then(data => {
    // Isi dropdown Provinsi
    const provinsiList = Object.keys(data);
    provinsiList.forEach(prov => {
      const option = document.createElement("option");
      option.value = prov;
      option.textContent = prov;
      provinsiSelect.appendChild(option);
    });

    // Event ketika provinsi dipilih
    provinsiSelect.addEventListener("change", () => {
      const selectedProv = provinsiSelect.value;
      kabupatenSelect.innerHTML = "<option value=''>Pilih Kabupaten/Kota</option>";

      if (data[selectedProv]) {
        const kabupatenList = Object.keys(data[selectedProv]);
        kabupatenList.forEach(kab => {
          const option = document.createElement("option");
          option.value = kab;
          option.textContent = kab;
          kabupatenSelect.appendChild(option);
        });
      }
    });
  })
  .catch(err => {
    console.error("Gagal memuat wilayah:", err);
    status.textContent = "❌ Gagal memuat data wilayah.";
  });

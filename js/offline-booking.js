fetch("data/wilayah.json")
  .then(res => res.json())
  .then(data => {
    const provinsiSelect = document.getElementById("provinsi");
    const kabupatenSelect = document.getElementById("kabupaten");

    // Isi provinsi
    Object.keys(data.provinsi).forEach(namaProvinsi => {
      const option = document.createElement("option");
      option.value = namaProvinsi;
      option.textContent = namaProvinsi;
      provinsiSelect.appendChild(option);
    });

    // Saat provinsi dipilih
    provinsiSelect.addEventListener("change", function () {
      const namaProv = this.value;
      kabupatenSelect.innerHTML = '<option value="">-- Pilih Kabupaten/Kota --</option>';

      if (data.provinsi[namaProv]) {
        data.provinsi[namaProv].forEach(kab => {
          const opt = document.createElement("option");
          opt.value = kab;
          opt.textContent = kab;
          kabupatenSelect.appendChild(opt);
        });
      }
    });
  })
  .catch(err => {
    console.error("Gagal memuat wilayah.json", err);
  });

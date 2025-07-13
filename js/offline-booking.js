fetch("data/wilayah.json")
  .then(res => res.json())
  .then(data => {
    const provinsiSelect = document.getElementById("provinsi");
    const kabupatenSelect = document.getElementById("kabupaten");

    // Isi provinsi
    for (let prov in data.provinsi) {
      const opt = document.createElement("option");
      opt.value = prov;
      opt.textContent = prov;
      provinsiSelect.appendChild(opt);
    }

    provinsiSelect.addEventListener("change", () => {
      const selectedProvinsi = provinsiSelect.value;
      const kabupatenList = data.provinsi[selectedProvinsi] || [];

      kabupatenSelect.innerHTML = '<option value="">Pilih Kabupaten/Kota</option>';
      kabupatenList.forEach(kab => {
        const opt = document.createElement("option");
        opt.value = kab;
        opt.textContent = kab;
        kabupatenSelect.appendChild(opt);
      });
    });
  });

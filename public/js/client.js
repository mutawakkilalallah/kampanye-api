const socket = io();

socket.on("updateData", (data) => {
  // Daftar Paslon
  const paslonList = document.getElementById("paslon-list");

  // Iterate over data and update only parts that need to change
  data.forEach((d, index) => {
    const paslonItem = paslonList.children[index]; // Find the corresponding list item

    // If paslonItem does not exist, create it
    if (!paslonItem) {
      const li = document.createElement("li");

      // Tambahkan elemen gambar
      const img = document.createElement("img");
      img.src = `https://bzwin-pilkada.id/assets/img/paslon/${d.paslon_foto}`;
      img.alt = `Foto Paslon ${d.paslon_nama}`;
      img.width = 150;

      // Tambahkan informasi paslon (nama, nomor urut)
      const nomorUrut = document.createElement("p");
      nomorUrut.innerHTML = `<strong>Nomor Urut: ${d.paslon_nourut}</strong>`;

      const namaPaslon = document.createElement("p");
      namaPaslon.innerHTML = `<strong>${d.paslon_nama}</strong>`;

      // Tambahkan elemen total suara (yang akan diupdate)
      const totalSuara = document.createElement("p");
      totalSuara.classList.add("total-suara"); // Add class for easy selection

      li.appendChild(img);
      li.appendChild(nomorUrut);
      li.appendChild(namaPaslon);
      li.appendChild(totalSuara);
      paslonList.appendChild(li);
    }

    // Update only the "Total Suara" section
    const totalSuaraElement = paslonItem.querySelector(".total-suara");
    totalSuaraElement.innerHTML = `
      Total Suara: <br />
      <b>${d.suara_paslon} (${d.persen_suara_paslon}%)</b>
    `;
  });

  // Tabel Rekapan (same as before)
  const tbody = document.querySelector("table tbody");
  tbody.innerHTML = ""; // Kosongkan tabel sebelum diperbarui

  const rows = [
    {
      kategori: "Tanggal",
      jumlah: new Intl.DateTimeFormat("en-GB", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
        timeZone: "Asia/Bangkok",
      }).format(new Date(data[0].tanggal)),
    },
    { kategori: "Suara Tidak Sah", jumlah: data[0].tidak_sah },
    {
      kategori: "Total Partisipasi",
      jumlah: `${data[0].total_suara_masuk} / ${data[0].total_dpt} <b>(${data[0].persen_suara_masuk}%)</b>`,
    },
    {
      kategori: "Total Suara Sah",
      jumlah: `${data[0].total_suara_sah} / ${data[0].total_dpt} <b>(${data[0].persen_total_suara_sah}%)</b>`,
    },
    {
      kategori: "Total TPS Input",
      jumlah: `${data[0].total_tps_input} / ${data[0].total_tps} <b>(${data[0].persen_tps_input}%)</b>`,
    },
  ];

  rows.forEach((row) => {
    const tr = document.createElement("tr");

    const tdKategori = document.createElement("td");
    tdKategori.textContent = row.kategori;

    const tdJumlah = document.createElement("td");
    tdJumlah.innerHTML = row.jumlah;

    tr.appendChild(tdKategori);
    tr.appendChild(tdJumlah);
    tbody.appendChild(tr);
  });
});

const socket = io();

// Inisialisasi chart
let paslonChart;

function initializeChart(data) {
  const ctx = document.getElementById("paslonChart").getContext("2d");

  const labels = data.map((d) => d.paslon_nama); // Nama Paslon sebagai label
  const percentages = data.map((d) => parseFloat(d.persen_suara_paslon)); // Persentase suara

  paslonChart = new Chart(ctx, {
    type: "bar", // Jenis chart (bisa 'bar', 'pie', 'doughnut', dll.)
    data: {
      labels: labels,
      datasets: [
        {
          label: "HASIL PEROLEHAN SUARA",
          data: percentages,
          backgroundColor: ["#b80254", "#02b820", "#0244b8"], // Warna paslon
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
      },
    },
  });
}

document.addEventListener("DOMContentLoaded", () => {
  if (initialData && initialData.length) {
    initializeChart(initialData);
  }
});

socket.on("updateData", (data) => {
  if (!paslonChart) {
    initializeChart(data);
  } else {
    // Update data pada chart
    paslonChart.data.labels = data.map((d) => d.paslon_nama); // Update label
    paslonChart.data.datasets[0].data = data.map((d) =>
      parseFloat(d.persen_suara_paslon)
    ); // Update data
    paslonChart.update(); // Render ulang chart
  }

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

  const container = document.querySelector(".results-container"); // Tambahkan div dengan class 'results-container' untuk menampung hasil
  const dataInfo = data[0]; // Data yang digunakan

  const versiElement = document.createElement("p");
  versiElement.className = "text-center";
  versiElement.innerHTML = `
  <b>
    Versi: ${new Intl.DateTimeFormat("en-GB", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      timeZone: "Asia/Bangkok",
    }).format(new Date(dataInfo.tanggal))} Progress: ${
    dataInfo.total_tps_input
  } dari ${dataInfo.total_tps} TPS (${dataInfo.persen_tps_input}%), ${
    dataInfo.total_suara_sah
  } dari ${dataInfo.total_dpt} DPT (${dataInfo.persen_total_suara_sah}%)
  </b>
`;

  const summaryElement = document.createElement("p");
  summaryElement.className = "text-center text-muted";
  summaryElement.innerHTML = `
  Suara Sah: ${dataInfo.total_suara_sah} Tidak Sah: ${dataInfo.tidak_sah} Partisipasi: ${dataInfo.total_suara_masuk} (${dataInfo.persen_suara_masuk}%)
`;

  // Append elements to the container
  container.appendChild(versiElement);
  container.appendChild(summaryElement);
});

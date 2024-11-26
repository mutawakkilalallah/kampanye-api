const socket = io();

// Inisialisasi chart
let paslonChart;

function initializeChart(data) {
  const ctx = document.getElementById("paslonChart").getContext("2d");

  const labels = data.map((d) => d.paslon_nama); // Nama Paslon sebagai label
  const percentages = data.map((d) => parseFloat(d.persen_suara_paslon)); // Persentase suara

  paslonChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "HASIL PEROLEHAN SUARA",
          data: percentages,
          backgroundColor: ["#b80254", "#02b820", "#0244b8"],
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
  // Update chart
  if (!paslonChart) {
    initializeChart(data);
  } else {
    paslonChart.data.labels = data.map((d) => d.paslon_nama);
    paslonChart.data.datasets[0].data = data.map((d) =>
      parseFloat(d.persen_suara_paslon)
    );
    paslonChart.update();
  }

  // Update daftar paslon
  const paslonList = document.querySelector(".paslon-list-item");

  // Iterate over data dan update hanya bagian total suara
  data.forEach((d) => {
    // Cari elemen paslon berdasarkan nomor urut
    const row = paslonList.querySelector(
      `[data-paslon-id="${d.paslon_nourut}"]`
    );

    // Jika elemen tidak ada, buat elemen baru
    if (!row) {
      const rowElement = document.createElement("div");
      rowElement.className = "row align-items-center mb-3";
      rowElement.setAttribute("data-paslon-id", d.paslon_nourut);

      const colImage = document.createElement("div");
      colImage.className = "col-md-3";

      const img = document.createElement("img");
      img.src = `https://bzwin-pilkada.id/assets/img/paslon/${d.paslon_foto}`;
      img.alt = `Foto Paslon ${d.paslon_nama}`;
      img.height = 96;
      img.width = 96;
      img.style.objectFit = "cover";

      colImage.appendChild(img);

      const colInfo = document.createElement("div");
      colInfo.className = "col-md-9";

      colInfo.innerHTML = `
      <p>Nomer Urut: <b>${d.paslon_nourut}</b></p>
      <p><b>${d.paslon_nama}</b></p>
      <p class="paslon-list-hasil-suara">
        Total Suara: <b>${d.suara_paslon} (${d.persen_suara_paslon}%)</b>
      </p>
    `;

      rowElement.appendChild(colImage);
      rowElement.appendChild(colInfo);
      paslonList.appendChild(rowElement);
    } else {
      // Jika elemen sudah ada, hanya update total suara
      const totalSuaraElement = row.querySelector(".paslon-list-hasil-suara");
      totalSuaraElement.innerHTML = `
      Total Suara: <b>${d.suara_paslon} (${d.persen_suara_paslon}%)</b>
    `;
    }
  });

  // Update versi dan summary
  const versiElement = document.querySelector(
    ".results-container > p:nth-child(3)"
  );
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
      }).format(new Date(data[0].tanggal))} Progress: ${
    data[0].total_tps_input
  } dari ${data[0].total_tps} TPS (${data[0].persen_tps_input}%), ${
    data[0].total_suara_sah
  } dari ${data[0].total_dpt} DPT (${data[0].persen_total_suara_sah}%)
    </b>
  `;

  const summaryElement = document.querySelector(
    ".results-container > p:nth-child(4)"
  );
  summaryElement.innerHTML = `
    Suara Sah: ${data[0].total_suara_sah} Tidak Sah: ${data[0].tidak_sah} Partisipasi: ${data[0].total_suara_masuk} (${data[0].persen_suara_masuk}%)
  `;
});

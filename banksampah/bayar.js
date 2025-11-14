const tombol = document.querySelector(".tombol");
const menu = document.querySelector(".menu");
tombol.addEventListener("click", () => {
  menu.classList.toggle("aktif");
});

const form = document.getElementById("paymentForm");
const tableBody = document.getElementById("tableBody");
let dataArray = [];
let editIndex = -1;

const hargaSampah = {
  "Sisa Makanan": 2000,
  "Daun Kering": 1500,
  "Sisa Sayuran": 2500,
  "Kulit Buah": 2000,
  "Ranting & Kayu": 1000,
};

// Menampilkan data dalam tabel
function addDataToTable(data, index) {
  const row = document.createElement("tr");
  row.innerHTML = `
        <td>${index + 1}</td>
        <td>${data.nama}</td>
        <td>${data.alamat}</td>
        <td>${data.jenisSampah}</td>
        <td>${data.berat} kg</td>
        <td>Rp ${data.totalHarga.toLocaleString("id-ID")}</td>
        <td>${data.tanggal}</td>
        <td>${data.noTelp}</td>
        <td>${data.foto ? `<img src="${data.foto}" alt="Foto Sampah" width="100" style="cursor:pointer;" onclick="showImage('${data.foto}')">` : "Tidak Ada Foto"}</td>
        <td>
            <button class="btn-edit" onclick="editData(${index})">Edit</button>
            <button class="btn-delete" onclick="deleteData(${index})">Hapus</button>
            <button class="btn-print" onclick="printStruk(${index})">Cetak Struk</button>
        </td>
    `;
  return row;
}

function showImage(src) {
  const newWindow = window.open();
  newWindow.document.write(`<body style="margin:0; background: #222;"><img src="${src}" style="display:block; margin: auto; max-width: 100%; max-height: 100vh;"></body>`);
}

function printStruk(index) {
  const data = dataArray[index];
  localStorage.setItem("strukData", JSON.stringify(data));
  window.open("struk.html", "_blank");
}

// Memperbarui tampilan tabel
function refreshTable() {
  tableBody.innerHTML = "";
  dataArray.forEach((data, index) => {
    tableBody.appendChild(addDataToTable(data, index));
  });
}

// Edit data
function editData(index) {
  const data = dataArray[index];
  document.getElementById("nama").value = data.nama;
  document.getElementById("alamat").value = data.alamat;
  document.getElementById("jenisSampah").value = data.jenisSampah;
  document.getElementById("berat").value = data.berat;
  document.getElementById("tanggal").value = data.tanggal;
  document.getElementById("noTelp").value = data.noTelp;
  editIndex = index;
  document.querySelector(".btn-submit").textContent = "Update Data";
}

// Hapus data
function deleteData(index) {
  if (confirm("Apakah Anda yakin ingin menghapus data ini?")) {
    dataArray.splice(index, 1);
    refreshTable();
  }
}

// Menyimpan data ke tabel jika disubmit
form.addEventListener("submit", function (e) {
  e.preventDefault();

  const fotoInput = document.getElementById("foto");
  const fotoFile = fotoInput.files[0];

  const formData = {
    nama: document.getElementById("nama").value,
    alamat: document.getElementById("alamat").value,
    jenisSampah: document.getElementById("jenisSampah").value,
    berat: parseFloat(document.getElementById("berat").value),
    tanggal: document.getElementById("tanggal").value,
    noTelp: document.getElementById("noTelp").value,
    foto: "",
  };

  const processData = (data) => {
    // Menghitung total harga
    const hargaPerKg = hargaSampah[data.jenisSampah] || 0;
    data.totalHarga = data.berat * hargaPerKg;

    // Menambah data baru atau memperbarui data yang ada
    if (editIndex === -1) {
      dataArray.push(data);
    } else {
      // Jika tidak ada file foto baru saat edit, pertahankan foto lama
      if (!data.foto && dataArray[editIndex].foto) {
        data.foto = dataArray[editIndex].foto;
      }
      dataArray[editIndex] = data;
      editIndex = -1;
      document.querySelector(".btn-submit").textContent = "Simpan Data";
    }

    refreshTable();
    form.reset();
  };

  if (fotoFile) {
    const reader = new FileReader();
    reader.onload = function (event) {
      formData.foto = event.target.result;
      processData(formData);
    };
    reader.readAsDataURL(fotoFile);
  } else {
    processData(formData);
  }
});

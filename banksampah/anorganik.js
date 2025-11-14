const tombol = document.querySelector(".tombol");
const menu = document.querySelector(".menu");
tombol.addEventListener("click", () => {
  menu.classList.toggle("aktif");
});

const form = document.getElementById("paymentForm"); // untuk memanggil id yang memiliki id "paymentForm"
const tableBody = document.getElementById("tableBody"); // untuk memanggil id yang memiliki id "tableBody"
let dataArray = [];
let editIndex = -1;

const hargaSampah = {
  Plastik: 2000,
  Kaca: 2000,
  Besi: 5000,
  "Ban Bekas": 2500,
  Elektronik: 500,
};

//menampilkan data dalam tabel
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
  localStorage.setItem("strukData", JSON.stringify(data)); //menyimpan dat ke localStorage
  window.open("struk.html", "_blank");
}

//memperbarui tampilan tabel dengan data baru yang ada dalam array dataArray
function refreshTable() {
  tableBody.innerHTML = "";
  dataArray.forEach((data, index) => {
    tableBody.appendChild(addDataToTable(data, index));
  });
}

//edit data
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

//delete data
function deleteData(index) {
  if (confirm("Apakah Anda yakin ingin menghapus data ini?")) {
    dataArray.splice(index, 1);
    refreshTable();
  }
}

//menyimpan data ke tabel jika disubmit
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
    //menghitung
    const hargaPerKg = hargaSampah[data.jenisSampah] || 0;
    data.totalHarga = data.berat * hargaPerKg;

    //menambah data baru atau memperbarui data yang ada dalam array
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

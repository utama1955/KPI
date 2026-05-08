const SHEETS_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbyO01urdBS1BKuF4DqVedXjvUY3l_AzNydJKLPcrk_-N0TabZUFQt5vsDWxN3dKniXc8Q/exec";

const criteria = [
  {
    id: "service_excellence",
    title: "Service Excellence",
    description: "Kemampuan dan keterampilan karyawan dalam memberikan pelayanan kepada nasabah sesuai dengan etika layanan yang berlaku di UTAMA GROUP.",
    weight: 20
  },
  {
    id: "sikap_disiplin",
    title: "Sikap dan Disiplin",
    description: "Sikap karyawan dalam melaksanakan pekerjaan yang meliputi rasa tanggung jawab, sikap terhadap peraturan, kebijakan perusahaan, dan perubahan.",
    weight: 20
  },
  {
    id: "absensi",
    title: "Absensi",
    description: "Sejauh mana karyawan tidak melaksanakan tugas karena mangkir, sakit, terlambat, izin, dan lain-lain.",
    weight: 20
  },
  {
    id: "penguasaan_pekerjaan",
    title: "Penguasaan Pekerjaan",
    description: "Kemampuan untuk menguasai bidang pekerjaan yang menjadi tanggung jawabnya secara mendalam.",
    weight: 10
  },
  {
    id: "komunikasi",
    title: "Komunikasi",
    description: "Dapat berkomunikasi dua arah secara efektif dengan atasan, rekan kerja, dan bawahannya.",
    weight: 10
  },
  {
    id: "kerjasama",
    title: "Kerjasama",
    description: "Kemampuan untuk membina kerja sama dalam kelompok dan berhubungan dengan atasan, rekan kerja, dan bawahan.",
    weight: 10
  },
  {
    id: "kemandirian",
    title: "Kemandirian",
    description: "Kemampuan karyawan untuk bekerja sendiri tanpa tergantung pada orang lain.",
    weight: 4
  },
  {
    id: "inisiatif",
    title: "Inisiatif",
    description: "Kemampuan karyawan untuk memulai pelaksanaan pekerjaan atas kemauan sendiri dan bawahan.",
    weight: 3
  },
  {
    id: "kreativitas",
    title: "Kreativitas",
    description: "Kemampuan karyawan untuk memecahkan persoalan dan mengembangkannya menjadi gagasan baru.",
    weight: 3
  }
];

const ratingScale = [
  { code: "BS", label: "Baik Sekali", value: 5 },
  { code: "B", label: "Baik", value: 4 },
  { code: "C", label: "Cukup", value: 3 },
  { code: "K", label: "Kurang", value: 2 },
  { code: "KS", label: "Kurang Sekali", value: 1 }
];

const criteriaList = document.getElementById("criteriaList");
const form = document.getElementById("kpiForm");
const totalScoreEl = document.getElementById("totalScore");
const gradeLabelEl = document.getElementById("gradeLabel");
const statusEl = document.getElementById("formStatus");
const submitButton = document.getElementById("submitButton");

function renderCriteria() {
  criteriaList.innerHTML = criteria.map((criterion, index) => {
    const options = ratingScale.map((option) => `
      <div class="rating-option">
        <input
          type="radio"
          id="${criterion.id}_${option.code}"
          name="${criterion.id}_rating"
          value="${option.value}"
          data-code="${option.code}"
          required
        >
        <label for="${criterion.id}_${option.code}">
          <span>${option.code}</span>
          <span>${option.label}</span>
        </label>
      </div>
    `).join("");

    return `
      <article class="criterion-card">
        <div class="criterion-header">
          <div>
            <div class="criterion-number">${index + 1}</div>
            <h4 class="criterion-title">${criterion.title}</h4>
            <p class="criterion-description">${criterion.description}</p>
          </div>
          <div class="criterion-weight">Bobot ${criterion.weight}%</div>
        </div>
        <div class="rating-group">${options}</div>
        <label>
          <span>Catatan Tambahan</span>
          <textarea name="${criterion.id}_note" rows="3" placeholder="Tambahkan catatan untuk indikator ini"></textarea>
        </label>
      </article>
    `;
  }).join("");
}

function calculateTotalScore() {
  let total = 0;

  criteria.forEach((criterion) => {
    const selected = form.querySelector(`input[name="${criterion.id}_rating"]:checked`);
    if (!selected) {
      return;
    }

    const numericValue = Number(selected.value);
    total += (numericValue / 5) * criterion.weight;
  });

  totalScoreEl.textContent = total.toFixed(2);
  gradeLabelEl.textContent = getGradeLabel(total);
}

function getGradeLabel(score) {
  if (score === 0) {
    return "Belum lengkap";
  }
  if (score >= 90) {
    return "Sangat Baik";
  }
  if (score >= 75) {
    return "Baik";
  }
  if (score >= 60) {
    return "Cukup";
  }
  if (score >= 40) {
    return "Kurang";
  }
  return "Kurang Sekali";
}

function buildPayload() {
  const formData = new FormData(form);
  const payload = {
    submittedAt: new Date().toISOString(),
    nama: formData.get("nama"),
    jabatan: formData.get("jabatan"),
    cabang: formData.get("cabang"),
    penilai: formData.get("penilai"),
    tanggal: formData.get("tanggal"),
    ttd: formData.get("ttd"),
    catatan_umum: formData.get("catatan_umum"),
    total_score: Number(totalScoreEl.textContent),
    grade_label: gradeLabelEl.textContent,
    criteria: criteria.map((criterion) => {
      const selected = form.querySelector(`input[name="${criterion.id}_rating"]:checked`);
      return {
        id: criterion.id,
        title: criterion.title,
        weight: criterion.weight,
        score_code: selected?.dataset.code ?? "",
        score_value: selected ? Number(selected.value) : null,
        weighted_score: selected ? Number((((Number(selected.value) / 5) * criterion.weight).toFixed(2))) : null,
        note: formData.get(`${criterion.id}_note`) || ""
      };
    })
  };

  return payload;
}

async function submitToGoogleSheets(payload) {
  if (!SHEETS_WEB_APP_URL || SHEETS_WEB_APP_URL.includes("PASTE_YOUR")) {
    throw new Error("URL Google Apps Script belum diisi di file script.js.");
  }

  const response = await fetch(SHEETS_WEB_APP_URL, {
    method: "POST",
    headers: {
      "Content-Type": "text/plain;charset=utf-8"
    },
    body: JSON.stringify(payload)
  });

  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok || (data && data.status !== "success")) {
    throw new Error(data?.message || "Gagal mengirim data ke Google Sheets.");
  }
}

function setStatus(message, type = "") {
  statusEl.textContent = message;
  statusEl.className = `form-status${type ? ` ${type}` : ""}`;
}

renderCriteria();
calculateTotalScore();
document.querySelector('input[name="tanggal"]').valueAsDate = new Date();

form.addEventListener("change", calculateTotalScore);

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  setStatus("Mengirim data...");
  submitButton.disabled = true;

  try {
    const payload = buildPayload();
    await submitToGoogleSheets(payload);
    setStatus("Data KPI berhasil dikirim ke Google Sheets.", "success");
    form.reset();
    document.querySelector('input[name="tanggal"]').valueAsDate = new Date();
    calculateTotalScore();
  } catch (error) {
    setStatus(error.message, "error");
  } finally {
    submitButton.disabled = false;
  }
});

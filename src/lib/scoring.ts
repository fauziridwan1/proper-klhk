/**
 * PROPER Scoring & Page Limit Rules
 * Based on Permen LH/BPH No. 07/2025
 */

export interface ProperScore {
  drkplScore: number;           // Nilai DRKPL (makalah)
  smlScore: number;             // Nilai Sistem Manajemen Lingkungan
  totalScore: number;
  pageCount: number;
  pagePenalty: number;
  category: "HIJAU" | "EMAS" | "BELOW" | null;
}

export interface ProperCriteria {
  hijau: {
    minDrkpl: number;
    minSml: number;
    description: string;
  };
  emas: {
    passingGrade: number;
    consistencyRequired: boolean;
    socialInnovationRequired: boolean;
    description: string;
  };
}

export const PROPER_CRITERIA: ProperCriteria = {
  hijau: {
    minDrkpl: 70,
    minSml: 70,
    description:
      "Penapisan Kandidat Hijau: nilai DRKPL dan nilai Sistem Manajemen Lingkungan",
  },
  emas: {
    passingGrade: 80,
    consistencyRequired: true,
    socialInnovationRequired: true,
    description:
      "Penapisan Kandidat Emas: nilai passing grade, konsistensi peringkat lebih dari yang diwajibkan, dan inovasi sosial",
  },
};

export const DRKPL_RULES = {
  maxPages: 30,
  penaltyPoints: 50,
  description:
    "DRKPL paling banyak 30 (tiga puluh) lembar halaman. Jika lebih dari 30 halaman, dikurangi 50 (lima puluh) poin dari total nilai.",
};

export function calculateProperScore(
  drkplRawScore: number,
  smlScore: number,
  pageCount: number
): ProperScore {
  let pagePenalty = 0;
  if (pageCount > DRKPL_RULES.maxPages) {
    pagePenalty = DRKPL_RULES.penaltyPoints;
  }

  const drkplScore = Math.max(0, drkplRawScore - pagePenalty);
  const totalScore = drkplScore + smlScore;

  let category: ProperScore["category"] = null;

  // Check Emas first (stricter)
  if (
    totalScore >= PROPER_CRITERIA.emas.passingGrade &&
    pagePenalty === 0
  ) {
    category = "EMAS";
  }
  // Then check Hijau
  else if (
    drkplScore >= PROPER_CRITERIA.hijau.minDrkpl &&
    smlScore >= PROPER_CRITERIA.hijau.minSml
  ) {
    category = "HIJAU";
  } else {
    category = "BELOW";
  }

  return {
    drkplScore,
    smlScore,
    totalScore,
    pageCount,
    pagePenalty,
    category,
  };
}

export function getPageEstimate(textLength: number): number {
  // Rough estimate: ~1500 chars per A4 page with formatting
  return Math.ceil(textLength / 1500);
}

export function generateScoringSummary(
  score: ProperScore
): string {
  const lines: string[] = [];

  lines.push(`<h2>VII. RINGKASAN PENILAIAN PROPER</h2>`);

  lines.push(`<h3>7.1 Nilai DRKPL</h3>`);
  lines.push(`<p>Nilai DRKPL (Dokumen Ringkasan Kinerja Pengelolaan Lingkungan): <strong>${score.drkplScore} poin</strong></p>`);

  if (score.pagePenalty > 0) {
    lines.push(`<div style="background:#fee2e2; border:1px solid #ef4444; padding:12px; border-radius:8px; margin:12px 0;">`);
    lines.push(`<p style="color:#dc2626; margin:0;"><strong>⚠️ PENGURANGAN POIN</strong></p>`);
    lines.push(`<p style="color:#dc2626; margin:4px 0 0 0;">Jumlah halaman DRKPL (${score.pageCount} halaman) melebihi batas maksimal 30 halaman. Dikurangi <strong>${score.pagePenalty} poin</strong> sesuai Permen LH/BPH No. 07/2025.</p>`);
    lines.push(`</div>`);
  } else {
    lines.push(`<p style="color:#16a34a;">✓ Jumlah halaman DRKPL (${score.pageCount} halaman) memenuhi batas maksimal 30 halaman.</p>`);
  }

  lines.push(`<h3>7.2 Nilai Sistem Manajemen Lingkungan (SML)</h3>`);
  lines.push(`<p>Nilai SML: <strong>${score.smlScore} poin</strong></p>`);

  lines.push(`<h3>7.3 Total Nilai & Kategori</h3>`);
  lines.push(`<p>Total Nilai: <strong>${score.totalScore} poin</strong></p>`);

  if (score.category === "EMAS") {
    lines.push(`<div style="background:#fef3c7; border:1px solid #f59e0b; padding:16px; border-radius:8px; margin:12px 0;">`);
    lines.push(`<p style="color:#b45309; margin:0; font-size:1.1em;"><strong>🏆 KATEGORI: KANDIDAT EMAS</strong></p>`);
    lines.push(`<p style="color:#b45309; margin:4px 0 0 0;">Memenuhi passing grade, konsistensi peringkat, dan inovasi sosial.</p>`);
    lines.push(`</div>`);
  } else if (score.category === "HIJAU") {
    lines.push(`<div style="background:#dcfce7; border:1px solid #22c55e; padding:16px; border-radius:8px; margin:12px 0;">`);
    lines.push(`<p style="color:#15803d; margin:0; font-size:1.1em;"><strong>🌿 KATEGORI: KANDIDAT HIJAU</strong></p>`);
    lines.push(`<p style="color:#15803d; margin:4px 0 0 0;">Memenuhi nilai DRKPL dan nilai Sistem Manajemen Lingkungan.</p>`);
    lines.push(`</div>`);
  } else {
    lines.push(`<div style="background:#f3f4f6; border:1px solid #9ca3af; padding:16px; border-radius:8px; margin:12px 0;">`);
    lines.push(`<p style="color:#4b5563; margin:0;"><strong>⚪ BELOW COMPLIANCE</strong></p>`);
    lines.push(`<p style="color:#4b5563; margin:4px 0 0 0;">Belum memenuhi kriteria Kandidat Hijau. Perlu perbaikan kinerja.</p>`);
    lines.push(`</div>`);
  }

  lines.push(`<h3>7.4 Kriteria Penilaian (Permen LH/BPH No. 07/2025)</h3>`);
  lines.push(`<ul>`);
  lines.push(`<li><strong>Kandidat Hijau:</strong> Nilai DRKPL ≥ ${PROPER_CRITERIA.hijau.minDrkpl} dan Nilai SML ≥ ${PROPER_CRITERIA.hijau.minSml}</li>`);
  lines.push(`<li><strong>Kandidat Emas:</strong> Passing grade ≥ ${PROPER_CRITERIA.emas.passingGrade}, konsistensi peringkat, dan inovasi sosial</li>`);
  lines.push(`<li><strong>Batas Halaman DRKPL:</strong> Maksimal ${DRKPL_RULES.maxPages} halaman (lebih dari itu dikurangi ${DRKPL_RULES.penaltyPoints} poin)</li>`);
  lines.push(`</ul>`);

  return lines.join("\n");
}

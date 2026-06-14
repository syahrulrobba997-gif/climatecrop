/**
 * ClimateCrop – Storage & Export Module
 * localStorage key: 'cc_history'
 */

const CC_KEY = 'cc_history';

function getHistory() {
  try { return JSON.parse(localStorage.getItem(CC_KEY)) || []; }
  catch { return []; }
}

function saveRecord(rec) {
  const history = getHistory();
  const entry = {
    id: 'r_' + Date.now(),
    date: new Date().toLocaleString('id-ID', { day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit' }),
    ...rec
  };
  history.unshift(entry);
  localStorage.setItem(CC_KEY, JSON.stringify(history));
  return entry;
}

function deleteRecord(id) {
  localStorage.setItem(CC_KEY, JSON.stringify(getHistory().filter(r => r.id !== id)));
}

function clearHistory() { localStorage.removeItem(CC_KEY); }

function filterHistory(query = '', cropFilter = '') {
  return getHistory().filter(r => {
    const q = query.trim().toLowerCase();
    const matchQ = !q || r.province.toLowerCase().includes(q) || r.commodity.toLowerCase().includes(q);
    const matchC = !cropFilter || r.commodity === cropFilter;
    return matchQ && matchC;
  });
}

/* ── CSV EXPORT ── */
function exportCSV() {
  const h = getHistory();
  if (!h.length) { alert('Riwayat kosong.'); return; }

  const headers = ['No', 'Tanggal', 'Provinsi', 'Luas Lahan (Ha)', 'Komoditas', 'Prediksi Hasil (Ton)', 'Skor (%)'];
  const rows = h.map((r, i) => [
    i + 1,
    `"${r.date}"`,
    `"${r.province}"`,
    r.area,
    `"${r.commodity}"`,
    r.yieldTotal,
    r.score
  ].join(','));

  const csv = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
  const a = document.createElement('a');
  a.href = encodeURI(csv);
  a.download = `climatecrop_${Date.now()}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

/* ── PDF EXPORT ── */
function exportPDF() {
  const h = getHistory();
  if (!h.length) { alert('Riwayat kosong.'); return; }
  if (!window.jspdf) { alert('Library PDF belum termuat. Periksa koneksi internet.'); return; }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

  /* Header bar */
  doc.setFillColor(6, 12, 8);
  doc.rect(0, 0, 297, 30, 'F');
  doc.setFillColor(46, 125, 50);
  doc.rect(0, 30, 297, 2, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('CLIMATECROP', 14, 13);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(148, 163, 184);
  doc.text('Laporan Rekomendasi Komoditas Pertanian Berbasis Iklim — Portal Layanan Publik Nasional', 14, 21);
  doc.text(`Dicetak: ${new Date().toLocaleString('id-ID')}`, 14, 27);

  /* Table */
  doc.autoTable({
    startY: 38,
    head: [['No', 'Tanggal', 'Provinsi', 'Luas (Ha)', 'Komoditas', 'Prediksi (Ton)', 'Skor (%)']],
    body: h.map((r, i) => [i + 1, r.date, r.province, r.area + ' Ha', r.commodity, r.yieldTotal + ' Ton', r.score + '%']),
    theme: 'grid',
    headStyles: { fillColor: [46, 125, 50], textColor: 255, fontSize: 9, fontStyle: 'bold', halign: 'center' },
    bodyStyles: { fontSize: 8.5 },
    alternateRowStyles: { fillColor: [245, 248, 245] },
    columnStyles: {
      0: { halign: 'center', cellWidth: 10 },
      3: { halign: 'right' },
      4: { fontStyle: 'bold' },
      5: { halign: 'right' },
      6: { halign: 'center', fontStyle: 'bold', textColor: [21, 101, 192] }
    }
  });

  /* Footer note */
  const fy = doc.lastAutoTable.finalY + 10;
  doc.setTextColor(113, 128, 150);
  doc.setFontSize(7.5);
  doc.text('Sumber: Buku Statistik Pertanian 2025 (BPS), BMKG. Data bersifat edukatif untuk mendukung program ketahanan pangan nasional.', 14, fy);

  doc.save(`climatecrop_report_${Date.now()}.pdf`);
}

window.StorageManager = { getHistory, saveRecord, deleteRecord, clearHistory, filterHistory, exportCSV, exportPDF };

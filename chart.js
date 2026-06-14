/**
 * ClimateCrop – Chart Module
 * Manages the Radar Chart via Chart.js
 */

let _radar = null;

function renderRadarChart(canvasId, scores) {
  if (typeof Chart === 'undefined') { console.error('Chart.js not loaded'); return; }

  const ctx = document.getElementById(canvasId);
  if (!ctx) return;

  if (_radar) { _radar.destroy(); _radar = null; }

  const s = scores || {};
  const cScore = s.climate || 0;
  const wScore = s.water || 0;
  const lScore = s.land || 0;
  const pScore = s.productivity || 0;

  _radar = new Chart(ctx, {
    type: 'radar',
    data: {
      labels: ['Iklim (40%)', 'Air (20%)', 'Lahan (20%)', 'Produktivitas (20%)'],
      datasets: [{
        label: 'Skor Kelayakan',
        data: [cScore, wScore, lScore, pScore],
        fill: true,
        backgroundColor: 'rgba(67,160,71,0.18)',
        borderColor: 'rgba(67,160,71,0.9)',
        pointBackgroundColor: '#fff',
        pointBorderColor: '#2E7D32',
        pointHoverBackgroundColor: '#2E7D32',
        pointHoverBorderColor: '#fff',
        pointRadius: 4,
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(4,8,5,0.95)',
          titleColor: '#fff',
          bodyColor: '#94A3B8',
          borderColor: 'rgba(67,160,71,0.4)',
          borderWidth: 1,
          callbacks: {
            label: ctx => ` ${ctx.label}: ${ctx.raw}%`
          }
        }
      },
      scales: {
        r: {
          min: 0,
          max: 100,
          ticks: {
            stepSize: 25,
            color: '#4B5563',
            backdropColor: 'transparent',
            font: { size: 8 }
          },
          grid: { color: 'rgba(255,255,255,0.07)' },
          angleLines: { color: 'rgba(255,255,255,0.07)' },
          pointLabels: {
            color: '#fff',
            font: { family: "'Plus Jakarta Sans',sans-serif", size: 10, weight: '700' }
          }
        }
      }
    }
  });
}

window.ChartManager = { renderRadarChart };

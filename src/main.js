import Chart from 'chart.js/auto';

window.Chart = Chart;

const RED = '#C8102E';
const RDARK = '#9B0C22';
const RLIGHT = 'rgba(200,16,46,0.15)';
const RGRID = 'rgba(200,16,46,0.25)';

const GR1 = '#5A5A66';
const GR2 = '#9393A0';
const GR3 = '#D2D2D6';
const GRF = 'rgba(90,90,102,0.1)';

const GREEN = '#4CAF50';
const AMBER = '#F59E0B';
const BLUE = '#2563EB';

const inited = {};

function showSec(id, btn) {
  document.querySelectorAll('.section').forEach((s) => s.classList.remove('active'));
  document.querySelectorAll('.db-tab').forEach((b) => b.classList.remove('active'));
  const sec = document.getElementById('sec-' + id);
  if (sec) sec.classList.add('active');
  if (btn) btn.classList.add('active');
  setTimeout(() => buildCharts(id), 60);
}

function applyFilter() {
  const s = document.getElementById('filterSuc')?.value;
  const d = {
    all: { v: '$84,200', s: '78%', r: '12%', re: '36 hrs', g: '–6%' },
    mpl: { v: '$28,400', s: '83%', r: '9%', re: '28 hrs', g: '–2%' },
    met: { v: '$23,100', s: '79%', r: '11%', re: '33 hrs', g: '–5%' },
    san: { v: '$18,600', s: '76%', r: '13%', re: '40 hrs', g: '–8%' },
    smg: { v: '$14,100', s: '72%', r: '17%', re: '44 hrs', g: '–12%' }
  };
  const v = d[s] || d.all;
  ['kv', 'ks', 'kr', 'kre', 'kg'].forEach(function (id, i) {
    const el = document.getElementById(id);
    if (el) el.textContent = [v.v, v.s, v.r, v.re, v.g][i];
  });
}

function opts(extra) {
  return Object.assign(
    {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: { grid: { color: 'rgba(180,180,180,0.12)' }, ticks: { color: GR1, font: { size: 11 } } },
        x: { grid: { display: false }, ticks: { color: GR1, font: { size: 11 } } }
      }
    },
    extra || {}
  );
}

function buildCharts(s) {
  if (inited[s]) return;
  inited[s] = true;

  if (s === 'general') {
    // Ventas
    new Chart(document.getElementById('cVentas'), {
      type: 'bar',
      data: {
        labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
        datasets: [
          { data: [92100, 89400, 87800, 86200, 84200, 81000], backgroundColor: RED, borderRadius: 5 },
          { label: 'Meta', data: [92000, 92000, 92000, 92000, 92000, 92000], type: 'line', borderColor: GR2, borderDash: [5, 3], pointRadius: 0, fill: false, borderWidth: 1.5 }
        ]
      },
      options: opts({
        scales: {
          y: { ticks: { callback: (v) => '$' + (v / 1000).toFixed(0) + 'K', color: GR1 }, grid: { color: 'rgba(180,180,180,0.12)' } },
          x: { grid: { display: false }, ticks: { color: GR1 } }
        }
      })
    });

    // Satisfacción por sucursal
    new Chart(document.getElementById('cSatSuc'), {
      type: 'bar',
      data: {
        labels: ['Multiplaza', 'Metrocentro', 'Santa Ana', 'San Miguel'],
        datasets: [
          { data: [83, 79, 76, 72], backgroundColor: [GREEN, AMBER, AMBER, RED], borderRadius: 5 },
          { label: 'Meta', data: [82, 82, 82, 82], type: 'line', borderColor: GR2, borderDash: [5, 3], pointRadius: 0, fill: false, borderWidth: 1.5 }
        ]
      },
      options: opts({ scales: { y: { min: 60, max: 100, ticks: { callback: (v) => v + '%', color: GR1 }, grid: { color: 'rgba(180,180,180,0.12)' } }, x: { grid: { display: false }, ticks: { color: GR1 } } } })
    });

    // Radar
    new Chart(document.getElementById('cRadar'), {
      type: 'radar',
      data: {
        labels: ['Ventas', 'Calidad', 'Digital', 'Inventario', 'Satisfacción', 'Rentabilidad'],
        datasets: [
          { data: [64, 58, 55, 62, 78, 71], backgroundColor: 'rgba(200,16,46,0.15)', borderColor: RED, pointBackgroundColor: RED, borderWidth: 2 },
          { data: [80, 80, 80, 80, 82, 80], backgroundColor: 'rgba(147,147,160,0.08)', borderColor: GR3, pointBackgroundColor: GR3, borderDash: [4, 3], borderWidth: 1.5 }
        ]
      },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { r: { min: 0, max: 100, ticks: { stepSize: 20, font: { size: 10 }, color: GR2 }, grid: { color: 'rgba(180,180,180,0.15)' }, pointLabels: { color: GR1, font: { size: 11 } } } } }
    });

    // Dona
    const dd = [38, 27, 21, 14];
    const dl = ['Sabor', 'Frescura', 'Presentación', 'Otros'];
    const dc = [RED, AMBER, BLUE, GR2];
    const ldonaEl = document.getElementById('ldona');
    if (ldonaEl) ldonaEl.innerHTML = dl.map((l, i) => `<span style="display:flex;align-items:center;gap:4px;"><span class="ld" style="background:${dc[i]}"></span>${l} ${dd[i]}%</span>`).join('');

    new Chart(document.getElementById('cDona'), {
      type: 'doughnut',
      data: { labels: dl, datasets: [{ data: dd, backgroundColor: dc, borderWidth: 3, borderColor: '#fff' }] },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, cutout: '60%' }
    });
  }

  if (s === 'calidad') {
    new Chart(document.getElementById('cReclProd'), {
      type: 'bar',
      data: { labels: ['Cheesecake', 'Tres leches', 'Frappes', 'Croissant', 'P. Chocolate', 'Otros'], datasets: [{ data: [82, 49, 37, 21, 16, 9], backgroundColor: [RED, RED, AMBER, AMBER, BLUE, GR2], borderRadius: 4 }] },
      options: opts({ indexAxis: 'y' })
    });

    new Chart(document.getElementById('cTendRec'), {
      type: 'line',
      data: { labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May'], datasets: [{ data: [7, 8, 9, 11, 12], borderColor: RED, backgroundColor: 'rgba(200,16,46,0.08)', fill: true, tension: 0.4, pointBackgroundColor: RED, pointRadius: 4, borderWidth: 2 }] },
      options: opts({ scales: { y: { ticks: { callback: (v) => v + '%', color: GR1 }, grid: { color: 'rgba(180,180,180,0.12)' } }, x: { grid: { display: false }, ticks: { color: GR1 } } } })
    });
  }

  if (s === 'comercial') {
    new Chart(document.getElementById('cVentaSuc'), {
      type: 'bar',
      data: { labels: ['Multiplaza', 'Metrocentro', 'Santa Ana', 'San Miguel'], datasets: [{ data: [28400, 23100, 18600, 14100], backgroundColor: [RED, GR1, GR2, GR3], borderRadius: 5 }] },
      options: opts({ scales: { y: { ticks: { callback: (v) => '$' + (v / 1000).toFixed(0) + 'K', color: GR1 }, grid: { color: 'rgba(180,180,180,0.12)' } }, x: { grid: { display: false }, ticks: { color: GR1 } } } })
    });

    new Chart(document.getElementById('cProdVend'), {
      type: 'bar',
      data: { labels: ['Café amer.', 'Croissant', 'P. Choco.', 'Tres leches', 'Frappe'], datasets: [{ data: [1420, 1180, 940, 820, 710], backgroundColor: [RED, RED, AMBER, AMBER, GR2], borderRadius: 5 }] },
      options: opts({ scales: { y: { grid: { color: 'rgba(180,180,180,0.12)' }, ticks: { color: GR1 } }, x: { grid: { display: false }, ticks: { color: GR1, font: { size: 11 } } } } })
    });

    new Chart(document.getElementById('cCompTrim'), {
      type: 'bar',
      data: { labels: ['Multiplaza', 'Metrocentro', 'Santa Ana', 'San Miguel'], datasets: [{ label: 'Q1', data: [31200, 25400, 20100, 16200], backgroundColor: RED, borderRadius: 3 }, { label: 'Q2', data: [28400, 23100, 18600, 14100], backgroundColor: GR3, borderRadius: 3 }] },
      options: opts({ scales: { y: { ticks: { callback: (v) => '$' + (v / 1000).toFixed(0) + 'K', color: GR1 }, grid: { color: 'rgba(180,180,180,0.12)' } }, x: { grid: { display: false }, ticks: { color: GR1 } } } })
    });
  }

  if (s === 'digital') {
    const pd = [54, 29, 17];
    const pl = ['Instagram', 'Facebook', 'TikTok'];
    const pc = [RED, GR1, AMBER];
    const lplatEl = document.getElementById('lplat');
    if (lplatEl) lplatEl.innerHTML = pl.map((l, i) => `<span style="display:flex;align-items:center;gap:4px;"><span class="ld" style="background:${pc[i]}"></span>${l} ${pd[i]}%</span>`).join('');

    new Chart(document.getElementById('cPlat'), { type: 'pie', data: { labels: pl, datasets: [{ data: pd, backgroundColor: pc, borderWidth: 3, borderColor: '#fff' }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } } });

    new Chart(document.getElementById('cSent'), { type: 'doughnut', data: { labels: ['Positivos', 'Negativos'], datasets: [{ data: [69, 31], backgroundColor: [GREEN, RED], borderWidth: 3, borderColor: '#fff' }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, cutout: '60%' } });

    new Chart(document.getElementById('cReputa'), {
      type: 'line',
      data: { labels: ['Dic', 'Ene', 'Feb', 'Mar', 'Abr', 'May'], datasets: [{ label: 'Instagram', data: [74, 72, 71, 70, 68, 67], borderColor: RED, tension: 0.4, pointRadius: 3, borderWidth: 2, fill: false }, { label: 'Facebook', data: [71, 70, 69, 68, 66, 65], borderColor: GR1, tension: 0.4, pointRadius: 3, borderWidth: 2, fill: false }, { label: 'TikTok', data: [68, 70, 72, 71, 70, 72], borderColor: AMBER, tension: 0.4, pointRadius: 3, borderWidth: 2, fill: false }] },
      options: opts({ scales: { y: { min: 55, max: 85, grid: { color: 'rgba(180,180,180,0.12)' }, ticks: { color: GR1 } }, x: { grid: { display: false }, ticks: { color: GR1 } } } })
    });
  }

  if (s === 'ops') {
    new Chart(document.getElementById('cInvVenta'), {
      type: 'bar',
      data: { labels: ['Cheesecake', 'Tres leches', 'Croissant', 'Café', 'Frappe'], datasets: [{ label: 'Inventario', data: [340, 280, 190, 520, 210], backgroundColor: RED, borderRadius: 3 }, { label: 'Ventas', data: [258, 214, 180, 500, 195], backgroundColor: GR3, borderRadius: 3 }] },
      options: opts({ scales: { y: { grid: { color: 'rgba(180,180,180,0.12)' }, ticks: { color: GR1 } }, x: { grid: { display: false }, ticks: { color: GR1, font: { size: 11 } } } } })
    });

    new Chart(document.getElementById('cRotSuc'), { type: 'bar', data: { labels: ['Multiplaza', 'Metrocentro', 'Santa Ana', 'San Miguel'], datasets: [{ data: [5.4, 4.8, 3.9, 2.9], backgroundColor: [GREEN, AMBER, AMBER, RED], borderRadius: 5 }] }, options: opts({ scales: { y: { max: 7, ticks: { callback: (v) => v + 'x', color: GR1 }, grid: { color: 'rgba(180,180,180,0.12)' } }, x: { grid: { display: false }, ticks: { color: GR1 } } } }) });
  }

  if (s === 'bi') {
    new Chart(document.getElementById('cBI'), {
      type: 'radar',
      data: { labels: ['Calidad', 'Satisfacción', 'Desperdicio', 'Ventas', 'Digital', 'Rentabilidad'], datasets: [{ label: 'Actual', data: [58, 78, 41, 64, 55, 71], backgroundColor: 'rgba(200,16,46,0.15)', borderColor: RED, pointBackgroundColor: RED, borderWidth: 2 }, { label: 'Con BI', data: [80, 88, 75, 82, 74, 85], backgroundColor: 'rgba(76,175,80,0.12)', borderColor: GREEN, pointBackgroundColor: GREEN, borderWidth: 2 }] },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { r: { min: 0, max: 100, ticks: { stepSize: 25, font: { size: 10 }, color: GR2 }, grid: { color: 'rgba(180,180,180,0.15)' }, pointLabels: { color: GR1, font: { size: 11 } } } } }
    });
  }
}

window.showSec = showSec;
window.applyFilter = applyFilter;

window.addEventListener('DOMContentLoaded', function () {
  try {
    const f = document.getElementById('filterSuc');
    if (f) f.addEventListener('change', applyFilter);
  } catch (e) {}
  buildCharts('general');
});

setTimeout(function () {
  if (!inited['general']) buildCharts('general');
}, 250);

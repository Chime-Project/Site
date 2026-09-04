
// Chart
new Chart(document.getElementById('weightLossChart'), {
  type: 'line',
  data: timelineConfig,
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        align: 'end',
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
          boxWidth: 8,
          boxHeight: 8,
          font: { size: 12 },
          color: '#527980',
          padding: 16,
        }
      },
      annotation: {
        annotations: {
          freeMonthBox: {
            type: 'box',
            xMin: 2,
            xMax: 3,
            backgroundColor: 'rgba(187,148,134, 0.09)',
            borderWidth: 0,
          },
          breakthroughLine: {
            type: 'line',
            xMin: 2,
            xMax: 2,
            borderColor: '#bb9486',
            borderWidth: 2,
            borderDash: [6, 4],
            label: {
              display: true,
              content: ['FREE MONTH', '(Peak Burn)'],
              position: 'start',
              backgroundColor: 'transparent',
              color: '#a16853',
              font: { size: 10, weight: 'bold' },
              yAdjust: 10,
            }
          },
          breakthroughBadge: {
            type: 'label',
            xValue: 2,
            yValue: 1,
            content: 'THE 3-MONTH BREAKTHROUGH',
            backgroundColor: '#975740',
            color: '#ffffff',
            borderRadius: 20,
            padding: { x: 12, y: 6 },
            font: { size: 9, weight: 'bold' },
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 25,
        ticks: {
          stepSize: 5,
          callback: v => v === 0 ? '' : v + '%',
          color: '#89a6ac',
          font: { size: 11 },
        },
        grid: { color: 'rgba(0,0,0,0.06)' },
        border: { display: false },
      },
      x: {
        grid: { display: false },
        ticks: {
          color: '#89a6ac',
          font: { size: 11 },
        },
        border: { display: false },
      }
    }
  }
});

// Slider
const slider = document.getElementById('weightSlider');

function updateSlider() {
  const w = parseInt(slider.value);
  const pct = ((w - 150) / 200) * 100;
  slider.style.setProperty('--fill', pct + '%');
  document.getElementById('currentWeight').textContent = w + ' lbs';
  const r = calculateResults(w);
  document.getElementById('month3Weight').textContent = r.month3 + ' lbs';
  document.getElementById('yearWeight').textContent = r.year1 + ' lbs';
}

slider.addEventListener('input', updateSlider);
updateSlider();

// Sources toggle
const toggle  = document.getElementById('sourcesToggle');
const content = document.getElementById('sourcesContent');
const icon    = document.getElementById('sourcesIcon');

toggle.addEventListener('click', () => {
  const open = toggle.getAttribute('aria-expanded') === 'true';
  toggle.setAttribute('aria-expanded', String(!open));
  icon.textContent = open ? '+' : '−';
  content.style.display = open ? 'none' : 'block';
});

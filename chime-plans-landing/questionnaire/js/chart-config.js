
const timelineConfig = {
  labels: ['Month 1', 'Month 2', 'Month 3', 'Month 4', 'Month 5', 'Month 6'],
  datasets: [
    {
      label: 'Tirzepatide',
      data: [3, 5.5, 9, 12.5, 14.5, 16.5],
      borderColor: '#bb9486',
      backgroundColor: 'transparent',
      tension: 0.35,
      pointBackgroundColor: '#bb9486',
      pointRadius: 5,
      pointHoverRadius: 7,
    },
    {
      label: 'Semaglutide',
      data: [2, 4, 6, 8, 9.5, 11],
      borderColor: '#b0b8b0',
      backgroundColor: 'transparent',
      tension: 0.35,
      pointBackgroundColor: '#b0b8b0',
      pointRadius: 5,
      pointHoverRadius: 7,
    }
  ]
};

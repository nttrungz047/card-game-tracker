import { Chart, registerables } from 'chart.js';
import { getTotals, data } from './state.js';

Chart.register(...registerables);

export let lineChartObj = null;
export let barChartObj = null;

export function renderDashboard() {
  const totals = getTotals();
  const sortedPlayers = [...data.players].sort((a, b) => totals[a] - totals[b]);
  const table = document.getElementById('totalsTable');

  if (!data.rounds.length) {
    table.innerHTML = '<p class="text-slate-400 text-center text-base py-4">Chưa có dữ liệu</p>';
  } else {
    table.innerHTML = `...`;
  }

  const labels = data.rounds.map((_, index) => 'Vòng ' + (index + 1));
  const colors = ['#fbbf24', '#34d399', '#60a5fa', '#f87171', '#a78bfa', '#fb923c', '#22d3ee', '#f472b6'];

  const lineDatasets = data.players.map((player, index) => {
    let cumulative = 0;
    return {
      label: player,
      data: data.rounds.map(round => cumulative += round[player] || 0),
      borderColor: colors[index % colors.length],
      backgroundColor: 'transparent',
      tension: 0.3
    };
  });

  if (lineChartObj) lineChartObj.destroy();
  lineChartObj = new Chart(document.getElementById('lineChart'), {
    type: 'line',
    data: { labels, datasets: lineDatasets },
    options: {
      plugins: {
        title: { display: true, text: 'Tổng lá lũy kế theo vòng', color: '#e2e8f0' },
        legend: { labels: { color: '#cbd5e1', boxWidth: 12, font: { size: 10 } } }
      },
      scales: { x: { ticks: { color: '#94a3b8' } }, y: { ticks: { color: '#94a3b8' }, beginAtZero: true } }
    }
  });

  if (barChartObj) barChartObj.destroy();
  barChartObj = new Chart(document.getElementById('barChart'), {
    type: 'bar',
    data: {
      labels: data.players,
      datasets: [{ label: 'Tổng lá', data: data.players.map(player => totals[player]), backgroundColor: data.players.map((_, index) => colors[index % colors.length]) }]
    },
    options: {
      plugins: { title: { display: true, text: 'Tổng lá hiện tại mỗi người', color: '#e2e8f0' }, legend: { display: false } },
      scales: { x: { ticks: { color: '#94a3b8' } }, y: { ticks: { color: '#94a3b8' }, beginAtZero: true } }
    }
  });
}

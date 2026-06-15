import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const STORAGE_KEY = 'cardGameData';
let data = { players: [], rounds: [] };
let lineChartObj = null;
let barChartObj = null;

function load() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) data = JSON.parse(raw);
  if (!data.players) data.players = [];
  if (!data.rounds) data.rounds = [];
}

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function toggleCollapse(id) {
  const section = document.getElementById(id);
  const panel = section.querySelector('.panel');
  const chevron = section.querySelector('.chevron');
  panel.classList.toggle('hidden');
  chevron.classList.toggle('-rotate-90');
}

function openRoundModal() {
  document.getElementById('roundModal').classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeRoundModal() {
  document.getElementById('roundModal').classList.add('hidden');
  document.body.style.overflow = 'auto';
}

function renderPlayerInputs() {
  const container = document.getElementById('playerInputs');
  container.innerHTML = '';
  const names = data.players.length ? data.players : [''];

  names.forEach((name, index) => {
    const row = document.createElement('div');
    row.className = 'flex gap-2';
    row.innerHTML = `
      <input type="text" value="${name}" placeholder="Tên người chơi ${index + 1}"
        class="flex-1 bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-base"
      />
      <button type="button" class="bg-slate-700 rounded-lg px-3 text-base">✕</button>
    `;

    const input = row.querySelector('input');
    const button = row.querySelector('button');

    input.addEventListener('input', () => { data.players[index] = input.value; });
    button.addEventListener('click', () => removePlayerInput(index));

    container.appendChild(row);
  });
}

function addPlayerInput() {
  data.players.push('');
  renderPlayerInputs();
}

function removePlayerInput(index) {
  data.players.splice(index, 1);
  renderPlayerInputs();
}

function startGame() {
  data.players = data.players.map(p => p.trim()).filter(p => p.length);
  if (data.players.length < 2) {
    alert('Cần ít nhất 2 người chơi');
    return;
  }

  save();
  renderPlayerInputs();
  renderRoundInputs();
  renderDashboard();
  renderHistory();

  const setupSection = document.getElementById('setupSection');
  const setupPanel = setupSection.querySelector('.panel');
  const setupChevron = setupSection.querySelector('.chevron');
  setupPanel.classList.add('hidden');
  setupChevron.classList.add('-rotate-90');
  
  openRoundModal();
}

function renderRoundInputs(editIndex = null) {
  const container = document.getElementById('roundInputs');
  container.innerHTML = '';
  document.getElementById('roundNum').textContent = '#' + (editIndex !== null ? editIndex + 1 : data.rounds.length + 1);
  const existing = editIndex !== null ? data.rounds[editIndex] : null;

  data.players.forEach(player => {
    const value = existing ? existing[player] : '';
    const row = document.createElement('div');
    row.className = 'flex items-center gap-2';
    row.innerHTML = `
      <span class="flex-1 text-base truncate">${player}</span>
      <input type="number" min="0" placeholder="Số lá" value="${value}"
        class="w-20 bg-slate-900 border border-slate-600 rounded-lg px-2 py-1.5 text-base text-center"
        data-player="${player}" />
    `;
    container.appendChild(row);
  });

  const submitBtn = document.getElementById('submitRoundButton');
  submitBtn.textContent = editIndex !== null ? 'Cập nhật vòng #' + (editIndex + 1) : 'Lưu vòng này';
  submitBtn.onclick = () => submitRound(editIndex);
}

function submitRound(editIndex = null) {
  const inputs = document.querySelectorAll('#roundInputs input');
  const roundData = {};
  let valid = true;

  inputs.forEach(input => {
    const value = input.value.trim();
    if (value === '' || Number(value) < 0 || Number.isNaN(Number(value))) {
      valid = false;
    }
    roundData[input.dataset.player] = Number(value);
  });

  if (!valid) {
    alert('Vui lòng nhập số lá hợp lệ (>=0) cho tất cả người chơi');
    return;
  }

  if (editIndex !== null) {
    data.rounds[editIndex] = roundData;
  } else {
    data.rounds.push(roundData);
  }

  save();
  renderRoundInputs();
  renderDashboard();
  renderHistory();
}

function getTotals() {
  const totals = {};
  data.players.forEach(player => { totals[player] = 0; });
  data.rounds.forEach(round => {
    data.players.forEach(player => { totals[player] += round[player] || 0; });
  });
  return totals;
}

function renderDashboard() {
  const totals = getTotals();
  const sortedPlayers = [...data.players].sort((a, b) => totals[a] - totals[b]);
  const table = document.getElementById('totalsTable');

  if (!data.rounds.length) {
    table.innerHTML = '<p class="text-slate-400 text-center text-base py-4">Chưa có dữ liệu</p>';
  } else {
    table.innerHTML = `
      <table class="w-full">
        <thead>
          <tr class="border-b-2 border-slate-700 bg-slate-800/50">
            <th class="text-left py-3 px-2 text-slate-300 font-semibold text-xs uppercase tracking-wider">Người chơi</th>
            <th class="text-right py-3 px-2 text-slate-300 font-semibold text-xs uppercase tracking-wider">Tổng lá</th>
            <th class="text-right py-3 px-2 text-slate-300 font-semibold text-xs uppercase tracking-wider">TB/vòng</th>
          </tr>
        </thead>
        <tbody>
          ${sortedPlayers.map((player, index) => `
            <tr class="border-b border-slate-700 hover:bg-slate-800/30 transition-colors">
              <td class="py-3 px-2 ${index === 0 ? 'text-amber-300 font-bold' : 'text-slate-100'}">${index === 0 ? '👑 ' : ''}${player}</td>
              <td class="text-right py-3 px-2 text-amber-400 font-semibold">${totals[player]}</td>
              <td class="text-right py-3 px-2 text-slate-400 text-base">${(totals[player] / data.rounds.length).toFixed(1)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
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
      scales: {
        x: { ticks: { color: '#94a3b8' } },
        y: { ticks: { color: '#94a3b8' }, beginAtZero: true }
      }
    }
  });

  if (barChartObj) barChartObj.destroy();
  barChartObj = new Chart(document.getElementById('barChart'), {
    type: 'bar',
    data: {
      labels: data.players,
      datasets: [{
        label: 'Tổng lá',
        data: data.players.map(player => totals[player]),
        backgroundColor: data.players.map((_, index) => colors[index % colors.length])
      }]
    },
    options: {
      plugins: {
        title: { display: true, text: 'Tổng lá hiện tại mỗi người', color: '#e2e8f0' },
        legend: { display: false }
      },
      scales: {
        x: { ticks: { color: '#94a3b8' } },
        y: { ticks: { color: '#94a3b8' }, beginAtZero: true }
      }
    }
  });
}

function renderHistory() {
  const historyList = document.getElementById('historyList');

  if (!data.rounds.length) {
    historyList.innerHTML = '<p class="text-slate-400 text-center text-base py-2">Chưa có vòng nào</p>';
    return;
  }

  historyList.innerHTML = data.rounds.map((round, index) => `
    <div class="bg-slate-800/60 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 rounded-lg p-3 flex justify-between items-start gap-3 text-base transition-all shadow-sm hover:shadow-md">
      <div class="flex-1 min-w-0">
        <span class="font-semibold text-amber-300">Vòng ${index + 1}</span>
        <div class="text-slate-300 text-xs mt-1 space-y-1">
          ${data.players.map(player => `<div class="flex justify-between"><span class="text-slate-400">${player}</span><span class="font-medium text-slate-200">${round[player]}</span></div>`).join('')}
        </div>
      </div>
      <div class="flex gap-2 flex-shrink-0">
        <button type="button" class="bg-blue-700 hover:bg-blue-600 active:bg-blue-800 rounded px-2.5 py-1 text-xs font-medium transition-colors" data-edit="${index}">Sửa</button>
        <button type="button" class="bg-red-700 hover:bg-red-600 active:bg-red-800 rounded px-2.5 py-1 text-xs font-medium transition-colors" data-delete="${index}">✕</button>
      </div>
    </div>
  `).join('');

  historyList.querySelectorAll('[data-edit]').forEach(button => {
    button.addEventListener('click', () => editRound(Number(button.dataset.edit)));
  });

  historyList.querySelectorAll('[data-delete]').forEach(button => {
    button.addEventListener('click', () => deleteRound(Number(button.dataset.delete)));
  });
}

function editRound(index) {
  renderRoundInputs(index);
  openRoundModal();
}

function deleteRound(index) {
  const confirmed = confirm('Xóa vòng #' + (index + 1) + '?');
  if (!confirmed) return;

  data.rounds.splice(index, 1);
  save();
  renderRoundInputs();
  renderDashboard();
  renderHistory();
}

function resetAll() {
  const confirmed = confirm('Xóa toàn bộ dữ liệu (người chơi & các vòng)?');
  if (!confirmed) return;
  data = { players: [], rounds: [] };
  save();
  renderPlayerInputs();
  document.getElementById('setupSection').classList.remove('collapsed');
  document.getElementById('roundSection').classList.add('collapsed');
  document.getElementById('roundInputs').innerHTML = '';
  document.getElementById('roundNum').textContent = '';
  renderDashboard();
  renderHistory();
}

function init() {
  document.getElementById('addPlayerButton').addEventListener('click', addPlayerInput);
  document.getElementById('startGameButton').addEventListener('click', startGame);
  document.getElementById('resetButton').addEventListener('click', resetAll);
  document.getElementById('addRoundButton').addEventListener('click', () => openRoundModal());
  document.getElementById('closeRoundModal').addEventListener('click', closeRoundModal);
  
  // Close modal on overlay click
  document.getElementById('roundModal').addEventListener('click', (e) => {
    if (e.target.id === 'roundModal') closeRoundModal();
  });
  
  // Close modal on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !document.getElementById('roundModal').classList.contains('hidden')) {
      closeRoundModal();
    }
  });

  window.toggleCollapse = toggleCollapse;

  load();
  renderPlayerInputs();

  const setupSection = document.getElementById('setupSection');
  const setupPanel = setupSection.querySelector('.panel');
  const setupChevron = setupSection.querySelector('.chevron');

  if (data.players.length) {
    renderRoundInputs();
    setupPanel.classList.add('hidden');
    setupChevron.classList.add('-rotate-90');
  }

  renderDashboard();
  renderHistory();
}

init();

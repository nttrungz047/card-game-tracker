import { data, save } from '../state.js';
import { renderDashboard } from '../charts.js';
import { renderHistory } from './history.js';
import { openRoundModal } from './modal.js';

export function renderRoundInputs(editIndex = null) {
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

export function submitRound(editIndex = null) {
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

export function editRound(index) {
  renderRoundInputs(index);
  openRoundModal();
}

export function deleteRound(index) {
  const confirmed = confirm('Xóa vòng #' + (index + 1) + '?');
  if (!confirmed) return;

  data.rounds.splice(index, 1);
  save();
  renderRoundInputs();
  renderDashboard();
  renderHistory();
}

import { data, save } from '../state.js';
import { renderRoundInputs } from './rounds.js';
import { renderDashboard } from '../charts.js';
import { renderHistory } from './history.js';

export function renderPlayerInputs() {
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

export function addPlayerInput() {
  data.players.push('');
  renderPlayerInputs();
}

export function removePlayerInput(index) {
  data.players.splice(index, 1);
  renderPlayerInputs();
}

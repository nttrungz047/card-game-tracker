import { data } from '../state.js';

export function renderHistory() {
  const historyList = document.getElementById('historyList');

  if (!data.rounds.length) {
    historyList.innerHTML = '<p class="text-slate-400 text-center text-base py-2">Chưa có vòng nào</p>';
    return;
  }

  historyList.innerHTML = data.rounds.map((round, index) => `
    <div class="bg-slate-800/60 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 rounded-lg p-3 flex justify-between items-center gap-3 text-base transition-all shadow-sm hover:shadow-md w-full">
      <div class="flex-1 min-w-0 pr-3">
        <div class="flex items-center justify-between gap-2">
          <span class="font-semibold text-amber-300">Vòng ${index + 1}</span>
          <div class="flex items-center gap-2">
            <button type="button" class="px-3 py-2 bg-blue-700 hover:bg-blue-600 active:bg-blue-800 rounded-lg text-sm font-semibold transition-colors" data-edit="${index}" title="Sửa vòng ${index + 1}" aria-label="Sửa vòng ${index + 1}">Sửa</button>
            <button type="button" class="px-3 py-2 bg-red-700 hover:bg-red-600 active:bg-red-800 rounded-lg text-sm font-semibold transition-colors" data-delete="${index}" title="Xóa vòng ${index + 1}" aria-label="Xóa vòng ${index + 1}">Xóa</button>
          </div>
        </div>
        <div class="text-slate-300 text-xs mt-3 space-y-1">
          ${data.players.map(player => `<div class="flex justify-between"><span class="text-slate-400">${player}</span><span class="font-medium text-slate-200">${round[player]}</span></div>`).join('')}
        </div>
      </div>
    </div>
  `).join('');

  historyList.querySelectorAll('[data-edit]').forEach(button => {
    button.addEventListener('click', () => {
      window.dispatchEvent(new CustomEvent('editRound', { detail: Number(button.dataset.edit) }));
    });
  });

  historyList.querySelectorAll('[data-delete]').forEach(button => {
    button.addEventListener('click', () => {
      window.dispatchEvent(new CustomEvent('deleteRound', { detail: Number(button.dataset.delete) }));
    });
  });
}

import { load, save, data, resetAll } from './state.js';
import { renderPlayerInputs, addPlayerInput } from './ui/players.js';
import { renderRoundInputs, editRound, deleteRound } from './ui/rounds.js';
import { renderHistory } from './ui/history.js';
import { renderDashboard } from './charts.js';
import { openRoundModal, closeRoundModal, toggleCollapse } from './ui/modal.js';

export function init() {
  document.getElementById('addPlayerButton').addEventListener('click', addPlayerInput);

  document.getElementById('startGameButton').addEventListener('click', () => {
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
  });

  document.getElementById('resetButton').addEventListener('click', () => {
    const confirmed = confirm('Xóa toàn bộ dữ liệu (người chơi & các vòng)?');
    if (!confirmed) return;
    resetAll();
    renderPlayerInputs();
    document.getElementById('setupSection').classList.remove('collapsed');
    document.getElementById('roundSection')?.classList.add('collapsed');
    document.getElementById('roundInputs').innerHTML = '';
    document.getElementById('roundNum').textContent = '';
    renderDashboard();
    renderHistory();
  });

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

  // Expose toggleCollapse for inline onclick handlers
  window.toggleCollapse = toggleCollapse;

  // Wire history button events (dispatched from ui/history.js)
  window.addEventListener('editRound', (e) => editRound(e.detail));
  window.addEventListener('deleteRound', (e) => deleteRound(e.detail));

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

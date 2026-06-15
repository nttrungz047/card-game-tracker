export let data = { players: [], rounds: [] };
const STORAGE_KEY = 'cardGameData';

export function load() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) data = JSON.parse(raw);
  if (!data.players) data.players = [];
  if (!data.rounds) data.rounds = [];
}

export function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function resetAll() {
  data = { players: [], rounds: [] };
  save();
}

export function getTotals() {
  const totals = {};
  data.players.forEach(player => { totals[player] = 0; });
  data.rounds.forEach(round => {
    data.players.forEach(player => { totals[player] += round[player] || 0; });
  });
  return totals;
}

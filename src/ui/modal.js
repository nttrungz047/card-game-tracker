export function toggleCollapse(id) {
  const section = document.getElementById(id);
  const panel = section.querySelector('.panel');
  const chevron = section.querySelector('.chevron');
  panel.classList.toggle('hidden');
  chevron.classList.toggle('-rotate-90');
}

export function openRoundModal() {
  document.getElementById('roundModal').classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

export function closeRoundModal() {
  document.getElementById('roundModal').classList.add('hidden');
  document.body.style.overflow = 'auto';
}

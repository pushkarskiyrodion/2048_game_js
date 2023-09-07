const helpButton = document.querySelector('.help');
const helpText = document.querySelector('.help-text');

helpButton.addEventListener('click', () => {
  helpText.classList.toggle('hidden');
});

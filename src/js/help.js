const helpButton = document.querySelector('.help');
const helpText = document.querySelector('.help-text');

function animationEndEventHandler() {
  if (helpText.classList.contains('help--fade-out')) {
    helpText.classList.add('hidden');
  }
}

helpButton.addEventListener('click', () => {
  if (helpText.classList.contains('hidden')) {
    helpText.classList.remove('hidden');
    helpText.classList.remove('help--fade-out');
    helpText.classList.add('help--appear');
    return;
  }

  helpText.classList.remove('help--appear');
  helpText.classList.add('help--fade-out');
});

helpText.addEventListener('animationend', animationEndEventHandler);
import { DIRECTION } from './constants';

export const getLocalStorage = (key) => {
  return key ? JSON.parse(localStorage.getItem(key)) : null;
};

export const setLocalStorage = (key, value) => {
  if (key && value) {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

export const handleSwipe = (moveCb = () => {}) => {
  let touchStartX = 0;
  let touchStartY = 0;

  const handleTouchStart = (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  };
  
  const handleTouchMove = (e) => {
    if (!touchStartX || !touchStartY) {
      return;
    }
  
    const touchEndX = e.touches[0].clientX;
    const touchEndY = e.touches[0].clientY;
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;
  
    Math.abs(deltaX) > Math.abs(deltaY)
      ? deltaX > 0
        ? moveCb(DIRECTION.RIGHT)
        : moveCb(DIRECTION.LEFT)
      : deltaY > 0
        ? moveCb(DIRECTION.UP)
        : moveCb(DIRECTION.DOWN);
  
    touchStartX = 0;
    touchStartY = 0;
  };

  document.addEventListener('touchstart', handleTouchStart, false);
  document.addEventListener('touchmove', handleTouchMove, false);
}

export const handlePlay = (moveCb = () => {}) => {
  document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowDown') {
      moveCb(DIRECTION.DOWN);
    } else if (e.key === 'ArrowUp') {
      moveCb(DIRECTION.UP);
    } else if (e.key === 'ArrowRight') {
      moveCb(DIRECTION.RIGHT);
    } else if (e.key === 'ArrowLeft') {
      moveCb(DIRECTION.LEFT);
    }
  });
}
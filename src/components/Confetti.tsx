import React, { useEffect } from 'react';

const Confetti: React.FC = () => {
  useEffect(() => {
    const createConfetti = () => {
      const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dda0dd', '#98d8c8'];
      const confettiCount = 150;
      for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti-piece';
        confetti.style.cssText = `
          position: fixed;
          width: ${Math.random() * 10 + 5}px;
          height: ${Math.random() * 10 + 5}px;
          background: ${colors[Math.floor(Math.random() * colors.length)]};
          left: ${Math.random() * 100}vw;
          top: -10px;
          border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
          opacity: ${Math.random() * 0.8 + 0.2};
          transform: rotate(${Math.random() * 360}deg);
          animation: confetti-fall ${Math.random() * 3 + 2}s linear forwards;
          z-index: 9999;
          pointer-events: none;
        `;
        document.body.appendChild(confetti);
        setTimeout(() => {
          if (confetti.parentNode) {
            confetti.parentNode.removeChild(confetti);
          }
        }, 5000);
      }
    };
    if (!document.querySelector('#confetti-styles')) {
      const style = document.createElement('style');
      style.id = 'confetti-styles';
      style.textContent = `
        @keyframes confetti-fall {
          from {
            transform: translateY(-100vh) rotate(0deg);
          }
          to {
            transform: translateY(100vh) rotate(720deg);
          }
        }
      `;
      document.head.appendChild(style);
    }
    const timer = setTimeout(createConfetti, 1000);
    return () => {
      clearTimeout(timer);
      const confettiPieces = document.querySelectorAll('.confetti-piece');
      confettiPieces.forEach(piece => {
        if (piece.parentNode) {
          piece.parentNode.removeChild(piece);
        }
      });
    };
  }, []);
  return null;
};

export default Confetti; 
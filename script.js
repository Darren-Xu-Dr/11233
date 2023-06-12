const cards = document.querySelectorAll('.memory-card');
const timerElement = document.getElementById('timer');
const messageElement = document.getElementById('message');
const resetButton = document.getElementById('reset-button');

let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let timerInterval;
let seconds = 0;

function flipCard() {
  if (lockBoard || this === firstCard) return;

  this.classList.add('flip');

  if (!hasFlippedCard) {
    hasFlippedCard = true;
    firstCard = this;
    startTimer();
  } else {
    secondCard = this;
    lockBoard = true; // Lock the board while checking for a match
    checkForMatch();
  }
}

function checkForMatch() {
  let isMatch = firstCard.dataset.framework === secondCard.dataset.framework;
  isMatch ? disableCards() : unflipCards();
}

function disableCards() {
  firstCard.removeEventListener('click', flipCard);
  secondCard.removeEventListener('click', flipCard);

  resetBoard();
  checkWin();
}

function unflipCards() {
  setTimeout(() => {
    firstCard.classList.remove('flip');
    secondCard.classList.remove('flip');
    resetBoard();
  }, 1500);
}

function resetBoard() {
  [hasFlippedCard, lockBoard] = [false, false];
  [firstCard, secondCard] = [null, null];
}

function startTimer() {
  if (!timerInterval) {
    timerInterval = setInterval(() => {
      seconds++;
      timerElement.textContent = formatTime(seconds);

      if (seconds >= 60) {
        stopTimer();
        showMessage("You failed! Try again.");
        resetButton.style.display = 'block';
      }
    }, 1000);
  }
}

function stopTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
}

function checkWin() {
  const matchedCards = document.querySelectorAll('.memory-card.flip');
  if (matchedCards.length === cards.length) {
    stopTimer();
    showMessage("Congratulations! You won!");
    resetButton.style.display = 'block';
  }
}

function formatTime(seconds) {
  const remainingSeconds = 60 - seconds;
  return padZero(remainingSeconds);
}

function padZero(value) {
  return value < 10 ? `0${value}` : value;
}

function showMessage(text) {
  messageElement.textContent = text;
  messageElement.style.display = 'block';
}

function resetGame() {
  stopTimer();
  resetButton.style.display = 'none';
  messageElement.style.display = 'none';
  seconds = 0;
  timerElement.textContent = formatTime(seconds);
  cards.forEach(card => {
    card.classList.remove('flip');
    card.addEventListener('click', flipCard);
  });
  shuffleCards();
}

function shuffleCards() {
  cards.forEach(card => {
    let randomPos = Math.floor(Math.random() * 12);
    card.style.order = randomPos;
  });
}

(function initializeGame() {
  resetButton.addEventListener('click', resetGame);
  shuffleCards();
})();

cards.forEach(card => card.addEventListener('click', flipCard));
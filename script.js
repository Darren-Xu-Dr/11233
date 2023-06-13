const cards = $('.memory-card');
const timerElement = $('#timer');
const messageElement = $('#message');
const resetButton = $('#reset-button');
const progressBar = $('#progress-bar-fill');

let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let timerInterval;
let seconds = 0;

function flipCard() {
  if (lockBoard || $(this).hasClass('flip')) return;

  $(this).addClass('flip');

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
  let isMatch = $(firstCard).data('framework') === $(secondCard).data('framework');
  isMatch ? disableCards() : unflipCards();
}

function disableCards() {
  $(firstCard).off('click', flipCard);
  $(secondCard).off('click', flipCard);

  resetBoard();
  updateProgress();
  checkWin();
}

function unflipCards() {
  setTimeout(() => {
    $(firstCard).removeClass('flip');
    $(secondCard).removeClass('flip');
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
      timerElement.text(formatTime(seconds));

      if (seconds >= 60) {
        stopTimer();
        showMessage("You failed! Try again.");
        cards.each(function(){
          $(this).off('click',flipCard)
        })
        resetButton.css('display', 'block');
      }
    }, 1000);
  }
}

function stopTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
}

function checkWin() {
  const matchedCards = $('.memory-card.flip');
  if (matchedCards.length === cards.length) {
    stopTimer();
    showMessage("Congratulations! You won!");
    resetButton.css('display', 'block');
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
  messageElement.text(text);
  messageElement.css('display', 'block');
}

function resetGame() {
  stopTimer();
  //resetButton.css('display', 'none');
  messageElement.css('display', 'none');
  seconds = 0;
  timerElement.text(formatTime(seconds));
  cards.each(function() {
    $(this).removeClass('flip');
    //$(this).on('click', flipCard);
  });
  shuffleCards();
  updateProgress();
}

function shuffleCards() {
  cards.each(function() {
    let randomPos = Math.floor(Math.random() * 12);
    $(this).css('order', randomPos);
  });
}

function updateProgress() {
  const matchedCards = $('.memory-card.flip');
  const progressPercentage = (matchedCards.length / cards.length) * 100;
  progressBar.css('width', progressPercentage + '%');
}

(function initializeGame() {
  resetButton.on('click', resetGame);
  shuffleCards();
})();

cards.on('click', flipCard);

const cardData = [
  { emoji: '🚀', color: 'pink' },
  { emoji: '🎮', color: 'blue' },
  { emoji: '💎', color: 'purple' },
  { emoji: '⚡', color: 'green' },
  { emoji: '🔥', color: 'orange' },
  { emoji: '🌟', color: 'yellow' },
  { emoji: '🎯', color: 'cyan' },
  { emoji: '👾', color: 'red' }
];

let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let moves = 0;
let gameStarted = false;
let timerInterval = null;
let seconds = 0;
let canFlip = true;

const gameBoard = document.getElementById('gameBoard');
const movesDisplay = document.getElementById('moves');
const timerDisplay = document.getElementById('timer');
const pairsDisplay = document.getElementById('pairs');
const restartBtn = document.getElementById('restartBtn');
const winModal = document.getElementById('winModal');
const playAgainBtn = document.getElementById('playAgainBtn');
const finalMoves = document.getElementById('finalMoves');
const finalTime = document.getElementById('finalTime');

function shuffle(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function createCard(cardInfo, index) {
  const card = document.createElement('div');
  card.className = 'card';
  card.dataset.index = index;
  card.dataset.emoji = cardInfo.emoji;
  
  card.innerHTML = `
    <div class="card-face card-front"></div>
    <div class="card-face card-back ${cardInfo.color}">${cardInfo.emoji}</div>
  `;
  
  card.addEventListener('click', () => flipCard(card));
  return card;
}

function flipCard(card) {
  if (!canFlip) return;
  if (card.classList.contains('flipped')) return;
  if (card.classList.contains('matched')) return;
  if (flippedCards.length >= 2) return;
  
  if (!gameStarted) {
    startTimer();
    gameStarted = true;
  }
  
  card.classList.add('flipped');
  flippedCards.push(card);
  
  if (flippedCards.length === 2) {
    moves++;
    movesDisplay.textContent = moves;
    checkMatch();
  }
}

function checkMatch() {
  const [card1, card2] = flippedCards;
  const isMatch = card1.dataset.emoji === card2.dataset.emoji;
  
  canFlip = false;
  
  if (isMatch) {
    setTimeout(() => {
      card1.classList.add('matched');
      card2.classList.add('matched');
      matchedPairs++;
      pairsDisplay.textContent = `${matchedPairs}/8`;
      flippedCards = [];
      canFlip = true;
      
      if (matchedPairs === 8) {
        endGame();
      }
    }, 300);
  } else {
    setTimeout(() => {
      card1.classList.remove('flipped');
      card2.classList.remove('flipped');
      flippedCards = [];
      canFlip = true;
    }, 1000);
  }
}

function startTimer() {
  timerInterval = setInterval(() => {
    seconds++;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    timerDisplay.textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
}

function formatTime(totalSeconds) {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function endGame() {
  stopTimer();
  finalMoves.textContent = moves;
  finalTime.textContent = formatTime(seconds);
  
  setTimeout(() => {
    winModal.classList.add('active');
  }, 600);
}

function initGame() {
  // Reset state
  cards = [];
  flippedCards = [];
  matchedPairs = 0;
  moves = 0;
  seconds = 0;
  gameStarted = false;
  canFlip = true;
  stopTimer();
  
  // Reset displays
  movesDisplay.textContent = '0';
  timerDisplay.textContent = '0:00';
  pairsDisplay.textContent = '0/8';
  winModal.classList.remove('active');
  
  // Create and shuffle cards
  const cardPairs = [...cardData, ...cardData];
  const shuffledCards = shuffle(cardPairs);
  
  // Clear and populate board
  gameBoard.innerHTML = '';
  shuffledCards.forEach((cardInfo, index) => {
    const card = createCard(cardInfo, index);
    cards.push(card);
    gameBoard.appendChild(card);
  });
}

restartBtn.addEventListener('click', initGame);
playAgainBtn.addEventListener('click', initGame);

// Start the game
initGame();

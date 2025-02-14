const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const quizScreen = document.getElementById('quiz-screen');
const startButton = document.getElementById('start-button');
const character = document.getElementById('character');
const boss = document.getElementById('boss');
const letter = document.getElementById('letter');
const questionElement = document.getElementById('question');
const answerButtons = [document.getElementById('answer1'), document.getElementById('answer2'), document.getElementById('answer3'), document.getElementById('answer4')];
const quests = [document.getElementById('quest1'), document.getElementById('quest2'), document.getElementById('quest3')];
const explosion = document.getElementById('explosion');
const failureMessage = document.getElementById('failure-message');

let characterSizeWidth = 110;
let characterSizeHeight = 55;
let characterPosition = 50;
let characterVelocity = 0;
let isJumping = false;
let currentQuestion = 0;
let correctAnswers = 0;
let bossSize = 100;
let questPositions = [200, 400, 600, 800]; // Adjusted positions for larger screen
let keys = { ArrowLeft: false, ArrowRight: false }; // Track key states

const questions = [
  {
    question: "What’s our favorite date spot?",
    answers: ["Cafe Chato", "Musuem", "Home", "Restaurant"],
    correct: "Home"
  },
  {
    question: "What I love about you more ?",
    answers: ["Angry 👀", "Cutie", "Big Brain time", "So Attentive"],
    correct: "So Attentive"
  },
  {
    question: "My favorite chocalate ?",
    answers: ["70%", "You :3", "90%", "Blanc 👀"],
    correct: "90%"
  }
];

startButton.addEventListener('click', () => {
  startScreen.classList.add('hidden');
  gameScreen.classList.remove('hidden');
  startGame();
});

function startGame() {
  document.addEventListener('keydown', handleKeyDown);
  document.addEventListener('keyup', handleKeyUp);
  gameLoop();
  showQuest();
}

function handleKeyDown(event) {
  if (event.key === 'ArrowRight') {
    keys.ArrowRight = true;
  } else if (event.key === 'ArrowLeft') {
    keys.ArrowLeft = true;
  } else if (event.key === 'ArrowUp' && !isJumping) { // Spacebar to jump
    jump();
  }
}

function handleKeyUp(event) {
  if (event.key === 'ArrowRight') {
    keys.ArrowRight = false;
  } else if (event.key === 'ArrowLeft') {
    keys.ArrowLeft = false;
  }
}

function gameLoop() {
  moveCharacter();
  checkQuest();
  requestAnimationFrame(gameLoop);
}

function moveCharacter() {
  const acceleration = 0.5; // Smooth acceleration
  const deceleration = 0.8; // Smooth deceleration

  if (keys.ArrowRight) {
    characterVelocity += acceleration;
  } else if (keys.ArrowLeft) {
    characterVelocity -= acceleration;
  } else {
    characterVelocity *= deceleration; // Slow down when no key is pressed
  }

  // Limit character velocity
  characterVelocity = Math.min(characterVelocity, 5); // Max speed
  characterVelocity = Math.max(characterVelocity, -5); // Min speed

  // Update character position
  characterPosition += characterVelocity;

  // Keep character within bounds
  characterPosition = Math.max(50, Math.min(750, characterPosition));

  // Apply position to character
  character.style.left = `${characterPosition}px`;
}

function jump() {
  isJumping = true;
  character.classList.add('jump');
  setTimeout(() => {
    character.classList.remove('jump');
    isJumping = false;
  }, 500);
}

function showQuest() {
  if (currentQuestion < questPositions.length) {
    quests[currentQuestion].style.display = 'block';
  } else {
    quests.forEach(quest => quest.style.display = 'none');
  }
}

/* function checkQuest() {
  if (currentQuestion < questPositions.length && Math.abs(characterPosition - questPositions[currentQuestion]) < 20) {
    quests[currentQuestion].style.display = 'none';
    startQuiz();
  }
} */

function checkQuest() {
  if (currentQuestion < questPositions.length && Math.abs(characterPosition - questPositions[currentQuestion]) < 20) {
    startQuiz(); // Start the quiz immediately
  }
}

function startQuiz() {
  quizScreen.classList.remove('hidden');
  showQuestion(questions[currentQuestion]);
  //quests[currentQuestion].style.display = 'none'; // Hide the quest image
}

function showQuestion(question) {
  questionElement.innerText = question.question;
  answerButtons.forEach((button, index) => {
    button.innerText = question.answers[index];
    button.onclick = () => checkAnswer(question.correct, question.answers[index]);
  });
}

function checkAnswer(correctAnswer, selectedAnswer) {
  if (correctAnswer === selectedAnswer) {
    correctAnswers++;
    characterSizeWidth += 20; // Increase size
    characterSizeHeight += 10; // Increase size
    character.style.width = `${characterSizeWidth}px`;
    character.style.height = `${characterSizeHeight}px`; // Maintain aspect ratio (130:65 = 2:1)
  } else {
    bossSize += 50;
    boss.style.width = `${bossSize}px`;
    boss.style.height = `${bossSize}px`;
  }
  currentQuestion++;
  quizScreen.classList.add('hidden');
  if (currentQuestion < questions.length) {
    showQuest();
  } else {
    endGame();
  }
}

function endGame() {
  if (correctAnswers === questions.length) {
    boss.style.display = 'none';
    explosion.style.right = `${boss.right}px`; // Center explosion on boss
    explosion.style.bottom = `${boss.bottom}px`;
    explosion.style.display = 'block';
    explosion.classList.add('explode');
    setTimeout(() => {
      explosion.style.display = 'none';
      letter.classList.remove('hidden');
    }, 1000);
  } else {
    // Move boss to the center
    boss.classList.add('boss-center');
    boss.style.left = '50%';
    boss.style.transform = 'translateX(-50%)';

    // Show failure message
    failureMessage.style.display = 'block';

    // Reset character position
    characterPosition = 50;
    character.style.left = `${characterPosition}px`;

    // Alert and reset the game
    //alert('Oops! The boss grew bigger. Try again!');
    setTimeout(() => {
      resetGame();
    }, 3000); // Wait 3 seconds before resetting the game
  }
}

function resetGame() {
  currentQuestion = 0;
  correctAnswers = 0;
  character.style.width = `${characterSizeWidth}px`;
  character.style.height = `${characterSizeHeight}px`;
  bossSize = 100;
  boss.style.width = `${bossSize}px`;
  boss.style.height = `${bossSize}px`;
  boss.classList.remove('boss-center'); // Reset boss position
  boss.style.left = ''; // Reset left position
  boss.style.transform = ''; // Reset transform
  failureMessage.style.display = 'none'; // Hide failure message
  showQuest();
}

// Add this at the end of the startGame function
function startGame() {
  document.addEventListener('keydown', handleKeyDown);
  document.addEventListener('keyup', handleKeyUp);
  gameLoop();
  showQuest();
  addFloatingHearts(); // Add floating hearts
}

function addFloatingHearts() {
  const heartSizes = ['small', 'medium', 'large'];
  const backgroundHearts = document.getElementById('background-hearts'); // Get the background container

  // numbers of days
  let date1 = new Date("10/26/2024");
  let date2 = new Date();

  // Calculating the time difference
  // of two dates
  let Difference_In_Time = date2.getTime() - date1.getTime();

  // Calculating the no. of days between
  // two dates
  let Difference_In_Days = Math.round(Difference_In_Time / (1000 * 3600 * 24));

  for (let i = 0; i < Difference_In_Days; i++) { // Add 10 hearts
    const heart = document.createElement('div');
    heart.classList.add('heart', heartSizes[Math.floor(Math.random() * heartSizes.length)]);
    heart.innerHTML = '🖤'; // 💗❤️🖤
    heart.style.left = `${Math.random() * 100}%`;
    heart.style.top = `${Math.random() * 100}%`;
    heart.style.animationDelay = `${Math.random() * 5}s`; // Randomize animation delay
    backgroundHearts.appendChild(heart); // Append to the background container
  }
}
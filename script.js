'use strict';

//HTML Element References

const popupContainer = document.querySelector('.popup-container');
const welcomePopup = document.querySelector('.welcome-popup');
const outOfTimePopup = document.querySelector('.out-of-time-popup');
const levelCompletePopup = document.querySelector('.level-complete-popup');
const closePopupContainer = document.querySelector('.close-popup-container');
const popupTextContainer = document.querySelector('.popup-text-container');
const nameInputField = document.querySelector('.name-input-field');
const topContainer = document.querySelector('.top-container');
const timerOverallContainer = document.querySelector(
  '.timer-overall-container'
);
const timerContainer = document.querySelector('.timer-container');
const timerTitleContainer = document.querySelector('.timer-title-container');
const mainContainer = document.querySelector('.main-container');
const mainLeftContainer = document.querySelector('.main-left-container');
const mainCenterContainer = document.querySelector('.main-center-container');
const mainRightContainer = document.querySelector('.main-right-container');
const playerOverallContainer = document.querySelector(
  '.player-overall-container'
);
const playerNameContainer = document.querySelector('.player-name-container');
const playerLevelContainer = document.querySelector('.player-level-container');
const scoreOverallContainer = document.querySelector(
  '.score-overall-container'
);
const scoreTitleContainer = document.querySelector('.score-title-container');
const scoreContainer = document.querySelector('.score-container');
const overlay = document.querySelector('.overlay');
const submitButton = document.querySelector('.submit-button');
const retryButton = document.querySelector('.retry-button');
const continueButton = document.querySelector('.continue-button');
const loadingContainer = document.querySelector('.loading-container');

// Sound File References

const correctSound = new Audio('lipsclick.wav');
const incorrectSound = new Audio('pc-game-ui-error.wav');
const victorySound = new Audio('mystery_music.wav');
const victorySound2 = new Audio('fanfare-trumpets.mp3');
const type1 = new Audio('type1.wav');
const type2 = new Audio('type2.wav');
const type3 = new Audio('type3.wav');
const type4 = new Audio('type4.wav');
const type5 = new Audio('type5.wav');
const type6 = new Audio('type6.wav');

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Sound Volume

correctSound.volume = 0.1;
incorrectSound.volume = 0.05;
type1.volume = 0.5;
type2.volume = 0.5;
type3.volume = 0.5;
type4.volume = 0.5;
type5.volume = 0.5;
type6.volume = 0.5;
victorySound.volume = 0.1;

// Variable Initializations

const letterArray = [
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'O',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
  'V',
  'W',
  'X',
  'Y',
  'Z',
];

const exemptKeys = [
  'Meta',
  'Shift',
  'CapsLock',
  'Control',
  'Alt',
  'Enter',
  'ArrowUp',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'Backspace',
  'Escape',
  'Tab',
];

const pointsTargets = [30, 60, 90, 120, 150, 180];

let levelLength = [15, 20, 25, 30, 35];

const timerValues = [
  [0, 30],
  [1, 0],
  [1, 30],
  [2, 0],
  [2, 30],
  [3, 0],
];

let levelIndex = 0;
let currentLetter = '';
let previousLetter = '';
let currentPoints = 0;
let currentTarget = 0;
let numberCorrect = 0;
let numberIncorrect = 0;
let firstCorrectKeyPressed = false;
let typingDisabled = false;
let nameInputFieldFocused = false;
let playerName = '';
let intervalId;
let nameInputDefaultPresent = true;
// const randomType = `type${Math.ceil(Math.random * 6)}`;

const typeSounds = {
  1: type1,
  2: type2,
  3: type3,
  4: type4,
  5: type5,
  6: type6,
};

const messages = {
  welcome: 'Welcome to the game!<br>To begin, type your name and click Start.',
  outOfTime: "You're out of time!<br>Try again!",
  levelComplete: () =>
    `Level complete!<br>You typed ${numberCorrect}/${
      numberCorrect + numberIncorrect
    } keys correctly on the first try.`,
};

// Function Definitions

let generateLetter = function () {
  do {
    currentLetter = letterArray[Math.round(Math.random() * 25)];
  } while (currentLetter === previousLetter);
  previousLetter = currentLetter;
  return currentLetter;
};

const addBox = function () {
  generateLetter();
  const html = `<div class="text-box">${currentLetter}</div>`;
  mainCenterContainer.innerHTML = '';
  mainCenterContainer.insertAdjacentHTML('afterbegin', html);
};

let addPoints = function () {
  currentPoints = currentPoints + 5;
  numberCorrect++;
  if (currentPoints >= currentTarget) {
    currentPoints = currentTarget;
    typingDisabled = true;
  }
};

let subtractPoints = function () {
  if (currentPoints > 0) {
    currentPoints--;
    numberIncorrect++;
  } else if (currentPoints === currentTarget) {
    return;
  }
};

const displayPoints = function () {
  scoreContainer.innerHTML = '';
  scoreContainer.insertAdjacentHTML(
    'afterbegin',
    `${currentPoints}/${currentTarget}`
  );
};

const randomTypeSound = function () {
  const randomIndex = Math.ceil(Math.random() * 4);
  typeSounds[randomIndex].play();
};

const correctType = function () {
  if (!typingDisabled) {
    addPoints();
    displayPoints();
    randomTypeSound();
    checkBeatLevel();
  }
};

const incorrectType = function () {
  if (!typingDisabled) {
    subtractPoints();
    displayPoints();
    incorrectSound.play();
  }
};

const updateTimerDisplay = function (minutes, seconds) {
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(seconds).padStart(2, '0');
  timerContainer.textContent = `${formattedMinutes}:${formattedSeconds}`;
};

const timerInterval = function (minutes, seconds) {
  intervalId = setInterval(() => {
    if (seconds === 0) {
      if (minutes === 0) {
        clearInterval(intervalId);
        outOfTime();
      } else {
        minutes--;
        seconds = 59;
        updateTimerDisplay(minutes, seconds);
        // checkBeatLevel(timerInterval);
      }
    } else {
      seconds--;
      updateTimerDisplay(minutes, seconds);
      // checkBeatLevel(timerInterval);
    }
  }, 1000);
};

const runTimer = function (minutes, seconds) {
  updateTimerDisplay(minutes, seconds);
  timerInterval(minutes, seconds);
};

const showPopup = function (popupName) {
  const popupElement = document.querySelector(popupName);
  if (popupElement) {
    popupElement.classList.remove('hidden');
    typingDisabled = true;
    overlay.classList.remove('hidden');
  }
};

const escapePopup = function (popupName) {
  console.log('Escaping popup!');
  const popupElement = document.querySelector(popupName);
  console.log('Before:', popupElement.classList, overlay.classList);
  popupElement.classList.add('hidden');
  overlay.classList.add('hidden');
  console.log('After:', popupElement.classList, overlay.classList);
};

const initializeGame = function (i) {
  typingDisabled = false;
  firstCorrectKeyPressed = false;
  updateTimerDisplay(...timerValues[levelIndex]);
  console.log(...timerValues[levelIndex]);
  if (levelIndex === 0 && playerName === '') {
    showPopup('.welcome-popup');
    nameInputField.focus();
    nameInputFieldFocused = true;
  }

  currentPoints = 0;
  currentTarget = pointsTargets[levelIndex];
  displayPoints();
  addBox();

  if (!welcomePopup.classList.contains('hidden')) {
    submitButton.addEventListener('click', updateNameInputField);
    window.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !welcomePopup.classList.contains('hidden')) {
        updateNameInputField();
      }
    });
  }
  if (!nameInputFieldFocused && nameInputField) {
    nameInputField.addEventListener('focus', function () {
      nameInputFieldFocused = true;
    });
  }
};

const updateNameInputField = function () {
  console.log('updateName called');
  if (nameInputField.value.trim() === '' || !nameInputFieldFocused) {
    alert('Please type your name');
  } else if (nameInputField.value.length > 20) {
    alert(
      'Max characters exceeded. Please enter a name up to 20 characters long.'
    );
  } else if (nameInputField.value === 'Just start typing...') {
    alert('Please type your name.');
  } else {
    playerName = nameInputField.value;
    playerNameContainer.textContent = `${playerName}`;
    playerLevelContainer.textContent = `Level ${levelIndex + 1} Sleuth`;
    escapePopup('.welcome-popup');
    typingDisabled = false;
  }
};

const outOfTime = function () {
  showPopup('.out-of-time-popup');
  retryButton.addEventListener('click', function (e) {
    initializeGame(levelIndex);
    escapePopup('.out-of-time-popup');
  });
};

const checkBeatLevel = function () {
  if (currentPoints >= currentTarget && currentPoints !== 0) {
    clearInterval(intervalId);

    showPopup('.level-complete-popup');
    // overlay.classList.remove('hidden');

    if (levelIndex === 5) {
      levelCompletePopup.querySelector(
        '.popup-text-container'
      ).innerHTML = `Congratulations,<br>${playerName}<br>You've beaten the game! Play again?`;
      continueButton.textContent = 'Play again!';
      levelIndex = 0;
      playerLevelContainer.textContent = `Level ${levelIndex + 1} Sleuth`;

      victorySound2.play();
    } else {
      levelCompletePopup.querySelector(
        '.popup-text-container'
      ).innerHTML = `Level ${levelIndex + 1} of 6 complete!`;
      victorySound.play();
      levelIndex++;
      playerLevelContainer.textContent = `Level ${levelIndex + 1} Sleuth`;
    }

    typingDisabled = true;
    continueButton.addEventListener('click', function () {
      escapePopup('.level-complete-popup');
      initializeGame(levelIndex);
    });

    window.addEventListener('keydown', function (e) {
      if (
        e.key === 'Enter' &&
        !levelCompletePopup.classList.contains('hidden')
      ) {
        escapePopup('.level-complete-popup');
        initializeGame(levelIndex);
      }
    });

    levelCompletePopup.querySelector('.continue-button').textContent =
      'Continue';
  }
};

// Event Listeners

// window.addEventListener('load', function () {
//   addBox();
//   displayPoints();
// });

window.addEventListener('keydown', function (e) {
  if (welcomePopup && nameInputDefaultPresent) {
    if (e.shiftKey) {
      nameInputField.value = '';
      nameInputDefaultPresent = false;
    } else if (exemptKeys.includes(e.key)) {
      return;
    } else {
      nameInputField.value = `${e.key}`;
      nameInputDefaultPresent = false;
    }
  }
});

window.addEventListener('keyup', function (e) {
  console.log(e.key);

  if (exemptKeys.includes(e.key)) {
    return;
  } else if (
    e.key.toUpperCase() === currentLetter &&
    !typingDisabled &&
    currentPoints < currentTarget
  ) {
    addBox();
    correctType();
    if (firstCorrectKeyPressed === false) {
      firstCorrectKeyPressed = !firstCorrectKeyPressed;
      runTimer(...timerValues[levelIndex]);
    }
  } else if (!typingDisabled) {
    incorrectType();
  }
});

window.addEventListener('keydown', function (e) {
  if (welcomePopup && nameInputDefaultPresent) {
    if (e.shiftKey) {
      nameInputField.value = `${e.key.toUpperCase()}`;
      nameInputDefaultPresent = false;
    } else if (exemptKeys.includes(e.key)) {
      return;
    } else {
      nameInputField.value = `${e.key}`;
      nameInputDefaultPresent = false;
    }
  }
});

closePopupContainer.addEventListener('click', function (e) {
  const popup = e.target.parentElement;
  if (popup && !closePopupContainer.classList.includes('hidden')) {
    popup.classList.add('hidden');
    overlay.classList.add('hidden');
  }
});

window.addEventListener('keyup', function (e) {
  if (e.key === 'Escape') {
    escapePopup('.popup-container');
  }
});

window.addEventListener('keyup', function (e) {
  if (e.key === 'Enter' && !outOfTimePopup.classList.contains('hidden')) {
    escapePopup('.out-of-time-popup');
    initializeGame(levelIndex);
  }
});

// Game Initialization
initializeGame(levelIndex);

// Test of whether the same class name can show up twice in the same HTML element class list

// let typingDisabled;
// const showPopup = function (popupName) {
//   const popupElement = document.querySelector(popupName);
//   if (popupElement) {
//     popupElement.classList.remove('hidden');
//     typingDisabled = true;
//   }
// };

// showPopup('.level-complete-popup');
// window.addEventListener('keydown', function (e) {
//   if (e.key === 't') {
//     document.querySelector('.level-complete-popup').classList.add('test-class');
//   }
//   if (e.key === 'c') {
//     console.log(document.querySelector('.level-complete-popup').classList);
//   }
//   if (e.key === 'r') {
//     document
//       .querySelector('.level-complete-popup')
//       .classList.remove('test-class');
//   }
// });

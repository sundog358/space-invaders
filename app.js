// Select essential DOM elements
const grid = document.querySelector(".grid"); // Game grid
const resultDisplay = document.querySelector(".results"); // Score display
const levelDisplay = document.querySelector(".level-display"); // Level display

// Player variables
let currentPlayerIndex = 202; // Initial player position
const width = 15; // Grid width

// Game state tracking
const aliensRemoved = []; // Track eliminated invaders
let invadersId; // Interval for moving invaders
let isGoingRight = true; // Track invader movement direction
let direction = 1; // Movement direction
let results = 0; // Player score
let currentLevel = 1; // Current game level
const maxLevel = 10; // Maximum level

// Meteor and debris variables
let meteorsId;
const meteors = []; // List of falling meteors
const spaceDebris = []; // List of falling space debris
const meteorSpeed = 300; // Meteor fall speed
const debrisSpeed = 400; // Space debris fall speed

// Add after the existing variables
const startOverBtn = document.querySelector(".start-over");

// Create grid squares
for (let i = 0; i < width * width; i++) {
  const square = document.createElement("div");
  grid.appendChild(square);
}

// Convert grid squares into an array
const squares = Array.from(document.querySelectorAll(".grid div"));

// Define initial alien positions
const alienInvaders = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 30, 31,
  32, 33, 34, 35, 36, 37, 38, 39,
];

// Function to draw player and invaders
function draw() {
  // Clear all squares without animation
  squares.forEach((square) => {
    square.style.setProperty("animation", "none", "important");
    square.style.setProperty("transition", "none", "important");
    square.className = "";
  });

  // Draw invaders
  for (let i = 0; i < alienInvaders.length; i++) {
    if (!aliensRemoved.includes(i)) {
      squares[alienInvaders[i]].className = `invader level${currentLevel}`;
    }
  }

  // Draw player
  squares[currentPlayerIndex].className = "player";
}

draw();

// Function to remove invaders from the grid
function remove() {
  for (let i = 0; i < alienInvaders.length; i++) {
    if (!aliensRemoved.includes(i)) {
      squares[alienInvaders[i]].classList.remove("invader");
      squares[alienInvaders[i]].classList.remove(`level${currentLevel}`);
    }
  }
}

// Function to move the player using arrow keys
function movePlayer(e) {
  squares[currentPlayerIndex].classList.remove("player");
  switch (e.key) {
    case "ArrowLeft":
      if (currentPlayerIndex % width !== 0) currentPlayerIndex -= 1;
      break;
    case "ArrowRight":
      if (currentPlayerIndex % width < width - 1) currentPlayerIndex += 1;
      break;
  }
  squares[currentPlayerIndex].classList.add("player");
}

document.addEventListener("keydown", movePlayer);

// Function to move the alien invaders
function moveInvaders() {
  const leftEdge = alienInvaders[0] % width === 0;
  const rightEdge =
    alienInvaders[alienInvaders.length - 1] % width === width - 1;
  remove();

  if (rightEdge && isGoingRight) {
    for (let i = 0; i < alienInvaders.length; i++) {
      alienInvaders[i] += width + 1;
      direction = -1;
      isGoingRight = false;
    }
  }

  if (leftEdge && !isGoingRight) {
    for (let i = 0; i < alienInvaders.length; i++) {
      alienInvaders[i] += width - 1;
      direction = 1;
      isGoingRight = true;
    }
  }

  for (let i = 0; i < alienInvaders.length; i++) {
    alienInvaders[i] += direction;
    // Check if any alien has reached the bottom row or passed the player
    if (!aliensRemoved.includes(i) && alienInvaders[i] >= currentPlayerIndex) {
      handleGameOver();
      return;
    }
  }

  draw();

  // Check if aliens collide with player (existing check)
  if (squares[currentPlayerIndex].classList.contains("invader")) {
    handleGameOver();
  }
}

invadersId = setInterval(moveInvaders, 600);

// Function to clear all intervals
function clearAllIntervals() {
  clearInterval(invadersId);
  clearInterval(meteorsId);
  // Clear any other intervals that might be running
  const highestId = window.setInterval(() => {}, Number.MAX_SAFE_INTEGER);
  for (let i = 1; i < highestId; i++) {
    window.clearInterval(i);
  }
}

// Function to reset game state for next level
function resetGameState() {
  // Clear arrays
  aliensRemoved.length = 0;
  meteors.length = 0;
  spaceDebris.length = 0;

  // Clear grid
  squares.forEach((square) => {
    square.className = "";
  });
}

// Add this function to handle different alien formations for each level
function getInitialAlienPositions(level) {
  switch (level) {
    case 2:
      return [
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
        30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 45, 46, 47, 48, 49, 50, 51, 52,
        53, 54,
      ];

    case 3:
      return [7, 21, 22, 23, 35, 36, 37, 38, 39, 51, 52, 53, 67];

    case 4:
      return [0, 4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60];

    case 5:
      return [
        6, 7, 8, 20, 21, 22, 23, 24, 35, 36, 37, 38, 39, 50, 51, 52, 53, 54, 66,
        67, 68,
      ];

    case 6:
      return [0, 1, 17, 18, 34, 35, 51, 52, 68, 69, 85, 86, 102, 103];

    case 7:
      return [7, 21, 22, 23, 35, 36, 37, 38, 39, 51, 52, 53, 67, 82, 97];

    case 8:
      let positions = [];
      for (let i = 0; i < 10; i++) {
        positions.push(i);
        positions.push(i + width);
        positions.push(i + width * 2);
      }
      return positions;

    case 9:
      positions = [];
      for (let i = 0; i < 15; i++) {
        positions.push(
          Math.floor(Math.random() * (width * width - width * 3)) + width
        );
      }
      return [...new Set(positions)]; // Remove duplicates

    case 10:
      return [
        7, 6, 8, 21, 22, 23, 35, 36, 37, 38, 39, 51, 52, 53, 67, 81, 82, 83, 97,
        98, 99,
      ];

    default:
      return [
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
      ];
  }
}

// Function to check win condition and handle level progression
function checkWinCondition() {
  if (aliensRemoved.length === alienInvaders.length) {
    if (currentLevel < maxLevel) {
      // Stop all current intervals
      clearAllIntervals();

      // Increment level
      currentLevel++;
      levelDisplay.innerHTML = currentLevel;

      // Add transition class
      document
        .querySelector(".game-container")
        .classList.add("level-transition");

      // Reset game state
      resetGameState();

      // Calculate new speed based on level
      const newSpeed = Math.max(600 - currentLevel * 50, 200);

      // Start new level after short delay
      setTimeout(() => {
        // Remove transition class
        document
          .querySelector(".game-container")
          .classList.remove("level-transition");

        // Get new alien positions for current level
        const newPositions = getInitialAlienPositions(currentLevel);
        alienInvaders.length = 0;
        alienInvaders.push(...newPositions);

        // Redraw game state
        draw();

        // Start movement with new speed
        invadersId = setInterval(moveInvaders, newSpeed);

        // Start meteors and debris with increased frequency
        meteorsId = setInterval(() => {
          if (Math.random() < 0.3 + currentLevel * 0.05) createMeteor();
          if (Math.random() < 0.2 + currentLevel * 0.03) createDebris();
        }, meteorSpeed - currentLevel * 20);
      }, 1000);
    } else {
      // Player has completed all levels
      resultDisplay.innerHTML = "YOU WIN!";
      clearAllIntervals();
    }
  }
}

// Function to shoot a laser
function shoot(e) {
  let laserId;
  let currentLaserIndex = currentPlayerIndex;

  function moveLaser() {
    squares[currentLaserIndex].classList.remove("laser");
    currentLaserIndex -= width;
    if (currentLaserIndex < 0) {
      clearInterval(laserId);
      return;
    }
    squares[currentLaserIndex].classList.add("laser");

    if (squares[currentLaserIndex].classList.contains("invader")) {
      squares[currentLaserIndex].classList.remove("laser");
      squares[currentLaserIndex].classList.remove("invader");
      squares[currentLaserIndex].classList.add("boom");

      setTimeout(
        () => squares[currentLaserIndex].classList.remove("boom"),
        300
      );
      clearInterval(laserId);

      const alienRemoved = alienInvaders.indexOf(currentLaserIndex);
      aliensRemoved.push(alienRemoved);
      results++;
      resultDisplay.innerHTML = results;
      checkWinCondition(); // Check win condition after each alien is removed
    }
  }

  if (e.key === "ArrowUp") {
    laserId = setInterval(moveLaser, 100);
  }
}

document.addEventListener("keydown", shoot);

// Add touch controls
function initMobileControls() {
  const leftBtn = document.getElementById("leftBtn");
  const rightBtn = document.getElementById("rightBtn");
  const shootBtn = document.getElementById("shootBtn");

  // Movement controls
  function handleMobileMove(direction) {
    squares[currentPlayerIndex].classList.remove("player");
    if (direction === "left" && currentPlayerIndex % width !== 0) {
      currentPlayerIndex -= 1;
    } else if (
      direction === "right" &&
      currentPlayerIndex % width < width - 1
    ) {
      currentPlayerIndex += 1;
    }
    squares[currentPlayerIndex].classList.add("player");
  }

  // Touch events for movement
  leftBtn.addEventListener("touchstart", (e) => {
    e.preventDefault();
    const moveInterval = setInterval(() => handleMobileMove("left"), 100);
    leftBtn.addEventListener("touchend", () => clearInterval(moveInterval));
  });

  rightBtn.addEventListener("touchstart", (e) => {
    e.preventDefault();
    const moveInterval = setInterval(() => handleMobileMove("right"), 100);
    rightBtn.addEventListener("touchend", () => clearInterval(moveInterval));
  });

  // Shoot control
  shootBtn.addEventListener("touchstart", (e) => {
    e.preventDefault();
    shoot({ key: "ArrowUp" });
  });

  // Prevent default touch behaviors
  document.addEventListener("touchmove", (e) => e.preventDefault(), {
    passive: false,
  });
}

// Initialize mobile controls
initMobileControls();

// Update game start for touch devices
document.addEventListener("touchstart", (e) => {
  if (!invadersId && e.target.id === "shootBtn") {
    invadersId = setInterval(moveInvaders, 600);
    meteorsId = setInterval(() => {
      if (Math.random() < 0.3) createMeteor();
      if (Math.random() < 0.2) createDebris();
    }, meteorSpeed);
  }
});

// Add viewport meta tag dynamically
const meta = document.createElement("meta");
meta.name = "viewport";
meta.content =
  "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no";
document.head.appendChild(meta);

// Add the event listener for the start over button
startOverBtn.addEventListener("click", restartGame);

// Function to restart the game
function restartGame() {
  // Reset game state
  aliensRemoved.length = 0;
  results = 0;
  currentLevel = 1;
  isGoingRight = true;
  direction = 1;
  currentPlayerIndex = 202;

  // Reset displays
  resultDisplay.innerHTML = "0";
  levelDisplay.innerHTML = "1";

  // Remove game over state
  document.querySelector(".game-container").classList.remove("game-over");

  // Reset alien positions
  alienInvaders.length = 0;
  alienInvaders.push(
    ...[
      0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 30,
      31, 32, 33, 34, 35, 36, 37, 38, 39,
    ]
  );

  // Clear any existing intervals
  clearAllIntervals();

  // Redraw the game
  draw();

  // Start game intervals
  invadersId = setInterval(moveInvaders, 600);
  meteorsId = setInterval(() => {
    if (Math.random() < 0.3) createMeteor();
    if (Math.random() < 0.2) createDebris();
  }, meteorSpeed);
}

// Update the game over handling function
function handleGameOver() {
  resultDisplay.innerHTML = "GAME OVER";
  document.querySelector(".game-container").classList.add("game-over");
  startOverBtn.style.display = "block"; // Explicitly show the button
  clearAllIntervals();
}

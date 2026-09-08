/* =========================================
   RunRush - Endless Runner Game
========================================= */

const game = document.getElementById("game");

const player = document.getElementById("player");

const objectsContainer =
    document.getElementById("objects");

const scoreElement =
    document.getElementById("score");

const coinsElement =
    document.getElementById("coins");

const speedElement =
    document.getElementById("speed");

const startScreen =
    document.getElementById("start-screen");

const gameOverScreen =
    document.getElementById("game-over-screen");

const finalScore =
    document.getElementById("final-score");

const finalCoins =
    document.getElementById("final-coins");

const startButton =
    document.getElementById("start-btn");

const restartButton =
    document.getElementById("restart-btn");

const leftButton =
    document.getElementById("left-btn");

const rightButton =
    document.getElementById("right-btn");

const jumpButton =
    document.getElementById("jump-btn");


/* =========================================
   GAME VARIABLES
========================================= */

const lanes = [16.66, 50, 83.33];

let currentLane = 1;

let score = 0;

let coins = 0;

let gameSpeed = 5;

let gameRunning = false;

let isJumping = false;

let objects = [];

let lastTime = 0;

let obstacleTimer = 0;

let coinTimer = 0;

let scoreTimer = 0;


/* =========================================
   PLAYER
========================================= */

function updatePlayerPosition() {

    player.style.left =
        `calc(${lanes[currentLane]}% - 40px)`;

}

updatePlayerPosition();


/* =========================================
   MOVE LEFT
========================================= */

function moveLeft() {

    if (!gameRunning) {
        return;
    }

    if (currentLane > 0) {

        currentLane--;

        updatePlayerPosition();

    }

}


/* =========================================
   MOVE RIGHT
========================================= */

function moveRight() {

    if (!gameRunning) {
        return;
    }

    if (currentLane < 2) {

        currentLane++;

        updatePlayerPosition();

    }

}


/* =========================================
   JUMP
========================================= */

function jump() {

    if (!gameRunning || isJumping) {
        return;
    }

    isJumping = true;

    player.classList.add("player-jump");

    setTimeout(() => {

        player.classList.remove("player-jump");

        isJumping = false;

    }, 550);

}


/* =========================================
   CREATE OBSTACLE
========================================= */

function createObstacle() {

    const obstacle = document.createElement("div");

    obstacle.className = "obstacle";

    obstacle.textContent = "🚧";

    const lane =
        Math.floor(Math.random() * 3);

    obstacle.dataset.lane = lane;

    obstacle.style.left =
        `calc(${lanes[lane]}% - 32px)`;

    obstacle.style.top = "-70px";

    objectsContainer.appendChild(obstacle);

    objects.push({

        element: obstacle,

        type: "obstacle",

        lane: lane,

        y: -70

    });

}


/* =========================================
   CREATE COIN
========================================= */

function createCoin() {

    const coin = document.createElement("div");

    coin.className = "coin";

    coin.textContent = "🪙";

    const lane =
        Math.floor(Math.random() * 3);

    coin.dataset.lane = lane;

    coin.style.left =
        `calc(${lanes[lane]}% - 25px)`;

    coin.style.top = "-50px";

    objectsContainer.appendChild(coin);

    objects.push({

        element: coin,

        type: "coin",

        lane: lane,

        y: -50

    });

}


/* =========================================
   COLLISION DETECTION
========================================= */

function checkCollision(object) {

    if (object.lane !== currentLane) {
        return false;
    }

    const objectTop =
        object.y;

    const objectBottom =
        object.y +
        object.element.offsetHeight;

    const playerTop =
        game.clientHeight -
        30 -
        player.offsetHeight;

    const playerBottom =
        game.clientHeight - 30;

    return (
        objectBottom > playerTop &&
        objectTop < playerBottom
    );

}


/* =========================================
   GAME OVER
========================================= */

function endGame() {

    gameRunning = false;

    finalScore.textContent =
        score;

    finalCoins.textContent =
        coins;

    gameOverScreen.style.display =
        "flex";

}


/* =========================================
   UPDATE SCORE
========================================= */

function updateScore() {

    scoreElement.textContent =
        score;

    coinsElement.textContent =
        coins;

    const speedLevel =
        Math.max(
            1,
            Math.floor(gameSpeed / 5)
        );

    speedElement.textContent =
        `${speedLevel}x`;

}


/* =========================================
   GAME LOOP
========================================= */

function gameLoop(timestamp) {

    if (!gameRunning) {
        return;
    }

    const delta =
        timestamp - lastTime;

    lastTime = timestamp;

    /* -------------------------
       MOVE OBJECTS
    ------------------------- */

    objects.forEach((object, index) => {

        object.y +=
            gameSpeed *
            (delta / 16);

        object.element.style.top =
            `${object.y}px`;


        /* -------------------------
           COLLISION
        ------------------------- */

        if (checkCollision(object)) {

            if (object.type === "coin") {

                coins++;

                score += 25;

                object.element.remove();

                objects.splice(index, 1);

            } else {

                if (!isJumping) {

                    endGame();

                }

            }

        }

        /* -------------------------
           REMOVE OFF-SCREEN
        ------------------------- */

        if (
            object.y >
            game.clientHeight + 100
        ) {

            object.element.remove();

            objects.splice(index, 1);

        }

    });


    /* -------------------------
       SCORE
    ------------------------- */

    scoreTimer += delta;

    if (scoreTimer > 300) {

        score++;

        scoreTimer = 0;

    }


    /* -------------------------
       OBSTACLE SPAWN
    ------------------------- */

    obstacleTimer += delta;

    if (
        obstacleTimer >
        Math.max(
            500,
            1100 - gameSpeed * 50
        )
    ) {

        createObstacle();

        obstacleTimer = 0;

    }


    /* -------------------------
       COIN SPAWN
    ------------------------- */

    coinTimer += delta;

    if (coinTimer > 700) {

        createCoin();

        coinTimer = 0;

    }


    /* -------------------------
       INCREASE SPEED
    ------------------------- */

    gameSpeed +=
        delta * 0.0005;

    updateScore();

    requestAnimationFrame(gameLoop);

}


/* =========================================
   START GAME
========================================= */

function startGame() {

    score = 0;

    coins = 0;

    gameSpeed = 5;

    currentLane = 1;

    isJumping = false;

    obstacleTimer = 0;

    coinTimer = 0;

    scoreTimer = 0;

    objects.forEach(object => {

        object.element.remove();

    });

    objects = [];

    player.classList.remove(
        "player-jump"
    );

    updatePlayerPosition();

    updateScore();

    startScreen.style.display =
        "none";

    gameOverScreen.style.display =
        "none";

    gameRunning = true;

    lastTime =
        performance.now();

    requestAnimationFrame(gameLoop);

}


/* =========================================
   RESTART GAME
========================================= */

function restartGame() {

    startGame();

}


/* =========================================
   KEYBOARD CONTROLS
========================================= */

document.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key === "ArrowLeft" ||
            event.key.toLowerCase() === "a"
        ) {

            event.preventDefault();

            moveLeft();

        }


        if (
            event.key === "ArrowRight" ||
            event.key.toLowerCase() === "d"
        ) {

            event.preventDefault();

            moveRight();

        }


        if (
            event.key === "ArrowUp" ||
            event.key === " "
        ) {

            event.preventDefault();

            jump();

        }

    }
);


/* =========================================
   BUTTON CONTROLS
========================================= */

leftButton.addEventListener(
    "click",
    moveLeft
);

rightButton.addEventListener(
    "click",
    moveRight
);

jumpButton.addEventListener(
    "click",
    jump
);

startButton.addEventListener(
    "click",
    startGame
);

restartButton.addEventListener(
    "click",
    restartGame
);


/* =========================================
   INITIAL SETUP
========================================= */

updatePlayerPosition();

updateScore();


